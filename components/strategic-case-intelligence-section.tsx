"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type CaseBreakdown = {
  diagnosis: string
  implementationLogic: string
  operationalLeverage: string
  estimatedBusinessImpact: string
}

type CaseIntel = {
  id: string
  industry: string
  title: string
  bottleneck: string
  approach: string
  systemsImplemented: string
  expectedImpact: string
  metrics: readonly string[]
  breakdown: CaseBreakdown
}

const cases: readonly CaseIntel[] = [
  {
    id: "luxury-re",
    industry: "Luxury real estate · HNI acquisition",
    title: "Luxury Real Estate Intelligence",
    bottleneck:
      "Inbound noise, uneven qualification, and follow-up that broke before a second touch.",
    approach:
      "Treat the funnel as a signal system: intent scoring, discreet routing, and broker-ready context on every qualified handoff.",
    systemsImplemented:
      "Lead qualification automation, sales funnel orchestration, HNI customer intelligence layer, CRM automation.",
    expectedImpact:
      "Higher-quality appointments, shorter cycle to tour, and conversion visibility leadership can trust.",
    metrics: [
      "Faster lead qualification",
      "Improved conversion visibility",
      "Strategic clarity",
    ],
    breakdown: {
      diagnosis:
        "Pipeline leakage at qualification—not volume—driving wasted principal time.",
      implementationLogic:
        "Score enquiries on source, behavior, and fit; route only above-threshold leads; automate nurture with human override on exceptions.",
      operationalLeverage:
        "Brokers receive structured dossiers; marketing sees cohort lift; sales sees SLA-backed queues.",
      estimatedBusinessImpact:
        "Meaningful lift in qualified-to-toured and toured-to-close without linear headcount adds.",
    },
  },
  {
    id: "d2c",
    industry: "D2C · Growth economics",
    title: "D2C Growth Infrastructure",
    bottleneck:
      "Retention lagged acquisition; conversion drifted by channel without a single view of economics.",
    approach:
      "Unify acquisition, retention, and creative testing under one instrumentation spine and decision cadence.",
    systemsImplemented:
      "Retention systems, conversion optimization loops, performance intelligence, creative workflow automation.",
    expectedImpact:
      "Improved conversion economics and durable growth loops at sustainable CAC.",
    metrics: [
      "Reduced operational friction",
      "Improved conversion visibility",
      "AI-assisted workflows",
    ],
    breakdown: {
      diagnosis:
        "Siloed channel reporting masked which cohorts and offers actually compound LTV.",
      implementationLogic:
        "Layer cohort models on funnel events; automate holdout reads; tie creative variants to margin, not clicks alone.",
      operationalLeverage:
        "Weekly growth review surfaces exceptions, not raw dashboards; fewer manual merges.",
      estimatedBusinessImpact:
        "Tighter spend efficiency and clearer where to double down versus retire.",
    },
  },
  {
    id: "consult",
    industry: "Professional services · Pre-sales",
    title: "AI Consultation Systems",
    bottleneck:
      "Principals carried repetitive discovery—scalability capped at calendar hours.",
    approach:
      "Structured conversational qualification feeding a diagnosis engine and human-reviewed recommendations.",
    systemsImplemented:
      "Conversational qualification, strategic recommendation engines, AI intake workflows, escalation paths.",
    expectedImpact:
      "A scalable pre-sales intelligence layer that preserves senior time for closable work.",
    metrics: [
      "Faster lead qualification",
      "Strategic clarity",
      "AI-assisted workflows",
    ],
    breakdown: {
      diagnosis:
        "Intake was unstructured text and calendar blocks—not reusable institutional memory.",
      implementationLogic:
        "Normalize every session into entities, risks, and next actions; route to CRM and proposal templates automatically.",
      operationalLeverage:
        "Partners review synthesized briefs, not raw transcripts; juniors prep from machine-first drafts.",
      estimatedBusinessImpact:
        "More qualified first meetings and faster proposal cycles without adding headcount.",
    },
  },
  {
    id: "dealer",
    industry: "Distribution · Partner networks",
    title: "Dealer & Distribution Intelligence",
    bottleneck:
      "Field performance and incentives were opaque—exceptions surfaced too late to correct course.",
    approach:
      "Instrument partners like internal branches: health scores, sell-through signals, and incentive alignment in one control plane.",
    systemsImplemented:
      "Partner systems, sales visibility stack, reporting infrastructure, incentive intelligence.",
    expectedImpact:
      "Better market visibility and scalable distribution management with fewer manual reconciliations.",
    metrics: [
      "Reduced operational friction",
      "Improved conversion visibility",
      "Strategic clarity",
    ],
    breakdown: {
      diagnosis:
        "Reporting lived in spreadsheets; disputes consumed ops bandwidth before leadership saw trend.",
      implementationLogic:
        "Automate ingest from partner feeds; reconcile incentives nightly; surface exceptions to territory owners.",
      operationalLeverage:
        "Leadership sees one distribution cockpit; partners get transparent scorecards.",
      estimatedBusinessImpact:
        "Faster corrective actions on underperforming regions and cleaner incentive spend.",
    },
  },
  {
    id: "founder-dash",
    industry: "Founder · Operating rhythm",
    title: "Founder Operating Dashboards",
    bottleneck:
      "Leaders lacked a single operating picture—decisions deferred for lack of trusted numbers.",
    approach:
      "Design an executive surface that joins finance, acquisition, and operations with AI-assisted synthesis.",
    systemsImplemented:
      "Operational visibility layer, business intelligence pipelines, strategic monitoring, alert logic.",
    expectedImpact:
      "Faster decisions, clearer accountability, and less time assembling decks manually.",
    metrics: [
      "Strategic clarity",
      "Reduced operational friction",
      "AI-assisted workflows",
    ],
    breakdown: {
      diagnosis:
        "Metrics existed in tools; the narrative tying them together was rebuilt weekly by hand.",
      implementationLogic:
        "Canonical KPI definitions, variance narratives generated first-pass by models, partner sign-off on thresholds.",
      operationalLeverage:
        "Monday reviews start from one link; exceptions push to owners before the meeting.",
      estimatedBusinessImpact:
        "Shorter decision cycles and fewer surprises in board and investor moments.",
    },
  },
  {
    id: "workflow",
    industry: "Operations · Internal leverage",
    title: "AI Workflow Automation",
    bottleneck:
      "High-value teams drowned in repetitive coordination, reporting, and handoffs.",
    approach:
      "Map workflows end-to-end; automate only where accuracy and auditability meet your bar; keep humans on judgment.",
    systemsImplemented:
      "Repetitive task automation, reporting systems, internal leverage tools, guard-railed AI copilots.",
    expectedImpact:
      "Material hours returned to core work with audit trails leadership can stand behind.",
    metrics: [
      "AI-assisted workflows",
      "Reduced operational friction",
      "Faster lead qualification",
    ],
    breakdown: {
      diagnosis:
        "Automation pilots failed because edge cases and approvals were not modeled as first-class states.",
      implementationLogic:
        "State-machine workflows with human checkpoints, logging, and rollback; integrate to source systems of record.",
      operationalLeverage:
        "Ops owns configuration; IT owns security; business sees throughput and error budgets.",
      estimatedBusinessImpact:
        "Sustained productivity lift without shadow IT or brittle RPA sprawl.",
    },
  },
] as const

