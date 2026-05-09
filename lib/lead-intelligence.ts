/** AI + heuristic helpers for `/api/lead` and `/api/lead/intelligence`. */

import type { ConversationStatePayload } from "@/lib/conversation-state"

export type LeadVisitorTypeSubmit = "potential_client" | "job_seeker" | "vendor"

export type LeadScoreTier = "High" | "Medium" | "Low"

export interface LeadIntelFields {
  visitorType: LeadVisitorTypeSubmit
  name: string
  company: string
  role: string
  email: string
  whatsApp: string
  businessVertical: string
  businessStage: string
  servicesInterested: string
  currentChallenge: string
  acquisitionChannels: string
  uploadedFileName: string
  conversationSummary: string
}

export interface LeadIntelligenceResult extends LeadIntelFields {
  consultantSummary: string
  leadScore: LeadScoreTier
  leadScoreRationale: string
  /** Short label for subject line, e.g. "Fashion Startup" */
  subjectAccent: string
}

export const VISITOR_PUBLIC_LABEL: Record<LeadVisitorTypeSubmit, string> = {
  potential_client: "Potential client",
  job_seeker: "Job applicant",
  vendor: "Vendor / partner",
}

function clamp(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + "…"
}

/** Rule-based fallback when OpenAI is unavailable */
export function heuristicLeadScoreAndAccent(
  fullTextLower: string,
  visitorType: LeadVisitorTypeSubmit,
  accentHint: string
): Pick<
  LeadIntelligenceResult,
  "leadScore" | "leadScoreRationale" | "subjectAccent"
> {
  const high =
    /\b(scal(?:e|ing)|growth\s+(?:marketing|strategy|partner)|marketing\s+support|automate\b|automation|strategy\b|consultation|consult\b|discovery\s+call|\bcallback\b|\bbook\b.*\bcall\b|schedule\s+(?:a\s+)?(?:call|meeting)|urgent\b|need\s+(?:your\s+)?help\s+(?:to|with)\s+grow|agency\s+(?:partner|needed))\b/i
  const medium =
    /\b(curious|explor(?:e|ing)|tell\s+me\s+about|learn\s+more|interesting|what\s+do\s+you\s+do|pricing|budget|options|early\s+(?:sense|ideas))\b/i
  const low =
    /^(hey|hi|hello|thanks|thank\s+you|ok+|cool)\b|^.{0,35}$/.test(fullTextLower.trim())

  let leadScore: LeadScoreTier = "Medium"
  let leadScoreRationale =
    "Balanced exploratory signals versus concrete commercial intent."

  if (high.test(fullTextLower)) {
    leadScore = "High"
    leadScoreRationale =
      "Explicit growth, scaling, marketing, automation, strategy or scheduling language."
  } else if (
    visitorType === "job_seeker" &&
    /\b(apply\b|resume|cv\b|portfolio|role\b|experience\b)/i.test(fullTextLower)
  ) {
    leadScore = "High"
    leadScoreRationale =
      "Job-oriented dialogue with substantive application intent."
  } else if (
    visitorType === "vendor" &&
    /\b(we\s+offer|services|proposal|portfolio|capabilities)\b/i.test(
      fullTextLower
    )
  ) {
    leadScore = "Medium"
    leadScoreRationale = "Partnership/vendor outreach with directional detail."
  } else if (
    /\b(low|casual|just checking|just browsing|not sure|maybe later)\b/.test(fullTextLower) &&
    fullTextLower.trim().length < 120 &&
    !medium.test(fullTextLower)
  ) {
    leadScore = "Low"
    leadScoreRationale = "Very short or ambiguous messages with unclear requirements."
  } else if (medium.test(fullTextLower)) {
    leadScore = "Medium"
    leadScoreRationale = "Education / exploration weighted language."
  }

  const accent = clamp(accentHint || "General enquiry", 48)
  return { leadScore, leadScoreRationale, subjectAccent: accent }
}

