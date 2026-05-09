import {
  Brain,
  Palette,
  TrendingUp,
  Target,
  Workflow,
  LayoutGrid,
} from "lucide-react"

const services = [
  {
    title: "AI Consulting",
    description:
      "Executive-grade AI roadmaps, governance and adoption — so intelligence compounds, not confuses.",
    icon: Brain,
  },
  {
    title: "Branding",
    description:
      "Distinct positioning, narrative systems and visual language engineered for premium markets.",
    icon: Palette,
  },
  {
    title: "Growth Strategy",
    description:
      "Revenue architecture, channel mix and sequencing designed for durable expansion, not spikes.",
    icon: TrendingUp,
  },
  {
    title: "Performance Marketing",
    description:
      "Attribution-aware acquisition loops, creative testing and budget efficiency at scale.",
    icon: Target,
  },
  {
    title: "AI Automation",
    description:
      "Workflow orchestration and agentic systems that remove drag from sales, ops and support.",
    icon: Workflow,
  },
  {
    title: "Website Systems",
    description:
      "High-converting digital estates — performance, content and integrations built as one system.",
    icon: LayoutGrid,
  },
]

export function ServicesGrid() {
  return (
    <section className="relative px-4 pb-24 pt-6 md:pb-32 md:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.04] to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl md:mb-16">
          <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/85">
            Capabilities
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2.25rem]">
            Full-stack intelligence for ambitious brands
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground/90 md:text-lg md:leading-relaxed">
            Strategy, creative and systems — unified under an AI-native
            operating model.
          </p>
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
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <article className="group relative cursor-default overflow-hidden rounded-[1.125rem] border border-white/[0.07] bg-card/[0.38] p-6 shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-8 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/[0.52] hover:shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55),0_0_0_1px_oklch(0.75_0.12_180/0.08)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/[0.06] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.125rem] bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[0.625rem] border border-primary/18 bg-primary/[0.09] text-primary transition-all duration-300 ease-out group-hover:border-primary/35 group-hover:bg-primary/[0.14]">
          <Icon className="h-5 w-5" strokeWidth={1.65} />
        </div>

        <h3 className="mb-2.5 text-[0.9375rem] font-semibold tracking-tight text-foreground md:text-base">
          {title}
        </h3>

        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm md:leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  )
}
