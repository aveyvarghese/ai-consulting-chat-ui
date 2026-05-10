/**
 * Structured enquiry formatting + professional summary generation.
 * CRM-ready payloads — extend `toCrmPayload` when wiring an integration.
 */

import type { ConversationStatePayload } from "@/lib/conversation-state"
import type { LeadData } from "@/lib/lead-data"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import { VISITOR_PUBLIC_LABEL } from "@/lib/lead-intelligence"

export interface LeadSummaryContext {
  businessVertical: string
  businessStage: string
  conversationStage: string
  potentialClientStage: number
}

export interface PremiumSalesIntake {
  fullName: string
  companyName: string
  email: string
  phoneNumber: string
  websiteInstagram: string
  budgetRange: string
  preferredService: string
  additionalNotes: string
  aiSummary: string
  recommendedService: string
  opportunityLevel: string
}

function dash(s: string): string {
  const t = s.trim()
  return t || "—"
}

/** Human-readable visitor label for enquiry block */
function visitorLabel(t: LeadData["visitorType"]): string {
  if (t === "unknown") return "Unknown"
  return VISITOR_PUBLIC_LABEL[t as keyof typeof VISITOR_PUBLIC_LABEL] ?? t
}

/**
 * Clean email block built from session `leadData` + conversation snapshot
 * (stage / vertical). Not raw transcript.
 */
export function formatStructuredEnquirySection(
  leadData: LeadData,
  ctx: LeadSummaryContext
): string {
  const webIg = [leadData.website.trim(), leadData.instagram.trim()]
    .filter(Boolean)
    .join(" · ") || "—"

  const contactLines = [
    leadData.email.trim() && `Email: ${leadData.email.trim()}`,
    leadData.phone.trim() && `Phone / WhatsApp: ${leadData.phone.trim()}`,
  ].filter(Boolean)
  const contactBlock =
    contactLines.length > 0
      ? `Contact:\n${contactLines.join("\n")}`
      : "Contact: —"

  return [
    `STRUCTURED ENQUIRY (session capture)`,
    ``,
    `Visitor type: ${visitorLabel(leadData.visitorType)}`,
    `Name: ${dash(leadData.name)}`,
    `Company / brand: ${dash(leadData.company)}`,
    `Service needed: ${dash(leadData.service)}`,
    `Stage: ${dash(ctx.businessStage)} (coarse: ${dash(ctx.conversationStage)} · client step: ${ctx.potentialClientStage})`,
    `Business vertical: ${dash(ctx.businessVertical)}`,
    `Website / Instagram: ${webIg}`,
    contactBlock,
    ``,
    `Internal notes (auto):`,
    dash(leadData.notes),
  ].join("\n")
}

export function formatProfessionalSummarySection(
  professionalSummary: string
): string {
  return [
    `AI-GENERATED CONVERSATION SUMMARY (concise)`,
    ``,
    professionalSummary.trim() || "—",
  ].join("\n")
}

export function formatPremiumIntakeSection(
  intake: PremiumSalesIntake | null
): string {
  if (!intake) return ""

  return [
    `PREMIUM AI SALES INTAKE`,
    ``,
    `Full name: ${dash(intake.fullName)}`,
    `Company name: ${dash(intake.companyName)}`,
    `Email: ${dash(intake.email)}`,
    `Phone number: ${dash(intake.phoneNumber)}`,
    `Website / Instagram: ${dash(intake.websiteInstagram)}`,
    `Budget range: ${dash(intake.budgetRange)}`,
    `Preferred service: ${dash(intake.preferredService)}`,
    `Recommended service: ${dash(intake.recommendedService)}`,
    `Estimated opportunity level: ${dash(intake.opportunityLevel)}`,
    ``,
    `AI summary:`,
    dash(intake.aiSummary),
    ``,
    `Additional notes:`,
    dash(intake.additionalNotes),
  ].join("\n")
}

export function formatIntelligenceTail(
  intel: LeadIntelligenceResult | null,
  submittedAt: string
): string {
  if (!intel) {
    return [`Lead score: —`, `Timestamp (UTC): ${submittedAt}`].join("\n")
  }
  return [
    `---`,
    `Lead score: ${intel.leadScore}`,
    `Score rationale: ${dash(intel.leadScoreRationale)}`,
    `Subject accent: ${dash(intel.subjectAccent)}`,
    ``,
    `Timestamp (UTC): ${submittedAt}`,
  ].join("\n")
}

/** Future CRM webhook / Salesforce / HubSpot — single object. */
export function toCrmPayload(
  leadData: LeadData,
  ctx: LeadSummaryContext,
  professionalSummary: string,
  uploadedFileNames: string[],
  intelligence: LeadIntelligenceResult | null
): Record<string, unknown> {
  return {
    source: "pxlbrief_chat",
    visitorType: leadData.visitorType,
    name: leadData.name,
    company: leadData.company,
    website: leadData.website,
    instagram: leadData.instagram,
    service: leadData.service,
    email: leadData.email,
    phone: leadData.phone,
    businessVertical: ctx.businessVertical,
    businessStage: ctx.businessStage,
    conversationStage: ctx.conversationStage,
    potentialClientStage: ctx.potentialClientStage,
    professionalSummary,
    uploadedFileNames,
    leadScore: intelligence?.leadScore ?? null,
    notes: leadData.notes,
  }
}

