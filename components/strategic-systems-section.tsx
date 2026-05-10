import {
  Brain,
  Building2,
  Gauge,
  GitBranch,
  Sparkles,
  Workflow,
} from "lucide-react"

const systems = [
  {
    title: "AI Lead Qualification",
    icon: Brain,
    challenge:
      "Volume without signal — teams burn time on conversations that never should have reached a human.",
    approach:
      "Scoring models, routing rules and CRM hooks aligned to how your funnel actually behaves.",
    impact:
      "Cleaner pipeline hygiene, faster handoffs, and reps focused on deals that can close.",
  },
  {
    title: "D2C Growth Infrastructure",
    icon: GitBranch,
    challenge:
      "Spend scales; attribution and creative learning don’t — every channel feels like a one-off.",
    approach:
      "One acquisition architecture: testing cadence, LTV-aware decisions, instrumentation end-to-end.",
    impact:
      "Compoundable growth loops instead of heroic campaign sprints.",
  },
  {
    title: "Luxury Real Estate Funnels",
    icon: Building2,
    challenge:
      "Long cycles and high scrutiny — generic funnels erode trust before a tour is booked.",
    approach:
      "Narrative-led journeys, discreet qualification, broker-ready context on every lead.",
    impact:
      "Higher-quality appointments and less friction from first touch to handshake.",
  },
  {
    title: "CRM & Workflow Automation",
    icon: Workflow,
    challenge:
      "Opportunities die in inbox debt, stale tasks and tools that nobody actually adopted.",
    approach:
      "CRM structure, automation with human checkpoints, workflows that sales will run.",
    impact:
      "Fewer dropped leads and less manual babysitting across the funnel.",
  },
  {
    title: "Conversion Optimization Systems",
    icon: Gauge,
    challenge:
      "Traffic is expensive; lifts are one-off tweaks without a system to prove what worked.",
    approach:
      "Experimentation backbone, coherent page systems, measurement you can defend.",
    impact:
      "Marginal gains that stack instead of regressing next quarter.",
  },
  {
    title: "Founder Intelligence Dashboards",
    icon: Sparkles,
    challenge:
      "Founders stare at spreadsheets that lag reality — decisions get made on vibes.",
    approach:
      "Executive views tying acquisition, economics and narrative — AI-assisted synthesis where useful.",
    impact:
      "Sharper weekly calls with less analyst overhead chasing numbers.",
  },
] as const

export function StrategicSystemsSection() {
  return (
    <section className="relative px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[20%] h-[min(70vw,420px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl md:mb-16">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Systems
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.25rem]">
            Architectures we stand behind
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg">
            Operating patterns your team can run—narrative, instrumentation, and
            automation in one stack, not three competing roadmaps.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {systems.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[1.125rem] border border-hairline bg-card/95 p-6 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-card/[0.35] md:p-7 hover:-translate-y-1 hover:border-primary/35 hover:bg-card dark:hover:bg-card/[0.48] hover:shadow-[0_0_0_1px_var(--glow-ambient),var(--shadow-tier-hover),0_0_48px_-20px_var(--glow-primary)]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/[0.08] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[0.625rem] border border-primary/20 bg-primary/[0.1] text-primary transition-all duration-300 group-hover:border-primary/45 group-hover:bg-primary/[0.16] group-hover:shadow-[0_0_24px_-4px_var(--glow-primary)]">
                  <item.icon className="h-5 w-5" strokeWidth={1.65} />
                </div>

                <h3 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>

                <dl className="space-y-3.5 text-[0.8125rem] leading-relaxed md:text-sm">
                  <div>
                    <dt className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/75">
                      Constraint
                    </dt>
                    <dd className="text-muted-foreground/90">{item.challenge}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-primary/80">
                      Move
                    </dt>
                    <dd className="text-foreground/88">{item.approach}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/75">
                      Outcome
                    </dt>
                    <dd className="text-muted-foreground/90">{item.impact}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
