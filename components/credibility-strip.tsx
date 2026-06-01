const CAPABILITIES = [
  "AI Growth Consulting",
  "Brand Strategy",
  "Performance Growth",
  "CRM Systems",
  "Executive Intelligence",
  "Market Intelligence",
] as const

function CapabilityPill({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 font-mono text-xs text-slate-400 transition-all duration-300 hover:border-cyan-500/30 hover:text-white">
      {label}
    </span>
  )
}

export function CredibilityStrip() {
  const sequence = [...CAPABILITIES, ...CAPABILITIES]

  return (
    <section
      className="relative z-10 w-full border-t border-white/5 bg-black pb-8 pt-16"
      aria-label="Practice areas"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] opacity-70"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-7xl space-y-4 px-4 md:px-8">
        <div className="text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            AI-native growth systems for founder-led businesses
          </p>
        </div>

        {/* Desktop: calm marquee */}
        <div className="hidden overflow-hidden py-2 md:block">
          <div className="pxl-credibility-marquee flex w-max gap-2 px-1 motion-reduce:animate-none lg:gap-3">
            {sequence.map((label, i) => (
              <CapabilityPill key={`${label}-${i}`} label={label} />
            ))}
          </div>
        </div>

        {/* Mobile: horizontal snap scroll, no infinite motion */}
        <div
          className="flex items-center justify-start gap-2 overflow-x-auto overscroll-x-contain px-1 py-2 [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
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
