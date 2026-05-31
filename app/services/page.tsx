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
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Services | PxlBrief",
  description:
    "AI growth consulting services across AI implementation, brand strategy, digital marketing, websites, SEO, AEO, GEO, CRM, dashboards, and business intelligence.",
})

const stackLayers = [
  "AI Layer",
  "Brand Layer",
  "Marketing Layer",
  "Website & Search Layer",
  "Intelligence Layer",
  "CRM & Sales Layer",
] as const

const principles = [
  {
    title: "Diagnose the bottleneck",
    description:
      "Find where growth is blocked before investing in more tools, campaigns, or content.",
    icon: Gauge,
  },
  {
    title: "Build the right system",
    description:
      "Install the missing operating layer across AI, brand, marketing, website, CRM, or reporting.",
    icon: Layers3,
  },
  {
    title: "Optimize with intelligence",
    description:
      "Use dashboards, reviews, automation, and market signals to improve the system over time.",
    icon: Radar,
  },
] as const

const services = [
  {
    id: "ai",
    shortLabel: "AI",
    title: "AI Implementation & Automation",
    problem:
      "Teams are spending too much time on repetitive work, manual reporting, follow-ups, research, content, and customer communication.",
    build:
      "AI workflows, automation systems, internal copilots, prompt systems, SOPs, customer support flows, reporting automation, and productivity systems.",
    useCases: [
      "AI opportunity audit",
      "AI workflow mapping",
      "AI chatbot or intake assistant",
      "AI reporting automation",
      "AI content workflow",
      "AI sales follow-up support",
    ],
    outcome:
      "Reduced manual workload, faster execution, better team productivity, and structured AI adoption.",
    icon: Brain,
  },
  {
    id: "brand",
    shortLabel: "Brand",
    title: "Brand Strategy & Positioning",
    problem:
      "The brand sounds generic, lacks differentiation, and does not communicate why customers should choose it.",
    build:
      "Brand positioning, brand story, communication pillars, messaging framework, tone of voice, product/service positioning, and premium narrative.",
    useCases: [
      "Brand positioning sprint",
      "Founder-led brand story",
      "Repositioning strategy",
      "Product/service messaging",
      "Campaign messaging framework",
    ],
    outcome:
      "Sharper market differentiation, stronger perception, clearer communication, and better marketing consistency.",
    icon: Sparkles,
  },
  {
    id: "marketing",
    shortLabel: "Marketing",
    title: "Digital Marketing & Performance Growth",
    problem:
      "Marketing is active but scattered, campaigns lack structure, and performance is not clearly connected to business outcomes.",
    build:
      "Campaign architecture, Meta/Google/LinkedIn strategy, funnel planning, retargeting, content systems, performance reporting, and growth reviews.",
    useCases: [
      "90-day digital growth roadmap",
      "Campaign strategy",
      "Performance marketing setup",
      "Local radius campaigns",
      "Social media content system",
      "Retargeting structure",
    ],
    outcome:
      "More structured marketing, better lead generation, clearer campaign performance, and stronger growth visibility.",
    icon: LineChart,
  },
  {
    id: "website",
    shortLabel: "Website",
    title: "Website, SEO, AEO & GEO",
    problem:
      "The website does not convert, search visibility is weak, and the brand is not prepared for AI-powered search discovery.",
    build:
      "Conversion-focused websites, landing pages, SEO structure, AEO readiness, GEO strategy, FAQ systems, content architecture, and lead capture flows.",
    useCases: [
      "Website strategy and development",
      "Website conversion audit",
      "SEO foundation",
      "AEO/GEO readiness",
      "Landing page system",
      "Local SEO and Google Business Profile",
    ],
    outcome:
      "Higher digital credibility, better search visibility, stronger conversion flow, and improved lead capture.",
    icon: Search,
  },
  {
    id: "research",
    shortLabel: "Research",
    title: "Market Research & Business Intelligence",
    problem:
      "Important business, marketing, product, and expansion decisions are being made without enough structured insight.",
    build:
      "Competitor analysis, market research, category mapping, customer personas, pricing intelligence, opportunity reports, and strategic insight dashboards.",
    useCases: [
      "Competitor benchmarking",
      "Market opportunity mapping",
      "Customer persona study",
      "Category intelligence report",
      "Geo-market analysis",
      "Digital competitor audit",
    ],
    outcome:
      "Better strategic decisions, sharper positioning, stronger market understanding, and clearer growth opportunities.",
    icon: Radar,
  },
  {
    id: "crm",
    shortLabel: "CRM",
    title: "CRM, Dashboards & Sales Enablement",
    problem:
      "Leads are getting lost, follow-ups are inconsistent, sales visibility is weak, and reporting does not produce decisions.",
    build:
      "CRM structure, lead pipeline, sales stages, WhatsApp/email follow-up flows, dashboards, executive reports, sales scripts, and enablement assets.",
    useCases: [
      "CRM setup",
      "Lead tracking dashboard",
      "Sales pipeline design",
      "Follow-up automation planning",
      "Executive dashboard",
      "Sales enablement content",
    ],
    outcome:
      "Cleaner lead management, better follow-up discipline, stronger sales visibility, and founder-ready reporting.",
    icon: Workflow,
  },
] as const

