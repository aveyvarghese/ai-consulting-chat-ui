import type { ConversationStatePayload } from "@/lib/conversation-state"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import { deriveRecommendedService } from "@/lib/intake-recommendation"

interface MessageLike {
  role: string
  content: string
}

export interface AiDiagnosis {
  businessType: string
  industry: string
  businessStage: string
  mainBottleneck: string
  serviceFit: string
  urgencyLevel: "Low" | "Medium" | "High"
  recommendedGrowthDirection: string
  suggestedSystems: string[]
  potentialRevenueLeaks: string[]
  recommendedNextActions: string[]
  leadScore: string
}

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

function detectIndustry(state: ConversationStatePayload, corpus: string): string {
  if (state.businessVertical.trim()) return state.businessVertical.trim()
  const lower = corpus.toLowerCase()
  if (/\breal\s+estate|property|broker|villa|apartment|developer\b/.test(lower))
    return "Real estate"
  if (/\bfashion|apparel|clothing|boutique|label|luxury\s+wear\b/.test(lower))
    return "Fashion / apparel"
  if (/\bd2c|dtc|shopify|e-?commerce|store|consumer\s+brand\b/.test(lower))
    return "D2C / ecommerce"
  if (/\bluxury|premium|high[-\s]?end|villa|jewellery|jewelry\b/.test(lower))
    return "Luxury"
  if (/\bclinic|restaurant|cafe|salon|local\s+business|near\s+me\b/.test(lower))
    return "Local business"
  if (/\benterprise|dealer|distribution|franchise|multi[-\s]?location\b/.test(lower))
    return "Enterprise / networked business"
  if (/\bsaas|software|platform|app\b/.test(lower)) return "SaaS / technology"
  return "Needs classification"
}

function detectBusinessType(industry: string, corpus: string): string {
  const lower = corpus.toLowerCase()
  if (/vendor|partner|we\s+offer|white[-\s]?label/.test(lower))
    return "Vendor / partner"
  if (/job|career|cv|resume|internship/.test(lower)) return "Talent / career"
  if (/enterprise|dealer|distribution|franchise|multi[-\s]?location/.test(lower))
    return "Networked business"
  if (/shopify|e-?commerce|d2c|dtc|store/.test(lower)) return "Commerce brand"
  if (/service|clinic|agency|consult|restaurant|local/.test(lower))
    return "Service business"
  if (industry === "Needs classification") return "Early-stage lead"
  return "Growth-oriented brand"
}

function detectStage(state: ConversationStatePayload, corpus: string): string {
  if (state.businessStage.trim()) return state.businessStage.trim()
  const lower = corpus.toLowerCase()
  if (/pre[-\s]?launch|starting|launching|mvp|no\s+site|not\s+live/.test(lower))
    return "Pre-launch / early build"
  if (/live|orders|revenue|already\s+sell|operating|customers/.test(lower))
    return "Operating with traction"
  if (/scale|scaling|growth\s+stage|expand|multi[-\s]?city/.test(lower))
    return "Scaling / growth phase"
  if (state.potentialClientStage >= 3) return "Qualified discovery"
  return "Initial discovery"
}

function detectBottleneck(state: ConversationStatePayload, corpus: string): string {
  if (state.currentChallenge.trim()) return state.currentChallenge.trim()
  const lower = corpus.toLowerCase()
  if (/lead|inquir|pipeline|booking|callback/.test(lower))
    return "Lead capture and qualification"
  if (/conversion|checkout|cart|landing|funnel|traffic/.test(lower))
    return "Conversion and funnel performance"
  if (/brand|position|identity|premium|differentiat/.test(lower))
    return "Brand clarity and trust"
  if (/manual|workflow|ops|crm|follow[-\s]?up|automation/.test(lower))
    return "Manual workflow leakage"
  if (/seo|organic|rank|search/.test(lower)) return "Organic demand capture"
  if (/ads|paid|meta|google|performance|roas|cac|cpa/.test(lower))
    return "Paid acquisition efficiency"
  return "Signal quality and growth system clarity"
}

function detectUrgency(
  leadScore: string,
  state: ConversationStatePayload,
  corpus: string
): AiDiagnosis["urgencyLevel"] {
  const lower = corpus.toLowerCase()
  if (
    leadScore === "High" ||
    /urgent|asap|proposal|start\s+now|this\s+month|budget|hire|call/.test(lower) ||
    state.email.trim() ||
    state.whatsapp.trim()
  ) {
    return "High"
  }
  if (leadScore === "Medium" || state.potentialClientStage >= 3) return "Medium"
  return "Low"
}

