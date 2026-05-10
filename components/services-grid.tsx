import {
  Brain,
  Palette,
  TrendingUp,
  Target,
  Workflow,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"
import { brandServices } from "@/lib/brand-services"

const serviceIcons = [
  Workflow,
  TrendingUp,
  Brain,
  Target,
  Palette,
  LayoutGrid,
] as const

const services = brandServices.map((s, i) => ({
  ...s,
  icon: serviceIcons[i]!,
}))

export function ServicesGrid() {
  return (
    <section
      id="what-we-build"
      className="relative scroll-mt-24 px-4 pb-24 pt-10 md:pb-32 md:pt-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/[0.055] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[min(92vw,920px)] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              What We Build
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground md:text-[2.65rem]">
              Intelligent infrastructure for brands ready to move faster.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
              AI-native execution
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-base md:leading-relaxed">
              Strategy, creative, automation and performance systems — built as
              one commercial operating layer.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <article className="group relative cursor-default overflow-hidden rounded-[1.25rem] border border-white/[0.075] bg-gradient-to-b from-card/[0.58] to-card/[0.28] p-6 shadow-[0_1px_0_0_oklch(1_0_0/0.045)_inset,0_22px_52px_-38px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/32 hover:bg-card/[0.62] hover:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.72),0_0_48px_-28px_oklch(0.75_0.12_180/0.85)] md:p-8">
      <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-primary/[0.075] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-primary/[0.065] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[0.75rem] border border-primary/20 bg-primary/[0.09] text-primary shadow-[0_0_32px_-20px_oklch(0.75_0.12_180/0.9)] transition-all duration-300 ease-out group-hover:border-primary/40 group-hover:bg-primary/[0.14] group-hover:shadow-[0_0_42px_-18px_oklch(0.75_0.12_180/1)]">
          <Icon className="h-5 w-5" strokeWidth={1.65} />
        </div>

        <h3 className="mb-2.5 text-base font-semibold tracking-[-0.01em] text-foreground md:text-lg">
          {title}
        </h3>

        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm md:leading-[1.75]">
          {description}
        </p>
      </div>
    </article>
  )
}
