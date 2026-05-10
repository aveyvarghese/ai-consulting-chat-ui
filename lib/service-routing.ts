/**
 * Heuristic service routing for PxlBrief AI — visitor-facing copy only.
 * No numeric scores are exposed outside this module.
 */

import type { LeadVisitorType } from "@/lib/lead-data"

export type PublicServiceRecommendation = {
  directionLabel: string
  whyItMatters: string
  suggestedNextStep: string
}

type RouteKey =
  | "ai_automation"
  | "website_funnel"
  | "performance_marketing"
  | "seo_growth"
  | "brand_strategy"
  | "crm_workflow"
  | "founder_bi"

const ROUTES: Record<
  RouteKey,
  { patterns: RegExp[]; rec: PublicServiceRecommendation }
> = {
  ai_automation: {
    patterns: [
      /\b(ai|llm|gpt|openai|agents?|copilot|machine learning)\b/i,
      /\bautomate|automation|workflow engine|orchestrat/i,
      /\bintegrat(e|ion).*(slack|notion|hubspot|zapier|make\.com)/i,
    ],
    rec: {
      directionLabel: "Automation & AI systems",
      whyItMatters:
        "When execution depends on fragile one-offs, leverage stalls before the roadmap does—architecture is what keeps gains compounding.",
      suggestedNextStep:
        "If it helps, note your stack or one workflow you wish ran without heroics—we can anchor the next exchange there.",
    },
  },
  website_funnel: {
    patterns: [
      /\b(website|site|landing page|funnel|checkout|cro|conversion rate)\b/i,
      /\bux\b|\bui\b|redesign|webflow|framer\b/i,
    ],
    rec: {
      directionLabel: "Digital estates & funnel systems",
      whyItMatters:
        "Traffic, narrative, and measurement have to move as one—otherwise acquisition pays a tax at every handoff.",
      suggestedNextStep:
        "Drop a URL or describe the step where prospects stall; sharper routing beats generic advice.",
    },
  },
  performance_marketing: {
    patterns: [
      /\b(meta ads?|facebook ads?|google ads|ppc|paid media|performance marketing)\b/i,
      /\b(roas|cac|cpc|cpm|attribution)\b/i,
      /\bads?\s+(budget|spend|scale)\b/i,
    ],
    rec: {
      directionLabel: "Acquisition & performance",
      whyItMatters:
        "Efficiency shows up when creative cadence, spend discipline, and instrumentation match how you actually make money.",
      suggestedNextStep:
        "Name your primary channel and one KPI you are defending—we will keep the thread anchored there.",
    },
  },
  seo_growth: {
    patterns: [
      /\bseo\b|\bae\b|\bsearch engine\b|\brankings?\b/i,
      /\borganic (traffic|growth|search)\b/i,
      /\bcontent strategy|editorial calendar|blog\b/i,
    ],
    rec: {
      directionLabel: "Growth architecture & discovery",
      whyItMatters:
        "Organic growth is sequencing—technical depth, content authority, and distribution have to line up or effort scatters.",
      suggestedNextStep:
        "One line on domain or constraint (e.g., technical debt, topical focus) sharpens what to prioritise next.",
    },
  },
  brand_strategy: {
    patterns: [
      /\b(brand(ing)?|positioning|narrative|messaging|story)\b/i,
      /\brebrand|identity|tone of voice|value proposition\b/i,
    ],
    rec: {
      directionLabel: "Positioning & narrative",
      whyItMatters:
        "Markets reward teams that compress ambiguity into a thesis operators can repeat without diluting trust.",
      suggestedNextStep:
        "When you are ready, attach a guideline or deck from the paperclip—context beats abstraction.",
    },
  },
  crm_workflow: {
    patterns: [
      /\b(hubspot|salesforce|pipedrive|crm)\b/i,
      /\b(pipeline|handoff|sla|ticket|ops workflow)\b/i,
      /\b(sales|revops)\s+(process|workflow)\b/i,
    ],
    rec: {
      directionLabel: "Automation architecture (revenue & ops)",
      whyItMatters:
        "Leaks between teams usually look like a tooling issue but behave like ownership and contracts between functions.",
      suggestedNextStep:
        "Name one brittle handoff (lead → fulfilment, sales → ops, support → product)—that often exposes the real constraint.",
    },
  },
  founder_bi: {
    patterns: [
      /\b(dashboard|board pack|weekly report|kpi|metrics layer)\b/i,
      /\b(business intelligence|exec view|leadership visibility)\b/i,
      /\b(single source of truth|data warehouse|reporting cadence)\b/i,
    ],
    rec: {
      directionLabel: "Intelligence & founder dashboards",
      whyItMatters:
        "The bottleneck is rarely “more charts”—it is signal quality, cadence, and what leadership can defend in review.",
      suggestedNextStep:
        "Describe what you wish you saw every Monday—clarity beats volume in the next reply.",
    },
  },
}

function scoreRoute(key: RouteKey, text: string): number {
  let s = 0
  for (const p of ROUTES[key].patterns) {
    if (p.test(text)) s += 3
  }
  return s
}

function eligibleVisitor(v: LeadVisitorType): boolean {
  return v === "potential_client" || v === "unknown"
}

/**
 * Pure heuristic from user turns only. Returns null when signal is thin
 * or visitor type is not a business-mandate conversation.
 */
export function computePublicServiceRecommendation(
  messages: readonly { role: string; content: string }[],
  visitorType: LeadVisitorType
): PublicServiceRecommendation | null {
  if (!eligibleVisitor(visitorType)) return null

  const userTurns = messages.filter((m) => m.role === "user")
  if (userTurns.length < 2) return null

  const text = userTurns.map((m) => m.content).join("\n").slice(0, 8000)
  if (text.trim().length < 24) return null

  const keys = Object.keys(ROUTES) as RouteKey[]
  const ranked = keys
    .map((k) => ({ k, s: scoreRoute(k, text) }))
    .sort((a, b) => b.s - a.s)

  const top = ranked[0]!
  if (top.s < 3) return null

  return ROUTES[top.k].rec
}
