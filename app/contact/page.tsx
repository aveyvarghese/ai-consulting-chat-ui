import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers3,
  Mail,
  MessageSquareText,
  Radar,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Start Diagnostic | PxlBrief",
  description:
    "Start with PxlBrief's AI-powered growth diagnostic for founder-led businesses looking to identify AI, marketing, website, CRM, and sales system gaps.",
})

const intakeSignals = [
  "Context captured",
  "Growth bottleneck identified",
  "Service fit recommended",
  "Strategic brief prepared",
  "Next step routed",
] as const

const diagnosisCards = [
  {
    title: "Understand the real bottleneck",
    description:
      "Separate symptoms from the system issue holding back leads, conversion, follow-up, team speed, or decision clarity.",
    icon: Gauge,
  },
  {
    title: "Avoid random execution",
    description:
      "Do not jump into tools, ads, content, dashboards, or automation before the priority gap is clear.",
    icon: Target,
  },
  {
    title: "Recommend the right first system",
    description:
      "Route attention toward the first growth layer most likely to unlock momentum for the business.",
    icon: Route,
  },
] as const

const intakeFields = [
  { title: "Business type", icon: Layers3 },
  { title: "Current challenge", icon: MessageSquareText },
  { title: "AI usage level", icon: Brain },
  { title: "Marketing maturity", icon: BarChart3 },
  { title: "Website and CRM status", icon: Workflow },
  { title: "Growth priority", icon: Target },
  { title: "Contact details", icon: Mail },
  { title: "Urgency", icon: Clock3 },
] as const

const processSteps = [
  "Your context is reviewed",
  "A strategic brief is generated",
  "Your fit is classified",
  "The right next step is recommended",
  "A follow-up is scheduled if relevant",
] as const

