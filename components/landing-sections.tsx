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

const intelligenceMetrics = [
  {
    value: "2.4x",
    label: "Faster enquiry clarity",
    detail: "AI-assisted intake, routing and next-step clarity before a human call.",
    fill: "82%",
  },
  {
    value: "24/7",
    label: "AI-assisted workflows",
    detail: "Always-on operating support for capture, research, content and follow-up.",
    fill: "74%",
  },
  {
    value: "4-layer",
    label: "Automated growth systems",
    detail: "Strategy, funnel, workflow and reporting designed as one connected loop.",
    fill: "88%",
  },
  {
    value: "Conversion",
    label: "Conversion-focused execution",
    detail: "Creative and systems built around qualified actions, not surface activity.",
    fill: "78%",
  },
] as const

const exampleUseCases = [
  {
    title: "Luxury real estate AI enquiry funnels",
    detail:
      "High-intent property enquiries structured through AI intake, segmentation and advisor handoff logic.",
  },
  {
    title: "AI-powered dealer ecosystems",
    detail:
      "Dealer onboarding, enquiry distribution and performance visibility across regional networks.",
  },
  {
    title: "AI consultation systems",
    detail:
      "Premium consultation flows that capture needs, score opportunities and prepare sales context.",
  },
  {
    title: "AI brand growth infrastructure",
    detail:
      "Brand positioning, content engines and acquisition systems connected to a single growth thesis.",
  },
  {
    title: "Automated customer engagement",
    detail:
      "WhatsApp, email and workflow touchpoints that keep prospects moving without manual leakage.",
  },
  {
    title: "Performance intelligence dashboards",
    detail:
      "Decision dashboards that connect funnel health, campaign signal and commercial priorities.",
  },
] as const

const enquiryTimeline = [
  {
    label: "AI consultation",
    detail: "PxlBrief AI captures business context and structures the first signal.",
  },
  {
    label: "Strategy diagnosis",
    detail: "We identify leverage points across offer, funnel, workflow and growth motion.",
  },
  {
    label: "System blueprint",
    detail: "The recommended architecture is mapped across automation, creative and execution.",
  },
  {
    label: "Execution roadmap",
    detail: "You receive a focused path for what to build, sequence and measure first.",
  },
] as const

const trustSignals = [
  "Founder-led consulting",
  "Confidential workflows",
  "AI + human strategy hybrid",
  "Designed for scalable businesses",
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
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.045] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[min(92vw,58rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 max-w-4xl md:mb-14">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Results & Intelligence
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
            Built for modern brands that need leverage, not just marketing.
          </h2>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg md:leading-relaxed">
            The output is not another campaign calendar. It is an intelligence
            layer for enquiry clarity, workflow, growth systems and conversion.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {intelligenceMetrics.map((metric) => (
            <article
              key={metric.label}
              className="group relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-gradient-to-b from-card/[0.58] to-card/[0.24] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_62px_-42px_rgba(0,0,0,0.82)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_30px_72px_-38px_rgba(0,0,0,0.85),0_0_44px_-30px_oklch(0.75_0.12_180/0.9)] md:p-6"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/[0.075] blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="font-mono text-2xl font-semibold tracking-[-0.04em] text-primary/95 md:text-3xl">
                  {metric.value}
                </div>
                <h3 className="mt-3 text-sm font-semibold tracking-tight text-foreground md:text-base">
                  {metric.label}
                </h3>
                <p className="mt-2 min-h-16 text-[0.8125rem] leading-relaxed text-muted-foreground/88">
                  {metric.detail}
                </p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/35 shadow-[0_0_24px_-8px_oklch(0.75_0.12_180/0.9)]"
                    style={{
                      width: metric.fill,
                      animation: "pxl-shimmer 4.8s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExampleUseCasesSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[oklch(0.078_0.006_260)] px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute right-[-18%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-primary/[0.045] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[-12%] h-[28rem] w-[28rem] rounded-full bg-cyan-300/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              Example Use Cases
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
              Enterprise-grade AI applications for premium growth environments.
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground/88 md:text-base">
            Each system is shaped around commercial intent, operational clarity
            and scalable customer movement.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {exampleUseCases.map((useCase, index) => (
            <article
              key={useCase.title}
              className="group relative min-h-52 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-card/[0.34] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-card/[0.5] hover:shadow-[0_28px_72px_-40px_rgba(0,0,0,0.88)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/[0.06] blur-2xl" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="mb-8 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.08] font-mono text-[0.6875rem] text-primary/95">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-tight tracking-[-0.015em] text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground/88 md:text-sm">
                    {useCase.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AfterEnquireSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(88vw,52rem)] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            What Happens After You Enquire
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
            From AI conversation to a practical execution path.
          </h2>
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-primary/25 via-primary/40 to-transparent md:block" />
          <ol className="relative grid gap-4 md:grid-cols-4 md:gap-5">
            {enquiryTimeline.map((step, index) => (
              <li
                key={step.label}
                className="group relative rounded-[1.125rem] border border-white/[0.075] bg-gradient-to-b from-card/[0.5] to-card/[0.22] p-5 backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/28 hover:shadow-[0_24px_60px_-38px_rgba(0,0,0,0.82)]"
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.09] font-mono text-[0.75rem] text-primary/95 shadow-[0_0_32px_-20px_oklch(0.75_0.12_180/0.9)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {step.label}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/88">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function TrustLayerSection() {
  return (
    <section className="relative px-4 pb-24 pt-4 md:pb-32 md:pt-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-card/[0.52] via-card/[0.3] to-black/[0.18] p-5 shadow-[0_28px_78px_-48px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl md:p-8">
        <div className="grid gap-4 md:grid-cols-4">
          {trustSignals.map((signal) => (
            <div
              key={signal}
              className="rounded-[1rem] border border-white/[0.07] bg-white/[0.035] px-4 py-4 text-center text-[0.8125rem] font-medium tracking-tight text-foreground/92 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-primary/26 hover:bg-primary/[0.055] md:text-sm"
            >
              {signal}
            </div>
          ))}
        </div>
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
