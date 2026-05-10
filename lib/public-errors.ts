/** Safe copy for any chat/API failure shown in the product UI */
export const PUBLIC_SUPPORT_EMAIL_MESSAGE =
  "Something went wrong. Please email info@pxlbrief.com."

const ENQUIRY_FILE_TOO_LARGE = /too large to attach/i

/** Lead / enquiry submit: keep actionable client errors; hide server/API detail */
export function sanitizeEnquirySubmitErrorMessage(raw: string): string {
  if (ENQUIRY_FILE_TOO_LARGE.test(raw)) return raw
  return PUBLIC_SUPPORT_EMAIL_MESSAGE
}
