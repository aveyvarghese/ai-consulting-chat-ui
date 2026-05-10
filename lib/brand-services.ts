export const brandServices = [
  {
    title: "AI Automation",
    description:
      "Workflow automation, agentic assistants and operational systems that remove repetitive drag from sales, service and delivery.",
  },
  {
    title: "AI Sales Systems",
    description:
      "Lead capture, qualification and follow-up infrastructure designed to turn demand into cleaner commercial conversations.",
  },
  {
    title: "Brand Intelligence",
    description:
      "Positioning, narrative and decision systems that help premium brands sound sharper and act with strategic consistency.",
  },
  {
    title: "Performance Marketing",
    description:
      "Acquisition loops, creative testing and funnel economics built for efficient scale rather than noisy campaign activity.",
  },
  {
    title: "AI Content Engines",
    description:
      "Content workflows, research systems and creative pipelines that turn expertise into consistent market presence.",
  },
  {
    title: "Website & Funnel Systems",
    description:
      "High-converting websites, landing pages and funnel architecture connected to analytics, CRM and automation.",
  },
] as const

export type BrandService = (typeof brandServices)[number]
