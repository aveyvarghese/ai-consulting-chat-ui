import { Resend } from "resend"
import {
  computeLeadIntelligence,
  snapshotToLeadPartial,
  buildLeadEmailSubject,
} from "@/lib/lead-intelligence"
import { normalizeConversationPayload } from "@/lib/conversation-state"
import type { LeadData } from "@/lib/lead-data"
import {
  mergeLeadDataIntoConversationSnapshot,
} from "@/lib/lead-submit"
import {
  buildLeadEnquiryEmailHtml,
  buildLeadEnquiryEmailText,
} from "@/lib/lead-email-html"
import { PUBLIC_SUPPORT_EMAIL_MESSAGE } from "@/lib/public-errors"
import { appendLeadToGoogleSheets } from "@/lib/google-sheets"
import { z } from "zod"

export const maxDuration = 60

const LEAD_TO_EMAIL = "info@pxlbrief.com"

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(8000),
})

const leadDataSchema = z.object({
  visitorType: z.enum(["unknown", "potential_client", "job_seeker", "vendor"]),
  name: z.string().max(500),
  company: z.string().max(500),
  website: z.string().max(2000),
  instagram: z.string().max(500),
  service: z.string().max(1000),
  email: z.string().max(320),
  phone: z.string().max(120),
  notes: z.string().max(4000),
})

const attachmentSchema = z.object({
  filename: z.string().max(255),
  contentType: z.string().max(120).optional(),
  base64: z.string().max(6_000_000),
})

const submitBodySchema = z.object({
  messages: z.array(chatMessageSchema).max(250).optional().default([]),
  snapshot: z.record(z.unknown()),
  leadData: leadDataSchema.optional(),
  professionalSummary: z.string().max(4000).optional().default(""),
  attachment: attachmentSchema.optional(),
  /** Client-provided label, e.g. "Homepage · PxlBrief AI" */
  submitSource: z.string().max(200).optional(),
})

function transcriptFromMessages(
  messages: z.infer<typeof chatMessageSchema>[]
): string {
  return messages
    .map((m) =>
      m.role === "user"
        ? `Visitor: ${m.content}`
        : `PxlBrief AI: ${m.content}`
    )
    .join("\n\n")
    .slice(0, 12000)
}

function resolveVisitorType(
  normalized: ReturnType<typeof normalizeConversationPayload>,
  leadData?: LeadData
): "potential_client" | "job_seeker" | "vendor" | null {
  if (
    normalized.visitorType === "potential_client" ||
    normalized.visitorType === "job_seeker" ||
    normalized.visitorType === "vendor"
  ) {
    return normalized.visitorType
  }
  if (
    leadData &&
    (leadData.visitorType === "potential_client" ||
      leadData.visitorType === "job_seeker" ||
      leadData.visitorType === "vendor")
  ) {
    return leadData.visitorType
  }
  return null
}

function firstNonEmpty(...values: string[]): string {
  return values.map((value) => value.trim()).find(Boolean) ?? ""
}

