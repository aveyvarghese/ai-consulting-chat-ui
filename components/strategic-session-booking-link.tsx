"use client"

import { AnalyticsEvent, trackAnalyticsEvent } from "@/lib/analytics-events"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"

type StrategicSessionBookingLinkProps = {
  href?: string
  className: string
  children: React.ReactNode
  /** Where the click originated (for analytics breakdown) */
  source?: string
}

export function StrategicSessionBookingLink({
  href = STRATEGY_CALL_BOOKING_URL,
  className,
  children,
  source = "unknown",
}: StrategicSessionBookingLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackAnalyticsEvent(AnalyticsEvent.REQUEST_STRATEGIC_SESSION, {
          source,
        })
      }
    >
      {children}
    </a>
  )
}
