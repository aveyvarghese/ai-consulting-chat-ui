export type ExecutiveSignalConfidence =
  | "Emerging"
  | "Moderate"
  | "Strong pattern"

export type ExecutiveSignalItem = {
  title: string
  typicalImpact: string
  confidence: ExecutiveSignalConfidence
}
