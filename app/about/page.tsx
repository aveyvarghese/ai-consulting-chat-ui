import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | PxlBrief",
  description:
    "PxlBrief is a premium AI-native consultancy — Diagnose, Strategize, Build, Scale.",
}

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden px-3 pb-20 pt-8 sm:px-4 sm:pb-24 sm:pt-10 md:pb-32 md:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.05] to-transparent" />
      <div className="relative mx-auto max-w-3xl">
        <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
          About
        </p>
        <h1 className="text-balance text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-3xl md:text-[2.5rem]">
          AI-native consultancy, built like a product studio.
        </h1>

        <div className="mt-10 space-y-6 text-[0.9375rem] leading-[1.7] text-muted-foreground/90 md:text-base md:leading-relaxed">
          <p>
            PxlBrief sits at the intersection of{" "}
            <span className="text-foreground/90">
              strategy, brand, growth and intelligent systems
            </span>
            . We work with founders and marketing leaders who need clarity before
            they scale — not more noise.
          </p>
          <p>
            The practice carries{" "}
            <span className="text-foreground/90">9+ years</span> of depth and has
            shaped work for{" "}
            <span className="text-foreground/90">50+ brands</span> — from
            early-stage launches to established names tightening acquisition and
            positioning. That shows up as judgment: what to fix first, what to
            ignore, and how to sequence the work.
          </p>
          <p>
            We are not a generic AI wrapper. PxlBrief is built as a{" "}
            <span className="text-foreground/90">premium AI-native consultancy</span>
            : sharp intake, systems thinking, and execution that respects brand
            and commercial reality.
          </p>
        </div>

        <div className="mt-10 rounded-[1.125rem] border border-hairline bg-card/95 p-5 backdrop-blur-xl sm:mt-14 sm:rounded-[1.25rem] sm:p-8 dark:bg-card/[0.35] md:p-10">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary/85">
            Philosophy
          </h2>
          <p className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            Diagnose. Strategize. Build. Scale.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground/90 md:text-[0.9375rem]">
            <strong className="font-medium text-foreground/90">Diagnose</strong>{" "}
            — find leverage, not noise.{" "}
            <strong className="font-medium text-foreground/90">Strategize</strong>{" "}
            — one clear thesis and roadmap.{" "}
            <strong className="font-medium text-foreground/90">Build</strong> — ship
            creative and systems together.{" "}
            <strong className="font-medium text-foreground/90">Scale</strong> —
            compound what works, cut what does not.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#consulting-chat"
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-[0.875rem] bg-primary px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/93 hover:shadow-lg hover:shadow-primary/18 sm:w-auto sm:min-h-[2.875rem] sm:px-8"
          >
            Start with PxlBrief AI
          </Link>
        </div>
      </div>
    </main>
  )
}
