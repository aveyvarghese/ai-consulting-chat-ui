"use client"

import { Activity, Gauge, Radar, Route, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type ExecutiveIntelligencePanelProps = {
  /** Tighter layout for stacked mobile placement */
  compact?: boolean
}

const metrics = [
  {
    key: "readiness",
    label: "AI Readiness Score",
    compactLabel: "AI Readiness",
    hint: "Current stack readiness",
    icon: Gauge,
    value: "42",
    suffix: "/ 100",
    barClass: "pxl-intel-bar--growth",
  },
  {
    key: "bottleneck",
    label: "Growth Bottleneck",
    compactLabel: "Bottleneck",
    hint: "Top system constraint",
    icon: Activity,
    value: "Disconnected lead tracking",
    barClass: "pxl-intel-bar--drag",
  },
  {
    key: "leakage",
    label: "Lead Leakage Risk",
    compactLabel: "Lead Leakage",
    hint: "Revenue attention required",
    icon: Radar,
    value: "High",
    barClass: "pxl-intel-bar--leverage",
  },
  {
    key: "opportunity",
    label: "Automation Opportunity",
    compactLabel: "Automation",
    hint: "Fastest leverage point",
    icon: Zap,
    value: "Sales follow-up + reporting",
    barClass: "pxl-intel-bar--auto",
  },
  {
    key: "system",
    label: "Recommended System",
    compactLabel: "Recommended",
    hint: "Suggested first engagement",
    icon: Route,
    value: "AI Growth Audit",
    barClass: "pxl-intel-bar--auto",
  },
] as const

export function ExecutiveIntelligencePanel({
  compact,
}: ExecutiveIntelligencePanelProps) {
  const badges = ["Founder Intelligence", "Live Signal", "Growth System View"]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border border-primary/14 bg-gradient-to-b from-card/[0.78] via-card/[0.55] to-card/[0.34] shadow-[0_28px_90px_-52px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.035),inset_0_1px_0_0_var(--shine-inset),inset_0_-1px_0_rgba(255,255,255,0.025)] backdrop-blur-2xl dark:from-card/[0.48] dark:via-card/[0.34] dark:to-card/[0.22]",
        compact
          ? "rounded-[1.05rem] p-3.5 shadow-[0_16px_54px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_0_var(--shine-inset)] sm:p-5"
          : "p-5 sm:p-6 md:p-7"
      )}
      aria-label="Illustrative executive intelligence readout"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 pxl-data-grid",
          compact ? "opacity-[0.18]" : "opacity-[0.36] pxl-data-grid-shift"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-full bg-primary/[0.095]",
          compact
            ? "-right-16 -top-12 h-36 w-36 blur-2xl"
            : "-right-1/4 -top-10 h-64 w-64 blur-3xl motion-safe:pxl-ambient-glow-drift"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-full bg-accent/[0.105]",
          compact
            ? "-bottom-12 left-0 h-28 w-28 blur-2xl"
            : "-bottom-14 left-0 h-48 w-48 blur-3xl motion-safe:pxl-ambient-glow-drift-reverse"
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        aria-hidden
      />

      <div className="relative z-[1]">
        <div
          className={cn(
            "flex flex-col border-b border-hairline/70",
            compact ? "mb-3 gap-3 pb-3" : "mb-5 gap-4 pb-5"
          )}
        >
          <div className={cn("flex flex-wrap gap-2", compact && "hidden min-[390px]:flex")}>
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary/14 bg-primary/[0.055] px-2.5 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.13em] text-primary/85 shadow-[inset_0_1px_0_0_var(--shine-inset)] sm:text-[0.56rem]"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75 sm:text-[0.625rem] sm:tracking-[0.2em]">
                AI diagnostic console
              </p>
              <p className="mt-1 text-[0.8125rem] font-semibold tracking-tight text-foreground/95 sm:mt-1.5 sm:text-sm">
                Founder intelligence preview
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-primary/22 bg-primary/[0.07] px-2.5 py-1 shadow-[inset_0_1px_0_0_var(--shine-inset)]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[0.625rem] font-medium tabular-nums text-primary/90">
                Live
              </span>
            </div>
          </div>
        </div>

        <ul className={cn("space-y-2.5", !compact && "sm:space-y-3.5")}>
          {metrics.map((m) => (
            <li
              key={m.key}
              className={cn(
                "min-w-0 rounded-[0.9rem] border border-hairline/65 bg-background/[0.22] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
                compact ? "px-3 py-2.5" : "px-3.5 py-3.5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-[0.65rem] border border-primary/16 bg-primary/[0.07] shadow-[inset_0_1px_0_0_var(--shine-inset)]",
                      compact ? "h-8 w-8" : "h-9 w-9"
                    )}
                  >
                    <m.icon
                      className="h-3.5 w-3.5 text-primary/85"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.105em] text-muted-foreground/75 sm:text-[0.72rem] sm:tracking-[0.12em]">
                      {compact ? m.compactLabel : m.label}
                    </p>
                    {!compact && (
                      <p className="mt-1 text-[0.6875rem] leading-snug text-muted-foreground/65">
                        {m.hint}
                      </p>
                    )}
                  </div>
                </div>
                <p className="max-w-[50%] shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums leading-snug tracking-tight text-foreground min-[390px]:text-[0.875rem] sm:max-w-[52%]">
                  {m.value}
                  {"suffix" in m ? (
                    <span className="font-medium text-muted-foreground/70">
                      {m.suffix}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className={cn("h-1 overflow-hidden rounded-full bg-muted/[0.42]", compact ? "mt-2" : "mt-3")}>
                <div
                  className={cn(
                    "h-full w-full origin-left rounded-full bg-gradient-to-r from-primary/45 via-primary/80 to-foreground/45 pxl-intel-bar",
                    m.barClass
                  )}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className={cn("border-t border-hairline/70 text-[0.6875rem] leading-relaxed text-muted-foreground/65", compact ? "mt-3 pt-3" : "mt-5 pt-4")}>
          Illustrative readout — the live intake turns business context into a
          focused growth-system diagnosis.
        </p>
      </div>
    </div>
  )
}
