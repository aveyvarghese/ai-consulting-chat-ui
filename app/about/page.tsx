import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Gauge,
  Layers3,
  LineChart,
  Radar,
  Route,
  Search,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About | PxlBrief",
  description:
    "Learn about PxlBrief, an AI growth consulting practice helping founder-led businesses connect AI, brand, marketing, websites, CRM, dashboards, and business intelligence.",
})

const profileItems = [
  ["Strategic depth", "9+ years"],
  ["Brand exposure", "50+ brands influenced / worked with"],
  ["Core lens", "AI + brand + marketing + systems"],
  ["Primary focus", "Founder-led growth infrastructure"],
  ["Method", "Diagnose -> Design -> Deploy -> Optimize"],
] as const

const whyCards = [
  {
    title: "Less scattered execution",
    description:
      "Connect activity across campaigns, website, CRM, sales, and reporting into one operating rhythm.",
    icon: Layers3,
  },
  {
    title: "More decision clarity",
    description:
      "Turn fragmented performance data into founder-ready intelligence and clearer next actions.",
    icon: Radar,
  },
  {
    title: "Smarter AI-led systems",
    description:
      "Use AI where it improves workflows, saves time, supports quality, or strengthens decisions.",
    icon: Brain,
  },
] as const

const philosophyCards = [
  {
    title: "Diagnose before execution",
    description:
      "Do not add more campaigns, tools, or dashboards before identifying the real bottleneck.",
    icon: Gauge,
  },
  {
    title: "AI must serve a workflow",
    description:
      "AI is useful only when it improves a real process, saves time, improves quality, or supports decisions.",
    icon: Brain,
  },
  {
    title: "Brand and performance must connect",
    description:
      "Strong positioning, clear messaging, campaign systems, and lead tracking must work together.",
    icon: Sparkles,
  },
  {
    title: "Dashboards should lead to action",
    description:
      "Reports are not enough. Founders need intelligence that tells them what to fix, scale, or stop.",
    icon: BarChart3,
  },
] as const

const differenceCards = [
  {
    title: "Not a normal digital marketing agency",
    description:
      "PxlBrief does not sell isolated posts, ads, or creatives. It builds connected growth systems.",
  },
  {
    title: "Not a generic AI consultant",
    description:
      "PxlBrief does not stop at tools. It connects AI to marketing, sales, CRM, websites, reporting, and business outcomes.",
  },
  {
    title: "Not just strategy on slides",
    description:
      "PxlBrief converts strategy into implementation roadmaps, workflows, dashboards, and practical execution systems.",
  },
] as const

const capabilities = [
  {
    title: "AI Implementation & Automation",
    description: "Workflow automation, AI use cases, prompt systems, and productivity layers.",
    icon: Brain,
  },
  {
    title: "Brand Strategy & Positioning",
    description: "Sharper differentiation, messaging, narrative, and premium market clarity.",
    icon: Sparkles,
  },
  {
    title: "Digital Marketing & Performance Growth",
    description: "Campaign systems, content direction, retargeting, and performance reviews.",
    icon: LineChart,
  },
  {
    title: "Website, SEO, AEO & GEO",
    description: "Conversion-focused websites, search readiness, AI-search structure, and lead capture.",
    icon: Search,
  },
  {
    title: "Market Research & Business Intelligence",
    description: "Competitor insight, customer intelligence, opportunity mapping, and market clarity.",
    icon: Radar,
  },
  {
    title: "CRM, Dashboards & Sales Enablement",
    description: "Lead tracking, pipeline visibility, dashboards, follow-up systems, and sales assets.",
    icon: Workflow,
  },
] as const

const audiences = [
  "Founder-led SMEs",
  "Startups preparing to scale",
  "Consumer brands",
  "B2B companies",
  "Traditional businesses moving digital",
  "Teams using AI without structure",
] as const

