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
    <section
      className={cn(
        "relative z-10 w-full overflow-hidden border-t border-white/5 bg-black text-white",
        compact
          ? "rounded-2xl border border-white/10 px-4 py-6"
          : "px-4 py-20 md:px-8"
      )}
      aria-label="AI audit tools preview"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vw] max-h-[500px] w-[80vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.03] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />

      <div className={cn("relative z-[1] mx-auto space-y-8", compact ? "max-w-2xl" : "max-w-7xl space-y-12")}>
        <div
          className={cn(
            "space-y-3",
            compact ? "max-w-xl" : "max-w-3xl"
          )}
        >
          <div>
            <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
              Digital presence preview
            </p>
            <h2
              className={cn(
                "mt-2 font-black leading-tight tracking-tight text-white",
                compact ? "text-2xl" : "text-3xl md:text-5xl"
              )}
            >
              AI audit tools
            </h2>
          </div>

          <p
            className={cn(
              "max-w-2xl font-light leading-relaxed text-slate-400",
              compact ? "text-sm" : "text-sm md:text-base"
            )}
          >
            Run quick AI-led audits across your social presence, website visibility,
            answer readiness, and generative search readiness.
          </p>
        </div>

        <ul className={cn("grid grid-cols-1 gap-4 md:gap-6", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
          {auditTools.map((tool, index) => (
            <li
              key={tool.key}
              className={cn(
                "group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A]/40 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A0A0A]/80",
                index < 3
                  ? "hover:border-cyan-500/30"
                  : "hover:border-purple-500/30",
                compact
                  ? "min-h-[150px] p-5"
                  : "min-h-[180px] p-6 md:p-8",
                !compact && index === 0 ? "lg:min-h-[220px]" : "",
                !compact && index === 2 ? "lg:translate-y-8" : "",
                !compact && index === 3 ? "lg:-translate-y-4" : "",
                !compact && index === 5 ? "lg:-translate-y-8" : ""
              )}
            >
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 transition-colors",
                    index < 3
                      ? "group-hover:text-cyan-400"
                      : "group-hover:text-purple-400"
                  )}
                >
                  <tool.icon
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1 text-lg font-bold leading-tight tracking-tight text-white">
                    {tool.label}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-slate-400 md:text-sm">
                    {tool.description}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                  index < 3
                    ? "bg-gradient-to-r from-cyan-500 to-transparent"
                    : "bg-gradient-to-r from-purple-500 to-transparent"
                )}
                aria-hidden
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center space-y-3 pt-4">
          <Link
            href="/ai-lab#ai-audit-tools"
            className={cn(
              "inline-flex touch-manipulation items-center justify-center rounded-full bg-gradient-to-r from-[#ff7f50] to-[#ffa07a] text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,127,80,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(255,127,80,0.45)]",
              compact ? "min-h-11 w-full px-6 py-3" : "w-full px-8 py-3.5 sm:w-auto"
            )}
          >
            Explore AI Audit Tools
          </Link>
          <p className="text-center font-mono text-[10px] tracking-wider text-slate-500 md:text-xs">
            Directional audits first. Deeper report available after submission.
          </p>
        </div>
      </div>
    </section>
  )
}
