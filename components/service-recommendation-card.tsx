"use client"

import { Compass, X } from "lucide-react"
import type { PublicServiceRecommendation } from "@/lib/service-routing"

type ServiceRecommendationCardProps = {
  recommendation: PublicServiceRecommendation
  onDismiss: () => void
}

export function ServiceRecommendationCard({
  recommendation,
  onDismiss,
}: ServiceRecommendationCardProps) {
  return (
    <div
      className="relative mb-4 overflow-hidden rounded-[1rem] border border-hairline bg-gradient-to-b from-primary/[0.05] via-card/96 to-card/95 shadow-sm backdrop-blur-sm dark:from-primary/[0.07] dark:via-card/[0.4] dark:to-card/[0.28]"
      role="region"
      aria-label="Suggested direction"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] pxl-data-grid"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3 border-b border-hairline/80 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/22 bg-primary/[0.08]">
            <Compass className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
              Recommended direction
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-snug tracking-tight text-foreground">
              {recommendation.directionLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          aria-label="Dismiss suggestion"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative space-y-3 px-4 py-4 sm:px-5 sm:py-5">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
            Why it matters
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm md:leading-relaxed">
            {recommendation.whyItMatters}
          </p>
        </div>
        <div className="rounded-lg border border-hairline/90 bg-muted/[0.2] px-3.5 py-3 dark:bg-muted/[0.12]">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary/85">
            Suggested next step
          </p>
          <p className="mt-1.5 text-[0.8125rem] font-medium leading-relaxed text-foreground/95 md:text-sm">
            {recommendation.suggestedNextStep}
          </p>
        </div>
      </div>
    </div>
  )
}
