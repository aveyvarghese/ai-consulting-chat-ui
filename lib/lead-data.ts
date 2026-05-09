/**
 * Session-scoped structured lead memory for the chat UI.
 * Populated heuristically from user messages + conversation snapshot.
 * Intended to merge later with `/api/lead` submit payloads.
 */

import type { ConversationStatePayload } from "@/lib/conversation-state"

export type LeadVisitorType =
  | "potential_client"
  | "job_seeker"
  | "vendor"
  | "unknown"

export interface LeadData {
  visitorType: LeadVisitorType
  name: string
  company: string
  website: string
  instagram: string
  service: string
  email: string
  phone: string
  notes: string
}

export function createInitialLeadData(): LeadData {
  return {
    visitorType: "unknown",
    name: "",
    company: "",
    website: "",
    instagram: "",
    service: "",
    email: "",
    phone: "",
    notes: "",
  }
}

function pickNonEmpty(current: string, next: string): string {
  const t = next.trim()
  if (!t) return current
  return t
}

function userTranscript(messages: { role: string; content: string }[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n")
}

function extractEmail(text: string): string {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return m?.[0]?.trim() ?? ""
}

function extractWebsite(text: string): string {
  const url =
    text.match(/\bhttps?:\/\/[^\s<>"')]+[^\s<>"').,]/i)?.[0] ??
    text.match(/\bwww\.[a-z0-9.-]+\.[a-z]{2,}[^\s<>"').,]*/i)?.[0]
  if (url) return url.trim()
  const bare = text.match(
    /\b(?:[a-z0-9-]+\.)+(?:com|in|co|io|ai|app|net|org|shop|store)\b/i
  )
  if (bare && !/@/.test(bare[0])) return bare[0].trim()
  return ""
}

function extractInstagram(text: string): string {
  const igUrl = text.match(
    /instagram\.com\/([A-Za-z0-9._]{1,30})(?:\/|\?|\s|$)/i
  )
  if (igUrl?.[1]) return `@${igUrl[1]}`
  const at = text.match(/@([A-Za-z0-9._]{2,30})\b/)
  if (at?.[1] && !/@\d/.test(at[0])) {
    const h = at[1]
    if (/^(gmail|yahoo|hotmail|outlook|icloud)\b/i.test(h)) return ""
    return `@${h}`
  }
  return ""
}

function extractPhone(text: string): string {
  const labeled = text.match(
    /(?:phone|mobile|whatsapp|wa|call\s+me|reach\s+me|contact)[:\s#-]*(\+?[\d][\d\s().-]{8,16}\d)/i
  )
  if (labeled?.[1]) return labeled[1].replace(/\s+/g, " ").trim()
  const intl = text.match(/\+?\d[\d\s().-]{10,18}\d/)
  return intl?.[0]?.replace(/\s+/g, " ").trim() ?? ""
}

function inferServiceLine(text: string): string {
  const lower = text.toLowerCase()
  const bits: string[] = []
  if (/\bseo\b|\baeo\b/i.test(lower)) bits.push("SEO")
  if (/\bbranding\b|\bbrand\s+identity\b/i.test(lower)) bits.push("Branding")
  if (/\bwebsite\b|\bweb\s+design\b|\blanding\b/i.test(lower)) bits.push("Website")
  if (/\bads?\b|performance|meta\b|facebook|google\s+ads|ppc/i.test(lower))
    bits.push("Performance marketing")
  if (/\bsocial\b|instagram\s+growth|content\s+marketing/i.test(lower))
    bits.push("Social / content")
  if (/\bai\b|automat/i.test(lower)) bits.push("AI / automation")
  if (/\bstrategy|consult/i.test(lower)) bits.push("Strategy / consulting")
  if (/\bdigital\s+marketing\b/i.test(lower)) bits.push("Digital marketing")
  return [...new Set(bits)].join("; ")
}

function synthesizeNotes(
  conv: LeadConversationSnapshot,
  messages: { role: string; content: string }[],
  maxLen = 1500
): string {
  const parts: string[] = []
  if (conv.businessVertical.trim()) {
    parts.push(`Vertical: ${conv.businessVertical.trim()}`)
  }
  if (conv.uploadedFileName.trim()) {
    parts.push(`Attachment: ${conv.uploadedFileName.trim()}`)
  }
  const userMsgs = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.trim())
    .filter(Boolean)
  const tail = userMsgs.slice(-5).map((s) => (s.length > 240 ? `${s.slice(0, 237)}…` : s))
  if (tail.length) {
    parts.push(`Recent visitor messages:\n${tail.map((s) => `- ${s}`).join("\n")}`)
  }
  const block = parts.join("\n\n")
  return block.length <= maxLen ? block : block.slice(0, maxLen - 1) + "…"
}

export type LeadConversationSnapshot = Pick<
  ConversationStatePayload,
  | "visitorType"
  | "name"
  | "company"
  | "email"
  | "whatsapp"
  | "servicesInterested"
  | "businessVertical"
  | "uploadedFileName"
>

/**
 * Merge previous lead memory with latest user text and CRM-style snapshot.
 * Non-destructive: fills empty fields or upgrades with clearer extractions.
 */
export function deriveLeadData(
  prev: LeadData,
  messages: { role: string; content: string }[],
  conv: LeadConversationSnapshot
): LeadData {
  const users = userTranscript(messages)

  const visitorType: LeadVisitorType =
    conv.visitorType !== "unknown" ? conv.visitorType : prev.visitorType

  let name = pickNonEmpty(prev.name, conv.name)
  let company = pickNonEmpty(prev.company, conv.company)
  let email = pickNonEmpty(prev.email, extractEmail(users))
  if (!email) email = pickNonEmpty(prev.email, conv.email)

  let phone = pickNonEmpty(prev.phone, extractPhone(users))
  if (!phone && conv.whatsapp.trim())
    phone = pickNonEmpty(prev.phone, conv.whatsapp)

  let website = pickNonEmpty(prev.website, extractWebsite(users))
  let instagram = pickNonEmpty(prev.instagram, extractInstagram(users))

  let service = pickNonEmpty(prev.service, inferServiceLine(users))
  if (!service) service = pickNonEmpty(prev.service, conv.servicesInterested)

  const notes = synthesizeNotes(conv, messages)

  return {
    visitorType,
    name,
    company,
    website,
    instagram,
    service,
    email,
    phone,
    notes,
  }
}
