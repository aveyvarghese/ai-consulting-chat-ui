/**
 * Visitor-facing follow-up after enquiry — Executive Sunrise palette (email-safe hex).
 * No scores, no internal labels, no raw JSON.
 */

import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import type { PublicServiceRecommendation } from "@/lib/service-routing"
import type { StrategicBriefPayload } from "@/lib/strategic-brief-types"

const SUBJECT_LINES = [
  "Your PxlBrief Strategic Brief",
  "Initial Strategic Intelligence Summary",
  "Your AI Growth & Operations Snapshot",
] as const

/** Warm white / sunrise accents — readable in Gmail, Apple Mail, Outlook basics */
const C = {
  bg: "#FAF8F5",
  card: "#FFFFFF",
  ink: "#1A222C",
  muted: "#5C6670",
  hairline: "#E6DFD4",
  gold: "#B8860B",
  cta: "#B54E12",
} as const

const DISCLAIMER =
  "This is an initial AI-assisted strategic assessment based on the submitted conversation."

const CTA_LABEL = "Book Strategic Session"

const VISITOR_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidVisitorEmail(email: string): boolean {
  return VISITOR_EMAIL_REGEX.test(email.trim())
}

export function pickVisitorFollowUpSubject(visitorEmail: string): string {
  const key = visitorEmail.trim().toLowerCase()
  let n = 0
  for (let i = 0; i < key.length; i++) n += key.charCodeAt(i)
  return SUBJECT_LINES[n % SUBJECT_LINES.length]!
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function clamp(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + "…"
}

function greetingName(fullName: string): string {
  const t = fullName.trim()
  if (!t) return "there"
  const first = t.split(/\s+/)[0] ?? t
  if (!first) return "there"
  const safe = first.length > 48 ? first.slice(0, 48) : first
  return safe.replace(/^./, (c) => c.toUpperCase())
}

export type VisitorFollowUpInput = {
  name: string
  professionalSummary: string
  strategicBrief: StrategicBriefPayload
  intelligence: Pick<
    LeadIntelligenceResult,
    | "currentChallenge"
    | "servicesInterested"
    | "consultantSummary"
    | "businessVertical"
    | "businessStage"
  >
  serviceRecommendation: PublicServiceRecommendation | null
}

type ResolvedSections = {
  businessSummary: string
  keyObservations: string
  recommendedDirection: string
  strategicPriorities: string
  suggestedNextStep: string
}

function resolveSections(input: VisitorFollowUpInput): ResolvedSections {
  const { professionalSummary, strategicBrief, intelligence, serviceRecommendation } =
    input
  const prof = professionalSummary.trim()
  const intelSummary = intelligence.consultantSummary.trim()

  if (strategicBrief.complete === true && strategicBrief.fields) {
    const f = strategicBrief.fields
    return {
      businessSummary: clamp(prof || f.businessContext, 900),
      keyObservations: clamp(f.keyChallenge, 700),
      recommendedDirection: clamp(f.recommendedDirection, 700),
      strategicPriorities: clamp(f.prioritySystem, 700),
      suggestedNextStep: clamp(f.suggestedNextStep, 500),
    }
  }

  const businessSummary = clamp(
    prof || intelSummary || `${intelligence.businessVertical} · ${intelligence.businessStage}`.trim(),
    900
  )
  const keyObservations = clamp(
    intelligence.currentChallenge.trim() ||
      prof.slice(0, 400) ||
      intelSummary.slice(0, 400),
    700
  )
  const recommendedDirection = clamp(
    serviceRecommendation?.directionLabel.trim() ||
      intelligence.servicesInterested.trim() ||
      "A focused conversation to align scope, sequencing, and ownership before execution spreads.",
    700
  )
  const strategicPriorities = clamp(
    serviceRecommendation?.whyItMatters.trim() ||
      "Clarify where leadership attention and operating cadence should concentrate over the next quarter.",
    700
  )
  const suggestedNextStep = clamp(
    serviceRecommendation?.suggestedNextStep.trim() ||
      "Book a strategy session so we can pressure-test assumptions and agree sensible next moves together.",
    500
  )

  return {
    businessSummary,
    keyObservations,
    recommendedDirection,
    strategicPriorities,
    suggestedNextStep,
  }
}

function sectionBlock(title: string, body: string): string {
  const b = body.trim()
  if (b.length < 8) return ""
  return `<tr>
<td style="padding:0 0 22px 0;">
  <p style="margin:0 0 6px 0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:650;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};">${esc(title)}</p>
  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.58;color:${C.ink};">${esc(clamp(b, 1200))}</p>
</td>
</tr>`
}

export function buildVisitorFollowUpEmailHtml(input: VisitorFollowUpInput): string {
  const name = greetingName(input.name)
  const bookingUrl = STRATEGY_CALL_BOOKING_URL.trim()
  const href =
    bookingUrl.startsWith("http://") || bookingUrl.startsWith("https://")
      ? bookingUrl
      : `https://${bookingUrl}`

  const s = resolveSections(input)

  const sections = [
    sectionBlock("Business summary", s.businessSummary),
    sectionBlock("Key operational & growth observations", s.keyObservations),
    sectionBlock("Recommended direction", s.recommendedDirection),
    sectionBlock("Strategic priorities", s.strategicPriorities),
    sectionBlock("Suggested next step", s.suggestedNextStep),
  ].join("")

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};">
<tr><td align="center" style="padding:28px 16px 40px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
  <tr><td style="background:${C.card};border:1px solid ${C.hairline};border-radius:14px;box-shadow:0 2px 24px rgba(40,48,64,0.06);overflow:hidden;padding:0;">
    <div style="height:3px;background:linear-gradient(90deg,#E8D5B8,#D4A574,#C47026,#D4A574,#E8D5B8);"></div>
    <div style="padding:26px 22px 30px 22px;">
    <p style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.45;color:${C.ink};">
      Hello${name === "there" ? "" : `, ${esc(name)}`} —
    </p>
    <p style="margin:0 0 26px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.62;color:${C.muted};">
      Thank you for the brief you shared with PxlBrief. Below is a concise read of what stood out from our exchange.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${sections}
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 26px 0;">
      <tr>
        <td style="border-radius:10px;background:${C.cta};">
          <a href="${esc(href)}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;padding:14px 26px;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;font-weight:600;letter-spacing:0.02em;color:#FFFFFF;text-decoration:none;border-radius:10px;">
            ${esc(CTA_LABEL)}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px 0;padding-top:4px;border-top:1px solid ${C.hairline};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.55;color:${C.muted};">
      ${esc(DISCLAIMER)}
    </p>
    <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;line-height:1.5;color:${C.muted};">
      PxlBrief · <a href="${esc(href)}" style="color:${C.gold};text-decoration:none;font-weight:500;">${esc(CTA_LABEL)}</a>
    </p>
    </div>
  </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

export function buildVisitorFollowUpEmailText(input: VisitorFollowUpInput): string {
  const name = greetingName(input.name)
  const s = resolveSections(input)
  const bookingUrl = STRATEGY_CALL_BOOKING_URL.trim()
  const href =
    bookingUrl.startsWith("http://") || bookingUrl.startsWith("https://")
      ? bookingUrl
      : `https://${bookingUrl}`

  const lines = [
    name === "there" ? "Hello —" : `Hello, ${name} —`,
    "",
    "Thank you for the brief you shared with PxlBrief. Below is a concise read of what stood out from our exchange.",
    "",
    s.businessSummary.trim().length >= 8
      ? `Business summary\n${s.businessSummary}\n`
      : "",
    s.keyObservations.trim().length >= 8
      ? `Key operational & growth observations\n${s.keyObservations}\n`
      : "",
    s.recommendedDirection.trim().length >= 8
      ? `Recommended direction\n${s.recommendedDirection}\n`
      : "",
    s.strategicPriorities.trim().length >= 8
      ? `Strategic priorities\n${s.strategicPriorities}\n`
      : "",
    s.suggestedNextStep.trim().length >= 8
      ? `Suggested next step\n${s.suggestedNextStep}\n`
      : "",
    `${CTA_LABEL}: ${href}`,
    "",
    DISCLAIMER,
    "",
    "PxlBrief",
  ]
  return lines.filter(Boolean).join("\n")
}
