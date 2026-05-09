export const brandServices = [
  {
    title: "AI Consulting",
    description:
      "Executive-grade AI roadmaps, governance and adoption — so intelligence compounds, not confuses.",
  },
  {
    title: "Branding",
    description:
      "Distinct positioning, narrative systems and visual language engineered for premium markets.",
  },
  {
    title: "Growth Strategy",
    description:
      "Revenue architecture, channel mix and sequencing designed for durable expansion, not spikes.",
  },
  {
    title: "Performance Marketing",
    description:
      "Attribution-aware acquisition loops, creative testing and budget efficiency at scale.",
  },
  {
    title: "AI Automation",
    description:
      "Workflow orchestration and agentic systems that remove drag from sales, ops and support.",
  },
  {
    title: "Website Systems",
    description:
      "High-converting digital estates — performance, content and integrations built as one system.",
  },
] as const

export type BrandService = (typeof brandServices)[number]
