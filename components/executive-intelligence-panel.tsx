"use client"

import { Activity, Gauge, TrendingDown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type ExecutiveIntelligencePanelProps = {
  /** Tighter layout for stacked mobile placement */
  compact?: boolean
}

const metrics = [
  {
    key: "drag",
    label: "Operational drag",
    hint: "Process latency vs. peers",
    icon: TrendingDown,
    value: "Elevated",
    barClass: "pxl-intel-bar--drag",
  },
  {
    key: "automation",
    label: "Automation readiness",
    hint: "Stack + governance fit",
    icon: Zap,
    value: "High",
    barClass: "pxl-intel-bar--auto",
  },
  {
    key: "bottlenecks",
    label: "Growth bottlenecks",
    hint: "Top constraint this quarter",
    icon: Activity,
    value: "GTM · throughput",
    barClass: "pxl-intel-bar--growth",
  },
  {
    key: "leverage",
    label: "AI leverage score",
    hint: "Signal quality index",
    icon: Gauge,
    value: "72",
    suffix: "/ 100",
    barClass: "pxl-intel-bar--leverage",
  },
] as const

export function ExecutiveIntelligencePanel({
  compact,
}: ExecutiveIntelligencePanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.125rem] border border-hairline bg-card/[0.72] shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl dark:bg-card/[0.4]",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
      )}
      aria-label="Illustrative executive intelligence readout"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] pxl-data-grid pxl-data-grid-shift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 top-0 h-48 w-48 rounded-full bg-primary/[0.07] blur-3xl motion-safe:pxl-ambient-glow-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 left-0 h-32 w-32 rounded-full bg-accent/[0.12] blur-2xl motion-safe:pxl-ambient-glow-drift-reverse"
        aria-hidden
      />

      <div className="relative z-[1]">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-hairline/80 pb-4">
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/75">
              Executive intelligence
            </p>
            <p className="mt-1 text-xs font-medium text-foreground/90">
              Live strategic readout
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-1">
            <span
              className="relative flex h-2 w-2"
              aria-hidden
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-[0.625rem] font-medium tabular-nums text-primary/90">
              Synced
            </span>
          </div>
        </div>

        <ul className="space-y-4 sm:space-y-5">
          {metrics.map((m) => (
            <li key={m.key} className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-muted/[0.35]">
                    <m.icon
                      className="h-3.5 w-3.5 text-primary/85"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-semibold leading-tight tracking-tight text-foreground">
                      {m.label}
                    </p>
                    {!compact && (
                      <p className="mt-0.5 text-[0.6875rem] leading-snug text-muted-foreground/75">
                        {m.hint}
                      </p>
                    )}
                  </div>
                </div>
                <p className="shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums tracking-tight text-foreground">
                  {m.value}
                  {"suffix" in m ? (
                    <span className="font-medium text-muted-foreground/70">
                      {m.suffix}
                    </span>
                  ) : null}
                </p>
              </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted/[0.5]">
                <div
                  className={cn(
                    "h-full w-full origin-left rounded-full bg-gradient-to-r from-primary/50 to-primary/85 pxl-intel-bar",
                    m.barClass
                  )}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 border-t border-hairline/70 pt-4 text-[0.6875rem] leading-relaxed text-muted-foreground/65">
          Illustrative dashboard — your engagement maps signal to ownership
          and cadence.
        </p>
      </div>
    </div>
  )
}
