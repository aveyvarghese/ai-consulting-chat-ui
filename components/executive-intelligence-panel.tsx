"use client"

import Link from "next/link"
import { Globe2, Instagram, Linkedin, Search, Sparkles, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

type ExecutiveIntelligencePanelProps = {
  /** Tighter layout for stacked mobile placement */
  compact?: boolean
}

const auditTools = [
  {
    key: "instagram",
    label: "Instagram Audit",
    description: "Profile, content, and positioning signals",
    icon: Instagram,
  },
  {
    key: "linkedin",
    label: "LinkedIn Audit",
    description: "Authority, profile clarity, and B2B visibility",
    icon: Linkedin,
  },
  {
    key: "youtube",
    label: "YouTube Audit",
    description: "Channel structure, topics, and conversion cues",
    icon: Youtube,
  },
  {
    key: "seo",
    label: "Website SEO",
    description: "Search basics, metadata, and page structure",
    icon: Search,
  },
  {
    key: "aeo",
    label: "Website AEO",
    description: "Answer-readiness and FAQ clarity",
    icon: Globe2,
  },
  {
    key: "geo",
    label: "Website GEO",
    description: "Brand/entity clarity for generative discovery",
    icon: Sparkles,
  },
] as const

export function ExecutiveIntelligencePanel({
  compact,
}: ExecutiveIntelligencePanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border border-primary/14 bg-gradient-to-b from-card/[0.78] via-card/[0.55] to-card/[0.34] shadow-[0_28px_90px_-52px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.035),inset_0_1px_0_0_var(--shine-inset),inset_0_-1px_0_rgba(255,255,255,0.025)] backdrop-blur-2xl dark:from-card/[0.48] dark:via-card/[0.34] dark:to-card/[0.22]",
        compact
          ? "rounded-[1.05rem] p-3.5 shadow-[0_16px_54px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_0_var(--shine-inset)] sm:p-5"
          : "p-5 sm:p-6 md:p-7"
      )}
      aria-label="AI audit tools preview"
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
            "border-b border-hairline/70",
            compact ? "mb-3 pb-3" : "mb-5 pb-5"
          )}
        >
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75 sm:text-[0.625rem] sm:tracking-[0.2em]">
              Digital presence preview
            </p>
            <p className="mt-1 text-[0.95rem] font-semibold tracking-tight text-foreground/95 sm:mt-1.5 sm:text-base">
              AI audit tools
            </p>
          </div>
        </div>

        <p
          className={cn(
            "text-[0.75rem] leading-relaxed text-muted-foreground/82",
            compact ? "mb-3" : "mb-4"
          )}
        >
          Run quick AI-led audits across your social presence, website visibility,
          answer readiness, and generative search readiness.
        </p>

        <ul className={cn("grid gap-2", !compact && "sm:grid-cols-2")}>
          {auditTools.map((tool) => (
            <li
              key={tool.key}
              className={cn(
                "min-w-0 rounded-[0.85rem] border border-hairline/65 bg-background/[0.22] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
                compact ? "px-3 py-2.5" : "px-3 py-3"
              )}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-[0.62rem] border border-primary/18 bg-primary/[0.075] text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)]",
                    compact ? "h-8 w-8" : "h-8 w-8"
                  )}
                >
                  <tool.icon
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.78rem] font-semibold leading-tight tracking-tight text-foreground/95">
                    {tool.label}
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground/70">
                    {tool.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className={cn("border-t border-hairline/70", compact ? "mt-3 pt-3" : "mt-5 pt-4")}>
          <Link
            href="/ai-lab#ai-audit-tools"
            className="cta-gradient-motion inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-[0.75rem] bg-primary px-4 py-2 text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94]"
          >
            Explore AI Audit Tools
          </Link>
          <p className="mt-2.5 text-center text-[0.6875rem] leading-relaxed text-muted-foreground/65">
            Directional audits first. Deeper report available after submission.
          </p>
        </div>
      </div>
    </div>
  )
}
