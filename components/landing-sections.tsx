import { ChevronRight } from "lucide-react"

const processSteps = [
  {
    key: "diagnose",
    label: "Diagnose",
    detail:
      "Map constraints, signal gaps, and operating drag with executive-grade clarity.",
  },
  {
    key: "design",
    label: "Design",
    detail:
      "Define the architecture: systems, ownership, metrics, and the path to leverage.",
  },
  {
    key: "deploy",
    label: "Deploy",
    detail:
      "Install workflows and automation your team runs — measured, governed, compounding.",
  },
] as const

const industries = [
  "Fashion",
  "Real Estate",
  "D2C",
  "Luxury",
  "Healthcare",
  "Education",
  "Startups",
  "Hospitality",
] as const

const metrics = [
  { value: "9+", label: "Years in market" },
  { value: "50+", label: "Organizations" },
  { value: "Unified", label: "Strategy to stack" },
  { value: "Senior", label: "Principal involvement" },
] as const

export function HowWeWorkSection() {
  return (
    <section className="relative border-y border-hairline bg-section-tint px-3 py-20 sm:px-4 sm:py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] pxl-data-grid"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              How we work
            </p>
            <h2 className="text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.375rem] md:leading-[1.1] md:tracking-[-0.03em]">
              Diagnose. Design. Deploy.
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-base md:leading-relaxed">
            A disciplined consulting cadence — evidence first, architecture second,
            execution last.
          </p>
        </header>

        <div className="hidden items-stretch gap-4 md:flex md:gap-6 lg:gap-8">
          {processSteps.map((step, i) => (
            <div key={step.key} className="flex min-w-0 flex-1 items-start">
              <div className="flex w-full flex-col rounded-[1.125rem] border border-hairline/90 bg-card/[0.45] p-6 shadow-sm backdrop-blur-sm dark:bg-card/[0.22] lg:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/28 bg-primary/[0.09] font-mono text-[11px] font-medium tabular-nums text-primary/95 shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < processSteps.length - 1 && (
                    <div
                      className="hidden h-px min-w-0 flex-1 bg-gradient-to-r from-primary/30 to-transparent xl:block"
                      aria-hidden
                    />
                  )}
                </div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground/95 lg:text-xl">
                  {step.label}
                </h3>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm md:leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ol className="flex flex-col gap-6 md:hidden">
          {processSteps.map((step, i) => (
            <li
              key={step.key}
              className="flex gap-4 rounded-[1.125rem] border border-hairline bg-card/92 p-6 shadow-sm backdrop-blur-md transition-shadow duration-500 ease-out hover:shadow-md dark:bg-card/[0.28]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/28 bg-primary/[0.09] font-mono text-[11px] font-medium text-primary/95 shadow-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 flex items-center gap-2 font-semibold tracking-tight text-foreground">
                  {step.label}
                  {i < processSteps.length - 1 && (
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-primary/50"
                      aria-hidden
                    />
                  )}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function IndustriesSection() {
  return (
    <section className="relative px-3 py-20 sm:px-4 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 md:mb-16">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Sectors
          </p>
          <h2 className="text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.375rem] md:tracking-[-0.03em]">
            Where we deploy depth
          </h2>
        </header>

        <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
          {industries.map((name) => (
            <span
              key={name}
              className="inline-flex min-h-11 min-w-0 touch-manipulation items-center justify-center rounded-full border border-hairline bg-card/94 px-3 py-2.5 text-center text-[0.8125rem] font-medium leading-snug text-foreground/92 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/32 hover:bg-primary/[0.07] hover:text-foreground hover:shadow-md dark:bg-card/[0.32] md:px-5 md:text-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ResultsSection() {
  return (
    <section className="relative px-3 pb-24 pt-10 sm:px-4 sm:pb-28 md:pb-36 md:pt-14">
      <div className="mx-auto grid min-w-0 max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="min-w-0 rounded-[1.125rem] border border-hairline bg-gradient-to-b from-card/92 to-card/80 p-4 text-center shadow-sm backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/28 hover:shadow-md dark:from-card/[0.48] dark:to-card/[0.22] sm:p-6 md:p-8"
          >
            <div className="font-mono text-2xl font-semibold tracking-tight text-primary/95 md:text-3xl">
              {m.value}
            </div>
            <div className="mt-2 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/80 md:text-[0.6875rem]">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FinalCtaSection() {
  return (
    <section className="relative px-3 pb-20 pt-10 sm:px-4 sm:pb-28 sm:pt-12 md:pb-36 md:pt-14">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.25rem] border border-hairline bg-card/94 px-6 py-12 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:px-10 sm:py-16 dark:bg-card/[0.42] md:px-14 md:py-20">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/[0.09] blur-3xl pxl-ambient-glow-drift" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-accent/[0.08] blur-2xl pxl-ambient-glow-drift-reverse" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2] pxl-data-grid"
          aria-hidden
        />

        <div className="relative z-10">
          <h2 className="text-balance text-[1.875rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.375rem] md:leading-[1.1] md:tracking-[-0.03em]">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:mt-8 md:text-lg md:leading-relaxed">
            Open a session. Bring a problem, a metric, or a deck. We map the
            next move with the same discipline we bring behind closed doors.
          </p>
          <a
            href="#consulting-chat"
            className="mt-10 inline-flex min-h-[3rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] bg-primary px-8 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-md shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/[0.94] hover:shadow-xl hover:shadow-primary/20 active:scale-[0.985] motion-reduce:transition-colors sm:mt-12 sm:w-auto sm:min-h-[3rem] sm:px-12"
          >
            Start a session
          </a>
        </div>
      </div>
    </section>
  )
}
