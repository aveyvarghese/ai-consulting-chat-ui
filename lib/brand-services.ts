export const brandServices = [
  {
    title: "Intelligence & AI systems",
    description:
      "Decision-grade models, data contracts, and governance—so automation compounds instead of fragmenting.",
  },
  {
    title: "Positioning & narrative",
    description:
      "Clear thesis, proof, and language systems for markets where trust is earned in inches, not slogans.",
  },
  {
    title: "Growth architecture",
    description:
      "Revenue sequencing, channel economics, and the instrumentation leadership can defend in review.",
  },
  {
    title: "Acquisition & performance",
    description:
      "Attribution-aware spend, creative learning loops, and efficiency at the pace of your P&L.",
  },
  {
    title: "Automation architecture",
    description:
      "Workflow design across sales, ops, and service—fewer handoffs, fewer leaks, fewer heroic saves.",
  },
  {
    title: "Digital estates",
    description:
      "Sites and product surfaces treated as systems: performance, content, and integrations in one stack.",
  },
] as const

export type BrandService = (typeof brandServices)[number]
