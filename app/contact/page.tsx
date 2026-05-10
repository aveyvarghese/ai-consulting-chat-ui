import type { Metadata } from "next"
import Link from "next/link"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"

export const metadata: Metadata = {
  title: "Contact | PxlBrief",
  description: "Connect with PxlBrief — start with PxlBrief AI.",
}

export default function ContactPage() {
  return (
    <main className="relative overflow-x-hidden px-3 pb-20 pt-8 sm:px-4 sm:pb-24 sm:pt-10 md:pb-32 md:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.05] to-transparent" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
          Contact
        </p>
        <h1 className="text-balance text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-3xl md:text-[2.5rem]">
          Start the right conversation.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg">
          New engagements begin through{" "}
          <span className="text-foreground/90">PxlBrief AI</span> — a focused intake
          that captures context, intent and next steps without a long form.
        </p>

        <div className="mx-auto mt-10 max-w-md rounded-[1.125rem] border border-hairline bg-card/95 p-5 text-left backdrop-blur-xl sm:mt-12 sm:rounded-[1.25rem] sm:p-8 dark:bg-card/[0.4] md:p-10">
          <h2 className="text-sm font-semibold text-foreground">What to expect</h2>
          <ul className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-muted-foreground/90 sm:text-sm">
            <li>• Brief, senior-led dialogue — not a ticket queue.</li>
            <li>• You can attach references or a deck from the chat.</li>
            <li>• When it makes sense, you will see Submit Enquiry to route to the team.</li>
          </ul>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-stretch gap-4 sm:mt-12 sm:gap-5">
          <Link
            href="/#consulting-chat"
            className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-[0.875rem] bg-primary px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/93 hover:shadow-lg hover:shadow-primary/18 sm:min-h-[2.875rem] sm:px-8"
          >
            Start with PxlBrief AI
          </Link>
          <div className="rounded-[0.875rem] border border-hairline bg-card/92 px-5 py-5 text-center backdrop-blur-sm dark:bg-card/[0.25]">
            <p className="text-[0.8125rem] text-muted-foreground/85">
              Prefer to schedule directly?
            </p>
            <a
              href={STRATEGY_CALL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/35 bg-primary/[0.06] px-5 py-3 text-sm font-semibold tracking-tight text-primary transition-all duration-300 hover:border-primary/50 hover:bg-primary/12 hover:shadow-md hover:shadow-primary/10"
            >
              Book a Strategy Call
            </a>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground/70">
          Prefer email for something specific? Mention it in the chat — we will
          route it internally.
        </p>
      </div>
    </main>
  )
}