const fitEngagements = [
  {
    title: "AI Growth Audit",
    description: "A focused diagnostic across AI, marketing, website, CRM, sales, and reporting gaps.",
    icon: Gauge,
  },
  {
    title: "AI Workflow Implementation",
    description: "Practical automation, AI workflow mapping, prompt systems, and productivity layers.",
    icon: Brain,
  },
  {
    title: "Website, SEO, AEO & GEO System",
    description: "Conversion structure, search readiness, AI-search visibility, and lead capture flows.",
    icon: Search,
  },
  {
    title: "CRM & Dashboard Setup",
    description: "Lead tracking, pipeline visibility, follow-up systems, and founder-ready reporting.",
    icon: Workflow,
  },
  {
    title: "Brand Positioning Sprint",
    description: "Sharper market differentiation, messaging, founder narrative, and premium clarity.",
    icon: Sparkles,
  },
  {
    title: "Monthly AI Growth Partner",
    description: "Ongoing strategic support to improve campaigns, systems, intelligence, and execution.",
    icon: Radar,
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

function BookingCta({
  source,
  children = "Book Strategic Session",
}: {
  source: string
  children?: ReactNode
}) {
  return (
    <StrategicSessionBookingLink
      source={source}
      className="inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/28 bg-primary/[0.055] px-6 py-3.5 text-sm font-semibold tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all duration-500 hover:border-primary/44 hover:bg-primary/10 sm:w-auto"
    >
      {children}
    </StrategicSessionBookingLink>
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

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <DiagnosisSection />
      <IntakeCaptureSection />
      <BeginOptionsSection />
      <AfterSubmitSection />
      <BestFitSection />
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
            START DIAGNOSTIC
          </p>
          <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground min-[390px]:text-[2.45rem] sm:text-5xl md:text-[4rem]">
            Begin with the right growth question.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.6] text-muted-foreground/90 sm:mt-5 sm:text-lg sm:leading-relaxed md:mx-0">
            Share your business context through PxlBrief's AI-powered intake.
            The system helps identify your growth bottleneck, AI opportunity,
            and recommended next step before a deeper strategic conversation.
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2.5 sm:mt-7 sm:flex-row md:mx-0 md:mt-9">
            <PrimaryCta>Run My Growth Diagnostic</PrimaryCta>
            <BookingCta source="start_diagnostic_hero" />
          </div>
        </div>

        <GlassCard className="p-3 sm:p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between border-b border-hairline/70 pb-3 sm:mb-4 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Intake Intelligence
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                From signal to next step
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {intakeSignals.map((signal, index) => (
              <div
                key={signal}
                className="flex min-w-0 items-center gap-2.5 rounded-[0.8rem] border border-hairline/70 bg-background/30 px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.07] font-mono text-[0.625rem] text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 text-[0.8125rem] font-semibold text-foreground">
                  {signal}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function DiagnosisSection() {
  return (
    <section className="section-mid relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.18]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="First principle"
          title="Why start with diagnosis?"
          text="Most businesses approach consultants with symptoms: low leads, weak campaigns, poor follow-up, slow teams, or scattered AI usage. PxlBrief starts by identifying the system issue behind the symptom."
          center
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {diagnosisCards.map((card) => (
            <GlassCard key={card.title} className="px-3.5 py-3 sm:p-5">
              <IconBox icon={card.icon} />
              <h3 className="mt-4 text-balance text-base font-semibold tracking-tight text-foreground">
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

function IntakeCaptureSection() {
  return (
    <section className="section-graphite relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Intake signals"
          title="What the AI intake captures."
          center
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {intakeFields.map((field) => (
            <GlassCard key={field.title} className="px-3.5 py-3 sm:p-5">
              <IconBox icon={field.icon} />
              <h3 className="mt-3 text-balance text-[0.8125rem] font-semibold leading-snug text-foreground sm:text-sm">
                {field.title}
              </h3>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function BeginOptionsSection() {
  return (
    <section className="section-bronze relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Entry routes" title="Choose how to begin." center />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
          <GlassCard className="px-3.5 py-3 sm:p-5">
            <IconBox icon={Brain} />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Run My Growth Diagnostic
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
              Best for founders who want a directional readout before speaking.
            </p>
            <div className="mt-5">
              <PrimaryCta>Run My Growth Diagnostic</PrimaryCta>
            </div>
          </GlassCard>

          <GlassCard className="px-3.5 py-3 sm:p-5">
            <IconBox icon={Route} />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Book Strategic Session
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
              Best for serious founders who already know they need strategic support.
            </p>
            <div className="mt-5">
              <BookingCta source="start_diagnostic_options">Book Session</BookingCta>
            </div>
          </GlassCard>

          <GlassCard className="px-3.5 py-3 sm:p-5">
            <IconBox icon={Mail} />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Direct Enquiry
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
              Best for formal requests, partnerships, or existing conversations.
            </p>
            <a
              href="mailto:info@pxlbrief.com"
              className="mt-5 inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center gap-2 rounded-[0.875rem] border border-primary/28 bg-primary/[0.055] px-5 py-3.5 text-sm font-semibold tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all duration-500 hover:border-primary/44 hover:bg-primary/10"
            >
              info@pxlbrief.com
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

function AfterSubmitSection() {
  return (
    <section className="section-mid relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Routing logic"
          title="What happens after you submit."
          center
        />
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-5 sm:gap-3">
          {processSteps.map((step, index) => (
            <div key={step} className="min-w-0">
              <div className="flex min-h-14 items-center gap-3 rounded-[0.85rem] border border-primary/18 bg-card/86 px-3 py-2 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl sm:block sm:min-h-28 sm:rounded-[0.95rem] sm:border-hairline sm:bg-card/86 sm:p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.625rem] text-[var(--secondary-accent)] sm:h-8 sm:w-8 sm:text-[0.6875rem]">
                  {index + 1}
                </span>
                <p className="min-w-0 text-[0.8125rem] font-semibold leading-snug text-foreground sm:mt-4">
                  {step}
                </p>
              </div>
              {index < processSteps.length - 1 ? (
                <div className="ml-6 h-2.5 w-px bg-primary/20 sm:hidden" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BestFitSection() {
  return (
    <section className="section-bronze relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.18]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Service fit" title="Best fit engagements." center />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
          {fitEngagements.map((engagement) => (
            <GlassCard key={engagement.title} className="p-3 sm:p-5">
              <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                <IconBox icon={engagement.icon} />
                <div className="min-w-0">
                  <h3 className="text-balance text-[0.9375rem] font-semibold tracking-tight text-foreground sm:text-base">
                    {engagement.title}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground/90 sm:mt-2 md:text-sm">
                    {engagement.description}
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

function FinalCtaSection() {
  return (
    <section className="section-cta-glow relative overflow-hidden px-3 py-9 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[min(92vw,520px)] w-[min(96vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[82px] md:blur-[128px]" />
        <div className="absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
      </div>
      <GlassCard className="cta-glass-panel mx-auto max-w-5xl p-4 text-center sm:p-8 md:p-12">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.08] text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)]">
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.7} aria-hidden />
        </div>
        <h2 className="mx-auto mt-5 max-w-3xl text-balance text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl md:text-[3.2rem]">
          Ready to find the system gap?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground/90 sm:text-lg">
          Start with the AI Growth Diagnostic and get a clearer view of your
          bottleneck, AI opportunity, and recommended next step.
        </p>
        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-center">
          <PrimaryCta>Run My Growth Diagnostic</PrimaryCta>
          <SecondaryCta href="/ai-lab">Explore AI Lab</SecondaryCta>
        </div>
      </GlassCard>
    </section>
  )
}
