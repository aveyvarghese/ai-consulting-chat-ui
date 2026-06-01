import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleDot,
  Gauge,
  Landmark,
  Route,
  Sparkles,
  Workflow,
} from "lucide-react"
import { HomepageCaseMobileList } from "@/components/homepage-case-mobile-list"
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
    status: "Available",
    icon: Sparkles,
    description: "Turn market inputs into sharper campaign angles.",
  },
  {
    title: "AI Brand Positioning Engine",
    status: "Available",
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

export function ProblemSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-black px-4 py-20 text-white md:px-8 md:py-28">
      <div
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-red-500/[0.02] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 left-[-10%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-cyan-500/[0.02] blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl space-y-16">
        <div className="max-w-4xl space-y-4">
          <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
            Diagnosis
          </p>
          <h2 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-3xl font-black leading-[1.15] tracking-tight text-transparent md:text-5xl">
            Most businesses do not have a marketing problem. They have a disconnected growth system.
          </h2>
          <p className="max-w-3xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            PxlBrief starts by finding where growth signal breaks: campaign to website, website to CRM, CRM to sales, sales to founder-level decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A]/40 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-[#0A0A0A]/80 md:p-8"
            >
              <span
                className="pointer-events-none absolute bottom-2 right-4 select-none font-mono text-8xl font-black text-white/[0.01] transition-colors duration-500 group-hover:text-red-500/[0.03] md:text-9xl"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-slate-600 transition-colors group-hover:text-red-400/60">
                    NODE_SIGNAL_ERR //{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-red-400">
                    <span className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
                    Signal gap
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-red-400 md:text-xl">
                  {problem.title}
                </h3>
                <p className="text-xs font-light leading-relaxed text-slate-400 md:text-sm">
                  {problem.signal}
                </p>
              </div>

              <div
                className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-500 via-purple-500 to-transparent transition-all duration-500 group-hover:w-full"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AIGrowthDiagnosticPreviewSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-black px-4 py-16 text-white md:px-8 md:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[85vw] max-h-[600px] w-[85vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.02] blur-[130px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl space-y-12">
        <div className="mx-auto max-w-3xl space-y-3 text-center md:mx-0 md:text-left">
          <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
            AI Growth Diagnostic
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Start with a live AI diagnosis of your growth system.
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:mx-0 md:text-base">
            Answer a few focused questions and receive a directional readout of your growth bottleneck, AI opportunity, and recommended next step.
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/70 shadow-2xl backdrop-blur-xl">
          <div className="flex h-11 w-full items-center justify-between border-b border-white/5 bg-black/40 px-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/30 transition-colors group-hover:bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/30 transition-colors group-hover:bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/30 transition-colors group-hover:bg-green-500/60" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              DIAGNOSTIC_CONSOLE_v3.5.exe
            </span>
            <span className="rounded border border-cyan-500/15 bg-cyan-500/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan-400">
              Preview
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/5 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            <div className="space-y-6 bg-black/20 p-6 md:p-8 lg:col-span-5">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Diagnostic interface
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  // INTAKE PARAMETERS
                </span>
                <h3 className="text-base font-bold tracking-tight text-white">
                  Growth system intake
                </h3>
              </div>

              <div className="space-y-5">
                {diagnosticInputs.map((item) => (
                  <div key={item} className="space-y-2">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {item}
                    </span>
                    <div className="relative">
                      <div className="min-h-12 w-full cursor-pointer rounded-lg border border-white/5 bg-black/40 px-4 py-3 text-xs font-light text-slate-300 shadow-inner transition-all focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 hover:border-cyan-500/25 md:text-sm">
                        Select Option Parameter...
                      </div>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        ▼
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex flex-col justify-between space-y-6 bg-black/40 p-6 md:p-8 lg:col-span-7">
              <div
                className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse"
                aria-hidden
              />
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                      // GENERATED RESULTS
                    </span>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      <h3 className="text-base font-bold tracking-tight text-white">
                        Output preview
                      </h3>
                    </div>
                  </div>
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan-400 animate-pulse">
                    Live Scan
                  </span>
                </div>

                <div className="relative space-y-4 overflow-hidden rounded-xl border border-white/5 bg-black/30 p-5">
                  {diagnosticOutputs.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 border-b border-white/[0.03] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/5">
                        <CheckCircle2 className="h-2.5 w-2.5 text-cyan-400" strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wide text-slate-300">
                          {item}
                        </h4>
                        <p className="text-xs font-light leading-relaxed text-slate-400">
                          Directional intelligence generated from the live intake.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 lg:pt-0">
                <a
                  href="#consulting-chat"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff7f50] to-[#ffa07a] px-6 py-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,127,80,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(255,127,80,0.45)]"
                >
                  Discuss With PxlBrief AI
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AILabPreviewSection() {
  return (
    <section id="ai-lab" className="relative z-10 w-full scroll-mt-20 overflow-hidden border-t border-white/5 bg-black px-4 pb-12 pt-20 text-white md:px-8">
      <div className="relative mx-auto max-w-7xl space-y-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
              AI Lab
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Explore the intelligence systems we build.
            </h2>
            <p className="text-sm font-light leading-relaxed text-slate-400 md:text-base">
              The AI Lab demonstrates how PxlBrief turns business inputs into diagnosis, recommendations, scores, campaigns, and growth systems.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:col-span-7 sm:grid-cols-2">
          {labCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-[#0A0A0A]/80 md:p-8"
            >
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 transition-colors group-hover:text-cyan-400">
                  <card.icon className="h-5 w-5" strokeWidth={1.65} aria-hidden />
                </div>
                <span
                  className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                    card.status === "Available"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-white/[0.03] text-slate-500"
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mb-6 mt-3 text-sm font-light leading-relaxed text-slate-400">
                {card.description}
              </p>
              <a
                href={card.status === "Available" ? "/ai-lab#lab-tools" : "#ai-lab"}
                className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-lg border border-white/10 px-5 py-2.5 font-mono text-xs text-slate-300 transition-all hover:bg-white/5 hover:text-white sm:w-auto"
              >
                {card.status === "Available" ? "Open in AI Lab" : "Preview"}
              </a>
            </article>
          ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl rounded-xl border border-white/5 bg-white/[0.01] p-5 text-center text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-sm font-semibold tracking-tight text-white">
            Prefer a direct conversation?
          </p>
          <p className="mx-auto mt-1.5 max-w-xl text-[0.8125rem] font-light leading-relaxed text-slate-400 sm:text-sm">
            Book a strategic session and we’ll review the right starting point.
          </p>
          <StrategicSessionBookingLink
            source="homepage_ai_lab_preview"
            className="mt-4 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-gradient-to-r from-[#ff7f50] to-[#ffa07a] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,127,80,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(255,127,80,0.45)] sm:w-auto"
          >
            Book Strategic Session
          </StrategicSessionBookingLink>
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
    <section className="relative z-10 w-full overflow-hidden bg-black px-4 py-12 text-white md:px-8">
      <div className="relative mx-auto max-w-7xl space-y-6 border-t border-white/5 pt-8">
        <div className="space-y-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Industry playbooks
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
            AI growth systems designed for real business categories.
          </h2>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            Each category has its own acquisition constraints, trust markers, operational drag, and automation opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {industryPlaybooks.map((playbook) => (
            <article
              key={playbook.title}
              className="space-y-6 rounded-xl border border-white/5 bg-[#0A0A0A]/40 p-6 transition-all duration-300 hover:border-white/10 md:p-8"
            >
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xl font-black text-white">
                  {playbook.title}
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff7f50]">
                  Common challenge
                </span>
              </div>
              <dl className="space-y-4 text-xs font-light leading-relaxed text-slate-400 md:text-sm">
                <div>
                  <dt className="block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Common challenge
                  </dt>
                  <dd className="mt-1">
                    {playbook.challenge}
                  </dd>
                </div>
                <div>
                  <dt className="block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    AI opportunity
                  </dt>
                  <dd className="mt-1">
                    {playbook.opportunity}
                  </dd>
                </div>
                <div>
                  <dt className="block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Recommended system
                  </dt>
                  <dd className="mt-1">
                    {playbook.system}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CaseIntelligencePreviewSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-black px-4 py-12 text-white md:px-8">
      <div className="relative mx-auto max-w-7xl space-y-6 border-t border-white/5 pt-12">
        <div className="space-y-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Case intelligence
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
            Strategic systems, not isolated services.
          </h2>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            These example transformation scenarios show how strategy, execution, and AI layers connect into one operating system.
          </p>
        </div>

        <HomepageCaseMobileList cases={caseScenarios} />
        <div className="hidden border-t border-white/10 sm:block">
          {caseScenarios.map((item, index) => (
            <article
              key={item.title}
              className="group border-b border-white/10 py-5 transition-all duration-200 hover:px-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-600 transition-colors group-hover:text-[#ff7f50]">
                    Case {index + 1} // Example transformation scenario
                  </span>
                  <h3 className="text-sm font-bold text-white transition-colors group-hover:text-cyan-400 md:text-base">
                    {item.title}
                  </h3>
                </div>
                <span className="whitespace-nowrap rounded-full border border-white/15 px-4 py-2 font-mono text-xs text-slate-400 transition-all group-hover:border-white group-hover:text-white">
                  View Case
                </span>
              </div>
              <dl className="mt-4 grid gap-4 text-xs font-light leading-relaxed text-slate-400 md:grid-cols-3 md:text-sm">
                <div>
                  <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Problem
                  </dt>
                  <dd>{item.problem}</dd>
                </div>
                <div>
                  <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    System
                  </dt>
                  <dd>{item.system}</dd>
                </div>
                <div>
                  <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    AI Layer
                  </dt>
                  <dd>{item.aiLayer}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FounderCredibilitySection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-black px-4 py-16 text-white md:px-8 md:py-24">
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[60vw] max-h-[400px] w-[60vw] max-w-[400px] rounded-full bg-purple-500/[0.02] blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl rounded-2xl border border-white/5 bg-[#0A0A0A]/40 p-6 shadow-2xl backdrop-blur-md md:p-12">
        <div
          className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          aria-hidden
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-4 md:space-y-6 lg:col-span-5">
            <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50]">
              Founder credibility
            </p>
            <h2 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-black leading-tight tracking-tight text-transparent md:text-4xl lg:text-5xl">
              Built by a strategist who understands brand, business, AI, and execution.
            </h2>
            <p className="text-sm font-light leading-relaxed text-slate-400 md:text-base">
              PxlBrief sits at the intersection of strategy and implementation:
              not just ideas, not just tools, and not just campaigns. The work is
              to connect decisions, systems, and execution into measurable growth.
            </p>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {credibilityPoints.slice(0, 2).map((point, index) => (
                <div
                  key={point}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-6"
                >
                  <div className="pointer-events-none absolute -bottom-4 -right-4 font-mono text-6xl font-black text-white/[0.01] transition-colors group-hover:text-cyan-500/[0.03]">
                    {index === 0 ? "EXP" : "BRD"}
                  </div>
                  <div className="mb-1 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
                    {index === 0 ? "9+" : "50+"}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    {point}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {credibilityPoints.slice(2).map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-4 transition-all duration-200 hover:border-white/10"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#ff7f50] to-[#ffa07a] shadow-[0_0_8px_rgba(255,127,80,0.5)]" />
                  <span className="text-xs font-light tracking-wide text-slate-300 md:text-sm">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FinalGrowthCtaSection() {
  return (
    <section className="section-cta-glow relative px-3 pb-14 pt-6 sm:px-4 sm:pb-28 sm:pt-12 md:pb-36 md:pt-14">
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
              className="pxl-mobile-secondary-cta cta-secondary-ai inline-flex min-h-12 touch-manipulation items-center justify-center rounded-[0.875rem] border px-8 py-3 text-sm font-semibold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] motion-reduce:transition-colors"
            >
              Run My Growth Diagnostic
            </a>
            <StrategicSessionBookingLink
              source="homepage_final_cta"
              className="pxl-mobile-primary-cta cta-gradient-motion cta-primary-booking inline-flex min-h-[3.125rem] touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/32 px-8 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_var(--shine-inset),0_14px_36px_-26px_var(--glow-primary)] transition-all duration-500 hover:border-primary/46"
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
