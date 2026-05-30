"use client"

import { useState } from "react"
import type { ExecutiveSignalItem } from "@/lib/executive-signals-types"

type ExecutiveSignalsPanelProps = {
  signals: ExecutiveSignalItem[] | null
  loading: boolean
}

export function ExecutiveSignalsPanel({
  signals,
  loading,
}: ExecutiveSignalsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!loading && (signals === null || signals.length === 0)) {
    return null
  }

  const signalSummary =
    signals && signals.length > 0
      ? signals
          .slice(0, 2)
          .map((signal) => signal.title)
          .join(", ")
      : loading
        ? "Updating operating read"
        : "No dominant pattern yet"

  return (
    <div
      className="border-b border-hairline bg-gradient-to-b from-background/95 to-card/[0.26] px-3 py-2.5 sm:px-5 sm:py-4 dark:from-background dark:to-card/[0.18]"
      aria-label="Executive signals"
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[0.6875rem] font-medium leading-snug text-foreground sm:text-[0.75rem]">
            <span className="font-semibold text-primary/90">
              Executive Signals:
            </span>{" "}
            <span className="text-muted-foreground/86">{signalSummary}</span>
          </p>
          <p className="hidden text-[0.6875rem] text-muted-foreground/70 sm:block">
            Operating read inferred from your thread
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="inline-flex min-h-9 shrink-0 touch-manipulation items-center rounded-full border border-primary/16 bg-primary/[0.055] px-3 text-[0.6875rem] font-semibold text-primary/90 transition-colors hover:border-primary/30 hover:bg-primary/[0.09]"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Hide signals" : "View signals"}
        </button>
      </div>

      {isExpanded ? (
        loading && (!signals || signals.length === 0) ? (
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-[0.75rem] border border-hairline/80 bg-muted/[0.25] motion-reduce:animate-none sm:h-20"
            />
          ))}
        </div>
        ) : (
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {signals?.map((s) => (
            <article
              key={s.title}
              className="flex min-h-[5.75rem] min-w-0 flex-col rounded-[0.75rem] border border-hairline bg-card/95 p-3 shadow-[0_2px_14px_-4px_rgba(40,48,64,0.07)] backdrop-blur-sm dark:bg-card/[0.35] sm:min-h-[6.5rem] sm:p-3.5"
            >
              <div className="mb-1.5 flex min-w-0 items-start justify-between gap-2">
                <h3 className="text-[0.75rem] font-semibold leading-snug tracking-tight text-foreground md:text-[0.8125rem]">
                  {s.title}
                </h3>
                <span
                  className="shrink-0 rounded-full border border-primary/20 bg-primary/[0.06] px-2 py-0.5 text-[0.625rem] font-medium tabular-nums text-primary/90"
                  title="Signal strength"
                >
                  {s.confidence}
                </span>
              </div>
              <p className="mt-auto text-[0.6875rem] leading-[1.45] text-muted-foreground/85">
                <span className="font-medium text-muted-foreground/90">
                  What this typically impacts:{" "}
                </span>
                <span className="text-foreground/88">{s.typicalImpact}</span>
              </p>
            </article>
          ))}
        </div>
        )
      ) : null}
    </div>
  )
}
