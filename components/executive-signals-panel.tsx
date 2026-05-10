import type { ExecutiveSignalItem } from "@/lib/executive-signals-types"

type ExecutiveSignalsPanelProps = {
  signals: ExecutiveSignalItem[] | null
  loading: boolean
}

export function ExecutiveSignalsPanel({
  signals,
  loading,
}: ExecutiveSignalsPanelProps) {
  if (!loading && (signals === null || signals.length === 0)) {
    return null
  }

  return (
    <div
      className="border-b border-hairline bg-gradient-to-b from-background/95 to-card/[0.35] px-4 py-4 sm:px-5 sm:py-5 dark:from-background dark:to-card/[0.2]"
      aria-label="Executive signals"
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-primary/88">
            Executive signals
          </p>
          <p className="text-[0.6875rem] text-muted-foreground/75">
            Operating read — inferred from your thread
          </p>
        </div>
        {loading ? (
          <span className="text-[0.6875rem] text-muted-foreground/65">
            Updating…
          </span>
        ) : null}
      </div>

      {loading && (!signals || signals.length === 0) ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[0.875rem] border border-hairline/80 bg-muted/[0.25] motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {signals?.map((s) => (
            <article
              key={s.title}
              className="flex min-h-[7.5rem] min-w-0 flex-col rounded-[0.875rem] border border-hairline bg-card/95 p-3.5 shadow-[0_2px_14px_-4px_rgba(40,48,64,0.07)] backdrop-blur-sm dark:bg-card/[0.35] sm:p-4"
            >
              <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                <h3 className="text-[0.8125rem] font-semibold leading-snug tracking-tight text-foreground md:text-sm">
                  {s.title}
                </h3>
                <span
                  className="shrink-0 rounded-full border border-primary/20 bg-primary/[0.06] px-2 py-0.5 text-[0.625rem] font-medium tabular-nums text-primary/90"
                  title="Signal strength"
                >
                  {s.confidence}
                </span>
              </div>
              <p className="mt-auto text-[0.6875rem] leading-relaxed text-muted-foreground/85">
                <span className="font-medium text-muted-foreground/90">
                  What this typically impacts:{" "}
                </span>
                <span className="text-foreground/88">{s.typicalImpact}</span>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
