import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Gauge,
  LineChart,
  Radar,
  Route,
  Search,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/ai-growth-audit",
  title: "AI Growth Audit | PxlBrief",
  description:
    "Run an AI Growth Audit to identify business bottlenecks, marketing gaps, website issues, CRM leakage, AI opportunities, and the next growth system to build.",
})

const solvedGaps = [
  "Scattered marketing activity",
  "Random AI usage",
  "Weak website conversion",
  "Poor lead tracking",
  "Manual reporting",
  "Founder-dependent decisions",
] as const

const auditCoverage = [
  {
    title: "AI Implementation & Automation",
    description:
      "Find repetitive workflows, automation opportunities, AI use cases, and productivity gaps.",
    icon: Brain,
  },
  {
    title: "Brand Strategy & Positioning",
    description:
      "Assess clarity, differentiation, messaging, category positioning, and market perception.",
    icon: Sparkles,
  },
  {
    title: "Digital Marketing & Performance Growth",
    description:
      "Review campaigns, funnels, audience strategy, content direction, paid media structure, and reporting.",
    icon: LineChart,
  },
  {
    title: "Website, SEO, AEO & GEO",
    description:
      "Review website conversion, search visibility, AI-search readiness, content structure, and lead capture.",
    icon: Search,
  },
  {
    title: "Market Research & Business Intelligence",
    description:
      "Review competitor intelligence, category opportunities, customer signals, and strategic insights.",
    icon: Radar,
  },
  {
    title: "CRM, Dashboards & Sales Enablement",
    description:
      "Review lead capture, follow-up systems, CRM maturity, dashboards, sales content, and decision visibility.",
    icon: Workflow,
  },
] as const

const deliverables = [
  "Executive summary",
  "Growth gap analysis",
  "AI opportunity map",
  "Website and search readiness review",
  "CRM and lead leakage review",
  "Dashboard/reporting maturity review",
  "Priority scorecard",
  "30-60-90 day action roadmap",
  "Recommended implementation plan",
] as const

const scorecard = [
  { label: "AI readiness", value: "42", suffix: "/100", icon: Brain },
  { label: "Brand clarity", value: "58", suffix: "/100", icon: Sparkles },
  { label: "Website conversion", value: "46", suffix: "/100", icon: Search },
  { label: "CRM maturity", value: "35", suffix: "/100", icon: Workflow },
  { label: "Reporting intelligence", value: "40", suffix: "/100", icon: BarChart3 },
] as const

const idealFor = [
  "Founder-led SMEs",
  "Startups preparing to scale",
  "Consumer brands",
  "B2B companies",
  "Traditional businesses moving digital",
  "Teams using AI without structure",
] as const

const processSteps = [
  {
    title: "Discovery",
    description:
      "Understand your business, goals, current systems, and bottlenecks.",
  },
  {
    title: "Diagnostic Review",
    description:
      "Review your AI usage, brand, marketing, website, CRM, dashboards, and sales process.",
  },
  {
    title: "Intelligence Mapping",
    description:
      "Identify gaps, opportunities, risks, and high-impact AI use cases.",
  },
  {
    title: "Roadmap Presentation",
    description:
      "Deliver a clear 30-60-90 day roadmap with recommended next actions.",
  },
] as const

function SectionHeader({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string
  title: string
  text?: string
  center?: boolean
}) {
  return (
    <header
      className={
        center
          ? "mx-auto mb-6 max-w-3xl text-center sm:mb-12 md:mb-16"
          : "mb-6 max-w-3xl sm:mb-12 md:mb-16"
      }
    >
      <p className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85 sm:text-[0.6875rem] sm:tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="text-balance text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.5rem]">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-pretty text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
          {text}
        </p>
      ) : null}
    </header>
  )
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-[0.95rem] border border-hairline bg-card/86 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34] sm:rounded-[1.125rem] ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 hidden h-40 w-40 rounded-full bg-primary/[0.07] blur-2xl sm:block" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function IconBox({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.7rem] border border-primary/20 bg-primary/[0.08] text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)]">
      <Icon className="h-5 w-5" strokeWidth={1.65} aria-hidden />
    </div>
  )
}