const howWeThink = [
  {
    title: "Systems-first strategy",
    line: "We start from operating reality—then align capital, creative, and code to how work actually moves.",
  },
  {
    title: "AI + human intelligence",
    line: "Models handle volume and pattern; principals own judgment, exceptions, and the last mile of trust.",
  },
  {
    title: "Operational leverage",
    line: "Every layer should remove drag from selling, serving, and scaling what matters.",
  },
  {
    title: "Scalable infrastructure",
    line: "We build machinery you can run—repeatable cadences, not one-off heroics.",
  },
  {
    title: "Founder-level thinking",
    line: "Decisions are framed the way owners review risk: capital, time, and narrative in one frame.",
  },
  {
    title: "Decision intelligence",
    line: "Signal is curated for action—fewer charts, clearer next moves, defensible in review.",
  },
] as const

export function StrategicCaseIntelligenceSection() {
  const baseId = useId()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section
      id="strategic-case-intelligence"
      data-pxl-section="strategic-case-intelligence"
      className="relative scroll-mt-24 border-y border-hairline/60 bg-gradient-to-b from-section-tint/35 via-background to-background px-4 py-24 md:py-32"
      aria-labelledby="strategic-case-intelligence-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11] motion-reduce:opacity-[0.07] dark:opacity-[0.16]"
        aria-hidden
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0 43px, var(--border) 43px 44px), repeating-linear-gradient(0deg, transparent 0 43px, var(--border) 43px 44px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ring/22 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto mb-16 max-w-3xl md:mb-20 md:text-left">
          <div className="flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:gap-12 md:text-left">
            <div className="md:max-w-xl">
              <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/80">
                Case intelligence
              </p>
              <h2
                id="strategic-case-intelligence-heading"
                className="text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-foreground md:text-[2.35rem]"
              >
                Strategic Case Intelligence
              </h2>
            </div>
            <p className="max-w-md text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:pb-0.5 md:text-base md:leading-relaxed">
              PxlBrief helps businesses build AI-powered operational, growth, and
              decision infrastructure—documented like internal systems reviews,
              not portfolio slides.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
          {cases.map((c) => {
            const panelId = `${baseId}-${c.id}-breakdown`
            const open = expandedId === c.id
            return (
              <article
                key={c.id}
                className="group relative overflow-hidden rounded-[1.125rem] border border-hairline bg-card/96 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-card/[0.36] motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/28 motion-safe:hover:shadow-[var(--shadow-card-hover),0_0_0_1px_var(--glow-ambient)] motion-reduce:hover:translate-y-0"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:opacity-0"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(125deg, color-mix(in oklch, var(--primary) 7%, transparent) 0%, transparent 45%, color-mix(in oklch, var(--ring) 6%, transparent) 100%)",
                  }}
                />

                <div className="relative border-b border-hairline/60 bg-gradient-to-r from-transparent via-primary/[0.045] to-transparent px-6 py-4 md:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 text-left">
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                        {c.industry}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                        {c.title}
                      </h3>
                    </div>
                    <div
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary/90 tabular-nums shadow-sm"
                      aria-label="System active"
                    >
                      <span className="relative flex h-1.5 w-1.5" aria-hidden>
                        <span className="absolute inset-0 rounded-full bg-primary/35 motion-safe:animate-ping motion-reduce:hidden" />
                        <span className="relative block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_1px_var(--glow-ambient)]" />
                      </span>
                      Live
                    </div>
                  </div>
                </div>

                <div className="relative space-y-5 px-6 pb-6 pt-5 md:px-8 md:pb-7 md:pt-6">
                  <dl className="space-y-5">
                    <div>
                      <dt className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/75">
                        Core bottleneck
                      </dt>
                      <dd className="text-[0.8125rem] leading-relaxed text-foreground/90 md:text-sm">
                        {c.bottleneck}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                        Strategic approach
                      </dt>
                      <dd className="text-[0.8125rem] leading-relaxed text-foreground/90 md:text-sm">
                        {c.approach}
                      </dd>
                    </div>
                  </dl>

                  <div className="rounded-lg border border-primary/16 bg-gradient-to-br from-primary/[0.055] via-card/35 to-ring/[0.045] px-4 py-3.5 md:px-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                      Systems implemented
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-foreground/92 md:text-sm">
                      {c.systemsImplemented}
                    </p>
                  </div>

                  <div className="border-t border-hairline/50 pt-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/75">
                      Expected operational impact
                    </p>
                    <p className="mt-2 text-[0.8125rem] font-medium leading-relaxed text-foreground md:text-sm">
                      {c.expectedImpact}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {c.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md border border-hairline/70 bg-background/55 px-2.5 py-1 text-[0.65rem] font-medium leading-none tracking-tight text-muted-foreground/95 shadow-sm backdrop-blur-sm md:text-[0.6875rem]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-hairline/55 pt-4">
                    <button
                      type="button"
                      id={`${panelId}-trigger`}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() =>
                        setExpandedId((prev) => (prev === c.id ? null : c.id))
                      }
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-hairline/80 bg-background/50 px-3.5 py-3 text-left text-[0.8125rem] font-semibold tracking-tight text-foreground transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/28 hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 md:text-sm"
                    >
                      Strategic Breakdown
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-primary/80 transition-transform duration-300 ease-out",
                          open && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={`${panelId}-trigger`}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-3 space-y-4 rounded-lg border border-hairline/60 bg-card/50 px-4 py-4 md:px-5">
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
                              Diagnosis
                            </p>
                            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/88 md:text-sm">
                              {c.breakdown.diagnosis}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary/85">
                              Implementation logic
                            </p>
                            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/88 md:text-sm">
                              {c.breakdown.implementationLogic}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
                              Operational leverage
                            </p>
                            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/88 md:text-sm">
                              {c.breakdown.operationalLeverage}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
                              Estimated business impact
                            </p>
                            <p className="mt-1.5 text-[0.8125rem] font-medium leading-relaxed text-foreground md:text-sm">
                              {c.breakdown.estimatedBusinessImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* How PxlBrief Thinks */}
        <div className="relative mt-20 md:mt-24">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-px bg-gradient-to-r from-transparent via-hairline to-transparent md:-top-12" />
          <div className="rounded-[1.25rem] border border-hairline bg-panel-deep/85 p-7 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl md:p-10">
            <p className="text-center text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/80 md:text-left">
              Operating doctrine
            </p>
            <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight text-foreground md:text-left md:text-[1.65rem]">
              How PxlBrief Thinks
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-10">
              {howWeThink.map((item) => (
                <div key={item.title} className="text-center md:text-left">
                  <h3 className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground/88 md:text-sm">
                    {item.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
