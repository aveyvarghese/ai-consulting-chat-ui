"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type HomepageCase = {
  title: string
  problem: string
  system: string
  aiLayer: string
}

type HomepageCaseMobileListProps = {
  cases: readonly HomepageCase[]
}

export function HomepageCaseMobileList({ cases }: HomepageCaseMobileListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="grid gap-2.5 sm:hidden" aria-label="Case studies">
      {cases.map((item, index) => {
        const open = openIndex === index
        return (
          <article
            key={item.title}
            className="min-w-0 overflow-hidden rounded-[0.95rem] border border-primary/18 bg-card/88 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34]"
          >
            <div className="flex min-w-0 items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-primary/82">
                  Case {index + 1} · Example scenario
                </p>
                <h3 className="mt-1 text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground">
                  {item.title}
                </h3>
              </div>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                className={cn(
                  "inline-flex min-h-9 shrink-0 touch-manipulation items-center justify-center rounded-full border px-3 py-1.5 text-[0.75rem] font-semibold transition-colors",
                  open
                    ? "border-[var(--secondary-accent)]/35 bg-[var(--secondary-accent)]/12 text-[var(--secondary-accent)]"
                    : "border-[var(--secondary-accent)]/30 bg-[var(--secondary-accent)]/10 text-[var(--secondary-accent)] hover:bg-[var(--secondary-accent)]/15"
                )}
              >
                {open ? "Hide" : "View"}
              </button>
            </div>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <dl className="space-y-3 border-t border-hairline/70 bg-background/22 px-3 pb-3.5 pt-3.5 text-[0.8125rem] leading-relaxed">
                  <div>
                    <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                      Problem
                    </dt>
                    <dd className="text-muted-foreground/90">{item.problem}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/82">
                      System
                    </dt>
                    <dd className="text-foreground/90">{item.system}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                      AI Layer
                    </dt>
                    <dd className="text-muted-foreground/90">{item.aiLayer}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
