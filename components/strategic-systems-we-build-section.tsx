import type { CSSProperties } from "react"
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
      className="section-bronze relative border-y border-hairline/70 px-3 py-16 sm:px-4 sm:py-24 md:py-32"
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
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-20 md:text-left">
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

        <div className="relative overflow-hidden rounded-[1.35rem] border border-hairline bg-card/70 p-4 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl dark:bg-card/[0.28] sm:rounded-[2rem] sm:p-7 md:p-9">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] pxl-data-grid md:opacity-[0.2]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(72vw,34rem)] w-[min(72vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.065] blur-3xl" />
          <div className="relative z-10 space-y-3 sm:space-y-4">
            {systems.map((item, index) => (
              <article
                key={item.title}
                className="group relative min-w-0 overflow-hidden rounded-[1rem] border border-hairline/80 bg-background/35 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[border-color,background-color,transform] duration-500 hover:border-primary/28 hover:bg-primary/[0.045] md:ml-[calc(var(--layer-offset)*1rem)]"
                style={
                  {
                    "--layer-offset": index,
                  } as CSSProperties
                }
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20" />
                <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[0.34fr_0.66fr] md:items-center md:gap-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] border border-primary/22 bg-primary/[0.08] font-mono text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        {item.title.includes("AI")
                          ? "AI Layer"
                          : item.title.includes("Brand")
                            ? "Brand Layer"
                            : item.title.includes("Marketing")
                              ? "Marketing Layer"
                              : item.title.includes("Website")
                                ? "Website & Search Layer"
                                : item.title.includes("Market")
                                  ? "Intelligence Layer"
                                  : "CRM & Sales Layer"}
                      </p>
                      <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground md:text-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:max-w-[14rem] md:justify-end">
                      {item.bullets.slice(0, 2).map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-primary/14 bg-primary/[0.055] px-2.5 py-1 text-[0.6875rem] font-medium text-primary/90"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
