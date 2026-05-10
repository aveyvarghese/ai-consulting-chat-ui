/** Visitor-facing strategic brief (screen + email). No scores or raw model dumps. */

export type StrategicBriefFields = {
  businessContext: string
  keyChallenge: string
  recommendedDirection: string
  prioritySystem: string
  suggestedNextStep: string
}

export type StrategicBriefPayload =
  | { complete: true; fields: StrategicBriefFields }
  | { complete: false }
