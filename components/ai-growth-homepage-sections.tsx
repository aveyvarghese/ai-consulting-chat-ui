import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleDot,
  Gauge,
  Landmark,
  LockKeyhole,
  Route,
  Sparkles,
  Workflow,
} from "lucide-react"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"

type Problem = {
  title: string
  signal: string
}

const problems: readonly Problem[] = [
  {
    title: "Marketing is active but scattered",
    signal: "Channels move, but the system does not compound.",
  },
  {
    title: "AI tools are being used randomly",
    signal: "Experiments exist without governance, workflow, or measurable lift.",
  },
  {
    title: "Websites are not converting enough",
    signal: "Traffic arrives, but the route to enquiry is not engineered.",
  },
  {
    title: "Leads are not tracked properly",
    signal: "Follow-up depends on memory, inbox discipline, and manual effort.",
  },
  {
    title: "Reports do not produce decisions",
    signal: "Dashboards show activity but do not tell founders what to do next.",
  },
  {
    title: "Founders are still dependent on manual processes",
    signal: "Senior time is trapped in coordination, reporting, and repeated checks.",
  },
] as const

const diagnosticInputs = [
  "Business type",
  "Main challenge",
  "Current AI usage",
  "Marketing maturity",
  "Website / CRM status",
] as const

const diagnosticOutputs = [
  "Likely bottleneck",
  "AI opportunity",
  "Recommended service",
  "Suggested next step",
] as const

const labCards = [
  {
    title: "AI Growth Scorecard",
    status: "Available",
    icon: Gauge,
    description: "Score your current growth system and see the next constraint.",
  },
  {
    title: "AI Service Recommender",
    status: "Available",
    icon: Route,
    description: "Match business context to the right PxlBrief system.",
  },
  {
    title: "AI ROI / Productivity Calculator",
    status: "Available",
    icon: BarChart3,
    description: "Estimate time, cost, and productivity upside from AI workflows.",
  },
  {
    title: "AI Campaign Idea Generator",
    status: "Coming Soon",
    icon: Sparkles,
    description: "Turn market inputs into sharper campaign angles.",
  },
  {
    title: "AI Brand Positioning Engine",
    status: "Coming Soon",
    icon: Landmark,
    description: "Clarify positioning, narrative, and premium differentiation.",
  },
  {
    title: "AI Lead Funnel Builder",
    status: "Coming Soon",
    icon: Workflow,
    description: "Map lead capture, qualification, nurture, and handoff flows.",
  },
] as const

const dashboardKpis = [
  { label: "Leads this month", value: "186", trend: "+18%" },
  { label: "Lead conversion rate", value: "7.4%", trend: "+1.9%" },
  { label: "Campaign efficiency", value: "82", trend: "Healthy" },
  { label: "Website conversion", value: "3.8%", trend: "Improve" },
  { label: "CRM health", value: "68", trend: "Watch" },
  { label: "AI productivity score", value: "42", trend: "Unlock" },
  { label: "Pending follow-ups", value: "23", trend: "High" },
  { label: "Recommended next action", value: "Audit", trend: "Now" },
] as const

const industryPlaybooks = [
  {
    title: "Fashion & Lifestyle",
    challenge: "Campaigns and content move faster than customer intelligence.",
    opportunity: "AI-assisted content workflows and buying signal dashboards.",
    system: "Brand funnel + performance reporting.",
  },
  {
    title: "Home Improvement",
    challenge: "Enquiries leak between site, WhatsApp, calls, and sales teams.",
    opportunity: "Lead routing, qualification, and follow-up automation.",
    system: "CRM + local growth engine.",
  },
  {
    title: "Education & Coaching",
    challenge: "Interest is high, but nurture and conversion are inconsistent.",
    opportunity: "AI-assisted counselling journeys and campaign intelligence.",
    system: "Admissions funnel + dashboard.",
  },
  {
    title: "Healthcare & Wellness",
    challenge: "Trust, search visibility, and patient acquisition lack one system.",
    opportunity: "Structured content, local search, and intake automation.",
    system: "Authority website + lead capture.",
  },
  {
    title: "B2B Services",
    challenge: "Expertise is strong, but positioning and inbound are unclear.",
    opportunity: "LinkedIn authority, website clarity, and lead qualification.",
    system: "Authority engine + CRM flow.",
  },
  {
    title: "Manufacturing",
    challenge: "Traditional sales data stays hidden across teams and spreadsheets.",
    opportunity: "Market intelligence, pipeline visibility, and weekly summaries.",
    system: "Sales intelligence dashboard.",
  },
  {
    title: "Real Estate & Interiors",
    challenge: "High-value leads need discretion, speed, and better context.",
    opportunity: "Qualification logic, broker-ready briefs, and retargeting.",
    system: "Premium lead system.",
  },
  {
    title: "Retail & Local Businesses",
    challenge: "Marketing effort is fragmented across local channels.",
    opportunity: "Search, offers, CRM, and follow-up connected in one cadence.",
    system: "Local growth operating system.",
  },
] as const

