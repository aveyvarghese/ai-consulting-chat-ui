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
    <div className="grid gap-0 border-t border-white/10 sm:hidden" aria-label="Case studies">
      {cases.map((item, index) => {
        const open = openIndex === index
        return (
          <article
            key={item.title}
            className="min-w-0 overflow-hidden border-b border-white/10 bg-transparent"
          >
            <div className="flex min-w-0 items-center gap-4 py-5">
              <div className="min-w-0 flex-1 text-left">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">
                  Case {index + 1} · Example scenario
                </p>
                <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-white">
                  {item.title}
                </h3>
              </div>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                className={cn(
                  "inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center rounded-full border px-4 py-2 font-mono text-xs transition-colors",
                  open
                    ? "border-[#ff7f50]/45 bg-[#ff7f50]/10 text-[#ff7f50]"
                    : "border-white/15 bg-transparent text-slate-400 hover:border-white hover:text-white"
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
                <dl className="space-y-3 pb-5 text-xs font-light leading-relaxed text-slate-400">
                  <div>
                    <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      Problem
                    </dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      System
                    </dt>
                    <dd>{item.system}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      AI Layer
                    </dt>
                    <dd>{item.aiLayer}</dd>
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
