import type { LucideIcon } from "lucide-react"
import {
  ContactRound,
  LayoutDashboard,
  Sparkles,
  GitBranch,
  LineChart,
  Workflow,
} from "lucide-react"

type SystemCard = {
  title: string
  description: string
  bullets: readonly string[]
  icon: LucideIcon
}

const systems: readonly SystemCard[] = [
  {
    title: "AI Implementation & Automation",
    description:
      "AI workflows, automation systems, internal copilots, customer support flows, reporting automation, and team productivity systems.",
    bullets: [
      "AI workflows",
      "Internal copilots",
      "Support and reporting automation",
      "Team productivity systems",
    ],
    icon: Sparkles,
  },
  {
    title: "Brand Strategy & Positioning",
    description:
      "Brand clarity, positioning, narrative, messaging, communication pillars, and premium market differentiation.",
    bullets: [
      "Positioning strategy",
      "Narrative architecture",
      "Messaging systems",
      "Premium differentiation",
    ],
    icon: ContactRound,
  },
  {
    title: "Digital Marketing & Performance Growth",
    description:
      "Campaign strategy, Meta, Google, LinkedIn, funnel planning, retargeting, content systems, and performance reporting.",
    bullets: [
      "Campaign strategy",
      "Performance funnels",
      "Retargeting systems",
      "Growth reporting",
    ],
    icon: LineChart,
  },
  {
    title: "Website, SEO, AEO & GEO",
    description:
      "Conversion-focused websites, search visibility, AI search readiness, landing pages, structured content, and lead capture.",
    bullets: [
      "Conversion websites",
      "SEO and AI search readiness",
      "Landing page systems",
      "Structured lead capture",
    ],
    icon: GitBranch,
  },
  {
    title: "Market Research & Business Intelligence",
    description:
      "Competitor analysis, category research, customer insights, market opportunity mapping, and strategic intelligence reports.",
    bullets: [
      "Competitor analysis",
      "Category research",
      "Customer insight systems",
      "Opportunity mapping",
    ],
    icon: LayoutDashboard,
  },
  {
    title: "CRM, Dashboards & Sales Enablement",
    description:
      "Lead tracking, CRM flows, sales scripts, dashboards, executive summaries, and follow-up systems.",
    bullets: [
      "Lead tracking",
      "CRM flows",
      "Executive dashboards",
      "Follow-up systems",
    ],
    icon: Workflow,
  },
] as const

export function StrategicSystemsWeBuildSection() {
  return (
    <section
      className="relative border-y border-hairline/70 bg-gradient-to-b from-background via-section-tint/40 to-background px-3 py-10 sm:px-4 sm:py-24 md:py-32"
      aria-labelledby="strategic-systems-we-build-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div
        className="pointer-events-none absolute left-[8%] top-[22%] h-[min(52vw,380px)] w-[min(52vw,380px)] rounded-full bg-primary/[0.04] blur-[100px] motion-reduce:opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[12%] right-[6%] h-[min(48vw,340px)] w-[min(48vw,340px)] rounded-full bg-ring/[0.055] blur-[90px] motion-reduce:opacity-80"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto mb-7 max-w-3xl text-center sm:mb-12 md:mb-20 md:text-left">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/80">
            Growth architecture
          </p>
          <h2
            id="strategic-systems-we-build-heading"
            className="text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-foreground md:text-[2.35rem]"
          >
            Strategic systems we build.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:mx-0 md:text-lg md:leading-relaxed">
            PxlBrief does not treat AI, marketing, branding, websites, CRM, and
            dashboards as separate activities. We connect them into one
            structured growth system.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {systems.map((item) => (
            <article
              key={item.title}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.125rem] border border-hairline bg-card/95 p-4 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7 dark:bg-card/[0.38] md:p-8 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/28 motion-safe:hover:shadow-[var(--shadow-card-hover),0_0_0_1px_var(--glow-ambient)] motion-reduce:hover:translate-y-0"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-ring/[0.08] opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-100"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-ring/[0.04] opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                aria-hidden
              />

              <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[0.625rem] border border-primary/22 bg-primary/[0.08] text-primary shadow-sm transition-all duration-500 group-hover:border-primary/38 group-hover:bg-primary/[0.12] group-hover:shadow-[0_0_28px_-6px_var(--glow-primary)] sm:mb-6 sm:h-12 sm:w-12">
                  <item.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-[1.0625rem]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 sm:mt-3 md:text-sm md:leading-relaxed">
                  {item.description}
                </p>

                <ul
                  className="mt-4 space-y-2 border-t border-hairline/50 pt-4 sm:mt-6 sm:space-y-2.5 sm:pt-6"
                  aria-label={`${item.title} capabilities`}
                >
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-[0.8125rem] leading-snug text-muted-foreground/95 md:text-sm"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/50 ring-1 ring-primary/15"
                        aria-hidden
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