function industrySystems(industry: string, serviceFit: string): string[] {
  const lower = industry.toLowerCase()
  if (/real\s+estate/.test(lower)) {
    return ["Lead automation", "CRM routing", "WhatsApp follow-up"]
  }
  if (/d2c|ecommerce|fashion|apparel/.test(lower)) {
    return ["Performance engine", "Retention flows", "Funnel analytics"]
  }
  if (/luxury/.test(lower)) {
    return ["Brand intelligence", "Concierge funnel", "Premium content system"]
  }
  if (/local/.test(lower)) {
    return ["Local SEO", "WhatsApp intake", "Review/reputation loop"]
  }
  if (/enterprise|networked/.test(lower)) {
    return ["AI workflows", "Dealer / team dashboards", "Process automation"]
  }
  if (serviceFit === "AI Automation") {
    return ["AI workflow map", "CRM automation", "Lead qualification logic"]
  }
  if (serviceFit === "Website Systems") {
    return ["Conversion site map", "Landing page system", "Analytics layer"]
  }
  return ["Strategic diagnosis", "Growth system blueprint", "Execution roadmap"]
}

function directionFor(industry: string, serviceFit: string): string {
  const lower = industry.toLowerCase()
  if (/real\s+estate/.test(lower)) return "Lead automation + CRM architecture"
  if (/d2c|ecommerce|fashion|apparel/.test(lower))
    return "Performance growth + retention infrastructure"
  if (/luxury/.test(lower)) return "Brand intelligence + premium funnel systems"
  if (/local/.test(lower)) return "SEO + WhatsApp conversion systems"
  if (/enterprise|networked/.test(lower)) return "Automation + AI workflow layer"
  return `${serviceFit} with a growth systems blueprint`
}

function revenueLeaks(corpus: string, bottleneck: string): string[] {
  const lower = corpus.toLowerCase()
  const leaks = [
    /lead|inquir|pipeline|callback/.test(lower) &&
      "Unqualified enquiries may be reaching the team without routing logic.",
    /follow[-\s]?up|whatsapp|phone|call|crm/.test(lower) &&
      "Follow-up timing could be leaking warm prospects between channels.",
    /website|landing|checkout|funnel|conversion/.test(lower) &&
      "The website or funnel may not be converting attention into clear action.",
    /ads|paid|meta|google|performance|traffic/.test(lower) &&
      "Paid traffic may be scaling before offer, creative and landing proof are aligned.",
    /brand|position|luxury|premium|identity/.test(lower) &&
      "Brand trust signals may not be strong enough for premium decision-making.",
    /seo|organic|search|local/.test(lower) &&
      "Search demand may be uncaptured because content, technical structure or local intent is thin.",
    /manual|ops|workflow|automation/.test(lower) &&
      "Manual operations may be slowing response speed and repeatability.",
  ].filter(Boolean) as string[]

  if (leaks.length >= 3) return leaks.slice(0, 3)
  return [
    ...leaks,
    `${bottleneck} needs clearer system ownership before growth spend compounds.`,
    "The next commercial action may not be obvious enough for high-intent visitors.",
  ].slice(0, 3)
}

function nextActions(
  serviceFit: string,
  urgency: AiDiagnosis["urgencyLevel"],
  systems: string[]
): string[] {
  const first =
    urgency === "High"
      ? "Prioritise a senior diagnostic call and route the enquiry with full context."
      : "Use the AI intake to capture context before a senior review."
  return [
    first,
    `Map the first system around ${systems[0]?.toLowerCase() ?? serviceFit.toLowerCase()}.`,
    `Validate ${serviceFit.toLowerCase()} as the primary service path before execution.`,
  ]
}

export function deriveAiDiagnosis(
  state: ConversationStatePayload,
  messages: MessageLike[],
  leadIntel?: LeadIntelligenceResult | null
): AiDiagnosis {
  const corpus = corpusFrom(state, messages, leadIntel)
  const industry = detectIndustry(state, corpus)
  const serviceFit = deriveRecommendedService(state, messages, leadIntel)
  const businessStage = detectStage(state, corpus)
  const mainBottleneck = detectBottleneck(state, corpus)
  const leadScore = leadIntel?.leadScore ?? (messages.length >= 4 ? "Medium" : "Warming")
  const urgencyLevel = detectUrgency(leadScore, state, corpus)
  const suggestedSystems = industrySystems(industry, serviceFit)

  return {
    businessType: detectBusinessType(industry, corpus),
    industry,
    businessStage,
    mainBottleneck,
    serviceFit,
    urgencyLevel,
    recommendedGrowthDirection: directionFor(industry, serviceFit),
    suggestedSystems,
    potentialRevenueLeaks: revenueLeaks(corpus, mainBottleneck),
    recommendedNextActions: nextActions(serviceFit, urgencyLevel, suggestedSystems),
    leadScore,
  }
}