const engagementSteps = [
  "Start AI Growth Diagnostic",
  "Run AI Growth Audit",
  "Identify priority systems",
  "Build or optimize the growth infrastructure",
  "Review performance and improve monthly",
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
          ? "mx-auto mb-8 max-w-3xl text-center sm:mb-12 md:mb-16"
          : "mb-8 max-w-3xl sm:mb-12 md:mb-16"
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
  children: ReactNode
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

function PrimaryCta({ children }: { children: ReactNode }) {
  return (
    <Link
      href="/#consulting-chat"
      className="inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/35 bg-gradient-to-b from-primary via-primary/95 to-primary/82 px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_18px_48px_-24px_var(--glow-primary)] transition-all duration-500 hover:border-primary/48 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.26),0_24px_58px_-20px_var(--glow-primary)] active:scale-[0.985] sm:w-auto"
    >
      {children}
    </Link>
  )
}

function SecondaryCta({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/28 bg-primary/[0.055] px-6 py-3.5 text-sm font-semibold tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all duration-500 hover:border-primary/44 hover:bg-primary/10 sm:w-auto"
    >
      {children}
    </Link>
  )
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <WhySection />
      <PhilosophySection />
      <DifferenceSection />
      <CapabilityStackSection />
      <AudienceSection />
      <EngagementSection />
      <FinalCtaSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="section-hero-dark relative overflow-hidden px-3 pb-9 pt-7 sm:px-4 sm:pb-20 sm:pt-14 md:pb-28 md:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-[min(88vw,420px)] w-[min(96vw,560px)] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[70px] md:top-10 md:h-[680px] md:w-[900px] md:bg-primary/[0.05] md:blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-accent/[0.035] blur-[58px] md:h-96 md:w-96 md:bg-accent/[0.04] md:blur-[118px]" />
        <div className="absolute inset-0 opacity-[0.14] pxl-data-grid md:opacity-[0.22]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-background/35 to-section-tint/50" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.75fr)] md:items-center md:gap-12">
        <div className="min-w-0 text-center md:text-left">
          <p className="mx-auto mb-3 inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary/90 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl sm:mb-4 md:mx-0">
            ABOUT PXLBRIEF
          </p>
          <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground min-[390px]:text-[2.45rem] sm:text-5xl md:text-[4rem]">
            Built for founders who need strategy, systems, and AI leverage.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.6] text-muted-foreground/90 sm:mt-5 sm:text-lg sm:leading-relaxed md:mx-0">
            PxlBrief is led as a senior AI growth consulting practice for
            founder-led businesses that want to connect brand, marketing,
            automation, websites, CRM, dashboards, and intelligence into one
            operating system for growth.
          </p>
          <div className="mx-auto mt-5 flex max-w-xl flex-col gap-2.5 sm:mt-7 sm:flex-row md:mx-0 md:mt-9">
            <PrimaryCta>Start AI Growth Diagnostic</PrimaryCta>
            <SecondaryCta href="/services">View Services</SecondaryCta>
          </div>
        </div>

        <GlassCard className="p-3.5 sm:p-5 md:p-6">
          <div className="mb-3.5 flex items-center justify-between border-b border-hairline/70 pb-3.5 sm:mb-4 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Founder Intelligence Profile
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                Senior consulting lens
              </p>
            </div>
            <Target className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="space-y-2">
            {profileItems.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[0.8rem] border border-hairline/70 bg-background/30 px-3 py-2.5 sm:px-3.5 sm:py-3"
              >
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  {label}
                </p>
                <p className="mt-1 text-[0.8125rem] font-semibold leading-snug text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="section-espresso relative border-y border-hairline/70 px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.18]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Why it exists"
          title="Why PxlBrief exists."
          text="Most growing businesses do not suffer from lack of activity. They suffer from disconnected activity. Marketing runs separately from sales. Websites are disconnected from lead tracking. AI tools are used without process. Reports show numbers but not decisions. PxlBrief exists to connect these moving parts into one intelligent growth system."
          center
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {whyCards.map((card) => (
            <GlassCard key={card.title} className="p-4 sm:p-5">
              <IconBox icon={card.icon} />
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {card.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhilosophySection() {
  return (
    <section className="section-mid relative px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Operating philosophy" title="The consulting philosophy." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {philosophyCards.map((card) => (
            <GlassCard key={card.title} className="p-4 sm:p-5">
              <IconBox icon={card.icon} />
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {card.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function DifferenceSection() {
  return (
    <section className="section-graphite relative border-y border-hairline/70 px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Different by design"
          title="What makes PxlBrief different."
          center
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {differenceCards.map((card, index) => (
            <GlassCard key={card.title} className="p-4 sm:p-5">
              <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.6875rem] text-primary">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {card.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function CapabilityStackSection() {
  return (
    <section className="section-bronze relative px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Capability stack" title="Core capability stack." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <GlassCard key={capability.title} className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <IconBox icon={capability.icon} />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-tight tracking-tight text-foreground">
                    {capability.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                    {capability.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function AudienceSection() {
  return (
    <section className="section-espresso relative border-y border-hairline/70 px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Who it serves"
          title="Who PxlBrief is built for."
          center
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <GlassCard key={audience} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
                  {audience}
                </h3>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function EngagementSection() {
  return (
    <section className="section-graphite relative px-3 py-11 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Engagement path"
          title="How engagements usually begin."
        />
        <GlassCard className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-5 md:gap-3">
            {engagementSteps.map((step, index) => (
              <div key={step} className="min-w-0">
                <div className="rounded-[0.9rem] border border-hairline/70 bg-background/30 p-3.5 md:min-h-32">
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.6875rem] text-primary">
                    {index + 1}
                  </span>
                  <h3 className="text-[0.875rem] font-semibold leading-snug tracking-tight text-foreground">
                    {step}
                  </h3>
                </div>
                {index < engagementSteps.length - 1 ? (
                  <div className="mx-auto h-4 w-px bg-primary/20 md:hidden" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[0.95rem] border border-primary/20 bg-primary/[0.055] p-4">
            <div className="flex items-start gap-3">
              <Route className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[0.875rem] leading-relaxed text-foreground/90 md:text-base">
                The entry point is diagnosis, then the work moves into priority
                systems, implementation, and a monthly optimization cadence.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section-cta-glow relative px-3 pb-14 pt-8 sm:px-4 sm:pb-24 sm:pt-12 md:pb-32">
      <div className="cta-glass-panel relative mx-auto max-w-3xl overflow-hidden rounded-[1.15rem] border border-hairline px-5 py-10 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-16 md:px-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="relative z-10">
          <p className="mb-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
            Next step
          </p>
          <h2 className="text-balance text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.4rem]">
            Ready to build with more intelligence?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
            Start with the AI Growth Diagnostic and understand which growth
            system your business needs first.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <PrimaryCta>Start AI Growth Diagnostic</PrimaryCta>
            <SecondaryCta href="/ai-lab">Explore AI Lab</SecondaryCta>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground/70">
            <Route className="h-3.5 w-3.5 text-primary/75" aria-hidden />
            Diagnosis first. Intelligent systems second.
          </p>
        </div>
      </div>
    </section>
  )
}