export function formatLeadEmailStructured(
  f: LeadIntelligenceResult,
  submittedAt: string
): string {
  const lines: string[] = [
    `SECTION 1 — Visitor Information`,
    `Visitor Type: ${VISITOR_PUBLIC_LABEL[f.visitorType]}`,
    `Name: ${f.name || "—"}`,
    `Company: ${f.company || "—"}`,
    `Role: ${f.role || "—"}`,
    `Email: ${f.email || "—"}`,
    `WhatsApp: ${f.whatsApp || "—"}`,
    ``,
    `SECTION 2 — Business Intelligence`,
    `Business Vertical: ${f.businessVertical || "—"}`,
    `Business Stage: ${f.businessStage || "—"}`,
    `Main Challenges: ${f.currentChallenge || "—"}`,
    `Services Interested: ${f.servicesInterested || "—"}`,
    `Current Acquisition Channels: ${f.acquisitionChannels || "—"}`,
    ``,
    `SECTION 3 — AI Conversation Summary`,
    f.consultantSummary?.trim() || "—",
    ``,
    `SECTION 4 — Attachments`,
    f.uploadedFileName?.trim() ? f.uploadedFileName.trim() : "No file referenced",
    ``,
    `Lead Score: ${f.leadScore}`,
    `Score rationale (system): ${f.leadScoreRationale}`,
    ``,
    `Timestamp (UTC): ${submittedAt}`,
  ]
  return lines.join("\n")
}

export function buildLeadEmailSubject(
  visitorType: LeadVisitorTypeSubmit,
  subjectAccent: string
): string {
  const a = clamp(subjectAccent, 52)
  const glue =
    !a ||
    /^general\s+(enquir|inquir)/i.test(a.trim()) ||
    /^enquiry$/i.test(a.trim())
      ? ""
      : ` — ${a}`
  switch (visitorType) {
    case "potential_client":
      return `New Potential Client Lead${glue}`
    case "job_seeker":
      return `New Job Application${glue}`
    case "vendor":
      return `New Vendor Enquiry${glue}`
  }
}

interface AiLeadIntelPatch {
  consultantSummary: string
  leadScore: LeadScoreTier
  leadScoreRationale: string
  subjectAccent: string
  businessVertical: string
  businessStage: string
  servicesInterested: string
  currentChallenge: string
  acquisitionChannels: string
}

async function openAiLeadIntel(
  transcript: string,
  partial: LeadIntelFields
): Promise<AiLeadIntelPatch | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const system = `You are a senior business development analyst at PxlBrief (consulting / growth / AI). From the transcript and partial CRM fields, output ONLY valid JSON matching the schema mentally:
{
  "consultantSummary": "4-7 tight sentences consultant voice: needs, situation, opportunities, urgency (low/medium/high)",
  "leadScore": "High" | "Medium" | "Low",
  "leadScoreRationale": "one concise sentence explaining the score vs signals",
  "subjectAccent": "2-6 word label like 'Fashion Startup' or 'Creative Strategist'",
  "businessVertical": "short or empty",
  "businessStage": "short or empty — launching / operating / scaling",
  "servicesInterested": "semicolon-separated services if inferable else empty",
  "currentChallenge": "short main challenge narrative or empty",
  "acquisitionChannels": "short list or empty"
}
Rules: NEVER invent private facts not implied. Prefer empty strings over guesses. Tone clinical, not marketing.`


  const user = `PARTIAL KNOWN FIELDS (may be incomplete):\n${JSON.stringify(partial, null, 2)}\n\nTRANSCRIPT:\n${transcript.slice(0, 11000)}`

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  })

  if (!resp.ok) return null
  const data = await resp.json()
  const raw = data.choices?.[0]?.message?.content
  if (typeof raw !== "string") return null
  try {
    const o = JSON.parse(raw) as Record<string, unknown>
    const leadScoreRaw = String(o.leadScore ?? "").trim()
    const leadScore: LeadScoreTier =
      leadScoreRaw === "High" || leadScoreRaw === "Low" || leadScoreRaw === "Medium"
        ? leadScoreRaw
        : "Medium"

    return {
      consultantSummary: clamp(String(o.consultantSummary ?? ""), 2000),
      leadScore,
      leadScoreRationale: clamp(String(o.leadScoreRationale ?? ""), 500),
      subjectAccent: clamp(String(o.subjectAccent ?? ""), 52),
      businessVertical: clamp(String(o.businessVertical ?? ""), 500),
      businessStage: clamp(String(o.businessStage ?? ""), 240),
      servicesInterested: clamp(String(o.servicesInterested ?? ""), 500),
      currentChallenge: clamp(String(o.currentChallenge ?? ""), 800),
      acquisitionChannels: clamp(String(o.acquisitionChannels ?? ""), 500),
    }
  } catch {
    return null
  }
}

