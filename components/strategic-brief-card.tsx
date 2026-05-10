import type { StrategicBriefPayload } from "@/lib/strategic-brief-types"

const BRIEF_PENDING =
  "Brief will be completed after our strategy review."

type StrategicBriefCardProps = {
  payload: StrategicBriefPayload
}

export function StrategicBriefCard({ payload }: StrategicBriefCardProps) {
  return (
    <div
      className="mt-4 overflow-hidden rounded-[1rem] border border-primary/25 bg-gradient-to-b from-background via-card/98 to-card/95 shadow-[0_2px_20px_-6px_rgba(181,78,18,0.12)] dark:from-background dark:via-card/[0.45] dark:to-card/[0.3]"
      role="region"
      aria-label="Your strategic brief"
    >
      <div className="border-b border-primary/15 bg-primary/[0.04] px-4 py-3.5 sm:px-5">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-primary/90">
          Your Strategic Brief
        </p>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {!payload.complete ? (
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-base">
            {BRIEF_PENDING}
          </p>
        ) : (
          <dl className="space-y-4 sm:space-y-5">
            <BriefRow
              label="Business context"
              value={payload.fields.businessContext}
            />
            <BriefRow label="Key challenge" value={payload.fields.keyChallenge} />
            <BriefRow
              label="Recommended direction"
              value={payload.fields.recommendedDirection}
            />
            <BriefRow
              label="Priority system to build"
              value={payload.fields.prioritySystem}
            />
            <BriefRow
              label="Suggested next step"
              value={payload.fields.suggestedNextStep}
            />
          </dl>
        )}
      </div>
    </div>
  )
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
        {label}
      </dt>
      <dd className="mt-1.5 text-[0.8125rem] font-normal leading-relaxed text-foreground/95 md:text-sm md:leading-relaxed">
        {value}
      </dd>
    </div>
  )
}