const caseScenarios = [
  {
    title: "Founder-Led Consumer Brand",
    problem: "Scattered content, weak campaign structure, poor lead clarity",
    system: "Brand positioning + performance funnel + dashboard",
    aiLayer: "Campaign intelligence and content workflow",
  },
  {
    title: "B2B Services Company",
    problem: "Weak LinkedIn presence, low inbound leads, unclear website messaging",
    system: "Website + LinkedIn authority + CRM lead tracking",
    aiLayer: "Lead qualification and sales follow-up assistance",
  },
  {
    title: "Traditional SME",
    problem: "Manual reporting, disconnected teams, no AI adoption roadmap",
    system: "AI workflow audit + dashboard + automation roadmap",
    aiLayer: "Weekly executive intelligence summary",
  },
] as const

const credibilityPoints = [
  "9+ years of experience",
  "50+ brands influenced / worked with",
  "AI implementation",
  "Brand strategy",
  "Digital marketing",
  "Website and performance growth",
  "CRM, dashboards, and market intelligence",
] as const

function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string
  title: string
  text?: string
  align?: "left" | "center"
}) {
  return (
    <header
      className={
        align === "center"
          ? "mx-auto mb-6 max-w-3xl text-center sm:mb-12 md:mb-16"
          : "mb-6 max-w-3xl sm:mb-12 md:mb-16"
      }
    >
      <p className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85 sm:mb-4 sm:text-[0.6875rem] sm:tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="text-balance text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.5rem] md:tracking-[-0.035em]">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-pretty text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg md:leading-relaxed">
          {text}
        </p>
      ) : null}
    </header>
  )
}

function MetallicCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1rem] border border-hairline bg-card/88 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[border-color,box-shadow,transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/30 hover:bg-card/95 hover:shadow-[var(--shadow-card-hover),0_0_0_1px_var(--glow-ambient)] dark:bg-card/[0.36] sm:rounded-[1.125rem] ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 hidden h-40 w-40 rounded-full bg-primary/[0.08] opacity-70 blur-2xl sm:block md:-right-20 md:-top-20 md:h-48 md:w-48 md:blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-[0.625rem] border border-primary/22 bg-primary/[0.09] text-primary shadow-sm sm:h-11 sm:w-11">
      <Icon className="h-5 w-5" strokeWidth={1.65} aria-hidden />
    </div>
  )
}

