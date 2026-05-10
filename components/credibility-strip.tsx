const CAPABILITIES = [
  "AI Strategy",
  "Automation Systems",
  "Executive Intelligence",
  "Workflow Optimization",
  "GTM Systems",
  "Founder Advisory",
] as const

function CapabilityPill({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-hairline bg-card/90 px-4 py-2.5 text-[0.8125rem] font-medium tracking-tight text-foreground/92 shadow-sm backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/28 hover:shadow-md motion-reduce:transition-none md:px-5 md:text-sm">
      {label}
    </span>
  )
}

export function CredibilityStrip() {
  const sequence = [...CAPABILITIES, ...CAPABILITIES]

  return (
    <section
      className="relative border-y border-hairline/80 bg-section-tint/80 py-8 sm:py-10"
      aria-label="Practice areas"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 pxl-data-grid"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-6xl px-3 sm:px-4 md:px-6">
        <p className="mb-5 text-center text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground/75 md:mb-6">
          Trusted executive intelligence
        </p>

        {/* Desktop: calm marquee */}
        <div className="hidden overflow-hidden md:block">
          <div className="pxl-credibility-marquee flex w-max gap-3 motion-reduce:animate-none">
            {sequence.map((label, i) => (
              <CapabilityPill key={`${label}-${i}`} label={label} />
            ))}
          </div>
        </div>

        {/* Mobile: horizontal snap scroll, no infinite motion */}
        <div
          className="flex gap-2.5 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
        >
          {CAPABILITIES.map((label) => (
            <CapabilityPill key={label} label={label} />
          ))}
        </div>
      </div>
    </section>
  )
}
