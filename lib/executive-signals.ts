import { z } from "zod"
import type { LeadVisitorType } from "@/lib/lead-data"
import type { ExecutiveSignalConfidence, ExecutiveSignalItem } from "@/lib/executive-signals-types"

export const EXECUTIVE_SIGNAL_TITLES = [
  "Revenue friction",
  "Team bottleneck",
  "Funnel leakage",
  "Operational drag",
  "Slow decision systems",
  "Missing automation",
  "Founder dependency risk",
] as const

export type ExecutiveSignalTitle = (typeof EXECUTIVE_SIGNAL_TITLES)[number]

export const EXECUTIVE_IMPACTS = [
  "growth velocity",
  "CAC efficiency",
  "execution speed",
  "reporting clarity",
  "scalability",
  "leadership bandwidth",
] as const

const TITLE_ALIASES: { match: RegExp; title: ExecutiveSignalTitle }[] = [
  { match: /\b(revenue|margin|pricing|moneti|cash\s*flow)\b/i, title: "Revenue friction" },
  { match: /\b(team|hiring|headcount|capacity|bandwidth|roles?)\b/i, title: "Team bottleneck" },
  { match: /\b(funnel|conversion|leak|drop-?off|abandon)\b/i, title: "Funnel leakage" },
  { match: /\b(operational|ops|manual|process|inefficien|drag|bottleneck)\b/i, title: "Operational drag" },
  { match: /\b(decision|approval|slow|latency|governance|committee)\b/i, title: "Slow decision systems" },
  { match: /\b(automat|integrat|workflow|tooling|crm|stack)\b/i, title: "Missing automation" },
  { match: /\b(founder|ceo|key\s*person|hero|bus\s*factor|dependency)\b/i, title: "Founder dependency risk" },
]

const DEFAULT_IMPACT: Record<ExecutiveSignalTitle, string> = {
  "Revenue friction": "growth velocity",
  "Team bottleneck": "execution speed",
  "Funnel leakage": "CAC efficiency",
  "Operational drag": "execution speed",
  "Slow decision systems": "leadership bandwidth",
  "Missing automation": "scalability",
  "Founder dependency risk": "scalability",
}

function confidenceFromHits(hits: number): ExecutiveSignalConfidence {
  if (hits >= 4) return "Strong pattern"
  if (hits >= 2) return "Moderate"
  return "Emerging"
}

/** Keyword inference — no network, no scores exposed. */
export function inferExecutiveSignalsHeuristic(
  messages: readonly { role: string; content: string }[],
  visitorType: LeadVisitorType
): ExecutiveSignalItem[] {
  if (visitorType !== "potential_client" && visitorType !== "unknown") {
    return []
  }
  const text = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n")
    .slice(0, 12000)
    .toLowerCase()

  if (text.trim().length < 24) return []

  const scored = new Map<ExecutiveSignalTitle, number>()
  for (const { match, title } of TITLE_ALIASES) {
    const c = (text.match(match) ?? []).length
    if (c > 0) scored.set(title, (scored.get(title) ?? 0) + c)
  }

  const ranked = [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  if (ranked.length === 0) return []

  return ranked.map(([title, hits]) => ({
    title,
    typicalImpact: DEFAULT_IMPACT[title],
    confidence: confidenceFromHits(hits),
  }))
}

const signalItemSchema = z.object({
  title: z.string().max(80),
  typicalImpact: z.string().max(80),
  confidence: z.enum(["Emerging", "Moderate", "Strong pattern"]),
})

const responseSchema = z.object({
  signals: z.array(signalItemSchema).max(4),
})

function normalizeTitle(raw: string): ExecutiveSignalTitle | null {
  const t = raw.trim()
  if (!t) return null
  const exact = EXECUTIVE_SIGNAL_TITLES.find((x) => x.toLowerCase() === t.toLowerCase())
  if (exact) return exact
  const lower = t.toLowerCase()
  for (const canonical of EXECUTIVE_SIGNAL_TITLES) {
    if (lower.includes(canonical.toLowerCase().slice(0, 10))) return canonical
  }
  return null
}

function normalizeImpact(raw: string): string {
  const t = raw.trim().toLowerCase()
  const hit = EXECUTIVE_IMPACTS.find((i) => t.includes(i) || i.includes(t))
  return hit ?? "execution speed"
}

export async function generateExecutiveSignals(
  messages: readonly { role: string; content: string }[],
  visitorType: LeadVisitorType
): Promise<ExecutiveSignalItem[]> {
  const fallback = inferExecutiveSignalsHeuristic(messages, visitorType)
  if (visitorType !== "potential_client" && visitorType !== "unknown") {
    return []
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return fallback

  const transcript = messages
    .map((m) => `${m.role === "user" ? "Visitor" : "PxlBrief"}: ${m.content}`)
    .join("\n")
    .slice(0, 10000)

  if (transcript.trim().length < 40) return fallback

  const system = `You infer executive operating signals from a live chat. Output JSON only: {"signals":[...]} with at most 4 items.
Rules:
- Each item: title, typicalImpact, confidence.
- title MUST be exactly one of: ${EXECUTIVE_SIGNAL_TITLES.join(" | ")}
- typicalImpact MUST be exactly one of: ${EXECUTIVE_IMPACTS.join(" | ")}
- confidence MUST be exactly one of: Emerging | Moderate | Strong pattern
- Only include signals clearly supported by the transcript. If nothing clear, return {"signals":[]}.
- Tone is calm and diagnostic — not alarmist. No scores, no percentages, no internal labels.`

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
            content: JSON.stringify({
              visitorType,
              transcript,
            }),
          },
        ],
        temperature: 0.22,
        max_tokens: 400,
        response_format: { type: "json_object" },
      }),
    })
    if (!res.ok) return fallback
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content
    if (typeof raw !== "string") return fallback
    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return fallback
    }
    const parsed = responseSchema.safeParse(json)
    if (!parsed.success) return fallback
    const out: ExecutiveSignalItem[] = []
    const seen = new Set<string>()
    for (const s of parsed.data.signals) {
      const title = normalizeTitle(s.title)
      if (!title || seen.has(title)) continue
      seen.add(title)
      out.push({
        title,
        typicalImpact: normalizeImpact(s.typicalImpact),
        confidence: s.confidence,
      })
    }
    return out.length > 0 ? out : fallback
  } catch {
    return fallback
  }
}
