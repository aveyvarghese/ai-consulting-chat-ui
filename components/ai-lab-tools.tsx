"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { BarChart3, Gauge, Route, Sparkles } from "lucide-react"

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

type ActiveTool = "scorecard" | "recommender" | "roi"

const toolTabs: readonly {
  id: ActiveTool
  label: string
  eyebrow: string
}[] = [
  { id: "scorecard", label: "Scorecard", eyebrow: "Tool 01" },
  { id: "recommender", label: "Recommender", eyebrow: "Tool 02" },
  { id: "roi", label: "ROI", eyebrow: "Tool 03" },
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

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
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

export function AILabTools() {
  const [scorecard, setScorecard] = useState<ScorecardState>(initialScorecard)
  const [recommender, setRecommender] =
    useState<RecommenderState>(initialRecommender)
  const [roi, setRoi] = useState<RoiState>(initialRoi)
  const [activeTool, setActiveTool] = useState<ActiveTool>("scorecard")

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

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:gap-6">
      <div
        className="grid grid-cols-3 gap-1.5 rounded-[0.95rem] border border-hairline bg-card/84 p-1.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34] sm:gap-2 sm:rounded-[1.1rem] sm:p-2"
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
              className={`min-w-0 touch-manipulation rounded-[0.75rem] border px-2.5 py-2.5 text-left transition-all duration-300 [-webkit-tap-highlight-color:transparent] sm:px-4 sm:py-3 ${
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
    </div>
  )
}
