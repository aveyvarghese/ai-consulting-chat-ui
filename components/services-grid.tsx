import {
  Brain,
  BarChart3,
  Target,
  Palette,
  Search,
  Rocket,
} from "lucide-react"

const services = [
  {
    title: "AI Consulting",
    description: "AI adoption frameworks, automation systems and intelligent business workflows.",
    icon: Brain,
  },
  {
    title: "Digital Marketing",
    description: "Growth-focused digital ecosystems designed for modern customer acquisition.",
    icon: BarChart3,
  },
  {
    title: "Performance Marketing",
    description: "Performance-led acquisition systems focused on scalable ROI.",
    icon: Target,
  },
  {
    title: "Creative & Branding",
    description: "Strategic brand positioning and identity systems built for premium perception.",
    icon: Palette,
  },
  {
    title: "SEO / AEO / GEO",
    description: "Search visibility optimization across traditional and AI-driven discovery platforms.",
    icon: Search,
  },
  {
    title: "Go-To-Market Strategy",
    description: "Launch and market-entry systems designed for rapid business scale.",
    icon: Rocket,
  },
]

export function ServicesGrid() {
  return (
    <section className="relative px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
    <div className="group relative p-6 md:p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 cursor-pointer">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary/60 text-primary mb-5 group-hover:bg-primary/15 transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground mb-2.5">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
