export function SiteAmbient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,var(--ambient-mid),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_50%,var(--ambient-side),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_0%_80%,var(--ambient-floor),transparent_45%)]" />
      <div
        className="absolute -left-[20%] top-[15%] h-[min(55vw,480px)] w-[min(55vw,480px)] rounded-full blur-[100px]"
        style={{
          animation: "pxl-drift 28s ease-in-out infinite",
          backgroundColor: "var(--ambient-orb-a)",
        }}
      />
      <div
        className="absolute -right-[15%] bottom-[10%] h-[min(45vw,420px)] w-[min(45vw,420px)] rounded-full blur-[90px]"
        style={{
          animation: "pxl-drift 32s ease-in-out infinite reverse",
          backgroundColor: "var(--ambient-orb-b)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />
    </div>
  )
}