function resolveSubmittedSource(
  bodySource: string | undefined,
  referer: string | null
): string {
  const fromBody = bodySource?.trim()
  if (fromBody) return fromBody.slice(0, 200)
  if (!referer?.trim()) return "PxlBrief (direct session)"
  try {
    const u = new URL(referer)
    const path = `${u.pathname}${u.search || ""}`.trim()
    return (path || u.hostname).slice(0, 200)
  } catch {
    return "PxlBrief (referrer)"
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const from = process.env.RESEND_FROM_EMAIL?.trim()
    if (!from) {
      return Response.json(
        {
          error:
            "RESEND_FROM_EMAIL is not configured (verified sender address required)",
        },
        { status: 500 }
      )
    }

    const raw = submitBodySchema.safeParse(await req.json())
    if (!raw.success) {
      return Response.json(
        { error: "Invalid request body", details: raw.error.flatten() },
        { status: 400 }
      )
    }

    let normalized = normalizeConversationPayload(raw.data.snapshot)
    const leadData = raw.data.leadData as LeadData | undefined
    if (leadData) {
      normalized = mergeLeadDataIntoConversationSnapshot(normalized, leadData)
    }

    const effectiveVisitor = resolveVisitorType(normalized, leadData)
    if (!effectiveVisitor) {
      return Response.json(
        { error: "Cannot submit until visitor intent is recognised" },
        { status: 400 }
      )
    }
    normalized = { ...normalized, visitorType: effectiveVisitor }

    const transcript =
      normalized.conversationSummary.trim() ||
      transcriptFromMessages(raw.data.messages ?? [])

    let partial
    try {
      partial = snapshotToLeadPartial(
        normalized,
        transcript,
        normalized.uploadedFileName
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid snapshot"
      return Response.json({ error: msg }, { status: 400 })
    }

    const intelligence = await computeLeadIntelligence(transcript, partial)

    const profSummary =
      raw.data.professionalSummary?.trim() || intelligence.consultantSummary

    const ld: LeadData = leadData
      ? { ...leadData, visitorType: effectiveVisitor }
      : {
          visitorType: effectiveVisitor,
          name: normalized.name,
          company: normalized.company,
          website: "",
          instagram: "",
          service: normalized.servicesInterested,
          email: normalized.email,
          phone: normalized.whatsapp,
          notes: "",
        }

    const attachmentNames: string[] = []
    if (normalized.uploadedFileName.trim()) {
      attachmentNames.push(normalized.uploadedFileName.trim())
    }
    if (raw.data.attachment?.filename) {
      attachmentNames.push(raw.data.attachment.filename)
    }

    const filesLine =
      attachmentNames.length > 0 ? attachmentNames.join(", ") : "None"

    const submittedAtDate = new Date()
    const submittedAt = submittedAtDate.toISOString()
    const subject = buildLeadEmailSubject(
      intelligence.visitorType,
      intelligence.subjectAccent
    )

    const submittedSource = resolveSubmittedSource(
      raw.data.submitSource,
      req.headers.get("referer")
    )

    const transcriptExcerpt = transcript.slice(0, 4500)

    const emailInput = {
      intelligence,
      leadData: ld,
      professionalSummary: profSummary,
      transcriptExcerpt,
      businessVertical: normalized.businessVertical,
      businessStage: normalized.businessStage,
      submittedSource,
      submittedAt: submittedAtDate,
      attachmentsLine: filesLine,
    }

    const htmlBody = buildLeadEnquiryEmailHtml(emailInput)
    const textBody = buildLeadEnquiryEmailText(emailInput)

    const attachments: { filename: string; content: Buffer }[] = []
    if (raw.data.attachment?.base64 && raw.data.attachment.filename) {
      const buf = Buffer.from(raw.data.attachment.base64, "base64")
      if (buf.byteLength > 4 * 1024 * 1024) {
        return Response.json(
          { error: "Attachment exceeds 4MB limit" },
          { status: 400 }
        )
      }
      attachments.push({
        filename: raw.data.attachment.filename,
        content: buf,
      })
    }

    const resend = new Resend(apiKey)
    const replyTo = firstNonEmpty(ld.email, intelligence.email)
    const sendPayload: Parameters<Resend["emails"]["send"]>[0] = {
      from,
      to: LEAD_TO_EMAIL,
      subject,
      html: htmlBody,
      text: textBody,
      ...(attachments.length ? { attachments } : {}),
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
      sendPayload.replyTo = replyTo
    }

    const { error } = await resend.emails.send(sendPayload)

    if (error) {
      return Response.json(
        { error: PUBLIC_SUPPORT_EMAIL_MESSAGE },
        { status: 502 }
      )
    }

    try {
      await appendLeadToGoogleSheets({
        submittedAt,
        visitorType: intelligence.visitorType,
        leadScore: intelligence.leadScore,
        name: firstNonEmpty(ld.name, intelligence.name),
        company: firstNonEmpty(ld.company, intelligence.company),
        businessVertical: firstNonEmpty(
          intelligence.businessVertical,
          normalized.businessVertical
        ),
        serviceNeeded: firstNonEmpty(ld.service, intelligence.servicesInterested),
        phoneOrWhatsApp: firstNonEmpty(ld.phone, intelligence.whatsApp),
        email: firstNonEmpty(ld.email, intelligence.email),
        website: ld.website.trim(),
        instagram: ld.instagram.trim(),
        uploadedFileName: firstNonEmpty(
          attachmentNames.join(", "),
          intelligence.uploadedFileName
        ),
        conversationSummary: firstNonEmpty(
          profSummary,
          intelligence.consultantSummary,
          normalized.conversationSummary,
          transcript
        ),
      })
    } catch (sheetsError) {
      console.warn(
        "Google Sheets CRM logging failed",
        sheetsError instanceof Error ? sheetsError.message : sheetsError
      )
    }

    return Response.json({
      ok: true,
      leadScore: intelligence.leadScore,
      subjectAccent: intelligence.subjectAccent,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return Response.json({ error: message }, { status: 500 })
  }
}
