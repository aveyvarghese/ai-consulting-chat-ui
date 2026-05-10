import { track } from "@vercel/analytics"

export const AnalyticsEvent = {
  START_AI_CONSULTATION: "Start AI Consultation",
  SUBMIT_ENQUIRY: "Submit Enquiry",
  REQUEST_STRATEGIC_SESSION: "Request Strategic Session",
  CHAT_OPENED: "Chat opened",
} as const

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent]

type EventProps = Record<string, string | number | boolean | null | undefined>

/**
 * Vercel Web Analytics custom event. Call only from client components
 * (or code that runs after the Analytics script is on the page).
 */
export function trackAnalyticsEvent(name: AnalyticsEventName, props?: EventProps) {
  try {
    track(name, props)
  } catch {
    /* no-op */
  }
}
