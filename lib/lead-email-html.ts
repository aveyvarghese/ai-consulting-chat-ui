/**
 * Premium Resend HTML for lead enquiries — Executive Sunrise palette (email-safe hex).
 */

import type { LeadData } from "@/lib/lead-data"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import type { PublicServiceRecommendation } from "@/lib/service-routing"
import type { StrategicBriefPayload } from "@/lib/strategic-brief-types"
import { VISITOR_PUBLIC_LABEL } from "@/lib/lead-intelligence"

/** Approximates default Executive Sunrise: warm paper, ink, ember CTA, blue accent */
const C = {
  bg: "#FAFAF7",
  card: "#FFFFFF",
  ink: "#1B2430",
  muted: "#5A6570",
  hairline: "#E4DDD2",
  accentBg: "#EEF3FB",
  accentBorder: "#C8D4EE",
  primary: "#B54E12",
  primarySoft: "#FDF6F0",
  primaryBorder: "#E8C9AE",
} as const

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function preBlock(text: string): string {
  const t = text.trim() || "—"
  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:${C.ink};white-space:pre-wrap;margin:0;">${esc(t)}</div>`
}

function row(label: string, value: string): string {
  const v = value.trim() || "—"
  return `<tr>
  <td style="padding:10px 14px 10px 0;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};vertical-align:top;width:168px;">${esc(label)}</td>
  <td style="padding:10px 0;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.45;color:${C.ink};vertical-align:top;">${esc(v)}</td>
</tr>`
}

function sectionTitle(title: string): string {
  return `<tr><td colspan="2" style="padding:20px 0 8px 0;">
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.primary};border-bottom:1px solid ${C.hairline};padding-bottom:8px;">${esc(title)}</div>
</td></tr>`
}

const STRATEGIC_BRIEF_PENDING =
  "Brief will be completed after our strategy review."

function strategicBriefEmailBlock(
  strategicBrief: StrategicBriefPayload | null | undefined
): string {
  if (strategicBrief == null) return ""
  if (!strategicBrief.complete) {
    return `${sectionTitle("Strategic brief")}<tr><td colspan="2" style="padding:4px 0 12px 0;">
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.55;color:${C.muted};border-left:3px solid ${C.primaryBorder};padding:12px 14px;background:${C.primarySoft};border-radius:0 10px 10px 0;">${esc(STRATEGIC_BRIEF_PENDING)}</div>
</td></tr>`
  }
  const f = strategicBrief.fields
  return `${sectionTitle("Strategic brief")}${[
    row("Business context", f.businessContext),
    row("Key challenge", f.keyChallenge),
    row("Recommended direction", f.recommendedDirection),
    row("Priority system to build", f.prioritySystem),
    row("Suggested next step", f.suggestedNextStep),
  ].join("")}`
}

function scorePill(score: string): string {
  const s = score.trim()
  const bg =
    s === "High"
      ? "#FDF6F0"
      : s === "Low"
        ? "#F4F5F7"
        : "#FAF8F3"
  const border =
    s === "High" ? C.primaryBorder : s === "Low" ? "#D5D9DE" : "#E8DFD2"
  const fg = s === "High" ? C.primary : C.ink
  return `<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;background:${bg};border:1px solid ${border};color:${fg};">${esc(s)}</span>`
}

export interface LeadEnquiryEmailInput {
  intelligence: LeadIntelligenceResult
  leadData: LeadData
  professionalSummary: string
  transcriptExcerpt: string
  businessVertical: string
  businessStage: string
  submittedSource: string
  submittedAt: Date
  attachmentsLine: string
  /** Visitor-facing routing card mirrored for the team (no scores). */
  serviceRecommendation?: PublicServiceRecommendation | null
  /** Post-submit strategic brief (screen + email). */
  strategicBrief?: StrategicBriefPayload | null
}

function first(...vals: string[]): string {
  return vals.map((v) => v.trim()).find(Boolean) ?? ""
}