export function ProblemSection() {
  return (
    <section className="relative px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Diagnosis"
          title="Most businesses do not have a marketing problem. They have a disconnected growth system."
          text="PxlBrief starts by finding where growth signal breaks: campaign to website, website to CRM, CRM to sales, sales to founder-level decisions."
        />
        <div className="grid grid-cols-1 gap-2.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <MetallicCard key={problem.title} className="p-3 sm:p-6">
              <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-5">
                <span className="font-mono text-[0.6875rem] text-primary/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-primary/18 bg-primary/[0.06] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/90">
                  Signal gap
                </span>
              </div>
              <h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground sm:text-base">
                {problem.title}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground/90 sm:mt-3 md:text-sm">
                {problem.signal}
              </p>
            </MetallicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AIGrowthDiagnosticPreviewSection() {
  return (
    <section className="relative border-y border-hairline/70 bg-section-tint/70 px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.22]" />
      <div className="relative mx-auto grid max-w-6xl gap-7 sm:gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-14">
        <SectionHeader
          eyebrow="AI Growth Diagnostic"
          title="Start with a live AI diagnosis of your growth system."
          text="Answer a few focused questions and receive a directional readout of your growth bottleneck, AI opportunity, and recommended next step."
        />
        <MetallicCard className="p-3 sm:p-6 md:p-7">
          <div className="mb-3 flex items-center justify-between border-b border-hairline/70 pb-3 sm:mb-5 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/75">
                Diagnostic interface
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                Growth system intake
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/90">
              Preview
            </span>
          </div>
          <div className="grid gap-3 sm:gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-1.5 sm:space-y-3">
              {diagnosticInputs.map((item) => (
                <div
                  key={item}
                  className="rounded-[0.875rem] border border-hairline/80 bg-background/35 px-3 py-2 sm:px-4 sm:py-3"
                >
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                    {item}
                  </span>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted/55 sm:mt-2 sm:h-2">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary/40 to-primary/80" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[1rem] border border-primary/20 bg-primary/[0.045] p-3 sm:p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground sm:mb-4">
                <Brain className="h-4 w-4 text-primary" />
                Output preview
              </div>
              <div className="space-y-2 sm:space-y-3">
                {diagnosticOutputs.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                    <div>
                      <p className="text-[0.8125rem] font-semibold text-foreground">
                        {item}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">
                        Directional intelligence generated from the live intake.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#consulting-chat"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-[0.75rem] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/[0.94] sm:mt-6"
              >
                Run My Growth Diagnostic
              </a>
            </div>
          </div>
        </MetallicCard>
      </div>
    </section>
  )
}

export function AILabPreviewSection() {
  return (
    <section id="ai-lab" className="relative scroll-mt-20 px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="AI Lab"
          title="Explore the intelligence systems we build."
          text="The AI Lab demonstrates how PxlBrief turns business inputs into diagnosis, recommendations, scores, campaigns, and growth systems."
          align="center"
        />
        <div className="flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {labCards.map((card) => (
            <MetallicCard key={card.title} className="min-w-[82%] p-3.5 sm:min-w-0 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <IconBadge icon={card.icon} />
                <span
                  className={`rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
                    card.status === "Available"
                      ? "border-primary/25 bg-primary/[0.08] text-primary"
                      : "border-hairline bg-foreground/[0.04] text-muted-foreground"
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground sm:text-base">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/88 md:text-sm">
                {card.description}
              </p>
              <a
                href={card.status === "Available" ? "/ai-lab#lab-tools" : "#ai-lab"}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-[0.7rem] border border-primary/18 bg-primary/[0.055] px-4 py-2 text-[0.8125rem] font-semibold text-primary transition-colors hover:border-primary/32 hover:bg-primary/[0.09] sm:w-auto"
              >
                {card.status === "Available" ? "Open in AI Lab" : "Preview"}
              </a>
            </MetallicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExecutiveDashboardShowcaseSection() {
  return (
    <section className="relative border-y border-hairline/70 bg-gradient-to-b from-background via-section-tint/60 to-background px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 hidden h-[min(80vw,620px)] w-[min(90vw,760px)] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[110px] md:block" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Founder dashboard"
          title="Turn scattered business signals into founder-ready intelligence."
          text="PxlBrief helps founders see what is working, what is leaking, and what needs action across marketing, sales, CRM, website, and AI workflows."
          align="center"
        />
        <MetallicCard className="p-3.5 sm:p-6 md:p-8">
          <div className="mb-4 flex flex-col gap-3 border-b border-hairline/70 pb-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/75">
                Executive command view
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Growth cockpit
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-xs font-medium text-primary">
              <CircleDot className="h-3.5 w-3.5" />
              Mock data
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {dashboardKpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[0.95rem] border border-hairline/80 bg-background/35 p-3.5 sm:p-4"
              >
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                  {kpi.label}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
                    {kpi.value}
                  </span>
                  <span className="rounded-full border border-primary/18 bg-primary/[0.06] px-2 py-1 text-[0.625rem] font-semibold text-primary/90">
                    {kpi.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MetallicCard>
      </div>
    </section>
  )
}

export function IndustryPlaybooksPreviewSection() {
  return (
    <section className="relative px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Industry playbooks"
          title="AI growth systems designed for real business categories."
          text="Each category has its own acquisition constraints, trust markers, operational drag, and automation opportunity."
        />
        <div className="flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {industryPlaybooks.map((playbook) => (
            <MetallicCard key={playbook.title} className="min-w-[82%] p-3.5 sm:min-w-0 sm:p-5">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {playbook.title}
              </h3>
              <dl className="mt-3 space-y-2 text-[0.8125rem] leading-relaxed sm:mt-5 sm:space-y-3">
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Common challenge
                  </dt>
                  <dd className="mt-1 text-muted-foreground/90">
                    {playbook.challenge}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/80">
                    AI opportunity
                  </dt>
                  <dd className="mt-1 text-foreground/88">
                    {playbook.opportunity}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Recommended system
                  </dt>
                  <dd className="mt-1 text-muted-foreground/90">
                    {playbook.system}
                  </dd>
                </div>
              </dl>
            </MetallicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CaseIntelligencePreviewSection() {
  return (
    <section className="relative border-y border-hairline/70 bg-section-tint/70 px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.2]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Case intelligence"
          title="Strategic systems, not isolated services."
          text="These example transformation scenarios show how strategy, execution, and AI layers connect into one operating system."
          align="center"
        />
        <div className="grid grid-cols-1 gap-2.5 sm:gap-5 lg:grid-cols-3">
          {caseScenarios.map((item, index) => (
            <MetallicCard key={item.title} className="p-3.5 sm:p-6">
              <div className="mb-3 flex flex-col items-start gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="font-mono text-[0.6875rem] text-primary/80">
                  Case {index + 1}
                </span>
                <span className="rounded-full border border-hairline bg-foreground/[0.04] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
                  Example transformation scenario
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <dl className="mt-3 space-y-2 text-[0.8125rem] leading-relaxed sm:mt-6 sm:space-y-4 md:text-sm">
                <div>
                  <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Problem
                  </dt>
                  <dd className="text-muted-foreground/90">{item.problem}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/80">
                    System
                  </dt>
                  <dd className="text-foreground/88">{item.system}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    AI Layer
                  </dt>
                  <dd className="text-muted-foreground/90">{item.aiLayer}</dd>
                </div>
              </dl>
            </MetallicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FounderCredibilitySection() {
  return (
    <section className="relative px-3 py-8 sm:px-4 sm:py-24 md:py-32">
      <div className="relative mx-auto grid max-w-6xl gap-5 rounded-[1.1rem] border border-hairline bg-card/82 p-4 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl dark:bg-card/[0.34] sm:rounded-[1.25rem] sm:p-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 hidden h-72 w-72 rounded-full bg-primary/[0.08] blur-3xl sm:block" />
        <div className="relative">
          <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-primary/85">
            Founder credibility
          </p>
          <h2 className="text-balance text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.45rem] md:tracking-[-0.035em]">
            Built by a strategist who understands brand, business, AI, and execution.
          </h2>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
            PxlBrief sits at the intersection of strategy and implementation:
            not just ideas, not just tools, and not just campaigns. The work is
            to connect decisions, systems, and execution into measurable growth.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {credibilityPoints.map((point) => (
            <div
              key={point}
              className="flex items-center gap-2.5 rounded-[0.95rem] border border-hairline/80 bg-background/35 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
            >
              <LockKeyhole className="h-4 w-4 shrink-0 text-primary/85" />
              <span className="text-[0.8125rem] font-medium leading-snug text-foreground/90 md:text-sm">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalGrowthCtaSection() {
  return (
    <section className="relative px-3 pb-14 pt-6 sm:px-4 sm:pb-28 sm:pt-12 md:pb-36 md:pt-14">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.15rem] border border-hairline bg-card/94 px-4 py-7 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-16 dark:bg-card/[0.42] md:px-14 md:py-20">
        <div className="pointer-events-none absolute -left-20 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-primary/[0.09] blur-3xl pxl-ambient-glow-drift sm:block" />
        <div className="pointer-events-none absolute -right-16 bottom-0 hidden h-52 w-52 rounded-full bg-accent/[0.08] blur-2xl pxl-ambient-glow-drift-reverse sm:block" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
        <div className="relative z-10">
          <h2 className="text-balance text-[1.55rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.375rem]">
            Ready to see where your growth system is leaking?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-8 md:text-lg">
            Start with an AI Growth Diagnostic and get a clearer view of your
            business bottlenecks, AI opportunities, and recommended next step.
          </p>
          <div className="mx-auto mt-7 flex max-w-xl flex-col gap-2.5 sm:mt-12 sm:flex-row sm:justify-center sm:gap-3">
            <a
              href="#consulting-chat"
              className="inline-flex min-h-[3.125rem] touch-manipulation items-center justify-center rounded-[0.875rem] bg-primary px-8 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-md shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/[0.94] hover:shadow-xl hover:shadow-primary/20 active:scale-[0.985] motion-reduce:transition-colors"
            >
              Run My Growth Diagnostic
            </a>
            <StrategicSessionBookingLink
              source="homepage_final_cta"
              className="inline-flex min-h-[3.125rem] touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/30 bg-primary/[0.06] px-8 py-3.5 text-sm font-semibold tracking-tight text-primary transition-all duration-500 hover:border-primary/45 hover:bg-primary/12"
            >
              Book Strategic Session
            </StrategicSessionBookingLink>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground/70 sm:mt-8">
            <ArrowRight className="h-3.5 w-3.5 text-primary/70" />
            Founder-level diagnostic, then human strategic review.
          </div>
        </div>
      </div>
    </section>
  )
}
