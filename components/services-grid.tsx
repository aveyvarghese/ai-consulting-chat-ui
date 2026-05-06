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
    description: "Transform your business with cutting-edge AI strategies and implementation roadmaps.",
    icon: Brain,
  },
  {
    title: "Digital Marketing",
    description: "Data-driven campaigns that maximize ROI and accelerate your digital presence.",
    icon: BarChart3,
  },
  {
    title: "Performance Marketing",
    description: "Precision-targeted advertising that converts prospects into loyal customers.",
    icon: Target,
  },
  {
    title: "Creative & Branding",
    description: "Distinctive brand identities that resonate and leave lasting impressions.",
    icon: Palette,
  },
  {
    title: "SEO / AEO / GEO",
    description: "Optimize for search engines, AI engines, and generative experiences.",
    icon: Search,
  },
  {
    title: "Go-To-Market Strategy",
    description: "Launch products and enter markets with strategic precision and impact.",
    icon: Rocket,
  },
]

export function ServicesGrid() {
  return (
    <section className="relative px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive AI-powered solutions to accelerate your business growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="group relative p-6 md:p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 hover:border-border/80 hover:bg-card/60 transition-all duration-300 cursor-pointer">
      {/* Glassmorphism highlight on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/80 text-primary mb-5 group-hover:bg-primary/10 transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3">
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
