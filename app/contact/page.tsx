import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact | PxlBrief",
  description: "Connect with PxlBrief — start with PxlBrief AI.",
}

export default function ContactPage() {
  return (
    <main className="relative overflow-x-hidden px-4 pb-24 pt-10 md:pb-32 md:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.05] to-transparent" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
          Contact
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.5rem]">
          Start the right conversation.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg">
          New engagements begin through{" "}
          <span className="text-foreground/90">PxlBrief AI</span> — a focused intake
          that captures context, intent and next steps without a long form.
        </p>

        <div className="mx-auto mt-12 max-w-md rounded-[1.25rem] border border-white/[0.08] bg-card/[0.4] p-8 text-left backdrop-blur-xl md:p-10">
          <h2 className="text-sm font-semibold text-foreground">What to expect</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground/90">
            <li>• Brief, senior-led dialogue — not a ticket queue.</li>
            <li>• You can attach references or a deck from the chat.</li>
            <li>• When it makes sense, you will see Submit Enquiry to route to the team.</li>
          </ul>
        </div>

        <div className="mt-12">
          <Link
            href="/#consulting-chat"
            className="inline-flex min-h-[2.875rem] items-center justify-center rounded-[0.875rem] bg-primary px-8 py-3 text-sm font-semibold tracking-tight text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/93 hover:shadow-lg hover:shadow-primary/18"
          >
            Start with PxlBrief AI
          </Link>
        </div>

        <p className="mt-10 text-sm text-muted-foreground/70">
          Prefer email for something specific? Mention it in the chat — we will
          route it internally.
        </p>
      </div>
    </main>
  )
}
