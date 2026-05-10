import { ChevronRight } from "lucide-react"

const processSteps = [
  {
    key: "diagnose",
    label: "Diagnose",
    detail: "Signal, data and narrative — where leverage actually lives.",
  },
  {
    key: "strategize",
    label: "Strategize",
    detail: "A focused thesis, roadmap and metrics you can defend.",
  },
  {
    key: "build",
    label: "Build",
    detail: "Systems, creative and automation as one coherent stack.",
  },
  {
    key: "scale",
    label: "Scale",
    detail: "Compound loops — optimize what works, retire what does not.",
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
  { value: "9+", label: "Years Experience" },
  { value: "50+", label: "Brands" },
  { value: "AI-First", label: "Systems" },
  { value: "Growth-Led", label: "Execution" },
] as const

export function HowWeWorkSection() {
  return (
    <section className="relative border-y border-hairline bg-section-tint px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              Method
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.25rem]">
              How we work
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-base md:leading-relaxed">
            Diagnose → Strategize → Build → Scale. A linear rhythm with
            executive-grade clarity.
          </p>
        </header>

        <div className="hidden items-stretch gap-0 md:flex">
          {processSteps.map((step, i) => (
            <div key={step.key} className="flex min-w-0 flex-1 items-start">
              <div className="flex w-full flex-col">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/28 bg-primary/[0.09] font-mono text-[11px] font-medium tabular-nums text-primary/95 shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < processSteps.length - 1 && (
                    <div
                      className="h-px min-w-0 flex-1 bg-gradient-to-r from-primary/35 to-transparent"
                      aria-hidden
                    />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground/95">
                  {step.label}
                </h3>
                <p className="pr-4 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ol className="flex flex-col gap-8 md:hidden">
          {processSteps.map((step, i) => (
            <li
              key={step.key}
              className="flex gap-4 rounded-[1.125rem] border border-hairline bg-card/92 p-5 shadow-sm backdrop-blur-md transition-shadow duration-300 hover:shadow-md dark:bg-card/[0.28]"
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
    <section className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 md:mb-14">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Sectors
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.25rem]">
            Industries we elevate
          </h2>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3.5">
          {industries.map((name) => (
            <span
              key={name}
              className="inline-flex items-center justify-center rounded-full border border-hairline bg-card/94 px-4 py-2.5 text-center text-[0.8125rem] font-medium text-foreground/92 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/32 hover:bg-primary/[0.07] hover:text-foreground hover:shadow-md dark:bg-card/[0.32] md:px-5 md:text-sm"
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
    <section className="relative px-4 pb-24 pt-6 md:pb-32 md:pt-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-[1.125rem] border border-hairline bg-gradient-to-b from-card/92 to-card/80 p-6 text-center shadow-sm backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/28 hover:shadow-md dark:from-card/[0.48] dark:to-card/[0.22] md:p-8"
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
    <section className="relative px-4 pb-20 pt-6 md:pb-28 md:pt-8">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-hairline bg-card/94 px-8 py-14 text-center shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl dark:bg-card/[0.42] md:px-14 md:py-16">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/[0.09] blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-primary/[0.05] blur-2xl" />

        <div className="relative z-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.25rem]">
            Need clarity before scaling?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg md:leading-relaxed">
            Start a conversation with PxlBrief AI and explore how intelligent
            systems, branding and growth strategy can accelerate your business.
          </p>
          <a
            href="#consulting-chat"
            className="mt-10 inline-flex min-h-[2.875rem] items-center justify-center rounded-[0.875rem] bg-primary px-9 py-3 text-[0.8125rem] font-semibold tracking-tight text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:bg-primary/93 hover:shadow-lg hover:shadow-primary/18 active:scale-[0.99] md:text-sm"
          >
            Open PxlBrief AI
          </a>
        </div>
      </div>
    </section>
  )
}
