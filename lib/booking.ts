/**
 * Single source for every strategy-call / Cal booking CTA.
 * Optional override: NEXT_PUBLIC_STRATEGY_CALL_BOOKING_URL (full https URL).
 */
export const STRATEGY_CALL_BOOKING_URL: string =
  process.env.NEXT_PUBLIC_STRATEGY_CALL_BOOKING_URL?.trim() ||
  "https://cal.com/avey-varghese-aioggo/strategy-call"