/** Normalize partial + transcript into full intelligence blob (AI if possible). */
export async function computeLeadIntelligence(
  conversationSummary: string,
  partial: LeadIntelFields
): Promise<LeadIntelligenceResult> {
  const fullLower = `${conversationSummary} ${partial.businessVertical} ${partial.currentChallenge}`.toLowerCase()

  let accentHint = partial.businessVertical || partial.role || partial.company
  if (
    partial.visitorType === "job_seeker" &&
    partial.role &&
    /^[a-z\s]+$/i.test(partial.role)
  ) {
    accentHint = partial.role
  }

  const baseHeuristic = heuristicLeadScoreAndAccent(
    fullLower,
    partial.visitorType,
    accentHint || "General enquiry"
  )

  const mergedPartial: LeadIntelFields = {
    ...partial,
    conversationSummary,
  }

  const ai = await openAiLeadIntel(conversationSummary, mergedPartial)

  if (!ai) {
    const fallbackSummary = buildFallbackConsultantSummary(mergedPartial, baseHeuristic.leadScore)
    return {
      ...mergedPartial,
      consultantSummary: fallbackSummary,
      leadScore: baseHeuristic.leadScore,
      leadScoreRationale: baseHeuristic.leadScoreRationale,
      subjectAccent: baseHeuristic.subjectAccent || "General enquiry",
    }
  }

  const mergedScore = maxLeadScore(ai.leadScore, baseHeuristic.leadScore)

  return {
    ...mergedPartial,
    businessVertical:
      ai.businessVertical || mergedPartial.businessVertical || "—",
    businessStage:
      ai.businessStage || mergedPartial.businessStage || "—",
    servicesInterested:
      ai.servicesInterested || mergedPartial.servicesInterested || "—",
    currentChallenge:
      ai.currentChallenge || mergedPartial.currentChallenge || "—",
    acquisitionChannels:
      ai.acquisitionChannels || mergedPartial.acquisitionChannels || "—",
    consultantSummary:
      ai.consultantSummary.trim() ||
      buildFallbackConsultantSummary(mergedPartial, mergedScore),
    leadScore: mergedScore,
    leadScoreRationale:
      ai.leadScoreRationale || baseHeuristic.leadScoreRationale,
    subjectAccent:
      ai.subjectAccent || baseHeuristic.subjectAccent || "General enquiry",
  }
}

function maxLeadScore(a: LeadScoreTier, b: LeadScoreTier): LeadScoreTier {
  const rank: Record<LeadScoreTier, number> = { High: 3, Medium: 2, Low: 1 }
  return rank[a] >= rank[b] ? a : b
}

function buildFallbackConsultantSummary(
  f: LeadIntelFields,
  score: LeadScoreTier
): string {
  const parts = [
    `Visitor type ${VISITOR_PUBLIC_LABEL[f.visitorType]}. `,
    f.businessVertical &&
      `Stated vertical / category context: ${f.businessVertical.trim()}. `,
    f.businessStage &&
      `Stage signals: ${f.businessStage.trim()}. `,
    f.currentChallenge &&
      `Challenges surfaced: ${f.currentChallenge.trim()}. `,
    f.servicesInterested &&
      `Services / interest areas noted: ${f.servicesInterested.trim()}. `,
    f.acquisitionChannels &&
      `Acquisition / channel cues: ${f.acquisitionChannels.trim()}. `,
    `Engagement heuristic: ${score}. Summary generated without full AI analyst pass — refine from transcript.`,
  ]
  return clamp(parts.filter(Boolean).join(""), 1400)
}

/** Map live chat snapshot (+ optional transcript override) to a CRM-shaped partial. */
export function snapshotToLeadPartial(
  snapshot: ConversationStatePayload,
  transcript: string,
  uploadedFileFallback: string
): LeadIntelFields {
  if (snapshot.visitorType === "unknown") {
    throw new Error("Cannot submit lead: visitor type is still unknown")
  }
  const uploaded =
    uploadedFileFallback.trim() || snapshot.uploadedFileName.trim()
  return {
    visitorType: snapshot.visitorType,
    name: snapshot.name.trim(),
    company: snapshot.company.trim(),
    role: snapshot.role.trim(),
    email: snapshot.email.trim(),
    whatsApp: snapshot.whatsapp.trim(),
    businessVertical: snapshot.businessVertical.trim(),
    businessStage: snapshot.businessStage.trim(),
    servicesInterested: snapshot.servicesInterested.trim(),
    currentChallenge: snapshot.currentChallenge.trim(),
    acquisitionChannels: snapshot.acquisitionChannels.trim(),
    uploadedFileName: uploaded,
    conversationSummary: transcript.trim() || snapshot.conversationSummary.trim(),
  }
}
