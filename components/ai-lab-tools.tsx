"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { BarChart3, Gauge, Landmark, Megaphone, Route, Sparkles } from "lucide-react"

type ScorecardState = {
  stage: "startup" | "sme" | "established"
  aiUsage: "none" | "basic" | "moderate" | "advanced"
  marketing: "scattered" | "structured" | "strong"
  website: "weak" | "average" | "strong"
  crm: "none" | "manual" | "crm"
  reporting: "manual" | "basic" | "executive"
}

type RecommenderState = {
  challenge:
    | "leads"
    | "scattered"
    | "ai"
    | "website"
    | "tracking"
    | "positioning"
    | "dashboards"
  businessType: "startup" | "sme" | "consumer" | "b2b" | "traditional"
  urgency: "exploring" | "clarity" | "ready"
}

type RoiState = {
  teamSize: string
  reportingHours: string
  contentHours: string
  followupHours: string
  monthlyCost: string
}

type CampaignState = {
  businessType: "startup" | "sme" | "consumer" | "b2b" | "traditional" | "local"
  product: string
  audience:
    | "consumers"
    | "founders"
    | "homeowners"
    | "dealers"
    | "students"
    | "professionals"
    | "local"
  objective:
    | "awareness"
    | "leads"
    | "storeVisits"
    | "sales"
    | "appointments"
    | "retargeting"
  channel: "meta" | "google" | "linkedin" | "whatsapp" | "localRadius" | "multi"
  market: string
}

type PositioningState = {
  brandName: string
  industry:
    | "fashion"
    | "beauty"
    | "home"
    | "education"
    | "healthcare"
    | "b2b"
    | "manufacturing"
    | "realEstate"
    | "technology"
    | "other"
  targetCustomer:
    | "premium"
    | "mass"
    | "founders"
    | "smes"
    | "enterprises"
    | "dealers"
    | "local"
    | "young"
  product: string
  pricePositioning: "budget" | "value" | "premium" | "luxury" | "expert"
  differentiator: string
  tone: "premium" | "friendly" | "bold" | "technical" | "trustworthy" | "youthful" | "luxury"
}

type ActiveTool = "scorecard" | "recommender" | "roi" | "campaign" | "positioning"

type AiReadoutSection = {
  label: string
  value?: string
  items?: string[]
}

type AiReadout = {
  sections: AiReadoutSection[]
}

type AiReadoutState = {
  loading: boolean
  error: string | null
  readout: AiReadout | null
}

const createAiReadoutState = (): Record<ActiveTool, AiReadoutState> => ({
  scorecard: { loading: false, error: null, readout: null },
  recommender: { loading: false, error: null, readout: null },
  roi: { loading: false, error: null, readout: null },
  campaign: { loading: false, error: null, readout: null },
  positioning: { loading: false, error: null, readout: null },
})

const toolTabs: readonly {
  id: ActiveTool
  label: string
  eyebrow: string
}[] = [
  { id: "scorecard", label: "Scorecard", eyebrow: "Tool 01" },
  { id: "recommender", label: "Recommender", eyebrow: "Tool 02" },
  { id: "roi", label: "ROI", eyebrow: "Tool 03" },
  { id: "campaign", label: "Campaign", eyebrow: "Tool 04" },
  { id: "positioning", label: "Positioning", eyebrow: "Tool 05" },
]

const scoreOptions = {
  stage: [
    ["startup", "Startup"],
    ["sme", "SME"],
    ["established", "Established brand"],
  ],
  aiUsage: [
    ["none", "None"],
    ["basic", "Basic"],
    ["moderate", "Moderate"],
    ["advanced", "Advanced"],
  ],
  marketing: [
    ["scattered", "Scattered"],
    ["structured", "Somewhat structured"],
    ["strong", "Strong"],
  ],
  website: [
    ["weak", "Weak"],
    ["average", "Average"],
    ["strong", "Strong"],
  ],
  crm: [
    ["none", "None"],
    ["manual", "Manual"],
    ["crm", "CRM in place"],
  ],
  reporting: [
    ["manual", "Manual"],
    ["basic", "Basic dashboard"],
    ["executive", "Executive dashboard"],
  ],
} as const

const challengeOptions = [
  ["leads", "I need more leads"],
  ["scattered", "My marketing is scattered"],
  ["ai", "I want to use AI"],
  ["website", "My website is not converting"],
  ["tracking", "Leads are not tracked properly"],
  ["positioning", "My brand positioning is weak"],
  ["dashboards", "I need better dashboards"],
] as const

const businessTypeOptions = [
  ["startup", "Startup"],
  ["sme", "SME"],
  ["consumer", "Consumer brand"],
  ["b2b", "B2B company"],
  ["traditional", "Traditional business"],
] as const

const campaignBusinessTypeOptions = [
  ["startup", "Startup"],
  ["sme", "SME"],
  ["consumer", "Consumer brand"],
  ["b2b", "B2B company"],
  ["traditional", "Traditional business"],
  ["local", "Local business"],
] as const

const audienceOptions = [
  ["consumers", "Consumers"],
  ["founders", "Founders"],
  ["homeowners", "Homeowners"],
  ["dealers", "Dealers/distributors"],
  ["students", "Students/parents"],
  ["professionals", "Working professionals"],
  ["local", "Local customers"],
] as const

const campaignObjectiveOptions = [
  ["awareness", "Awareness"],
  ["leads", "Leads"],
  ["storeVisits", "Store visits"],
  ["sales", "Sales"],
  ["appointments", "Appointments"],
  ["retargeting", "Retargeting"],
] as const

const channelOptions = [
  ["meta", "Instagram / Meta"],
  ["google", "Google Search"],
  ["linkedin", "LinkedIn"],
  ["whatsapp", "WhatsApp"],
  ["localRadius", "Local radius campaign"],
  ["multi", "Multi-channel"],
] as const

const industryOptions = [
  ["fashion", "Fashion & Lifestyle"],
  ["beauty", "Beauty / Wellness"],
  ["home", "Home Improvement"],
  ["education", "Education"],
  ["healthcare", "Healthcare"],
  ["b2b", "B2B Services"],
  ["manufacturing", "Manufacturing"],
  ["realEstate", "Real Estate / Interiors"],
  ["technology", "Technology / SaaS"],
  ["other", "Other"],
] as const

