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
      className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-black px-4 py-20 text-white md:px-8 md:py-28"
      aria-labelledby="strategic-systems-we-build-heading"
    >
      <div
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[80vw] max-h-[550px] w-[80vw] max-w-[550px] rounded-full bg-purple-500/[0.01] blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/3 right-[-10%] h-[80vw] max-h-[550px] w-[80vw] max-w-[550px] rounded-full bg-cyan-500/[0.01] blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl space-y-16">
        <header className="max-w-3xl space-y-3">
          <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
            Growth architecture
          </p>
          <h2
            id="strategic-systems-we-build-heading"
            className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl"
          >
            Strategic systems we build.
          </h2>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
            PxlBrief does not treat AI, marketing, branding, websites, CRM, and
            dashboards as separate activities. We connect them into one
            structured growth system.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {systems.map((item, index) => (
            <article
              key={item.title}
              className="group relative flex flex-col justify-between space-y-6 border-b border-white/10 pb-8 transition-all duration-300 md:last:border-b"
            >
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#ff7f50] to-transparent transition-all duration-500 group-hover:w-1/3"
                aria-hidden
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-600 transition-colors group-hover:text-[#ff7f50]">
                    SYSTEM_PILLAR_0{index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-slate-600 transition-all duration-300 group-hover:border-[#ff7f50]/20 group-hover:text-[#ff7f50]">
                      <item.icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800 transition-all duration-300 group-hover:bg-[#ff7f50] group-hover:shadow-[0_0_8px_rgba(255,127,80,0.6)]" />
                  </div>
                </div>

                <h3 className="text-xl font-black tracking-tight text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 group-hover:bg-clip-text group-hover:text-transparent md:text-2xl">
                  {item.title}
                </h3>
                <p className="text-xs font-light leading-relaxed text-slate-400 md:text-sm">
                  {item.description}
                </p>

                <div className="pt-2">
                  <ul
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                    aria-label={`${item.title} capabilities`}
                  >
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-300"
                      >
                        <span
                          className="font-mono text-[#ff7f50] opacity-40 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        >
                          →
                        </span>
                        <span className="font-light tracking-wide">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
