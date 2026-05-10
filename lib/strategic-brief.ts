import { z } from "zod"
import type { LeadData } from "@/lib/lead-data"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import type { PublicServiceRecommendation } from "@/lib/service-routing"
import type { StrategicBriefFields, StrategicBriefPayload } from "@/lib/strategic-brief-types"

const briefJsonSchema = z.object({
  complete: z.boolean(),
  businessContext: z.string().max(600).optional(),
  keyChallenge: z.string().max(600).optional(),
  recommendedDirection: z.string().max(600).optional(),
  prioritySystem: z.string().max(600).optional(),
  suggestedNextStep: z.string().max(600).optional(),
})

function userTranscriptLength(
  messages: readonly { role: string; content: string }[]
): number {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ")
    .trim().length
}

function heuristicBrief(
  leadData: LeadData,
  intel: Pick<
    LeadIntelligenceResult,
    | "businessVertical"
    | "businessStage"
    | "currentChallenge"
    | "servicesInterested"
  >,
  routing: PublicServiceRecommendation | null,
  professionalSummary: string
): StrategicBriefPayload {
  const ctx =
    [leadData.company.trim(), intel.businessVertical.trim()].filter(Boolean).join(" · ") ||
    intel.businessVertical.trim() ||
    (leadData.visitorType === "potential_client"
      ? "Growth-led organisation"
      : "Engaged visitor")

  const challenge =
    intel.currentChallenge.trim() ||
    leadData.notes.trim().slice(0, 280) ||
    professionalSummary.slice(0, 280).trim()

  if (!ctx || ctx.length < 8 || !challenge || challenge.length < 12) {
    return { complete: false }
  }

  const direction =
    routing?.directionLabel.trim() ||
    intel.servicesInterested.trim() ||
    leadData.service.trim() ||
    "Integrated mandate across strategy, systems, and execution"

  return {
    complete: true,
    fields: {
      businessContext: ctx.slice(0, 400),
      keyChallenge: challenge.slice(0, 400),
      recommendedDirection: direction.slice(0, 400),
      prioritySystem:
        routing?.whyItMatters.slice(0, 400) ||
        "Clarify the operating layer where signal, ownership, and cadence must align before build work spreads.",
      suggestedNextStep:
        routing?.suggestedNextStep.slice(0, 400) ||
        "Hold a short strategy review so we can tighten scope and sequencing with you directly.",
    },
  }
}

export async function generateStrategicBrief(params: {
  messages: readonly { role: string; content: string }[]
  transcript: string
  leadData: LeadData
  intelligence: Pick<
    LeadIntelligenceResult,
    | "businessVertical"
    | "businessStage"
    | "currentChallenge"
    | "servicesInterested"
  >
  professionalSummary: string
  serviceRecommendation: PublicServiceRecommendation | null
}): Promise<StrategicBriefPayload> {
  const {
    messages,
    transcript,
    leadData,
    intelligence,
    professionalSummary,
    serviceRecommendation,
  } = params

  if (userTranscriptLength(messages) < 40) {
    return { complete: false }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return heuristicBrief(
      leadData,
      intelligence,
      serviceRecommendation,
      professionalSummary
    )
  }

  const routingBlock = serviceRecommendation
    ? `Session routing (visitor-facing): ${serviceRecommendation.directionLabel}. ${serviceRecommendation.whyItMatters}`
    : "None"

  const system = `You draft a premium strategic brief for PxlBrief (executive consultancy). Output a single JSON object only, no markdown, no prose outside JSON.
Rules:
- Tone: calm, concise, founder-aware, strategic — never salesy.
- If the transcript and structured fields lack enough concrete business signal (category, goal, constraint, or stage), set "complete": false and omit or empty the string fields.
- If "complete": true, every string field must be 1–2 tight sentences (max ~320 characters each), plain text, no bullet characters, no internal jargon like "lead" or "score".
- Fields: businessContext, keyChallenge, recommendedDirection, prioritySystem (one system or layer to instrument first), suggestedNextStep (one crisp action).
- JSON shape: {"complete":boolean,"businessContext"?:string,"keyChallenge"?:string,"recommendedDirection"?:string,"prioritySystem"?:string,"suggestedNextStep"?:string}`

  const userContent = JSON.stringify({
    structured: {
      visitorType: leadData.visitorType,
      company: leadData.company,
      service: leadData.service,
      vertical: intelligence.businessVertical,
      stage: intelligence.businessStage,
      challenge: intelligence.currentChallenge,
      servicesInterested: intelligence.servicesInterested,
    },
    professionalSummary: professionalSummary.slice(0, 2000),
    sessionRouting: routingBlock,
    transcriptExcerpt: transcript.slice(0, 10000),
  })

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
          { role: "user", content: userContent },
        ],
        temperature: 0.28,
        max_tokens: 550,
        response_format: { type: "json_object" },
      }),
    })
    if (!res.ok) {
      return heuristicBrief(
        leadData,
        intelligence,
        serviceRecommendation,
        professionalSummary
      )
    }
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content
    if (typeof raw !== "string") {
      return heuristicBrief(
        leadData,
        intelligence,
        serviceRecommendation,
        professionalSummary
      )
    }
    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return heuristicBrief(
        leadData,
        intelligence,
        serviceRecommendation,
        professionalSummary
      )
    }
    const parsed = briefJsonSchema.safeParse(json)
    if (!parsed.success || !parsed.data.complete) {
      return { complete: false }
    }
    const d = parsed.data
    const fields: StrategicBriefFields = {
      businessContext: (d.businessContext ?? "").trim(),
      keyChallenge: (d.keyChallenge ?? "").trim(),
      recommendedDirection: (d.recommendedDirection ?? "").trim(),
      prioritySystem: (d.prioritySystem ?? "").trim(),
      suggestedNextStep: (d.suggestedNextStep ?? "").trim(),
    }
    const minLen = 16
    if (
      fields.businessContext.length < minLen ||
      fields.keyChallenge.length < minLen ||
      fields.recommendedDirection.length < minLen ||
      fields.prioritySystem.length < minLen ||
      fields.suggestedNextStep.length < minLen
    ) {
      return { complete: false }
    }
    return { complete: true, fields }
  } catch {
    return heuristicBrief(
      leadData,
      intelligence,
      serviceRecommendation,
      professionalSummary
    )
  }
}
