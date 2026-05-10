import type { ConversationStatePayload } from "@/lib/conversation-state"
import type { LeadIntelligenceResult, LeadScoreTier } from "@/lib/lead-intelligence"

export const PREFERRED_SERVICE_OPTIONS = [
  "AI Automation",
  "Branding",
  "Website Systems",
  "Performance Marketing",
  "Growth Strategy",
  "SEO",
] as const

export const BUDGET_RANGE_OPTIONS = [
  "Under ₹1L",
  "₹1L - ₹3L",
  "₹3L - ₹7L",
  "₹7L - ₹15L",
  "₹15L+",
  "Not sure yet",
] as const

export type PreferredService = (typeof PREFERRED_SERVICE_OPTIONS)[number]

interface MessageLike {
  role: string
  content: string
}

interface ServiceRule {
  service: PreferredService
  patterns: RegExp[]
}

const SERVICE_RULES: ServiceRule[] = [
  {
    service: "AI Automation",
    patterns: [
      /\bai\b/i,
      /\bautomat(?:e|ion|ing)\b/i,
      /\bworkflow\b/i,
      /\bmanual\b/i,
      /\bcrm\b/i,
      /\bchatbot\b/i,
      /\blead\s+(?:routing|qualification|capture)\b/i,
      /\bwhatsapp\s+automation\b/i,
      /\bprocess(?:es)?\b/i,
    ],
  },
  {
    service: "Branding",
    patterns: [
      /\bbrand(?:ing)?\b/i,
      /\bposition(?:ing)?\b/i,
      /\bidentity\b/i,
      /\blogo\b/i,
      /\bnaming\b/i,
      /\bvisual\b/i,
      /\bpremium\b/i,
      /\bdifferentiat(?:e|ion)\b/i,
      /\bstory\b/i,
      /\bvoice\b/i,
    ],
  },
  {
    service: "Website Systems",
    patterns: [
      /\bwebsite\b/i,
      /\bsite\b/i,
      /\blanding\b/i,
      /\bshopify\b/i,
      /\bwebflow\b/i,
      /\bcms\b/i,
      /\bcatalog(?:ue)?\b/i,
      /\bcheckout\b/i,
      /\bfunnel\b/i,
      /\bbooking\b/i,
      /\bux\b/i,
    ],
  },
  {
    service: "Performance Marketing",
    patterns: [
      /\bperformance\b/i,
      /\bpaid\b/i,
      /\bads?\b/i,
      /\bmeta\b/i,
      /\bfacebook\b/i,
      /\bgoogle\s+ads\b/i,
      /\bppc\b/i,
      /\broas\b/i,
      /\bcpa\b/i,
      /\bcac\b/i,
      /\bcampaign\b/i,
      /\bacquisition\b/i,
      /\bcreatives?\b/i,
      /\bleads?\b/i,
    ],
  },
  {
    service: "Growth Strategy",
    patterns: [
      /\bgrowth\b/i,
      /\bscale\b/i,
      /\bscaling\b/i,
      /\bstrategy\b/i,
      /\broadmap\b/i,
      /\bgo[-\s]?to[-\s]?market\b/i,
      /\bgtm\b/i,
      /\boffer\b/i,
      /\bpricing\b/i,
      /\bconversion\b/i,
      /\baudit\b/i,
      /\bconsult(?:ing|ation)?\b/i,
    ],
  },
  {
    service: "SEO",
    patterns: [
      /\bseo\b/i,
      /\bsearch\b/i,
      /\brank(?:ing)?\b/i,
      /\borganic\b/i,
      /\bcontent\b/i,
      /\bblog\b/i,
      /\blocal\s+seo\b/i,
      /\bkeywords?\b/i,
      /\bgoogle\s+search\b/i,
    ],
  },
]

function corpusFrom(
  state: ConversationStatePayload,
  messages: MessageLike[],
  leadIntel?: LeadIntelligenceResult | null
): string {
  return [
    state.businessVertical,
    state.businessStage,
    state.servicesInterested,
    state.currentChallenge,
    state.acquisitionChannels,
    state.conversationSummary,
    leadIntel?.businessVertical,
    leadIntel?.businessStage,
    leadIntel?.servicesInterested,
    leadIntel?.currentChallenge,
    leadIntel?.consultantSummary,
    ...messages.map((message) => message.content),
  ]
    .filter(Boolean)
    .join("\n")
}

function scoreService(rule: ServiceRule, corpus: string): number {
  return rule.patterns.reduce((score, pattern) => {
    const matches = corpus.match(new RegExp(pattern.source, "gi"))
    return score + (matches?.length ?? 0)
  }, 0)
}

export function deriveRecommendedService(
  state: ConversationStatePayload,
  messages: MessageLike[],
  leadIntel?: LeadIntelligenceResult | null
): PreferredService {
  const corpus = corpusFrom(state, messages, leadIntel)
  const scored = SERVICE_RULES.map((rule) => ({
    rule,
    score: scoreService(rule, corpus),
  })).sort((a, b) => b.score - a.score)

  if (scored[0] && scored[0].score > 0) return scored[0].rule.service
  return "Growth Strategy"
}

export function estimateOpportunityLevel(
  leadScore: LeadScoreTier | string | null | undefined,
  budgetRange: string,
  state: ConversationStatePayload
): string {
  const score = typeof leadScore === "string" ? leadScore : ""
  const budget = budgetRange.toLowerCase()
  const highBudget = /15l|7l|₹15|₹7/.test(budget)
  const midBudget = /3l|₹3|1l|₹1/.test(budget)
  const highIntent =
    state.whatsapp.trim() ||
    state.email.trim() ||
    /\b(urgent|proposal|start|hire|call|budget|timeline)\b/i.test(
      state.conversationSummary
    )

  if (score === "High" && (highBudget || highIntent)) return "High"
  if (score === "High" || highBudget) return "Strong"
  if (score === "Medium" || midBudget || highIntent) return "Qualified"
  return "Emerging"
}

export function buildFallbackSalesSummary(
  state: ConversationStatePayload,
  service: string
): string {
  const vertical = state.businessVertical.trim() || "Business"
  const stage = state.businessStage.trim()
  const challenge = state.currentChallenge.trim()
  const channels = state.acquisitionChannels.trim()
  const context = [stage, challenge, channels].filter(Boolean).join(", ")
  return `${vertical} enquiry seeking ${service}${
    context ? ` support around ${context}` : " support"
  }.`.slice(0, 220)
}