function PrimaryCta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/#consulting-chat"
      className="pxl-mobile-secondary-cta cta-secondary-ai inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-[0.875rem] border px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-500 active:scale-[0.985] sm:w-auto"
    >
      {children}
    </Link>
  )
}

function SecondaryCta({
  source,
  children = "Book Strategic Session",
}: {
  source: string
  children?: React.ReactNode
}) {
  return (
    <StrategicSessionBookingLink
      source={source}
      className="pxl-mobile-primary-cta cta-gradient-motion cta-primary-booking inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/32 px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_var(--shine-inset),0_14px_36px_-26px_var(--glow-primary)] transition-all duration-500 hover:border-primary/46 sm:w-auto"
    >
      {children}
    </StrategicSessionBookingLink>
  )
}

export default function AIGrowthAuditPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <WhatItSolvesSection />
      <AuditCoverageSection />
      <DeliverablesSection />
      <ScorecardSection />
      <WhoItIsForSection />
      <ProcessSection />
      <CommercialSection />
      <FinalCtaSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="section-hero-dark relative overflow-hidden px-3 pb-7 pt-5 sm:px-4 sm:pb-20 sm:pt-14 md:pb-28 md:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-[min(88vw,420px)] w-[min(96vw,560px)] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[70px] md:top-10 md:h-[680px] md:w-[900px] md:bg-primary/[0.05] md:blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-accent/[0.035] blur-[58px] md:h-96 md:w-96 md:bg-accent/[0.04] md:blur-[118px]" />
        <div className="absolute inset-0 opacity-[0.14] pxl-data-grid md:opacity-[0.22]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-background/35 to-section-tint/50" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.75fr)] md:items-center md:gap-12">
        <div className="min-w-0 text-center md:text-left">
          <p className="mx-auto mb-3 inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary/90 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl sm:mb-4 md:mx-0">
            Flagship diagnostic
          </p>
          <h1 className="text-balance text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground min-[390px]:text-[2.55rem] sm:text-5xl md:text-[4rem]">
            AI Growth Audit
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.6] text-muted-foreground/90 sm:mt-5 sm:text-lg sm:leading-relaxed md:mx-0">
            A focused diagnostic for founder-led businesses that want to find
            growth bottlenecks, AI opportunities, marketing gaps, website
            issues, CRM leakages, and reporting blind spots.
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2.5 sm:mt-7 sm:flex-row md:mx-0 md:mt-9">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta source="ai_growth_audit_hero" />
          </div>
        </div>

        <GlassCard className="p-3 sm:p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between border-b border-hairline/70 pb-3 sm:mb-4 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Audit command view
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                Growth system leakage scan
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary">
              Live
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {[
              ["Time leakage", "Manual reporting"],
              ["Lead leakage", "CRM follow-up gaps"],
              ["Visibility gap", "Website + search"],
              ["AI opportunity", "Workflow automation"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2.5 rounded-[0.8rem] border border-hairline/70 bg-background/30 px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-3"
              >
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/75">
                  {label}
                </span>
                <span className="text-right text-[0.8125rem] font-semibold text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function WhatItSolvesSection() {
  return (
    <section className="section-mid relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="What it solves"
          title="Before you invest more in marketing, find the system gaps."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {solvedGaps.map((gap, index) => (
            <GlassCard key={gap} className="px-3 py-2.5 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.07] font-mono text-[0.625rem] text-primary min-[390px]:flex sm:h-8 sm:w-8 sm:text-[0.6875rem]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[0.8125rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[0.9375rem]">
                  {gap}
                </h3>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function AuditCoverageSection() {
  return (
    <section className="section-bronze relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Audit coverage"
          title="A complete diagnostic across your growth system."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {auditCoverage.map((item) => (
            <GlassCard key={item.title} className="p-3.5 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <IconBox icon={item.icon} />
                <h3 className="pt-1 text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {item.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function DeliverablesSection() {
  return (
    <section className="section-graphite relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Deliverables"
          title="What you get at the end of the audit."
        />
        <GlassCard className="p-3.5 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item) => (
              <div
                key={item}
                className="flex min-w-0 items-center gap-3 rounded-[0.875rem] border border-hairline/70 bg-background/30 px-3.5 py-3"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[0.8125rem] font-medium leading-snug text-foreground/90 md:text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function ScorecardSection() {
  return (
    <section className="section-mid relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Scorecard preview"
          title="Sample Scorecard Preview"
          text="A premium diagnostic snapshot of where growth visibility, AI maturity, and operational discipline need attention."
          center
        />
        <GlassCard className="mx-auto max-w-4xl p-3.5 sm:p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between border-b border-hairline/70 pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Founder scorecard
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Priority readout
              </h3>
            </div>
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            {scorecard.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[0.9rem] border border-hairline/70 bg-background/30 p-3.5"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <metric.icon className="h-4 w-4 shrink-0 text-primary/85" />
                    <span className="truncate text-[0.8125rem] font-semibold text-foreground">
                      {metric.label}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {metric.value}
                    <span className="text-muted-foreground/65">{metric.suffix}</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/45">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/45 via-primary/75 to-foreground/45"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[0.95rem] border border-primary/20 bg-primary/[0.055] p-4">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
              Priority action
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
              Fix lead tracking and automate weekly reporting
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function WhoItIsForSection() {
  return (
    <section className="section-espresso relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Who it is for"
          title="Built for businesses ready to grow with more clarity."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {idealFor.map((item) => (
            <GlassCard key={item} className="px-3 py-2.5 sm:p-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Target className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                <h3 className="text-[0.8125rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[0.9375rem]">
                  {item}
                </h3>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="section-graphite relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Process" title="How the audit works." />
        <div className="grid grid-cols-1 gap-0 md:grid-cols-4 md:gap-4">
          {processSteps.map((step, index) => (
            <div key={step.title} className="min-w-0">
              <div className="flex min-h-14 items-center gap-3 rounded-[0.9rem] border border-primary/18 bg-card/86 px-3 py-2 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl md:block md:min-h-36 md:border-hairline md:p-5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.625rem] text-[var(--secondary-accent)] md:mb-4 md:h-9 md:w-9 md:text-[0.75rem]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground md:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-[0.75rem] leading-snug text-muted-foreground/90 md:mt-3 md:line-clamp-none md:text-[0.8125rem] md:leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < processSteps.length - 1 ? (
                <div className="ml-6 h-2.5 w-px bg-primary/20 md:hidden" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CommercialSection() {
  return (
    <section className="section-bronze relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-6xl gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.46fr)] md:items-center md:gap-8">
        <GlassCard className="p-4 sm:p-7 md:p-9">
          <SectionHeader
            eyebrow="Commercial"
            title="Start with diagnosis before execution."
            text="Most businesses jump into campaigns, websites, AI tools, or CRM systems without first identifying the real growth bottleneck. The AI Growth Audit gives you a clear starting point before investing further."
          />
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta source="ai_growth_audit_commercial" />
          </div>
        </GlassCard>
        <GlassCard className="p-4 sm:p-7">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
            Starting from
          </p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            ₹50,000
          </p>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground/85 md:text-sm">
            Final scope depends on business size, number of systems reviewed,
            and depth of analysis required.
          </p>
        </GlassCard>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section-cta-glow relative px-3 pb-10 pt-6 sm:px-4 sm:pb-24 sm:pt-12 md:pb-32">
      <div className="cta-glass-panel relative mx-auto max-w-3xl overflow-hidden rounded-[1.15rem] border border-hairline px-4 py-7 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-16 md:px-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="relative z-10">
          <p className="mb-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
            Next step
          </p>
          <h2 className="text-balance text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.4rem]">
            Ready to see where your growth system is leaking?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
            Start the AI Growth Diagnostic and receive a clearer view of your
            bottlenecks, AI opportunities, and recommended next step.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta source="ai_growth_audit_final_cta" />
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground/70">
            <Route className="h-3.5 w-3.5 text-primary/75" />
            Diagnosis first. Execution second.
          </p>
        </div>
      </div>
    </section>
  )
}