function fallbackProfessionalSummary(
  leadData: LeadData,
  ctx: LeadSummaryContext
): string {
  const parts = [
    `${visitorLabel(leadData.visitorType)} enquiry.`,
    leadData.company.trim() &&
      `Brand/company: ${leadData.company.trim()}.`,
    leadData.service.trim() && `Services of interest: ${leadData.service.trim()}.`,
    ctx.businessVertical.trim() &&
      `Vertical: ${ctx.businessVertical.trim()}.`,
    ctx.businessStage.trim() && `Stage: ${ctx.businessStage.trim()}.`,
    (leadData.website || leadData.instagram) &&
      `Digital presence shared: ${[leadData.website, leadData.instagram].filter(Boolean).join(" · ")}.`,
    (leadData.email || leadData.phone) &&
      `Contact on file: ${[leadData.email, leadData.phone].filter(Boolean).join(" · ")}.`,
    `Next step: internal review and outreach.`,
  ].filter(Boolean) as string[]
  return parts.join(" ").slice(0, 1200)
}

/**
 * Produces a short professional paragraph — not a raw transcript dump.
 */
export async function generateProfessionalLeadSummary(
  messages: { role: string; content: string }[],
  leadData: LeadData,
  ctx: LeadSummaryContext
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  const transcript = messages
    .map((m) =>
      m.role === "user" ? `Visitor: ${m.content}` : `Assistant: ${m.content}`
    )
    .join("\n")
    .slice(0, 10000)

  if (!apiKey) {
    return fallbackProfessionalSummary(leadData, ctx)
  }

  const system = `You write internal CRM lead summaries for PxlBrief (consulting / growth / AI). Output a single concise professional paragraph (5–8 sentences max). No bullet points. No quoted transcript. Do not invent facts not supported by the structured fields or chat. Summarise: what they need, situation, urgency, and recommended internal next step. Plain text only.`

  const userPayload = {
    structured: {
      visitorType: leadData.visitorType,
      name: leadData.name,
      company: leadData.company,
      service: leadData.service,
      website: leadData.website,
      instagram: leadData.instagram,
      email: leadData.email,
      phone: leadData.phone,
      businessVertical: ctx.businessVertical,
      businessStage: ctx.businessStage,
      notes: leadData.notes,
    },
    conversationExcerpt: transcript,
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Summarise this enquiry for our team:\n${JSON.stringify(userPayload)}`,
          },
        ],
        temperature: 0.25,
        max_tokens: 450,
      }),
    })
    if (!res.ok) return fallbackProfessionalSummary(leadData, ctx)
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) return fallbackProfessionalSummary(leadData, ctx)
    return text.slice(0, 2500)
  } catch {
    return fallbackProfessionalSummary(leadData, ctx)
  }
}

function fallbackSalesIntakeSummary(
  leadData: LeadData,
  ctx: LeadSummaryContext,
  recommendedService: string
): string {
  const subject =
    leadData.company.trim() ||
    leadData.name.trim() ||
    ctx.businessVertical.trim() ||
    "Lead"
  const need =
    recommendedService.trim() ||
    leadData.service.trim() ||
    "growth strategy"
  const context = [
    ctx.businessVertical.trim(),
    ctx.businessStage.trim(),
    leadData.website.trim() || leadData.instagram.trim(),
  ]
    .filter(Boolean)
    .join(" · ")
  return `${subject} seeking ${need} support${
    context ? ` for ${context}` : ""
  }.`.slice(0, 240)
}

export async function generateSalesIntakeSummary(
  messages: { role: string; content: string }[],
  leadData: LeadData,
  ctx: LeadSummaryContext,
  recommendedService: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  const transcript = messages
    .map((m) =>
      m.role === "user" ? `Visitor: ${m.content}` : `Assistant: ${m.content}`
    )
    .join("\n")
    .slice(0, 10000)

  if (!apiKey) {
    return fallbackSalesIntakeSummary(leadData, ctx, recommendedService)
  }

  const system = `You write one-line sales intake summaries for PxlBrief. Output one premium, concrete sentence under 160 characters. No bullets. No labels. Do not invent facts. Example: "Fashion startup seeking SEO + Instagram growth support for low Shopify traffic."`
  const userPayload = {
    structured: {
      visitorType: leadData.visitorType,
      name: leadData.name,
      company: leadData.company,
      service: leadData.service,
      recommendedService,
      website: leadData.website,
      instagram: leadData.instagram,
      businessVertical: ctx.businessVertical,
      businessStage: ctx.businessStage,
      notes: leadData.notes,
    },
    conversationExcerpt: transcript,
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Summarise this enquiry in one sentence:\n${JSON.stringify(userPayload)}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 80,
      }),
    })
    if (!res.ok) {
      return fallbackSalesIntakeSummary(leadData, ctx, recommendedService)
    }
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) {
      return fallbackSalesIntakeSummary(leadData, ctx, recommendedService)
    }
    return text.replace(/^["']|["']$/g, "").slice(0, 240)
  } catch {
    return fallbackSalesIntakeSummary(leadData, ctx, recommendedService)
  }
}

export function mergeLeadDataIntoConversationSnapshot(
  base: ConversationStatePayload,
  leadData: LeadData
): ConversationStatePayload {
  return {
    ...base,
    name: leadData.name.trim() || base.name,
    company: leadData.company.trim() || base.company,
    email: leadData.email.trim() || base.email,
    whatsapp: leadData.phone.trim() || base.whatsapp,
    servicesInterested:
      leadData.service.trim() || base.servicesInterested,
  }
}
