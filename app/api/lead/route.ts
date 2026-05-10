import { Resend } from "resend"
import {
  computeLeadIntelligence,
  snapshotToLeadPartial,
  buildLeadEmailSubject,
} from "@/lib/lead-intelligence"
import { normalizeConversationPayload } from "@/lib/conversation-state"
import type { LeadData } from "@/lib/lead-data"
import {
  formatIntelligenceTail,
  formatPremiumIntakeSection,
  formatProfessionalSummarySection,
  formatStructuredEnquirySection,
  mergeLeadDataIntoConversationSnapshot,
  type PremiumSalesIntake,
} from "@/lib/lead-submit"
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

const intakeSchema = z.object({
  fullName: z.string().max(500).optional().default(""),
  companyName: z.string().max(500).optional().default(""),
  email: z.string().max(320).optional().default(""),
  phoneNumber: z.string().max(120).optional().default(""),
  websiteInstagram: z.string().max(2000).optional().default(""),
  budgetRange: z.string().max(120).optional().default(""),
  preferredService: z.string().max(1000).optional().default(""),
  additionalNotes: z.string().max(4000).optional().default(""),
  aiSummary: z.string().max(1000).optional().default(""),
  recommendedService: z.string().max(1000).optional().default(""),
  opportunityLevel: z.string().max(120).optional().default(""),
})

const submitBodySchema = z.object({
  messages: z.array(chatMessageSchema).max(250).optional().default([]),
  snapshot: z.record(z.unknown()),
  leadData: leadDataSchema.optional(),
  professionalSummary: z.string().max(4000).optional().default(""),
  attachment: attachmentSchema.optional(),
  intake: intakeSchema.optional(),
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

function normalizeIntake(
  intake: z.infer<typeof intakeSchema> | undefined,
  summaryFallback: string,
  serviceFallback: string
): PremiumSalesIntake | null {
  if (!intake) return null
  return {
    fullName: intake.fullName.trim(),
    companyName: intake.companyName.trim(),
    email: intake.email.trim(),
    phoneNumber: intake.phoneNumber.trim(),
    websiteInstagram: intake.websiteInstagram.trim(),
    budgetRange: intake.budgetRange.trim(),
    preferredService: intake.preferredService.trim(),
    additionalNotes: intake.additionalNotes.trim(),
    aiSummary: firstNonEmpty(intake.aiSummary, summaryFallback),
    recommendedService: firstNonEmpty(
      intake.recommendedService,
      intake.preferredService,
      serviceFallback
    ),
    opportunityLevel: intake.opportunityLevel.trim(),
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

    const ctx = {
      businessVertical: normalized.businessVertical,
      businessStage: normalized.businessStage,
      conversationStage: normalized.conversationStage,
      potentialClientStage: normalized.potentialClientStage,
    }

    const intakeRaw = raw.data.intake

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

    const preferredService = firstNonEmpty(
      intakeRaw?.preferredService ?? "",
      ld.service,
      intelligence.servicesInterested
    )
    const aiSummary = firstNonEmpty(
      intakeRaw?.aiSummary ?? "",
      profSummary,
      intelligence.consultantSummary
    )
    const intake = normalizeIntake(
      intakeRaw,
      aiSummary,
      preferredService
    )
    const emailLeadData: LeadData = {
      ...ld,
      name: firstNonEmpty(intake?.fullName ?? "", ld.name, intelligence.name),
      company: firstNonEmpty(
        intake?.companyName ?? "",
        ld.company,
        intelligence.company
      ),
      email: firstNonEmpty(intake?.email ?? "", ld.email, intelligence.email),
      phone: firstNonEmpty(
        intake?.phoneNumber ?? "",
        ld.phone,
        intelligence.whatsApp
      ),
      website: firstNonEmpty(intake?.websiteInstagram ?? "", ld.website),
      service: preferredService,
      notes: firstNonEmpty(intake?.additionalNotes ?? "", ld.notes),
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

    const submittedAt = new Date().toISOString()
    const subject = buildLeadEmailSubject(
      intelligence.visitorType,
      intelligence.subjectAccent
    )

    const textBody = [
      formatStructuredEnquirySection(emailLeadData, ctx),
      formatPremiumIntakeSection(intake),
      ["ATTACHMENTS", filesLine].join("\n"),
      formatProfessionalSummarySection(aiSummary),
      formatIntelligenceTail(intelligence, submittedAt),
    ]
      .filter((section) => section !== "")
      .join("\n\n")

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
    const { error } = await resend.emails.send({
      from,
      to: LEAD_TO_EMAIL,
      subject,
      text: textBody,
      ...(attachments.length ? { attachments } : {}),
    })

    if (error) {
      return Response.json(
        { error: error.message || "Failed to send email" },
        { status: 502 }
      )
    }

    try {
      await appendLeadToGoogleSheets({
        submittedAt,
        visitorType: intelligence.visitorType,
        leadScore: intelligence.leadScore,
        name: firstNonEmpty(emailLeadData.name, intelligence.name),
        company: firstNonEmpty(emailLeadData.company, intelligence.company),
        businessVertical: firstNonEmpty(
          intelligence.businessVertical,
          normalized.businessVertical
        ),
        serviceNeeded: firstNonEmpty(
          preferredService,
          intelligence.servicesInterested
        ),
        phoneOrWhatsApp: firstNonEmpty(emailLeadData.phone, intelligence.whatsApp),
        email: firstNonEmpty(emailLeadData.email, intelligence.email),
        website: firstNonEmpty(emailLeadData.website, intake?.websiteInstagram ?? ""),
        instagram: emailLeadData.instagram.trim(),
        uploadedFileName: firstNonEmpty(
          attachmentNames.join(", "),
          intelligence.uploadedFileName
        ),
        conversationSummary: firstNonEmpty(
          aiSummary,
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