export function buildLeadEnquiryEmailHtml(input: LeadEnquiryEmailInput): string {
  const {
    intelligence: f,
    leadData: ld,
    professionalSummary,
    transcriptExcerpt,
    businessVertical,
    businessStage,
    submittedSource,
    submittedAt,
    attachmentsLine,
    serviceRecommendation,
    strategicBrief,
  } = input

  const visitorLabel =
    VISITOR_PUBLIC_LABEL[f.visitorType as keyof typeof VISITOR_PUBLIC_LABEL] ??
    f.visitorType

  const name = first(ld.name, f.name)
  const company = first(ld.company, f.company)
  const role = first(f.role)
  const email = first(ld.email, f.email)
  const phone = first(ld.phone, f.whatsApp)
  const website = ld.website.trim()
  const instagram = ld.instagram.trim()
  const webIg = [website, instagram].filter(Boolean).join(" · ") || "—"

  const vertical = first(f.businessVertical, businessVertical)
  const stage = first(f.businessStage, businessStage)
  const businessType = [visitorLabel, vertical, stage].filter(Boolean).join(" · ")

  const pain = first(f.currentChallenge, ld.notes)
  const serviceDirection = first(f.servicesInterested, ld.service)
  const summary = first(professionalSummary.trim(), f.consultantSummary.trim())

  const tsUtc = submittedAt.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC")
  let tsLocal = tsUtc
  try {
    tsLocal = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(submittedAt)
    tsLocal = `${tsLocal} (IST)`
  } catch {
    /* ignore */
  }

  const contactRows = [
    row("Name", name),
    row("Company / brand", company),
    row("Role", role),
    row("Email", email),
    row("Phone / WhatsApp", phone),
    row("Website / Instagram", webIg),
  ].join("")

  const strategicCell = `${scorePill(f.leadScore)}<span style="display:inline-block;margin-left:10px;font-size:14px;font-weight:400;color:${C.muted};">${esc(f.leadScoreRationale)}</span>`

  const routingRows =
    serviceRecommendation &&
    serviceRecommendation.directionLabel.trim()
      ? [
          row("Session routing — direction", serviceRecommendation.directionLabel),
          row("Session routing — context", serviceRecommendation.whyItMatters),
          row(
            "Session routing — next step",
            serviceRecommendation.suggestedNextStep
          ),
        ].join("")
      : ""

  const bodyRows = [
    row("Business context", businessType || "—"),
    row("Key pain point", pain),
    row("Recommended service direction", serviceDirection),
    routingRows,
    `<tr>
  <td style="padding:10px 14px 10px 0;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};vertical-align:top;width:168px;">Strategic priority</td>
  <td style="padding:10px 0;vertical-align:top;">${strategicCell}</td>
</tr>`,
    row("Attachments", attachmentsLine),
    row("Submitted from", submittedSource),
    row("Received", `${tsLocal} · ${tsUtc}`),
  ].join("")

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};padding:28px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${C.card};border:1px solid ${C.hairline};border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(27,36,48,0.06);">
        <tr><td style="padding:22px 26px;background:linear-gradient(180deg,${C.accentBg} 0%,${C.card} 100%);border-bottom:1px solid ${C.accentBorder};">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:600;color:${C.ink};letter-spacing:-0.02em;">Pxl<span style="color:${C.primary};">Brief</span></div>
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;color:${C.muted};margin-top:6px;letter-spacing:0.04em;text-transform:uppercase;">New enquiry · internal</div>
        </td></tr>
        <tr><td style="padding:22px 26px 8px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${sectionTitle("Contact")}${contactRows}</table>
        </td></tr>
        <tr><td style="padding:4px 26px 8px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${sectionTitle("Brief intelligence")}${bodyRows}</table>
        </td></tr>
        <tr><td style="padding:8px 26px 22px 26px;">
          ${sectionTitle("Conversation summary")}
          <table role="presentation" width="100%"><tr><td style="padding:4px 0 0 0;">${preBlock(summary)}</td></tr></table>
        </td></tr>
        <tr><td style="padding:0 26px 8px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${strategicBriefEmailBlock(strategicBrief)}</table>
        </td></tr>
        <tr><td style="padding:0 26px 22px 26px;">
          ${sectionTitle("Session excerpt")}
          <table role="presentation" width="100%"><tr><td style="padding:4px 0 0 0;">${preBlock(transcriptExcerpt.slice(0, 2800))}</td></tr></table>
        </td></tr>
        <tr><td style="padding:14px 26px;background:${C.primarySoft};border-top:1px solid ${C.primaryBorder};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;color:${C.muted};line-height:1.5;">
          Reply directly to the visitor when their email is on file. This message was generated by PxlBrief lead routing.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function buildLeadEnquiryEmailText(input: LeadEnquiryEmailInput): string {
  const {
    intelligence: f,
    leadData: ld,
    professionalSummary,
    transcriptExcerpt,
    businessVertical,
    businessStage,
    submittedSource,
    submittedAt,
    attachmentsLine,
    serviceRecommendation,
    strategicBrief,
  } = input
  const visitorLabel =
    VISITOR_PUBLIC_LABEL[f.visitorType as keyof typeof VISITOR_PUBLIC_LABEL] ??
    f.visitorType

  const lines = [
    "PxlBrief — new enquiry",
    "",
    "CONTACT",
    `Name: ${first(ld.name, f.name) || "—"}`,
    `Company: ${first(ld.company, f.company) || "—"}`,
    `Role: ${f.role.trim() || "—"}`,
    `Email: ${first(ld.email, f.email) || "—"}`,
    `Phone / WhatsApp: ${first(ld.phone, f.whatsApp) || "—"}`,
    `Website / Instagram: ${[ld.website, ld.instagram].filter((x) => x.trim()).join(" · ") || "—"}`,
    "",
    "BUSINESS",
    `Type: ${visitorLabel}`,
    `Vertical: ${first(f.businessVertical, businessVertical) || "—"}`,
    `Stage: ${first(f.businessStage, businessStage) || "—"}`,
    "",
    "KEY PAIN POINT",
    f.currentChallenge.trim() || ld.notes.trim() || "—",
    "",
    "CONVERSATION SUMMARY",
    professionalSummary.trim() || f.consultantSummary.trim() || "—",
    "",
    ...(strategicBrief != null
      ? [
          "STRATEGIC BRIEF",
          ...(strategicBrief.complete
            ? [
                `Business context: ${strategicBrief.fields.businessContext}`,
                `Key challenge: ${strategicBrief.fields.keyChallenge}`,
                `Recommended direction: ${strategicBrief.fields.recommendedDirection}`,
                `Priority system to build: ${strategicBrief.fields.prioritySystem}`,
                `Suggested next step: ${strategicBrief.fields.suggestedNextStep}`,
              ]
            : [STRATEGIC_BRIEF_PENDING]),
          "",
        ]
      : []),
    "RECOMMENDED SERVICE DIRECTION",
    f.servicesInterested.trim() || ld.service.trim() || "—",
    "",
    ...(serviceRecommendation?.directionLabel.trim()
      ? [
          "SESSION ROUTING (from chat)",
          `Direction: ${serviceRecommendation.directionLabel.trim()}`,
          `Context: ${serviceRecommendation.whyItMatters.trim()}`,
          `Suggested next step: ${serviceRecommendation.suggestedNextStep.trim()}`,
          "",
        ]
      : []),
    "STRATEGIC PRIORITY",
    `Lead score: ${f.leadScore}`,
    f.leadScoreRationale.trim() || "—",
    "",
    "ATTACHMENTS",
    attachmentsLine,
    "",
    "SUBMITTED PAGE / SOURCE",
    submittedSource,
    "",
    "TIMESTAMP (UTC)",
    submittedAt.toISOString(),
    "",
    "SESSION EXCERPT",
    transcriptExcerpt.slice(0, 3200),
  ]
  return lines.join("\n")
}
