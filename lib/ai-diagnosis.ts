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

export interface StrategicScore {
  label: string
  value: number
  detail: string
}

export interface ObservedSignals {
  founderMindset: string
  businessMaturity: string
  marketingGaps: string
  operationalGaps: string
  customerAcquisitionWeaknesses: string
}

export interface StrategicIntelligence {
  isReady: boolean
  confidenceLevel: number
  confidenceLabel: string
  scores: StrategicScore[]
  estimatedGrowthBlockers: string[]
  estimatedMissedRevenueAreas: string[]
  estimatedOperationalInefficiencies: string[]
  suggestedStrategicPriorities: string[]
  observedSignals: ObservedSignals
  likelyPxlBriefActions: string[]
}

export interface StrategicBrief {
  isReady: boolean
  businessUnderstanding: string
  currentBottlenecks: string[]
  likelyGrowthBlockers: string[]
  brandPositioningObservations: string[]
  customerAcquisitionGaps: string[]
  funnelSystemWeaknesses: string[]
  recommendedStrategicDirection: string
  automationOpportunities: string[]
  recommendedServiceStack: string[]
  suggestedExecutionRoadmap: string[]
  recommendedPriority: "Immediate" | "High leverage" | "Foundational" | "Scale stage"
  estimatedImpactAreas: string[]
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

function meaningfulUserMessages(messages: MessageLike[]): MessageLike[] {
  return messages.filter(
    (message) =>
      message.role === "user" && message.content.trim().replace(/\s+/g, " ").length >= 12
  )
}

function countSignals(corpus: string, patterns: RegExp[]): number {
  return patterns.reduce((score, pattern) => {
    const matches = corpus.match(new RegExp(pattern.source, "gi"))
    return score + (matches?.length ?? 0)
  }, 0)
}

function clampScore(value: number): number {
  return Math.max(8, Math.min(96, Math.round(value)))
}

function scoreDetails(score: number, high: string, medium: string, low: string): string {
  if (score >= 72) return high
  if (score >= 45) return medium
  return low
}

function deriveScores(
  state: ConversationStatePayload,
  corpus: string,
  diagnosis: AiDiagnosis
): StrategicScore[] {
  const lower = corpus.toLowerCase()
  const contextDepth = Math.min(18, meaningfulContextDepth(state, corpus))
  const hasContact = state.email.trim() || state.whatsapp.trim() ? 10 : 0
  const highIntent = countSignals(lower, [
    /budget/i,
    /proposal/i,
    /urgent/i,
    /start/i,
    /hire/i,
    /call/i,
    /growth/i,
    /scale/i,
  ])
  const automationSignals = countSignals(lower, [
    /manual/i,
    /workflow/i,
    /automation/i,
    /crm/i,
    /follow[-\s]?up/i,
    /whatsapp/i,
    /ops/i,
    /process/i,
  ])
  const brandSignals = countSignals(lower, [
    /brand/i,
    /position/i,
    /identity/i,
    /premium/i,
    /luxury/i,
    /differentiat/i,
    /trust/i,
  ])
  const acquisitionSignals = countSignals(lower, [
    /lead/i,
    /traffic/i,
    /ads/i,
    /seo/i,
    /conversion/i,
    /funnel/i,
    /retention/i,
    /shopify/i,
  ])

  const opportunity = clampScore(
    34 +
      contextDepth +
      hasContact +
      highIntent * 8 +
      acquisitionSignals * 4 +
      (diagnosis.urgencyLevel === "High" ? 14 : diagnosis.urgencyLevel === "Medium" ? 8 : 0)
  )
  const readiness = clampScore(
    30 +
      contextDepth +
      (state.businessStage.trim() ? 12 : 0) +
      (state.businessVertical.trim() ? 10 : 0) +
      (state.servicesInterested.trim() ? 10 : 0) +
      (diagnosis.leadScore === "High" ? 10 : diagnosis.leadScore === "Medium" ? 6 : 0)
  )
  const automation = clampScore(
    28 +
      automationSignals * 10 +
      (/enterprise|networked|real estate|local/i.test(diagnosis.industry) ? 10 : 0) +
      (/lead|workflow|manual|crm/i.test(diagnosis.mainBottleneck) ? 14 : 0)
  )
  const positioning = clampScore(
    30 +
      brandSignals * 9 +
      (/luxury|fashion|premium/i.test(diagnosis.industry) ? 14 : 0) +
      (/brand|trust|position/i.test(diagnosis.mainBottleneck) ? 14 : 0)
  )

  return [
    {
      label: "Opportunity Score",
      value: opportunity,
      detail: scoreDetails(
        opportunity,
        "Strong commercial signal with clear paths to leverage.",
        "Qualified opportunity forming; needs sharper system definition.",
        "Early signal; more business context will improve precision."
      ),
    },
    {
      label: "Growth Readiness Score",
      value: readiness,
      detail: scoreDetails(
        readiness,
        "Business context is mature enough for a strategic roadmap.",
        "Some readiness signals are present; sequencing matters next.",
        "Discovery should clarify stage, offer and current channels."
      ),
    },
    {
      label: "Automation Potential Score",
      value: automation,
      detail: scoreDetails(
        automation,
        "High potential to remove manual leakage with AI workflows.",
        "Automation can improve response speed and handoff quality.",
        "Automation potential will depend on process clarity."
      ),
    },
    {
      label: "Brand Positioning Score",
      value: positioning,
      detail: scoreDetails(
        positioning,
        "Positioning and trust signals appear central to growth.",
        "Brand clarity can improve conversion and perceived value.",
        "Brand need is not dominant yet; monitor as context develops."
      ),
    },
  ]
}

function meaningfulContextDepth(
  state: ConversationStatePayload,
  corpus: string
): number {
  const structured = [
    state.businessVertical,
    state.businessStage,
    state.servicesInterested,
    state.currentChallenge,
    state.acquisitionChannels,
    state.company,
  ].filter((value) => value.trim()).length
  return structured * 2 + Math.min(8, Math.floor(corpus.length / 180))
}

function blockersFrom(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const blockers = [
    /lead|inquir|pipeline/.test(lower) && "Lead quality is not yet structured into a reliable qualification path.",
    /conversion|funnel|website|landing/.test(lower) && "Conversion architecture may be too weak to turn interest into action.",
    /brand|position|luxury|premium/.test(lower) && "The market may not have a sharp enough reason to trust or choose the brand.",
    /ads|paid|performance|traffic/.test(lower) && "Acquisition spend may be operating ahead of funnel and message clarity.",
    /manual|workflow|crm|follow/.test(lower) && "Manual handoffs may be limiting response speed and consistency.",
  ].filter(Boolean) as string[]
  return [
    ...blockers,
    `${diagnosis.mainBottleneck} is likely constraining the next growth move.`,
  ].slice(0, 3)
}

function missedRevenueFrom(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const areas = [
    /retention|repeat|ltv|customer/.test(lower) && "Repeat purchase and retention journeys may be underdeveloped.",
    /seo|organic|search|local/.test(lower) && "Search intent may be escaping to better-structured competitors.",
    /whatsapp|phone|call|crm/.test(lower) && "Interested prospects may drop between enquiry, follow-up and decision.",
    /checkout|cart|landing|website/.test(lower) && "High-intent visitors may not be seeing enough proof or urgency to convert.",
    /content|instagram|social/.test(lower) && "Content attention may not be connected to a measurable sales path.",
  ].filter(Boolean) as string[]
  return [
    ...areas,
    `${diagnosis.recommendedGrowthDirection} could unlock better commercial capture.`,
  ].slice(0, 3)
}

function inefficienciesFrom(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const inefficiencies = [
    /manual|process|ops|team/.test(lower) && "Repeated internal tasks may still depend on people instead of workflows.",
    /lead|crm|whatsapp|follow/.test(lower) && "Lead data may not be centralised enough for timely decision-making.",
    /content|creative|campaign/.test(lower) && "Creative production may not be supported by a repeatable intelligence system.",
    /report|dashboard|analytics|data/.test(lower) && "Performance signals may be reviewed too late to guide action.",
  ].filter(Boolean) as string[]
  return [
    ...inefficiencies,
    `${diagnosis.suggestedSystems[0] ?? "A system blueprint"} should reduce operational drag first.`,
  ].slice(0, 3)
}

function prioritiesFrom(diagnosis: AiDiagnosis): string[] {
  return [
    `Validate ${diagnosis.serviceFit} as the primary service lane.`,
    `Design ${diagnosis.suggestedSystems[0]?.toLowerCase() ?? "the first operating system"} before scaling activity.`,
    `Use ${diagnosis.recommendedGrowthDirection.toLowerCase()} as the immediate strategic direction.`,
  ]
}

function observedSignals(
  state: ConversationStatePayload,
  diagnosis: AiDiagnosis,
  corpus: string
): ObservedSignals {
  const lower = corpus.toLowerCase()
  return {
    founderMindset:
      /scale|growth|system|strategy|automation|performance/.test(lower)
        ? "Leverage-seeking; oriented toward systems and sharper growth decisions."
        : "Exploratory; still clarifying the most valuable growth constraint.",
    businessMaturity:
      state.businessStage.trim() || diagnosis.businessStage,
    marketingGaps:
      /ads|seo|content|instagram|traffic|lead|conversion/.test(lower)
        ? diagnosis.mainBottleneck
        : "Marketing gap not fully explicit yet; acquisition path needs more signal.",
    operationalGaps:
      /manual|workflow|crm|follow|ops|automation/.test(lower)
        ? "Operational handoffs and response systems appear important."
        : "Operational gaps are not explicit yet; watch for manual handoffs.",
    customerAcquisitionWeaknesses:
      /lead|traffic|seo|ads|funnel|conversion|pipeline/.test(lower)
        ? "Acquisition likely needs cleaner qualification, proof and conversion structure."
        : "Acquisition weakness is still emerging from the conversation.",
  }
}

function likelyActions(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const actions = [
    /lead|crm|whatsapp|follow|real\s+estate/.test(lower) && "Build AI sales workflows",
    /retention|repeat|ltv|d2c|shopify/.test(lower) && "Improve retention systems",
    /brand|position|luxury|premium|identity/.test(lower) && "Reposition brand",
    /website|landing|funnel|conversion|checkout/.test(lower) && "Improve funnel conversion",
    /seo|organic|search|local/.test(lower) && "Create SEO authority",
    /manual|workflow|automation|ops|enterprise/.test(lower) && "Implement CRM automation",
  ].filter(Boolean) as string[]

  return [
    ...new Set([
      ...actions,
      diagnosis.serviceFit === "AI Automation" && "Implement CRM automation",
      diagnosis.serviceFit === "Performance Marketing" && "Improve funnel conversion",
      diagnosis.serviceFit === "Branding" && "Reposition brand",
      diagnosis.serviceFit === "SEO" && "Create SEO authority",
      diagnosis.serviceFit === "Website Systems" && "Improve funnel conversion",
      "Build AI sales workflows",
    ].filter(Boolean) as string[]),
  ].slice(0, 4)
}

function confidenceLabel(value: number): string {
  if (value >= 78) return "High confidence"
  if (value >= 55) return "Directional confidence"
  return "Forming signal"
}

function sentence(parts: string[]): string {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
}

function briefBusinessUnderstanding(
  diagnosis: AiDiagnosis,
  intelligence: StrategicIntelligence
): string {
  return sentence([
    `This appears to be a ${diagnosis.businessType.toLowerCase()} in ${diagnosis.industry}.`,
    `The current stage reads as ${diagnosis.businessStage.toLowerCase()}, with ${diagnosis.mainBottleneck.toLowerCase()} as the clearest strategic constraint.`,
    intelligence.observedSignals.founderMindset,
  ])
}

function positioningObservations(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const observations = [
    /luxury|premium|high[-\s]?end/.test(lower) &&
      "Premium perception needs to be protected across copy, proof and funnel design.",
    /brand|position|identity|differentiat/.test(lower) &&
      "Positioning appears important to improving trust and conversion quality.",
    /fashion|real\s+estate|d2c|ecommerce/.test(lower) &&
      "Visual and narrative consistency likely influences how quickly buyers understand value.",
  ].filter(Boolean) as string[]

  return [
    ...observations,
    `Brand expression should support ${diagnosis.recommendedGrowthDirection.toLowerCase()}.`,
  ].slice(0, 3)
}

function acquisitionGaps(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const gaps = [
    /seo|organic|search|local/.test(lower) &&
      "Search intent may not be captured with enough authority or technical structure.",
    /ads|paid|meta|google|performance/.test(lower) &&
      "Paid acquisition may need tighter offer, creative and landing-page alignment.",
    /lead|inquir|pipeline|callback/.test(lower) &&
      "Lead capture likely needs clearer qualification and routing.",
    /instagram|social|content/.test(lower) &&
      "Social attention may not be connected to a measurable conversion path.",
  ].filter(Boolean) as string[]

  return [
    ...gaps,
    `Acquisition should be sequenced around ${diagnosis.serviceFit.toLowerCase()} rather than scattered tactics.`,
  ].slice(0, 3)
}

function funnelWeaknesses(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const weaknesses = [
    /website|landing|funnel|checkout|conversion/.test(lower) &&
      "The digital journey may not move visitors from interest to action with enough clarity.",
    /whatsapp|phone|crm|follow/.test(lower) &&
      "Follow-up and CRM handoffs may be too manual or inconsistent.",
    /proof|trust|case|testimonial|premium/.test(lower) &&
      "Proof architecture may need to work harder for higher-value decisions.",
  ].filter(Boolean) as string[]

  return [
    ...weaknesses,
    `${diagnosis.suggestedSystems[0] ?? "The first system"} should become the first measurable funnel asset.`,
  ].slice(0, 3)
}

function priorityFor(
  diagnosis: AiDiagnosis,
  intelligence: StrategicIntelligence
): StrategicBrief["recommendedPriority"] {
  if (diagnosis.urgencyLevel === "High") return "Immediate"
  if (intelligence.confidenceLevel >= 72) return "High leverage"
  if (/scaling|growth|operating/i.test(diagnosis.businessStage)) return "Scale stage"
  return "Foundational"
}

function impactAreas(diagnosis: AiDiagnosis, corpus: string): string[] {
  const lower = corpus.toLowerCase()
  const areas = [
    /lead|pipeline|inquir|real\s+estate/.test(lower) && "lead generation",
    /retention|repeat|ltv|d2c|shopify/.test(lower) && "retention",
    /automation|manual|workflow|crm|ops/.test(lower) && "automation",
    /conversion|funnel|website|landing|checkout/.test(lower) && "conversion",
    /brand|position|luxury|premium|identity/.test(lower) && "positioning",
    /manual|process|workflow|team|ops/.test(lower) && "operational efficiency",
  ].filter(Boolean) as string[]

  return [
    ...new Set([
      ...areas,
      diagnosis.serviceFit === "SEO" && "lead generation",
      diagnosis.serviceFit === "Branding" && "positioning",
      diagnosis.serviceFit === "AI Automation" && "automation",
      "conversion",
    ].filter(Boolean) as string[]),
  ].slice(0, 5)
}

export function deriveStrategicBrief(
  state: ConversationStatePayload,
  messages: MessageLike[],
  diagnosis: AiDiagnosis,
  intelligence: StrategicIntelligence,
  leadIntel?: LeadIntelligenceResult | null
): StrategicBrief {
  const corpus = corpusFrom(state, messages, leadIntel)
  const isReady = intelligence.isReady
  const serviceStack = [
    diagnosis.serviceFit,
    ...diagnosis.suggestedSystems,
    ...intelligence.likelyPxlBriefActions,
  ]
  const uniqueServiceStack = [...new Set(serviceStack)].slice(0, 5)

  return {
    isReady,
    businessUnderstanding: briefBusinessUnderstanding(diagnosis, intelligence),
    currentBottlenecks: [
      diagnosis.mainBottleneck,
      ...intelligence.estimatedOperationalInefficiencies,
    ].slice(0, 3),
    likelyGrowthBlockers: intelligence.estimatedGrowthBlockers,
    brandPositioningObservations: positioningObservations(diagnosis, corpus),
    customerAcquisitionGaps: acquisitionGaps(diagnosis, corpus),
    funnelSystemWeaknesses: funnelWeaknesses(diagnosis, corpus),
    recommendedStrategicDirection: diagnosis.recommendedGrowthDirection,
    automationOpportunities: [
      ...diagnosis.suggestedSystems,
      ...intelligence.estimatedOperationalInefficiencies,
    ].slice(0, 4),
    recommendedServiceStack: uniqueServiceStack,
    suggestedExecutionRoadmap: [
      "Run a focused strategic diagnosis from the captured conversation.",
      `Blueprint ${diagnosis.suggestedSystems[0]?.toLowerCase() ?? "the primary system"} around the highest-friction growth path.`,
      `Deploy ${diagnosis.serviceFit.toLowerCase()} as the first measurable execution lane.`,
      "Review performance signals and sequence the next system layer.",
    ],
    recommendedPriority: priorityFor(diagnosis, intelligence),
    estimatedImpactAreas: impactAreas(diagnosis, corpus),
  }
}

export function deriveStrategicIntelligence(
  state: ConversationStatePayload,
  messages: MessageLike[],
  diagnosis: AiDiagnosis,
  leadIntel?: LeadIntelligenceResult | null
): StrategicIntelligence {
  const corpus = corpusFrom(state, messages, leadIntel)
  const meaningful = meaningfulUserMessages(messages)
  const structuredDepth = meaningfulContextDepth(state, corpus)
  const isReady = meaningful.length >= 3 || (messages.length >= 5 && structuredDepth >= 5)
  const baseConfidence =
    32 +
    meaningful.length * 10 +
    structuredDepth * 2 +
    (leadIntel ? 12 : 0) +
    (state.businessVertical.trim() ? 8 : 0) +
    (state.currentChallenge.trim() ? 8 : 0)
  const confidenceLevel = isReady
    ? clampScore(baseConfidence)
    : clampScore(Math.min(baseConfidence, 48))

  return {
    isReady,
    confidenceLevel,
    confidenceLabel: confidenceLabel(confidenceLevel),
    scores: deriveScores(state, corpus, diagnosis),
    estimatedGrowthBlockers: blockersFrom(diagnosis, corpus),
    estimatedMissedRevenueAreas: missedRevenueFrom(diagnosis, corpus),
    estimatedOperationalInefficiencies: inefficienciesFrom(diagnosis, corpus),
    suggestedStrategicPriorities: prioritiesFrom(diagnosis),
    observedSignals: observedSignals(state, diagnosis, corpus),
    likelyPxlBriefActions: likelyActions(diagnosis, corpus),
  }
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
  const leadScore = leadIntel?.leadScore ?? (messages.length >= 4 ? "Medium" : "Forming")
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