const targetCustomerOptions = [
  ["premium", "Premium consumers"],
  ["mass", "Mass consumers"],
  ["founders", "Founders"],
  ["smes", "SMEs"],
  ["enterprises", "Enterprises"],
  ["dealers", "Dealers/distributors"],
  ["local", "Local customers"],
  ["young", "Young professionals"],
] as const

const priceOptions = [
  ["budget", "Budget"],
  ["value", "Value"],
  ["premium", "Premium"],
  ["luxury", "Luxury"],
  ["expert", "Expert / Specialist"],
] as const

const toneOptions = [
  ["premium", "Premium"],
  ["friendly", "Friendly"],
  ["bold", "Bold"],
  ["technical", "Technical"],
  ["trustworthy", "Trustworthy"],
  ["youthful", "Youthful"],
  ["luxury", "Luxury"],
] as const

const businessTypeLabels: Record<RecommenderState["businessType"], string> = {
  startup: "Startup",
  sme: "SME",
  consumer: "Consumer brand",
  b2b: "B2B company",
  traditional: "Traditional business",
}

const urgencyOptions = [
  ["exploring", "Exploring"],
  ["clarity", "Need clarity this month"],
  ["ready", "Ready to act now"],
] as const

const scoreWeights = {
  stage: { startup: 8, sme: 12, established: 15 },
  aiUsage: { none: 0, basic: 8, moderate: 14, advanced: 18 },
  marketing: { scattered: 4, structured: 12, strong: 18 },
  website: { weak: 4, average: 10, strong: 16 },
  crm: { none: 0, manual: 8, crm: 16 },
  reporting: { manual: 2, basic: 10, executive: 17 },
} as const

const scoreAreas = {
  stage: { label: "Business maturity", max: 15 },
  aiUsage: { label: "AI readiness", max: 18 },
  marketing: { label: "Marketing maturity", max: 18 },
  website: { label: "Website conversion", max: 16 },
  crm: { label: "CRM maturity", max: 16 },
  reporting: { label: "Reporting intelligence", max: 17 },
} as const

const serviceMap: Record<
  RecommenderState["challenge"],
  { service: string; reason: string; step: string }
> = {
  leads: {
    service: "Digital Marketing & Performance Growth",
    reason:
      "Your immediate constraint is demand generation, campaign structure, and measurable acquisition.",
    step: "Start with the diagnostic so the lead engine connects to website, CRM, and reporting.",
  },
  scattered: {
    service: "AI Growth Audit",
    reason:
      "Scattered activity needs diagnosis before more execution. The audit identifies the system gap first.",
    step: "Map the growth bottleneck, then decide which system should be built first.",
  },
  ai: {
    service: "AI Implementation & Automation",
    reason:
      "Your challenge points to workflow design, use-case prioritization, and practical AI adoption.",
    step: "Identify repeatable work that can become an AI-assisted operating layer.",
  },
  website: {
    service: "Website, SEO, AEO & GEO",
    reason:
      "Conversion and visibility issues usually need clearer messaging, search readiness, and lead capture.",
    step: "Review the website journey and search surface before investing more into traffic.",
  },
  tracking: {
    service: "CRM, Dashboards & Sales Enablement",
    reason:
      "Lead leakage is usually a tracking, handoff, follow-up, and dashboard visibility problem.",
    step: "Start with CRM maturity and reporting clarity so every lead has an owner and next action.",
  },
  positioning: {
    service: "Brand Strategy & Positioning",
    reason:
      "Weak positioning limits premium perception, campaign quality, website clarity, and sales confidence.",
    step: "Clarify category, audience, differentiation, and message before scaling execution.",
  },
  dashboards: {
    service: "CRM, Dashboards & Sales Enablement",
    reason:
      "Dashboard needs point to decision visibility, performance intelligence, and operating cadence.",
    step: "Define founder-ready metrics and connect them to CRM, campaigns, website, and sales activity.",
  },
}

const urgencyPriority: Record<
  RecommenderState["urgency"],
  { level: "Low" | "Medium" | "High"; context: string }
> = {
  exploring: {
    level: "Low",
    context: "Use the audit to clarify the priority before committing budget.",
  },
  clarity: {
    level: "Medium",
    context: "This should be clarified this month before execution expands.",
  },
  ready: {
    level: "High",
    context: "This is ready for a focused diagnostic and implementation conversation.",
  },
}

const campaignLabels = {
  businessType: {
    startup: "Startup",
    sme: "SME",
    consumer: "Consumer brand",
    b2b: "B2B company",
    traditional: "Traditional business",
    local: "Local business",
  },
  audience: {
    consumers: "consumers",
    founders: "founders",
    homeowners: "homeowners",
    dealers: "dealers and distributors",
    students: "students and parents",
    professionals: "working professionals",
    local: "local customers",
  },
  objective: {
    awareness: "Awareness",
    leads: "Leads",
    storeVisits: "Store visits",
    sales: "Sales",
    appointments: "Appointments",
    retargeting: "Retargeting",
  },
  channel: {
    meta: "Instagram / Meta",
    google: "Google Search",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    localRadius: "Local radius campaign",
    multi: "Multi-channel",
  },
} as const

const positioningLabels = {
  industry: {
    fashion: "fashion and lifestyle",
    beauty: "beauty and wellness",
    home: "home improvement",
    education: "education",
    healthcare: "healthcare",
    b2b: "B2B services",
    manufacturing: "manufacturing",
    realEstate: "real estate and interiors",
    technology: "technology / SaaS",
    other: "specialist",
  },
  targetCustomer: {
    premium: "premium consumers",
    mass: "mass consumers",
    founders: "founders",
    smes: "SMEs",
    enterprises: "enterprises",
    dealers: "dealers and distributors",
    local: "local customers",
    young: "young professionals",
  },
  pricePositioning: {
    budget: "accessible",
    value: "value-led",
    premium: "premium",
    luxury: "luxury",
    expert: "expert-led specialist",
  },
  tone: {
    premium: "premium",
    friendly: "friendly",
    bold: "bold",
    technical: "technical",
    trustworthy: "trustworthy",
    youthful: "youthful",
    luxury: "luxury",
  },
} as const

const initialScorecard: ScorecardState = {
  stage: "sme",
  aiUsage: "basic",
  marketing: "structured",
  website: "average",
  crm: "manual",
  reporting: "basic",
}

