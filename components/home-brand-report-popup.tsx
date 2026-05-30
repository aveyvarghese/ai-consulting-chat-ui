"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Sparkles, X } from "lucide-react"
import type { ConversationStatePayload } from "@/lib/conversation-state"
import type { LeadData } from "@/lib/lead-data"

const POPUP_SEEN_KEY = "pxlbrief_brand_report_popup_seen"
const POPUP_DELAY_MS = 4000

type FormState = {
  brandName: string
  mobile: string
  email: string
  brandLink: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialFormState: FormState = {
  brandName: "",
  mobile: "",
  email: "",
  brandLink: "",
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isInstagramLink(value: string): boolean {
  return /^@/.test(value) || /instagram\.com/i.test(value)
}

function trimForm(form: FormState): FormState {
  return {
    brandName: form.brandName.trim(),
    mobile: form.mobile.trim(),
    email: form.email.trim(),
    brandLink: form.brandLink.trim(),
  }
}

function validateForm(form: FormState): FieldErrors {
  const values = trimForm(form)
  const errors: FieldErrors = {}

  if (!values.brandName) errors.brandName = "Brand name is required."
  if (!values.mobile) errors.mobile = "Mobile number is required."
  if (!values.email) {
    errors.email = "Email ID is required."
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email ID."
  }
  if (!values.brandLink) {
    errors.brandLink = "Share a website, Instagram, or LinkedIn link."
  }

  return errors
}

function buildLeadPayload(form: FormState) {
  const values = trimForm(form)
  const conversationSummary = [
    "PXLBRIEF HOMEPAGE BRAND REPORT POPUP",
    "",
    "Source: Homepage Brand Report Popup",
    "Intent type: AI Brand Report Request",
    `Brand name: ${values.brandName}`,
    `Mobile number: ${values.mobile}`,
    `Email: ${values.email}`,
    `Website / Instagram / LinkedIn: ${values.brandLink}`,
    "Page path: /",
    "Lead priority: High",
    "Requested report: Detailed AI brand report",
  ].join("\n")

  const snapshot: ConversationStatePayload = {
    visitorType: "potential_client",
    name: values.brandName,
    company: values.brandName,
    role: "",
    email: values.email,
    whatsapp: values.mobile,
    uploadedFileName: "",
    conversationStage: "client_scheduling_focus",
    potentialClientStage: 5,
    clientCredibilityDelivered: true,
    businessVertical: "Homepage brand report request",
    businessStage: "AI-readiness report requested",
    servicesInterested: "Detailed AI brand report",
    currentChallenge:
      "Identify digital growth, positioning, website, and AI-readiness opportunities.",
    acquisitionChannels: "Homepage /",
    conversationSummary,
  }

  const leadData: LeadData = {
    visitorType: "potential_client",
    name: values.brandName,
    company: values.brandName,
    website: isInstagramLink(values.brandLink) ? "" : values.brandLink,
    instagram: isInstagramLink(values.brandLink) ? values.brandLink : "",
    service: "Detailed AI brand report",
    email: values.email,
    phone: values.mobile,
    notes: conversationSummary,
  }

  return {
    messages: [
      {
        role: "user",
        content: `Brand report requested for ${values.brandName}. Contact: ${values.mobile}, ${values.email}. Brand link: ${values.brandLink}.`,
      },
      {
        role: "assistant",
        content:
          "PxlBrief AI will review the brand for digital growth, positioning, website, and AI-readiness opportunities.",
      },
    ],
    snapshot,
    leadData,
    professionalSummary: conversationSummary,
    serviceRecommendation: {
      directionLabel: "Detailed AI brand report",
      whyItMatters:
        "The visitor requested a detailed AI-led review from the homepage popup.",
      suggestedNextStep:
        "Review the brand link and contact the lead with a tailored AI brand report follow-up.",
    },
    submitSource: "Homepage Brand Report Popup",
  }
}

export function HomeBrandReportPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  )

  const isSubmitting = status === "submitting"
  const hasSubmitted = status === "success"

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.pathname !== "/") return

    try {
      if (window.localStorage.getItem(POPUP_SEEN_KEY) === "true") return
    } catch {
      return
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true)
    }, POPUP_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  function markSeenAndClose() {
    try {
      window.localStorage.setItem(POPUP_SEEN_KEY, "true")
    } catch {
      // localStorage can be unavailable in private contexts; closing should still work.
    }
    setIsVisible(false)
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === "error") setStatus("idle")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadPayload(form)),
      })

      if (!response.ok) throw new Error("Lead submission failed")

      try {
        window.localStorage.setItem(POPUP_SEEN_KEY, "true")
      } catch {
        // The success state still prevents repeat during this page session.
      }
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-x-hidden bg-background/72 px-3 pb-3 pt-8 backdrop-blur-md sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-report-popup-title"
    >
      <div className="relative w-full max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[1.45rem] border border-primary/35 bg-[linear-gradient(145deg,rgba(12,17,20,0.98),rgba(20,24,27,0.98))] p-4 text-foreground shadow-[0_0_45px_rgba(0,224,255,0.14),0_22px_60px_rgba(0,0,0,0.55)] sm:max-w-[27rem] sm:p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />

        <button
          type="button"
          onClick={markSeenAndClose}
          className="absolute right-3 top-3 z-10 rounded-full border border-border/70 bg-background/70 p-2 text-muted-foreground transition hover:border-primary/45 hover:text-primary"
          aria-label="Close AI brand report popup"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI brand report
          </div>

          {hasSubmitted ? (
            <div className="py-5 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground">
                Request received.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We&rsquo;ll review your brand details and follow up with a more
                detailed AI-led report.
              </p>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_28px_rgba(255,122,26,0.22)] transition hover:bg-accent/90"
              >
                Continue exploring
              </button>
            </div>
          ) : (
            <>
              <h2
                id="brand-report-popup-title"
                className="max-w-[20rem] text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Get a detailed AI report on your brand today
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Share your brand details and PxlBrief AI will help identify your
                digital growth, positioning, website, and AI-readiness
                opportunities.
              </p>

              <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="brand-report-brand"
                    className="mb-1.5 block text-xs font-medium text-foreground/85"
                  >
                    Brand name
                  </label>
                  <input
                    id="brand-report-brand"
                    value={form.brandName}
                    onChange={(event) => updateField("brandName", event.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/72 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                    placeholder="Your brand or company"
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.brandName)}
                  />
                  {errors.brandName ? (
                    <p className="mt-1 text-xs text-destructive">{errors.brandName}</p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="brand-report-mobile"
                      className="mb-1.5 block text-xs font-medium text-foreground/85"
                    >
                      Mobile number
                    </label>
                    <input
                      id="brand-report-mobile"
                      value={form.mobile}
                      onChange={(event) => updateField("mobile", event.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background/72 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={Boolean(errors.mobile)}
                    />
                    {errors.mobile ? (
                      <p className="mt-1 text-xs text-destructive">{errors.mobile}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="brand-report-email"
                      className="mb-1.5 block text-xs font-medium text-foreground/85"
                    >
                      Email ID
                    </label>
                    <input
                      id="brand-report-email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background/72 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                      placeholder="you@brand.com"
                      autoComplete="email"
                      inputMode="email"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email ? (
                      <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="brand-report-link"
                    className="mb-1.5 block text-xs font-medium text-foreground/85"
                  >
                    Website / Instagram / LinkedIn
                  </label>
                  <input
                    id="brand-report-link"
                    value={form.brandLink}
                    onChange={(event) => updateField("brandLink", event.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/72 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                    placeholder="brand.com, @brand, or LinkedIn URL"
                    autoComplete="url"
                    inputMode="url"
                    aria-invalid={Boolean(errors.brandLink)}
                  />
                  {errors.brandLink ? (
                    <p className="mt-1 text-xs text-destructive">{errors.brandLink}</p>
                  ) : null}
                </div>

                <p className="text-[0.7rem] leading-relaxed text-muted-foreground/80">
                  By submitting, you agree that PxlBrief may contact you
                  regarding this AI brand report.
                </p>

                {status === "error" ? (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">
                    We could not submit this right now. Please email
                    info@pxlbrief.com.
                  </p>
                ) : null}

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_28px_rgba(255,122,26,0.2)] transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Request My AI Report
                  </button>
                  <button
                    type="button"
                    onClick={markSeenAndClose}
                    className="w-full rounded-full border border-border/80 bg-background/35 px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/45 hover:text-primary"
                  >
                    Maybe later
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
