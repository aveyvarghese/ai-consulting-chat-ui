import { ChevronRight } from "lucide-react"

const processSteps = [
  {
    key: "diagnose",
    label: "Diagnose",
    detail:
      "We read the business, customer journey, creative signals and operational drag before prescribing the system.",
  },
  {
    key: "design",
    label: "Design",
    detail:
      "We architect the AI workflows, brand logic, funnel paths and growth experiments into a focused operating plan.",
  },
  {
    key: "deploy",
    label: "Deploy",
    detail:
      "We move from strategy to shipped systems, premium execution and feedback loops that keep improving.",
  },
] as const

const brandReasons = [
  {
    label: "AI-first workflows",
    detail: "Automation and intelligence are designed into the operating model from the first move.",
  },
  {
    label: "Strategic consulting",
    detail: "Recommendations are grounded in positioning, economics and execution reality.",
  },
  {
    label: "Premium execution",
    detail: "Creative, systems and campaigns are built with restraint, clarity and polish.",
  },
  {
    label: "Automation mindset",
    detail: "We look for repeatable leverage, not manual dependency disguised as service.",
  },
  {
    label: "Founder-level involvement",
    detail: "Senior judgment stays close to the work, especially where choices compound.",
  },
] as const

const metrics = [
  { value: "9+", label: "Years Experience" },
  { value: "50+", label: "Brands" },
  { value: "AI-First", label: "Systems" },
  { value: "Growth-Led", label: "Execution" },
] as const

export function HowWeWorkSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[oklch(0.082_0.006_260)] px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute right-[-12%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/[0.035] blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              How PxlBrief Works
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
              A clean path from diagnosis to deployment.
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-base md:leading-relaxed">
            No bloated discovery, no theatre. A strategic rhythm for turning
            business context into intelligent systems.
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
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground/95">
                  {step.label}
                </h3>
                <p className="pr-6 text-[0.9375rem] leading-relaxed text-muted-foreground/88">
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
              className="flex gap-4 rounded-[1.125rem] border border-white/[0.07] bg-card/[0.28] p-5 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
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
  return <WhyBrandsChooseUsSection />
}

export function WhyBrandsChooseUsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute left-[-12%] top-20 h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl md:mb-14">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Why Brands Choose Us
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
            Senior strategy, AI-native systems and execution that feels premium.
          </h2>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg md:leading-relaxed">
            PxlBrief blends consulting depth with modern automation and creative
            infrastructure, so brands get sharper decisions and cleaner delivery.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-5 md:gap-5">
          {brandReasons.map((reason, index) => (
            <article
              key={reason.label}
              className={`group rounded-[1.125rem] border border-white/[0.075] bg-card/[0.34] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.045)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-primary/28 hover:bg-card/[0.48] hover:shadow-[0_22px_54px_-34px_rgba(0,0,0,0.75)] ${
                index === 0 ? "md:col-span-2" : ""
              } ${index === 1 ? "md:col-span-3" : "md:col-span-1"}`}
            >
              <div className="mb-4 h-px w-12 bg-gradient-to-r from-primary/75 to-transparent transition-all duration-300 group-hover:w-20" />
              <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">
                {reason.label}
              </h3>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/88 md:text-sm">
                {reason.detail}
              </p>
            </article>
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
            className="rounded-[1.125rem] border border-white/[0.07] bg-gradient-to-b from-card/[0.48] to-card/[0.22] p-6 text-center shadow-sm backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/28 hover:shadow-md md:p-8"
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
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-card/[0.42] px-8 py-14 text-center shadow-[0_24px_64px_-40px_rgba(0,0,0,0.65),inset_0_1px_0_0_oklch(1_0_0/0.04)] backdrop-blur-2xl md:px-14 md:py-16">
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
