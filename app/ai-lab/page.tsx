import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  CheckCircle2,
  Gauge,
  LockKeyhole,
  Route,
  Workflow,
} from "lucide-react"
import { AILabTools } from "@/components/ai-lab-tools"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/ai-lab",
  title: "AI Lab | PxlBrief",
  description:
    "Explore AI-powered diagnostic, service recommendation, and productivity tools from PxlBrief.",
})

const consoleItems = [
  { label: "Diagnostic Engine", status: "Live", tone: "live" },
  { label: "Growth Scorecard", status: "Live", tone: "live" },
  { label: "Service Recommender", status: "Live", tone: "live" },
  { label: "ROI Calculator", status: "Live", tone: "live" },
  { label: "Campaign Intelligence", status: "Live", tone: "live" },
  { label: "Brand Positioning Engine", status: "Live", tone: "live" },
] as const

const principles = [
  {
    title: "Diagnose before execution",
    description:
      "See the constraint before adding more tools, campaigns, or dashboards.",
    icon: Gauge,
  },
  {
    title: "Recommend the right system",
    description:
      "Match business context to the service that should come first.",
    icon: Route,
  },
  {
    title: "Convert insight into action",
    description:
      "Turn directional intelligence into a practical next step for growth.",
    icon: Workflow,
  },
] as const

const revealCards = [
  "Where your business is leaking time",
  "Where your marketing system is disconnected",
  "Where AI can create leverage",
  "Which service should come first",
  "What to discuss in the diagnostic call",
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

export default function AILabPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <PrinciplesSection />
      <ToolsSection />
      <RevealsSection />
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

      <div className="relative mx-auto grid max-w-6xl gap-5 sm:gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.75fr)] md:items-center md:gap-12">
        <div className="min-w-0 text-center md:text-left">
          <p className="mx-auto mb-3 inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary/90 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl sm:mb-4 md:mx-0">
            AI LAB
          </p>
          <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground min-[390px]:text-[2.45rem] sm:text-5xl md:text-[4rem]">
            Explore the intelligence systems behind smarter growth.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.6] text-muted-foreground/90 sm:mt-5 sm:text-lg sm:leading-relaxed md:mx-0">
            A live preview of how PxlBrief turns business inputs into scores,
            recommendations, automation priorities, and growth system decisions.
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2.5 sm:mt-7 sm:flex-row md:mx-0 md:mt-9">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta href="#lab-tools">Explore Tools</SecondaryCta>
          </div>
        </div>

        <GlassCard className="p-3 sm:p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between border-b border-hairline/70 pb-3 sm:mb-4 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                AI Lab Console
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                Business intelligence tools
              </p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary">
              Live
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {consoleItems.map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 items-center justify-between gap-2.5 rounded-[0.8rem] border border-hairline/70 bg-background/30 px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-3"
              >
                <span className="min-w-0 truncate text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/75">
                  {item.label}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold ${
                    item.tone === "live"
                      ? "border-primary/22 bg-primary/[0.07] text-primary"
                      : "border-hairline bg-foreground/[0.035] text-muted-foreground"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="section-graphite relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.18]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Decision intelligence"
          title="AI tools designed for business decisions, not gimmicks."
          text="Each tool in the AI Lab is designed to help founders understand where growth is blocked, what system is missing, and what action should come next."
          center
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {principles.map((principle) => (
            <GlassCard key={principle.title} className="p-3.5 sm:p-5">
              <IconBox icon={principle.icon} />
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {principle.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {principle.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolsSection() {
  return (
    <section
      id="lab-tools"
      className="section-mid relative scroll-mt-20 px-3 py-8 sm:px-4 sm:py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Interactive tools"
          title="Choose an AI Lab tool."
          text="Use these directional tools to pressure-test readiness, service fit, and productivity leverage before a deeper diagnostic."
        />
        <AILabTools />
      </div>
    </section>
  )
}

function RevealsSection() {
  return (
    <section className="section-graphite relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="What these tools reveal"
          title="A clearer view of the system behind growth."
          center
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
          {revealCards.map((item, index) => (
            <GlassCard key={item} className="px-3 py-2.5 sm:p-5">
              <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.625rem] text-[var(--secondary-accent)] sm:mb-4 sm:h-8 sm:w-8 sm:text-[0.6875rem]">
                {index + 1}
              </span>
              <h3 className="text-[0.8125rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[0.9375rem]">
                {item}
              </h3>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section-cta-glow relative px-3 pb-10 pt-6 sm:px-4 sm:pb-24 sm:pt-12 md:pb-32">
      <div className="relative mx-auto grid max-w-6xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] md:items-stretch">
        <div className="cta-glass-panel relative min-w-0 overflow-hidden rounded-[1.15rem] border border-hairline px-4 py-7 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-14 md:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
          <div className="relative z-10">
            <p className="mb-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
              Full diagnosis
            </p>
            <h2 className="text-balance text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.4rem]">
              Want the full diagnosis?
            </h2>
            <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
              The AI Lab gives you a directional preview. The AI Growth Audit
              gives you a structured review across AI, marketing, website, CRM,
              dashboards, and sales systems.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
              <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
              <SecondaryCta href="/ai-growth-audit">View AI Growth Audit</SecondaryCta>
            </div>
          </div>
        </div>
        <GlassCard className="p-4 sm:p-7">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <LockKeyhole className="h-5 w-5 text-primary" aria-hidden />
              <p className="mt-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Diagnostic depth
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Directional tools become implementation priorities.
              </h3>
            </div>
            <div className="space-y-2.5">
              {[
                "AI opportunity map",
                "Growth gap analysis",
                "30-60-90 day roadmap",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-[0.8125rem] font-medium text-foreground/90">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