const initialRecommender: RecommenderState = {
  challenge: "scattered",
  businessType: "sme",
  urgency: "clarity",
}

const initialRoi: RoiState = {
  teamSize: "6",
  reportingHours: "8",
  contentHours: "10",
  followupHours: "6",
  monthlyCost: "80000",
}

const initialCampaign: CampaignState = {
  businessType: "b2b",
  product: "AI consulting",
  audience: "founders",
  objective: "leads",
  channel: "linkedin",
  market: "India",
}

const initialPositioning: PositioningState = {
  brandName: "PxlBrief",
  industry: "b2b",
  targetCustomer: "founders",
  product: "AI growth consulting",
  pricePositioning: "premium",
  differentiator: "AI-led process and founder-ready execution",
  tone: "premium",
}

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: readonly (readonly [T, string])[]
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/75 sm:mb-2 sm:tracking-[0.14em]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-11 sm:rounded-[0.75rem] sm:text-sm"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  prefix?: string
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/75 sm:mb-2 sm:tracking-[0.14em]">
        {label}
      </span>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/70">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-11 sm:rounded-[0.75rem] sm:text-sm ${
            prefix ? "pl-8" : ""
          }`}
        />
      </div>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/75 sm:mb-2 sm:tracking-[0.14em]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors placeholder:text-muted-foreground/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-11 sm:rounded-[0.75rem] sm:text-sm"
      />
    </label>
  )
}

function ToolShell({
  eyebrow,
  title,
  purpose,
  icon,
  children,
}: {
  eyebrow: string
  title: string
  purpose: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-[1rem] border border-hairline bg-card/88 p-3.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.36] sm:rounded-[1.25rem] sm:p-6 md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 hidden h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl sm:block" />
      <div className="relative z-10">
        <div className="mb-4 flex items-start gap-3 border-b border-hairline/70 pb-3.5 sm:mb-5 sm:pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-primary/22 bg-primary/[0.08] text-primary sm:h-10 sm:w-10 sm:rounded-[0.75rem]">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
              {eyebrow}
            </p>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h3>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground/88 sm:mt-2 sm:text-sm">
              {purpose}
            </p>
          </div>
        </div>
        {children}
      </div>
    </article>
  )
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: string
  tone?: "default" | "primary"
}) {
  return (
    <div
      className={`min-w-0 rounded-[0.8rem] border px-3 py-2.5 sm:rounded-[0.85rem] sm:px-3.5 sm:py-3 ${
        tone === "primary"
          ? "border-primary/22 bg-primary/[0.065]"
          : "border-hairline/75 bg-background/32"
      }`}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
        {value}
      </p>
    </div>
  )
}

function OutputList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-[0.8rem] border border-hairline/75 bg-background/32 px-3 py-2.5 sm:rounded-[0.85rem] sm:px-3.5 sm:py-3">
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      <ul className="mt-2 grid gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[0.8125rem] leading-relaxed text-foreground/90"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/75" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PreviewDisclaimer() {
  return (
    <p className="mt-4 rounded-[0.8rem] border border-hairline/75 bg-background/30 px-3 py-2.5 text-[0.75rem] leading-relaxed text-muted-foreground/82">
      This is a directional preview. A full strategy requires deeper business and
      market review.
    </p>
  )
}

function AiStrategyPanel({
  state,
  onGenerate,
}: {
  state: AiReadoutState
  onGenerate: () => void
}) {
  return (
    <div className="mt-4 rounded-[0.9rem] border border-primary/18 bg-background/35 p-3 shadow-[inset_0_1px_0_0_var(--shine-inset)] sm:p-3.5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
            Optional AI layer
          </p>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground/82">
            Generate a concise strategic readout from the current inputs.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={state.loading}
          className="inline-flex min-h-10 w-full touch-manipulation items-center justify-center gap-2 rounded-[0.7rem] border border-primary/30 bg-primary/[0.1] px-4 py-2 text-[0.8125rem] font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.16] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {state.loading ? "Generating..." : "Generate AI Strategy"}
        </button>
      </div>

      {state.loading ? (
        <p className="mt-3 rounded-[0.75rem] border border-hairline/70 bg-card/45 px-3 py-2.5 text-[0.75rem] font-medium text-muted-foreground/85">
          Generating strategic readout...
        </p>
      ) : null}

      {state.error ? (
        <p className="mt-3 rounded-[0.75rem] border border-destructive/20 bg-destructive/[0.06] px-3 py-2.5 text-[0.75rem] leading-relaxed text-muted-foreground/88">
          Unable to generate AI readout right now. You can still use the
          directional result.
        </p>
      ) : null}

      {state.readout ? (
        <div className="mt-3 rounded-[0.85rem] border border-primary/20 bg-primary/[0.055] p-3">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            AI Strategic Readout
          </p>
          <div className="mt-3 grid gap-2.5">
            {state.readout.sections.map((section) => (
              <div
                key={section.label}
                className="rounded-[0.75rem] border border-hairline/70 bg-background/35 px-3 py-2.5"
              >
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/70">
                  {section.label}
                </p>
                {section.value ? (
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/90">
                    {section.value}
                  </p>
                ) : null}
                {section.items && section.items.length > 0 ? (
                  <ul className="mt-2 grid gap-1.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[0.8125rem] leading-relaxed text-foreground/90"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/75" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground/75">
            Directional strategic readout only. A full diagnosis requires deeper
            business and market review.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function AILabTools() {
  const [scorecard, setScorecard] = useState<ScorecardState>(initialScorecard)
  const [recommender, setRecommender] =
    useState<RecommenderState>(initialRecommender)
  const [roi, setRoi] = useState<RoiState>(initialRoi)
  const [campaign, setCampaign] = useState<CampaignState>(initialCampaign)
  const [positioning, setPositioning] =
    useState<PositioningState>(initialPositioning)
  const [activeTool, setActiveTool] = useState<ActiveTool>("scorecard")
  const [aiReadouts, setAiReadouts] =
    useState<Record<ActiveTool, AiReadoutState>>(createAiReadoutState)

  const generateAiReadout = async (
    tool: ActiveTool,
    inputs: Record<string, unknown>,
    directionalOutput: Record<string, unknown>
  ) => {
    setAiReadouts((state) => ({
      ...state,
      [tool]: { loading: true, error: null, readout: state[tool].readout },
    }))

    try {
      const response = await fetch("/api/ai-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, inputs, directionalOutput }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data || !Array.isArray(data.sections)) {
        throw new Error("Invalid AI readout response")
      }

      setAiReadouts((state) => ({
        ...state,
        [tool]: {
          loading: false,
          error: null,
          readout: {
            sections: data.sections
              .filter((section: unknown): section is AiReadoutSection => {
                if (!section || typeof section !== "object") return false
                const candidate = section as AiReadoutSection
                return typeof candidate.label === "string"
              })
              .slice(0, 10),
          },
        },
      }))
    } catch {
      setAiReadouts((state) => ({
        ...state,
        [tool]: {
          loading: false,
          error:
            "Unable to generate AI readout right now. You can still use the directional result.",
          readout: state[tool].readout,
        },
      }))
    }
  }

  const scorecardOutput = useMemo(() => {
    const areas = [
      {
        key: "stage",
        label: scoreAreas.stage.label,
        score: scoreWeights.stage[scorecard.stage],
        max: scoreAreas.stage.max,
      },
      {
        key: "aiUsage",
        label: scoreAreas.aiUsage.label,
        score: scoreWeights.aiUsage[scorecard.aiUsage],
        max: scoreAreas.aiUsage.max,
      },
      {
        key: "marketing",
        label: scoreAreas.marketing.label,
        score: scoreWeights.marketing[scorecard.marketing],
        max: scoreAreas.marketing.max,
      },
      {
        key: "website",
        label: scoreAreas.website.label,
        score: scoreWeights.website[scorecard.website],
        max: scoreAreas.website.max,
      },
      {
        key: "crm",
        label: scoreAreas.crm.label,
        score: scoreWeights.crm[scorecard.crm],
        max: scoreAreas.crm.max,
      },
      {
        key: "reporting",
        label: scoreAreas.reporting.label,
        score: scoreWeights.reporting[scorecard.reporting],
        max: scoreAreas.reporting.max,
      },
    ] as const

    const score = areas.reduce((total, area) => total + area.score, 0)
    const strongest = areas.reduce((best, current) =>
      current.score / current.max > best.score / best.max ? current : best,
    )
    const weakest = areas.reduce((lowest, current) =>
      current.score / current.max < lowest.score / lowest.max ? current : lowest,
    )

    const candidates: {
      area: string
      service: string
      nextStep: string
      severity: number
    }[] = []

    if (scorecard.aiUsage === "none" || scorecard.aiUsage === "basic") {
      candidates.push({
        area: "AI readiness",
        service:
          scorecard.aiUsage === "none"
            ? "AI Growth Audit"
            : "AI Implementation & Automation",
        nextStep:
          "Map repeatable workflows and create a practical AI implementation roadmap.",
        severity: 1 - scoreWeights.aiUsage[scorecard.aiUsage] / scoreAreas.aiUsage.max,
      })
    }

    if (scorecard.marketing === "scattered") {
      candidates.push({
        area: "Marketing maturity",
        service: "Digital Marketing & Performance Growth",
        nextStep:
          "Diagnose the campaign, content, funnel, and reporting gaps before adding more activity.",
        severity:
          1 - scoreWeights.marketing[scorecard.marketing] / scoreAreas.marketing.max,
      })
    }

    if (scorecard.website === "weak") {
      candidates.push({
        area: "Website conversion",
        service: "Website, SEO, AEO & GEO",
        nextStep:
          "Fix conversion paths, search structure, AI-search readiness, and lead capture.",
        severity: 1 - scoreWeights.website[scorecard.website] / scoreAreas.website.max,
      })
    }

    if (scorecard.crm === "none" || scorecard.crm === "manual") {
      candidates.push({
        area: "CRM maturity",
        service: "CRM, Dashboards & Sales Enablement",
        nextStep:
          "Connect lead capture, ownership, follow-up discipline, and pipeline visibility.",
        severity: 1 - scoreWeights.crm[scorecard.crm] / scoreAreas.crm.max,
      })
    }

    if (scorecard.reporting === "manual") {
      candidates.push({
        area: "Reporting intelligence",
        service: "CRM, Dashboards & Sales Enablement",
        nextStep:
          "Create a founder-ready dashboard that turns activity into clear next actions.",
        severity:
          1 - scoreWeights.reporting[scorecard.reporting] / scoreAreas.reporting.max,
      })
    }

    const recommended =
      candidates.sort((a, b) => b.severity - a.severity)[0] ??
      ({
        area: strongest.label,
        service: "Monthly AI Growth Partner",
        nextStep:
          "Move into an optimization review cadence to improve the full growth system.",
        severity: 0,
      } as const)

    return {
      score,
      strongest: strongest.label,
      weakest: weakest.label,
      nextStep: recommended.nextStep,
      service: recommended.service,
      serviceReason:
        recommended.service === "Monthly AI Growth Partner"
          ? "Most core signals are already relatively strong, so the next gain is optimization."
          : `${recommended.area} is the clearest constraint in this directional readout.`,
    }
  }, [scorecard])

  const recommenderOutput = useMemo(() => {
    const base = serviceMap[recommender.challenge]
    const priority = urgencyPriority[recommender.urgency]

    return {
      ...base,
      priority: priority.level,
      businessContext: `${businessTypeLabels[recommender.businessType]} context`,
      step: `${base.step} ${priority.context}`,
      ctaHref: priority.level === "High" ? "/#consulting-chat" : "/ai-growth-audit",
      ctaLabel:
        priority.level === "High"
          ? "Start Diagnostic Chat"
          : "View AI Growth Audit",
    }
  }, [recommender])

  const roiOutput = useMemo(() => {
    const reportingHours = toNumber(roi.reportingHours)
    const contentHours = toNumber(roi.contentHours)
    const followupHours = toNumber(roi.followupHours)
    const weeklyHours = reportingHours + contentHours + followupHours
    const monthlyHours = weeklyHours * 4.33
    const hourlyCost = toNumber(roi.monthlyCost) / 176
    const monthlyCost = monthlyHours * hourlyCost
    const highestHours = Math.max(reportingHours, contentHours, followupHours)
    const priority =
      weeklyHours < 5
        ? "Start with AI Growth Audit"
        : reportingHours === highestHours
          ? "Reporting automation"
          : contentHours === highestHours
            ? "AI content and research workflow"
            : "Sales follow-up automation"

    return {
      teamSize: toNumber(roi.teamSize),
      weeklyHours,
      monthlyHours,
      monthlyCost,
      hourlyCost,
      recoverable: [0.25, 0.35, 0.45].map((rate) => ({
        rate,
        hours: monthlyHours * rate,
        value: monthlyHours * rate * hourlyCost,
      })),
      priority,
    }
  }, [roi])

  const campaignOutput = useMemo(() => {
    const product = campaign.product.trim() || "your offer"
    const market = campaign.market.trim() || "your priority market"
    const objectiveDetail = {
      awareness: {
        theme: "Visibility, recall, and category education",
        message: `Make ${product} easier to understand, remember, and associate with the right buying moment in ${market}.`,
        funnel: "Awareness content -> engagement audience -> proof-led retargeting -> diagnostic CTA",
        cta: "Learn more",
      },
      leads: {
        theme: "Offer-led lead generation with qualification",
        message: `Position ${product} around a clear business problem, then move prospects into a landing page, form, or WhatsApp qualification path.`,
        funnel: "Problem ad -> landing page or WhatsApp -> qualification questions -> follow-up sequence",
        cta: "Request consultation",
      },
      storeVisits: {
        theme: "Local proof and store visit activation",
        message: `Use local trust signals and radius targeting to turn nearby demand into map, call, and WhatsApp visits for ${product}.`,
        funnel: "Local proof ad -> map or WhatsApp CTA -> store visit prompt -> retargeting reminder",
        cta: "Get directions",
      },
      sales: {
        theme: "Conversion offer and proof-led retargeting",
        message: `Convert warm demand for ${product} with a sharper offer, stronger proof, and repeat reminders across the decision window.`,
        funnel: "Offer ad -> product proof -> conversion page or WhatsApp -> retargeting sequence",
        cta: "Buy now",
      },
      appointments: {
        theme: "Trust-led consultation booking",
        message: `Build confidence in ${product} through expertise, proof, and a low-friction appointment path.`,
        funnel: "Authority content -> consultation page -> booking flow -> reminder follow-up",
        cta: "Book appointment",
      },
      retargeting: {
        theme: "Objection handling and reminder ads",
        message: `Bring undecided prospects back to ${product} with testimonials, urgency, FAQs, and next-step reminders.`,
        funnel: "Visited audience -> objection ads -> testimonial proof -> urgency CTA -> follow-up",
        cta: "Continue enquiry",
      },
    }[campaign.objective]

    const channelDetail = {
      meta: {
        formats: ["Reels", "Carousel explainers", "Stories", "Retargeting ads"],
        funnel:
          "Meta awareness and engagement -> retargeting -> landing page or WhatsApp follow-up",
      },
      google: {
        formats: ["Search intent landing page", "High-intent keyword groups", "Conversion CTA copy"],
        funnel: "High-intent search -> focused landing page -> conversion CTA -> CRM follow-up",
      },
      linkedin: {
        formats: ["Authority posts", "Founder narrative", "Lead magnet", "B2B proof posts"],
        funnel: "LinkedIn authority -> lead magnet or consultation CTA -> sales follow-up",
      },
      whatsapp: {
        formats: ["Broadcast copy", "Follow-up templates", "Short offer flow"],
        funnel: "Ad or list segment -> WhatsApp script -> qualification -> conversion follow-up",
      },
      localRadius: {
        formats: ["Geo-targeted ads", "Store proof creatives", "Maps CTA", "Call button"],
        funnel: "Radius ad -> map/call/WhatsApp CTA -> store visit -> local retargeting",
      },
      multi: {
        formats: ["Awareness ads", "Search landing page", "Retargeting creatives", "CRM follow-up"],
        funnel: "Awareness -> search capture -> retargeting -> CRM or WhatsApp follow-up",
      },
    }[campaign.channel]

    const hooks = [
      `${campaignLabels.audience[campaign.audience]} are losing time or money without a clearer ${product} decision path.`,
      `A sharper ${campaignLabels.objective[campaign.objective].toLowerCase()} campaign can turn interest into measurable next actions.`,
      `The right ${campaignLabels.channel[campaign.channel]} system can connect demand, proof, and follow-up in ${market}.`,
    ]

    const service =
      campaign.businessType === "traditional" || campaign.businessType === "local"
        ? "AI Growth Audit"
        : campaign.channel === "google"
          ? "Website, SEO, AEO & GEO"
          : campaign.channel === "whatsapp"
            ? "CRM, Dashboards & Sales Enablement"
            : campaign.channel === "linkedin" || campaign.businessType === "b2b"
              ? "Brand Strategy & Positioning + Digital Marketing & Performance Growth"
              : campaign.objective === "leads" ||
                  campaign.objective === "sales" ||
                  campaign.objective === "storeVisits"
                ? "Digital Marketing & Performance Growth"
                : "Brand Strategy & Positioning"

    return {
      theme: `${objectiveDetail.theme} for ${campaignLabels.businessType[campaign.businessType]}`,
      message: objectiveDetail.message,
      hooks,
      funnel: channelDetail.funnel || objectiveDetail.funnel,
      formats: channelDetail.formats,
      cta: objectiveDetail.cta,
      service,
    }
  }, [campaign])

  const positioningOutput = useMemo(() => {
    const brandName = positioning.brandName.trim() || "Your brand"
    const product = positioning.product.trim() || "product or service"
    const differentiator =
      positioning.differentiator.trim() || "a clearer and more reliable customer experience"
    const customer = positioningLabels.targetCustomer[positioning.targetCustomer]
    const industry = positioningLabels.industry[positioning.industry]
    const category = `${positioningLabels.pricePositioning[positioning.pricePositioning]} ${industry}`

    const benefit =
      positioning.targetCustomer === "founders" || positioning.targetCustomer === "smes"
        ? "make clearer growth decisions"
        : positioning.targetCustomer === "dealers"
          ? "sell with more confidence and support"
          : positioning.targetCustomer === "local"
            ? "choose a trusted local provider"
            : positioning.pricePositioning === "luxury"
              ? "access a more elevated experience"
              : "get a better outcome with less uncertainty"

    const taglineOptions = {
      premium: [`Built for sharper choices.`, `Clarity, crafted.`, `Better systems. Better growth.`],
      friendly: [`Simple help. Better outcomes.`, `Made clearer for you.`, `A smarter way forward.`],
      bold: [`Lead with clarity.`, `No noise. Just momentum.`, `Built to stand apart.`],
      technical: [`Precision-led outcomes.`, `Engineered for measurable progress.`, `Systems that prove the point.`],
      trustworthy: [`Confidence in every step.`, `Reliable expertise, clearly delivered.`, `Trust built into the process.`],
      youthful: [`Fresh thinking. Real momentum.`, `Make the next move smarter.`, `Built for what is next.`],
      luxury: [`Designed for distinction.`, `Where elegance meets intent.`, `An elevated standard of choice.`],
    }[positioning.tone]

    const pillarPool = [
      positioning.pricePositioning === "budget" ? "Value" : "Quality",
      positioning.tone === "technical" ? "Intelligence" : "Trust",
      positioning.tone === "luxury" || positioning.tone === "premium" ? "Design" : "Service",
      positioning.industry === "technology" ? "Innovation" : "Expertise",
      positioning.targetCustomer === "local" ? "Local relevance" : "Transformation",
      differentiator.toLowerCase().includes("fast") ? "Speed" : "Convenience",
    ]
    const pillars = Array.from(new Set(pillarPool)).slice(0, 4)

    const service =
      positioning.product.toLowerCase().includes("website") ||
      positioning.differentiator.toLowerCase().includes("digital")
        ? "Brand Strategy & Positioning + Website, SEO, AEO & GEO"
        : positioning.targetCustomer === "founders" ||
            positioning.targetCustomer === "smes" ||
            positioning.targetCustomer === "enterprises"
          ? "Brand Strategy & Positioning + Digital Marketing & Performance Growth"
          : "Brand Strategy & Positioning"

    return {
      statement: `For ${customer}, ${brandName} is a ${category} brand that helps them ${benefit} through ${differentiator}.`,
      promise: `${brandName} helps ${customer} move from uncertainty to a clearer, more confident ${product} decision.`,
      taglines: taglineOptions,
      pillars,
      tone: `${positioningLabels.tone[positioning.tone]}: clear, consistent, and matched to ${customer}.`,
      service,
      nextStep:
        "Use the diagnostic to pressure-test the audience, differentiation, website message, and campaign narrative before execution.",
    }
  }, [positioning])

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:gap-6">
      <div
        className="flex min-w-0 gap-1.5 overflow-x-auto overscroll-x-contain rounded-[0.95rem] border border-hairline bg-card/84 p-1.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34] sm:gap-2 sm:rounded-[1.1rem] sm:p-2"
        role="tablist"
        aria-label="AI Lab tools"
      >
        {toolTabs.map((tool) => {
          const isActive = activeTool === tool.id

          return (
            <button
              key={tool.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tool.id}-tool-panel`}
              onClick={() => setActiveTool(tool.id)}
              className={`min-w-[8.25rem] flex-1 touch-manipulation rounded-[0.75rem] border px-2.5 py-2.5 text-left transition-all duration-300 [-webkit-tap-highlight-color:transparent] sm:min-w-[9rem] sm:px-4 sm:py-3 lg:min-w-0 ${
                isActive
                  ? "border-primary/30 bg-primary/[0.11] text-foreground shadow-[inset_0_1px_0_0_var(--shine-inset),0_14px_34px_-24px_var(--glow-primary)]"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-primary/14 hover:bg-primary/[0.045] hover:text-foreground"
              }`}
            >
              <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-primary/80 sm:text-[0.625rem]">
                {tool.eyebrow}
              </span>
              <span className="mt-1 block truncate text-[0.8125rem] font-semibold tracking-tight sm:text-sm">
                {tool.label}
              </span>
            </button>
          )
        })}
      </div>

      {activeTool === "scorecard" ? (
        <ToolShell
          eyebrow="Tool 01"
          title="AI Growth Scorecard"
          purpose="Scores a business across AI readiness, brand clarity, marketing maturity, website conversion, CRM maturity, and reporting intelligence."
          icon={<Gauge className="h-5 w-5" strokeWidth={1.65} aria-hidden />}
        >
          <div
            id="scorecard-tool-panel"
            role="tabpanel"
            className="grid gap-4 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]"
          >
          <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <SelectField
              label="Business stage"
              value={scorecard.stage}
              options={scoreOptions.stage}
              onChange={(stage) => setScorecard((state) => ({ ...state, stage }))}
            />
            <SelectField
              label="Current AI usage"
              value={scorecard.aiUsage}
              options={scoreOptions.aiUsage}
              onChange={(aiUsage) =>
                setScorecard((state) => ({ ...state, aiUsage }))
              }
            />
            <SelectField
              label="Marketing structure"
              value={scorecard.marketing}
              options={scoreOptions.marketing}
              onChange={(marketing) =>
                setScorecard((state) => ({ ...state, marketing }))
              }
            />
            <SelectField
              label="Website performance"
              value={scorecard.website}
              options={scoreOptions.website}
              onChange={(website) =>
                setScorecard((state) => ({ ...state, website }))
              }
            />
            <SelectField
              label="CRM system"
              value={scorecard.crm}
              options={scoreOptions.crm}
              onChange={(crm) => setScorecard((state) => ({ ...state, crm }))}
            />
            <SelectField
              label="Reporting"
              value={scorecard.reporting}
              options={scoreOptions.reporting}
              onChange={(reporting) =>
                setScorecard((state) => ({ ...state, reporting }))
              }
            />
          </div>
          <div className="min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3.5 sm:p-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                  AI Growth Readiness Score
                </p>
                <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-foreground">
                  {scorecardOutput.score}
                  <span className="text-xl text-muted-foreground/65">/100</span>
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div className="grid gap-2.5">
              <MetricCard label="Strongest area" value={scorecardOutput.strongest} />
              <MetricCard label="Weakest area" value={scorecardOutput.weakest} />
              <MetricCard
                label="Recommended PxlBrief service"
                value={scorecardOutput.service}
              />
              <MetricCard
                label="Recommended first step"
                value={scorecardOutput.nextStep}
                tone="primary"
              />
            </div>
            <p className="mt-3 rounded-[0.8rem] border border-hairline/75 bg-background/30 px-3 py-2.5 text-[0.75rem] leading-relaxed text-muted-foreground/82">
              {scorecardOutput.serviceReason}
            </p>
            <AiStrategyPanel
              state={aiReadouts.scorecard}
              onGenerate={() =>
                generateAiReadout(
                  "scorecard",
                  asRecord(scorecard),
                  asRecord(scorecardOutput)
                )
              }
            />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                href="/ai-growth-audit"
                className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/[0.09] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.14]"
              >
                View AI Growth Audit
              </Link>
              <Link
                href="/#consulting-chat"
                className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94]"
              >
                Run My Growth Diagnostic
              </Link>
            </div>
          </div>
          </div>
        </ToolShell>
      ) : null}

      {activeTool === "recommender" ? (
        <ToolShell
          eyebrow="Tool 02"
          title="AI Service Recommender"
          purpose="Recommends the right PxlBrief service based on the visitor's challenge, business type, and urgency."
          icon={<Route className="h-5 w-5" strokeWidth={1.65} aria-hidden />}
        >
          <div
            id="recommender-tool-panel"
            role="tabpanel"
            className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
          <div className="grid min-w-0 gap-2.5 sm:gap-3">
            <SelectField
              label="Main challenge"
              value={recommender.challenge}
              options={challengeOptions}
              onChange={(challenge) =>
                setRecommender((state) => ({ ...state, challenge }))
              }
            />
            <SelectField
              label="Business type"
              value={recommender.businessType}
              options={businessTypeOptions}
              onChange={(businessType) =>
                setRecommender((state) => ({ ...state, businessType }))
              }
            />
            <SelectField
              label="Urgency"
              value={recommender.urgency}
              options={urgencyOptions}
              onChange={(urgency) =>
                setRecommender((state) => ({ ...state, urgency }))
              }
            />
          </div>
          <div className="min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3.5 sm:p-4">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
              Recommended service
            </p>
            <h4 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-foreground">
              {recommenderOutput.service}
            </h4>
            <div className="mt-4 grid gap-2.5">
              <MetricCard
                label="Priority level"
                value={recommenderOutput.priority}
                tone={recommenderOutput.priority === "High" ? "primary" : "default"}
              />
              <MetricCard
                label="Business context"
                value={recommenderOutput.businessContext}
              />
              <MetricCard label="Why this fits" value={recommenderOutput.reason} />
              <MetricCard
                label="Suggested next step"
                value={recommenderOutput.step}
                tone="primary"
              />
            </div>
            <Link
              href={recommenderOutput.ctaHref}
              className="mt-4 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/[0.09] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.14]"
            >
              {recommenderOutput.ctaLabel}
            </Link>
            <AiStrategyPanel
              state={aiReadouts.recommender}
              onGenerate={() =>
                generateAiReadout(
                  "recommender",
                  asRecord(recommender),
                  asRecord(recommenderOutput)
                )
              }
            />
          </div>
          </div>
        </ToolShell>
      ) : null}

      {activeTool === "roi" ? (
        <ToolShell
          eyebrow="Tool 03"
          title="AI ROI / Productivity Calculator"
          purpose="Estimates time leakage and potential productivity improvement from AI-assisted workflows."
          icon={<BarChart3 className="h-5 w-5" strokeWidth={1.65} aria-hidden />}
        >
          <div
            id="roi-tool-panel"
            role="tabpanel"
            className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
          <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <NumberField
              label="Team size"
              value={roi.teamSize}
              onChange={(teamSize) => setRoi((state) => ({ ...state, teamSize }))}
            />
            <NumberField
              label="Monthly cost per employee"
              value={roi.monthlyCost}
              prefix="₹"
              onChange={(monthlyCost) =>
                setRoi((state) => ({ ...state, monthlyCost }))
              }
            />
            <NumberField
              label="Weekly manual reporting hours"
              value={roi.reportingHours}
              onChange={(reportingHours) =>
                setRoi((state) => ({ ...state, reportingHours }))
              }
            />
            <NumberField
              label="Weekly content / research hours"
              value={roi.contentHours}
              onChange={(contentHours) =>
                setRoi((state) => ({ ...state, contentHours }))
              }
            />
            <NumberField
              label="Weekly manual follow-up hours"
              value={roi.followupHours}
              onChange={(followupHours) =>
                setRoi((state) => ({ ...state, followupHours }))
              }
            />
          </div>
          <div className="min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3.5 sm:p-4">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
              Directional estimate
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <MetricCard
                label="Team size"
                value={`${Math.round(roiOutput.teamSize)} people`}
              />
              <MetricCard
                label="Weekly manual hours"
                value={`${Math.round(roiOutput.weeklyHours)} hrs`}
              />
              <MetricCard
                label="Monthly manual hours"
                value={`${Math.round(roiOutput.monthlyHours)} hrs`}
              />
              <MetricCard
                label="Manual work cost"
                value={formatCurrency(roiOutput.monthlyCost)}
              />
              <MetricCard
                label="Estimated hourly cost"
                value={formatCurrency(roiOutput.hourlyCost)}
              />
            </div>
            <div className="mt-3 grid gap-2.5">
              {roiOutput.recoverable.map(({ rate, hours, value }) => (
                <MetricCard
                  key={rate}
                  label={`${Math.round(rate * 100)}% recoverable estimate`}
                  value={`${Math.round(hours)} hrs / ${formatCurrency(value)}`}
                />
              ))}
              <MetricCard
                label="Recommended automation priority"
                value={roiOutput.priority}
                tone="primary"
              />
            </div>
            <p className="mt-4 rounded-[0.8rem] border border-hairline/75 bg-background/30 px-3 py-2.5 text-[0.75rem] leading-relaxed text-muted-foreground/82">
              This is a directional estimate, not a guaranteed saving.
            </p>
            <AiStrategyPanel
              state={aiReadouts.roi}
              onGenerate={() =>
                generateAiReadout("roi", asRecord(roi), asRecord(roiOutput))
              }
            />
            <Link
              href="/ai-growth-audit"
              className="mt-4 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/[0.09] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.14]"
            >
              Start AI Growth Audit
            </Link>
          </div>
          </div>
        </ToolShell>
      ) : null}

      {activeTool === "campaign" ? (
        <ToolShell
          eyebrow="Tool 04"
          title="Campaign Intelligence"
          purpose="Generates a rule-based, directional campaign snapshot from market, audience, objective, and channel inputs."
          icon={<Megaphone className="h-5 w-5" strokeWidth={1.65} aria-hidden />}
        >
          <div
            id="campaign-tool-panel"
            role="tabpanel"
            className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
              <SelectField
                label="Business type"
                value={campaign.businessType}
                options={campaignBusinessTypeOptions}
                onChange={(businessType) =>
                  setCampaign((state) => ({ ...state, businessType }))
                }
              />
              <TextField
                label="Product / service"
                value={campaign.product}
                placeholder="e.g. premium skincare product, AI consulting"
                onChange={(product) => setCampaign((state) => ({ ...state, product }))}
              />
              <SelectField
                label="Target audience"
                value={campaign.audience}
                options={audienceOptions}
                onChange={(audience) =>
                  setCampaign((state) => ({ ...state, audience }))
                }
              />
              <SelectField
                label="Campaign objective"
                value={campaign.objective}
                options={campaignObjectiveOptions}
                onChange={(objective) =>
                  setCampaign((state) => ({ ...state, objective }))
                }
              />
              <SelectField
                label="Preferred channel"
                value={campaign.channel}
                options={channelOptions}
                onChange={(channel) => setCampaign((state) => ({ ...state, channel }))}
              />
              <TextField
                label="Market / location"
                value={campaign.market}
                placeholder="e.g. Gurgaon, Mumbai, 5 km around store"
                onChange={(market) => setCampaign((state) => ({ ...state, market }))}
              />
            </div>
            <div className="min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3.5 sm:p-4">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                Directional intelligence
              </p>
              <div className="mt-4 grid gap-2.5">
                <MetricCard label="Campaign theme" value={campaignOutput.theme} />
                <MetricCard label="Core message" value={campaignOutput.message} />
                <OutputList label="Campaign hooks" items={campaignOutput.hooks} />
                <MetricCard
                  label="Recommended funnel"
                  value={campaignOutput.funnel}
                  tone="primary"
                />
                <OutputList
                  label="Suggested content formats"
                  items={campaignOutput.formats}
                />
                <MetricCard label="CTA recommendation" value={campaignOutput.cta} />
                <MetricCard
                  label="Recommended PxlBrief service"
                  value={campaignOutput.service}
                  tone="primary"
                />
              </div>
              <PreviewDisclaimer />
              <AiStrategyPanel
                state={aiReadouts.campaign}
                onGenerate={() =>
                  generateAiReadout(
                    "campaign",
                    asRecord(campaign),
                    asRecord(campaignOutput)
                  )
                }
              />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/ai-growth-audit"
                  className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/[0.09] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.14]"
                >
                  View AI Growth Audit
                </Link>
                <Link
                  href="/#consulting-chat"
                  className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94]"
                >
                  Run My Growth Diagnostic
                </Link>
              </div>
            </div>
          </div>
        </ToolShell>
      ) : null}

      {activeTool === "positioning" ? (
        <ToolShell
          eyebrow="Tool 05"
          title="Brand Positioning Engine"
          purpose="Creates a rule-based, directional positioning snapshot for brand clarity, messaging, and service fit."
          icon={<Landmark className="h-5 w-5" strokeWidth={1.65} aria-hidden />}
        >
          <div
            id="positioning-tool-panel"
            role="tabpanel"
            className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
              <TextField
                label="Brand / business name"
                value={positioning.brandName}
                placeholder="e.g. PxlBrief"
                onChange={(brandName) =>
                  setPositioning((state) => ({ ...state, brandName }))
                }
              />
              <SelectField
                label="Industry"
                value={positioning.industry}
                options={industryOptions}
                onChange={(industry) =>
                  setPositioning((state) => ({ ...state, industry }))
                }
              />
              <SelectField
                label="Target customer"
                value={positioning.targetCustomer}
                options={targetCustomerOptions}
                onChange={(targetCustomer) =>
                  setPositioning((state) => ({ ...state, targetCustomer }))
                }
              />
              <TextField
                label="Product / service"
                value={positioning.product}
                placeholder="e.g. premium design service"
                onChange={(product) =>
                  setPositioning((state) => ({ ...state, product }))
                }
              />
              <SelectField
                label="Price positioning"
                value={positioning.pricePositioning}
                options={priceOptions}
                onChange={(pricePositioning) =>
                  setPositioning((state) => ({ ...state, pricePositioning }))
                }
              />
              <SelectField
                label="Desired tone"
                value={positioning.tone}
                options={toneOptions}
                onChange={(tone) => setPositioning((state) => ({ ...state, tone }))}
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Differentiator"
                  value={positioning.differentiator}
                  placeholder="e.g. faster service, premium design, local trust"
                  onChange={(differentiator) =>
                    setPositioning((state) => ({ ...state, differentiator }))
                  }
                />
              </div>
            </div>
            <div className="min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3.5 sm:p-4">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                Directional intelligence
              </p>
              <div className="mt-4 grid gap-2.5">
                <MetricCard
                  label="Positioning statement"
                  value={positioningOutput.statement}
                  tone="primary"
                />
                <MetricCard label="Brand promise" value={positioningOutput.promise} />
                <OutputList label="Tagline options" items={positioningOutput.taglines} />
                <OutputList
                  label="Communication pillars"
                  items={positioningOutput.pillars}
                />
                <MetricCard
                  label="Recommended tone of voice"
                  value={positioningOutput.tone}
                />
                <MetricCard
                  label="Recommended PxlBrief service"
                  value={positioningOutput.service}
                  tone="primary"
                />
                <MetricCard
                  label="Suggested next step"
                  value={positioningOutput.nextStep}
                />
              </div>
              <PreviewDisclaimer />
              <AiStrategyPanel
                state={aiReadouts.positioning}
                onGenerate={() =>
                  generateAiReadout(
                    "positioning",
                    asRecord(positioning),
                    asRecord(positioningOutput)
                  )
                }
              />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/services"
                  className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/[0.09] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/44 hover:bg-primary/[0.14]"
                >
                  View Services
                </Link>
                <Link
                  href="/#consulting-chat"
                  className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94]"
                >
                  Run My Growth Diagnostic
                </Link>
              </div>
            </div>
          </div>
        </ToolShell>
      ) : null}
    </div>
  )
}
