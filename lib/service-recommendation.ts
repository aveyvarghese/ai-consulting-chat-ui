import type { ConversationStatePayload } from "@/lib/conversation-state"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"

export type ServiceRecommendationName =
  | "AI Automation"
  | "Branding"
  | "Website Systems"
  | "Performance Marketing"
  | "Growth Strategy"
  | "SEO"

export interface ServiceRecommendation {
  primaryRecommendation: ServiceRecommendationName
  whyItMatters: string
  suggestedNextStep: string
}

interface MessageLike {
  role: string
  content: string
}

interface RecommendationRule {
  name: ServiceRecommendationName
  patterns: RegExp[]
  whyItMatters: string
  suggestedNextStep: string
}

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    name: "AI Automation",
    patterns: [
      /\bai\b/i,
      /\bautomat(?:e|ion|ing)\b/i,
      /\bworkflow\b/i,
      /\bmanual\b/i,
      /\bcrm\b/i,
      /\bops?\b/i,
      /\bchatbot\b/i,
      /\blead\s+(?:routing|qualification|capture)\b/i,
      /\bwhatsapp\s+automation\b/i,
      /\bprocess(?:es)?\b/i,
    ],
    whyItMatters:
      "Automation turns repeated handoffs into a cleaner operating system, so leads and internal work move faster with fewer leaks.",
    suggestedNextStep:
      "Submit the enquiry with the workflow or customer journey you want tightened first.",
  },
  {
    name: "Branding",
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
    whyItMatters:
      "A sharper brand system makes the offer easier to trust, remember and convert before performance spend is added.",
    suggestedNextStep:
      "Share references, an existing profile, or a short brief so the team can assess positioning depth.",
  },
  {
    name: "Website Systems",
    patterns: [
      /\bwebsite\b/i,
      /\bsite\b/i,
      /\blanding\b/i,
      /\bwebflow\b/i,
      /\bshopify\b/i,
      /\bcms\b/i,
      /\bcatalog(?:ue)?\b/i,
      /\bcheckout\b/i,
      /\bfunnel\b/i,
      /\bbooking\b/i,
      /\bux\b/i,
      /\bpages?\b/i,
    ],
    whyItMatters:
      "The site should work like a conversion system, not a brochure; structure, speed and proof need to support the next action.",
    suggestedNextStep:
      "Send the live URL or upload references so PxlBrief can map the first system improvement.",
  },
  {
    name: "Performance Marketing",
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
    whyItMatters:
      "Paid growth needs a tighter loop between offer, creative, funnel and economics before scale becomes reliable.",
    suggestedNextStep:
      "Submit the enquiry with current channels, spend range or campaign context if available.",
  },
  {
    name: "Growth Strategy",
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
    whyItMatters:
      "The highest-leverage move is to clarify the commercial path before choosing channels, creative or systems.",
    suggestedNextStep:
      "Submit the enquiry with the business stage and one growth constraint you want solved first.",
  },
  {
    name: "SEO",
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
    whyItMatters:
      "Search demand compounds when technical structure, content intent and authority are built around how buyers actually look for you.",
    suggestedNextStep:
      "Share the website or priority category so the team can assess search opportunity and site readiness.",
  },
]

function serviceCorpus(
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
    ...messages.map((m) => m.content),
  ]
    .filter(Boolean)
    .join("\n")
}

function userMessageCount(messages: MessageLike[]): number {
  return messages.filter((m) => m.role === "user").length
}

function hasEnoughContext(
  state: ConversationStatePayload,
  messages: MessageLike[],
  corpus: string
): boolean {
  if (state.visitorType !== "potential_client") return false

  const structuredSignals = [
    state.businessVertical,
    state.businessStage,
    state.servicesInterested,
    state.currentChallenge,
    state.acquisitionChannels,
  ].filter((value) => value.trim().length > 0).length

  const userCount = userMessageCount(messages)
  const userTextLength = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.trim())
    .join(" ").length

  return (
    state.potentialClientStage >= 3 ||
    structuredSignals >= 2 ||
    (userCount >= 2 && userTextLength >= 80) ||
    (userCount >= 1 && userTextLength >= 140 && /\b(need|want|looking|help|growth|website|brand|seo|ads?|automate|strategy)\b/i.test(corpus))
  )
}

function recommendationScore(rule: RecommendationRule, corpus: string): number {
  return rule.patterns.reduce((score, pattern) => {
    const matches = corpus.match(new RegExp(pattern.source, "gi"))
    return score + (matches?.length ?? 0)
  }, 0)
}

function chooseRule(corpus: string): RecommendationRule {
  const scored = RECOMMENDATION_RULES.map((rule) => ({
    rule,
    score: recommendationScore(rule, corpus),
  })).sort((a, b) => b.score - a.score)

  if (scored[0] && scored[0].score > 0) return scored[0].rule
  return RECOMMENDATION_RULES.find((rule) => rule.name === "Growth Strategy")!
}

export function deriveServiceRecommendation(
  state: ConversationStatePayload,
  messages: MessageLike[],
  leadIntel?: LeadIntelligenceResult | null
): ServiceRecommendation | null {
  const corpus = serviceCorpus(state, messages, leadIntel)
  if (!hasEnoughContext(state, messages, corpus)) return null

  const rule = chooseRule(corpus)
  return {
    primaryRecommendation: rule.name,
    whyItMatters: rule.whyItMatters,
    suggestedNextStep: rule.suggestedNextStep,
  }
}
