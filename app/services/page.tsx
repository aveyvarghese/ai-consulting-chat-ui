import type { Metadata } from "next"
import Link from "next/link"
import {
  Brain,
  LayoutGrid,
  Palette,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react"
import { brandServices } from "@/lib/brand-services"

export const metadata: Metadata = {
  title: "Services | PxlBrief",
  description:
    "AI consulting, branding, growth strategy, performance marketing, automation and website systems.",
}

const icons = [Brain, Palette, TrendingUp, Target, Workflow, LayoutGrid] as const

export default function ServicesPage() {
  return (
    <main className="relative overflow-x-hidden px-4 pb-24 pt-10 md:pb-32 md:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.05] to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl md:mb-16">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Services
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.5rem]">
            Capabilities built for modern brands
          </h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg">
            Each line is delivered as integrated work — not disconnected
            deliverables. Start a thread with PxlBrief AI to scope what matters
            first.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {brandServices.map((service, i) => {
            const Icon = icons[i]!
            return (
              <article
                key={service.title}
                className="group flex flex-col overflow-hidden rounded-[1.125rem] border border-hairline bg-card/95 p-6 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-card/[0.38] md:p-8 hover:-translate-y-1 hover:border-primary/28 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[0.625rem] border border-primary/18 bg-primary/[0.09] text-primary transition-colors group-hover:border-primary/35">
                  <Icon className="h-5 w-5" strokeWidth={1.65} />
                </div>
                <h2 className="mb-2.5 text-lg font-semibold tracking-tight text-foreground">
                  {service.title}
                </h2>
                <p className="mb-8 flex-1 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                  {service.description}
                </p>
                <Link
                  href="/#consulting-chat"
                  className="inline-flex w-fit items-center justify-center rounded-[0.75rem] border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/45 hover:bg-primary/15"
                >
                  Discuss in chat
                </Link>
              </article>
            )
          })}
        </div>

        <p className="mx-auto mt-16 max-w-xl text-center text-sm text-muted-foreground/80 md:mt-20">
          Prefer to talk it through?{" "}
          <Link
            href="/#consulting-chat"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open PxlBrief AI on the homepage
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