const entryOffers = [
  {
    title: "AI Growth Audit",
    description: "Best for businesses that need clarity before execution.",
    cta: "View AI Growth Audit",
    href: "/ai-growth-audit",
    icon: Gauge,
  },
  {
    title: "AI Lab Tools",
    description:
      "Best for a directional preview of readiness, service fit, and productivity leakage.",
    cta: "Explore AI Lab",
    href: "/ai-lab",
    icon: Brain,
  },
] as const

const systemFlow = [
  "AI audit",
  "Brand clarity",
  "Website/search foundation",
  "Campaign system",
  "CRM/dashboard",
  "Optimization loop",
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
      className="pxl-mobile-primary-cta inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/35 bg-gradient-to-b from-primary via-primary/95 to-primary/82 px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_18px_48px_-24px_var(--glow-primary)] transition-all duration-500 hover:border-primary/48 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.26),0_24px_58px_-20px_var(--glow-primary)] active:scale-[0.985] sm:w-auto"
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
      className="pxl-mobile-secondary-cta inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/28 bg-primary/[0.055] px-6 py-3.5 text-sm font-semibold tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all duration-500 hover:border-primary/44 hover:bg-primary/10 sm:w-auto"
    >
      {children}
    </Link>
  )
}

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <InfrastructureSection />
      <ServiceSystemsSection />
      <EntryOffersSection />
      <ConnectionFlowSection />
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
            SERVICES
          </p>
          <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground min-[390px]:text-[2.45rem] sm:text-5xl md:text-[4rem]">
            AI growth systems for businesses ready to scale smarter.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.6] text-muted-foreground/90 sm:mt-5 sm:text-lg sm:leading-relaxed md:mx-0">
            PxlBrief connects AI implementation, brand strategy, digital
            marketing, websites, CRM, dashboards, and business intelligence into
            one structured growth system.
          </p>
          <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2.5 sm:mt-7 sm:flex-row md:mx-0 md:mt-9">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta href="/ai-growth-audit">View AI Growth Audit</SecondaryCta>
          </div>
        </div>

        <GlassCard className="p-3 sm:p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between border-b border-hairline/70 pb-3 sm:mb-4 sm:pb-4">
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                Growth Systems Stack
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                Connected operating layers
              </p>
            </div>
            <Layers3 className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {stackLayers.map((layer, index) => (
              <div
                key={layer}
                className="flex min-w-0 items-center gap-2.5 rounded-[0.8rem] border border-hairline/70 bg-background/30 px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.07] font-mono text-[0.625rem] text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 text-[0.8125rem] font-semibold text-foreground">
                  {layer}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function InfrastructureSection() {
  return (
    <section className="section-bronze relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] pxl-data-grid md:opacity-[0.18]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Service architecture"
          title="Not isolated services. Connected growth infrastructure."
          text="Most businesses treat AI, marketing, branding, websites, CRM, and reporting as separate activities. PxlBrief connects them into one operating system for growth."
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

function ServiceSystemsSection() {
  return (
    <section className="section-graphite relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Six service pillars"
          title="The six systems we build."
          text="Each pillar can stand alone, but the highest leverage comes when they operate as one connected growth system."
        />
        <div className="mb-3 flex gap-1.5 overflow-x-auto rounded-[0.95rem] border border-hairline bg-card/84 p-1.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl [-webkit-overflow-scrolling:touch] dark:bg-card/[0.34] sm:mb-6 sm:grid sm:grid-cols-6 sm:gap-2 sm:rounded-[1.1rem] sm:p-2">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#service-${service.id}`}
              className="min-w-max touch-manipulation rounded-[0.75rem] border border-transparent bg-transparent px-3 py-2 text-center text-[0.75rem] font-semibold tracking-tight text-muted-foreground transition-all duration-300 [-webkit-tap-highlight-color:transparent] hover:border-primary/18 hover:bg-primary/[0.065] hover:text-foreground sm:min-w-0 sm:px-3 sm:py-3 sm:text-sm"
            >
              {service.shortLabel}
            </a>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
          {services.map((service, index) => (
            <details
              key={service.title}
              id={`service-${service.id}`}
              open={index === 0}
              className="group relative scroll-mt-24 overflow-hidden rounded-[0.95rem] border border-hairline bg-card/86 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34] sm:rounded-[1.125rem]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 hidden h-40 w-40 rounded-full bg-primary/[0.07] blur-2xl sm:block" />
              <summary className="relative z-10 flex cursor-pointer list-none items-start gap-2.5 px-3 py-3 outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-primary/[0.035] focus-visible:ring-2 focus-visible:ring-ring/35 group-open:border-b group-open:border-hairline/70 sm:gap-3 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                <IconBox icon={service.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/80">
                      System {String(index + 1).padStart(2, "0")}
                    </p>
                    <span className="shrink-0 rounded-full border border-primary/18 bg-primary/[0.06] px-2 py-0.5 text-[0.625rem] font-semibold text-primary/90">
                      {index === 0 ? "Open" : "View"}
                    </span>
                  </div>
                  <h3 className="mt-1 text-balance text-[0.9375rem] font-semibold leading-tight tracking-tight text-foreground sm:mt-1.5 sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-1 text-[0.75rem] leading-snug text-muted-foreground/88 sm:mt-2 sm:line-clamp-2 md:text-sm">
                    {service.outcome}
                  </p>
                </div>
              </summary>
              <div className="relative z-10 grid gap-2 px-3 py-3 sm:gap-3.5 sm:px-6 sm:py-5">
                <ServiceBlock label="Problem" text={service.problem} />
                <ServiceBlock label="What we build" text={service.build} />
                <div className="border-l border-primary/18 pl-3 sm:rounded-[0.9rem] sm:border sm:border-hairline/70 sm:bg-background/30 sm:p-3.5">
                  <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 sm:mb-3">
                    Use cases
                  </p>
                  <div className="grid gap-1 sm:grid-cols-2 sm:gap-2">
                    {service.useCases.map((useCase) => (
                      <div key={useCase} className="flex min-w-0 items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-[0.8125rem] leading-relaxed text-foreground/88">
                          {useCase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <ServiceBlock label="Outcome" text={service.outcome} highlight />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceBlock({
  label,
  text,
  highlight = false,
}: {
  label: string
  text: string
  highlight?: boolean
}) {
  return (
    <div
      className={`border-l py-0.5 pl-3 sm:rounded-[0.9rem] sm:border sm:p-3.5 ${
        highlight
          ? "border-primary/35 sm:border-primary/22 sm:bg-primary/[0.055]"
          : "border-hairline/70 sm:bg-background/30"
      }`}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
        {label}
      </p>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground/92 sm:mt-2 md:text-sm">
        {text}
      </p>
    </div>
  )
}

function EntryOffersSection() {
  return (
    <section className="section-mid relative border-y border-hairline/70 px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Recommended entry"
          title="Where most clients start."
          center
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {entryOffers.map((offer) => (
            <GlassCard key={offer.title} className="p-3.5 sm:p-5">
              <IconBox icon={offer.icon} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {offer.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                {offer.description}
              </p>
              <Link
                href={offer.href}
                className="mt-5 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/26 bg-primary/[0.075] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.11]"
              >
                {offer.cta}
              </Link>
            </GlassCard>
          ))}
          <GlassCard className="p-3.5 sm:p-5">
            <IconBox icon={Target} />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Strategic Session
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
              Best for founders who want to discuss growth priorities directly.
            </p>
            <StrategicSessionBookingLink
              source="services_entry_offer"
              className="mt-5 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/26 bg-primary/[0.075] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.11]"
            >
              Book Strategic Session
            </StrategicSessionBookingLink>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

function ConnectionFlowSection() {
  return (
    <section className="section-bronze relative px-3 py-8 sm:px-4 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Connected system"
          title="How the systems connect."
          text="The strongest growth systems are not built from isolated vendors. They are built by connecting strategy, execution, automation, and intelligence."
          center
        />
        <GlassCard className="p-3 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-6 md:gap-3">
            {systemFlow.map((step, index) => (
              <div key={step} className="min-w-0">
                <div className="flex min-h-14 items-center gap-3 rounded-[0.85rem] border border-primary/18 bg-background/30 px-3 py-2 md:block md:min-h-32 md:rounded-[0.9rem] md:border-hairline/70 md:p-3.5">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/22 bg-primary/[0.08] font-mono text-[0.625rem] text-[var(--secondary-accent)] sm:h-8 sm:w-8 sm:text-[0.6875rem] md:mb-3">
                    {index + 1}
                  </span>
                  <h3 className="min-w-0 text-[0.8125rem] font-semibold leading-snug tracking-tight text-foreground sm:text-[0.875rem]">
                    {step}
                  </h3>
                </div>
                {index < systemFlow.length - 1 ? (
                  <div className="ml-6 h-2.5 w-px bg-primary/20 md:hidden" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-[0.95rem] border border-primary/20 bg-primary/[0.055] p-3 sm:mt-5 sm:p-4">
            <div className="flex items-start gap-3">
              <Route className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[0.875rem] leading-relaxed text-foreground/90 md:text-base">
                Audit first, clarify the brand, strengthen website and search,
                build the campaign system, connect CRM and dashboards, then
                optimize from live business intelligence.
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
    <section className="section-cta-glow relative px-3 pb-10 pt-6 sm:px-4 sm:pb-24 sm:pt-12 md:pb-32">
      <div className="cta-glass-panel relative mx-auto max-w-3xl overflow-hidden rounded-[1.15rem] border border-hairline px-4 py-7 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-16 md:px-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="relative z-10">
          <p className="mb-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
            Next step
          </p>
          <h2 className="text-balance text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-[2.4rem]">
            Ready to build a smarter growth system?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.875rem] leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem] md:mt-6 md:text-lg">
            Start with the AI Growth Diagnostic and identify which system your
            business needs first.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <PrimaryCta>Discuss With PxlBrief AI</PrimaryCta>
            <SecondaryCta href="/ai-lab">Explore AI Lab</SecondaryCta>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground/70">
            <BarChart3 className="h-3.5 w-3.5 text-primary/75" aria-hidden />
            Strategy, execution, automation, and intelligence in one system.
          </p>
        </div>
      </div>
    </section>
  )
}
