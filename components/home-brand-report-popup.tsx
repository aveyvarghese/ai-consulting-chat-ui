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

  useEffect(() => {
    if (!isVisible || typeof document === "undefined") return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isVisible])

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
      className="fixed inset-0 z-50 flex h-dvh min-h-dvh items-center justify-center overflow-hidden bg-background/68 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-md sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-report-popup-title"
    >
      <div className="relative flex max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[420px] flex-col overflow-hidden rounded-[1.05rem] border border-primary/35 bg-[linear-gradient(145deg,rgba(12,17,20,0.98),rgba(20,24,27,0.98))] text-foreground shadow-[0_0_36px_rgba(0,224,255,0.13),0_18px_48px_rgba(0,0,0,0.52)] sm:rounded-[1.45rem]">
        <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-accent/14 blur-3xl" />

        <button
          type="button"
          onClick={markSeenAndClose}
          className="absolute right-2.5 top-2.5 z-20 rounded-full border border-border/70 bg-background/85 p-1.5 text-muted-foreground shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:border-primary/45 hover:text-primary sm:right-3 sm:top-3 sm:p-2"
          aria-label="Close AI brand report popup"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </button>

        <div className="relative flex min-h-0 flex-col p-3 pb-0 sm:p-5 sm:pb-0">
          <div className="mb-1.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-primary sm:mb-3 sm:gap-2 sm:px-3 sm:py-1 sm:text-[0.65rem]">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
            AI brand report
          </div>

          {hasSubmitted ? (
            <div className="overflow-y-auto px-0.5 py-3 text-center sm:py-5">
              <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary sm:mb-4 sm:h-12 sm:w-12">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <h2 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Request received.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                We&rsquo;ll review your brand details and follow up with a more
                detailed AI-led report.
              </p>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_28px_rgba(255,122,26,0.22)] transition hover:bg-accent/90 sm:mt-5"
              >
                Continue exploring
              </button>
            </div>
          ) : (
            <>
              <h2
                id="brand-report-popup-title"
                className="max-w-[17rem] pr-8 text-balance text-lg font-semibold tracking-tight text-foreground sm:max-w-[20rem] sm:text-2xl"
              >
                <span className="sm:hidden">Get your AI brand report</span>
                <span className="hidden sm:inline">
                  Get a detailed AI report on your brand today
                </span>
              </h2>
              <p className="mt-1 text-[0.76rem] leading-snug text-muted-foreground sm:mt-2 sm:text-sm sm:leading-relaxed">
                <span className="sm:hidden">
                  Share your brand details and we&rsquo;ll review your growth,
                  website, and AI-readiness opportunities.
                </span>
                <span className="hidden sm:inline">
                  Share your brand details and we&rsquo;ll review your digital
                  growth, positioning, website, and AI-readiness opportunities.
                </span>
              </p>

              <form
                className="mt-2.5 flex min-h-0 flex-1 flex-col sm:mt-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="min-h-0 space-y-1.5 overflow-y-auto px-0.5 pb-1.5 pr-1 [scrollbar-width:none] sm:space-y-3 [&::-webkit-scrollbar]:hidden">
                  <div>
                    <label
                      htmlFor="brand-report-brand"
                      className="mb-0.5 block text-[0.68rem] font-medium leading-tight text-foreground/85 sm:mb-1.5 sm:text-xs"
                    >
                      Brand name
                    </label>
                    <input
                      id="brand-report-brand"
                      value={form.brandName}
                      onChange={(event) => updateField("brandName", event.target.value)}
                      className="h-11 w-full rounded-lg border border-border/80 bg-background/72 px-3 text-sm text-foreground outline-none transition placeholder:text-[0.78rem] placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 sm:h-auto sm:rounded-xl sm:py-2.5 sm:text-sm"
                      placeholder="Your brand or company"
                      autoComplete="organization"
                      aria-invalid={Boolean(errors.brandName)}
                    />
                    {errors.brandName ? (
                      <p className="mt-1 text-xs text-destructive">{errors.brandName}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                    <div>
                      <label
                        htmlFor="brand-report-mobile"
                        className="mb-0.5 block text-[0.68rem] font-medium leading-tight text-foreground/85 sm:mb-1.5 sm:text-xs"
                      >
                        Mobile number
                      </label>
                      <input
                        id="brand-report-mobile"
                        value={form.mobile}
                        onChange={(event) => updateField("mobile", event.target.value)}
                        className="h-11 w-full rounded-lg border border-border/80 bg-background/72 px-3 text-sm text-foreground outline-none transition placeholder:text-[0.78rem] placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 sm:h-auto sm:rounded-xl sm:py-2.5 sm:text-sm"
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
                        className="mb-0.5 block text-[0.68rem] font-medium leading-tight text-foreground/85 sm:mb-1.5 sm:text-xs"
                      >
                        Email ID
                      </label>
                      <input
                        id="brand-report-email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className="h-11 w-full rounded-lg border border-border/80 bg-background/72 px-3 text-sm text-foreground outline-none transition placeholder:text-[0.78rem] placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 sm:h-auto sm:rounded-xl sm:py-2.5 sm:text-sm"
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
                      className="mb-0.5 block text-[0.68rem] font-medium leading-tight text-foreground/85 sm:mb-1.5 sm:text-xs"
                    >
                      Website / Instagram / LinkedIn
                    </label>
                    <input
                      id="brand-report-link"
                      value={form.brandLink}
                      onChange={(event) => updateField("brandLink", event.target.value)}
                      className="h-11 w-full rounded-lg border border-border/80 bg-background/72 px-3 text-sm text-foreground outline-none transition placeholder:text-[0.78rem] placeholder:text-muted-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 sm:h-auto sm:rounded-xl sm:py-2.5 sm:text-sm"
                      placeholder="brand.com, @brand, or LinkedIn URL"
                      autoComplete="url"
                      inputMode="url"
                      aria-invalid={Boolean(errors.brandLink)}
                    />
                    {errors.brandLink ? (
                      <p className="mt-1 text-xs text-destructive">{errors.brandLink}</p>
                    ) : null}
                  </div>

                  <p className="text-[0.64rem] leading-snug text-muted-foreground/80 sm:text-[0.7rem] sm:leading-relaxed">
                    By submitting, you agree that PxlBrief may contact you about
                    this AI brand report.
                  </p>

                  {status === "error" ? (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs leading-snug text-destructive sm:rounded-xl sm:px-3 sm:py-2 sm:leading-relaxed">
                      We could not submit this right now. Please email
                      info@pxlbrief.com.
                    </p>
                  ) : null}
                </div>

                <div className="sticky bottom-0 -mx-3 mt-1 flex flex-col gap-1.5 border-t border-border/55 bg-[linear-gradient(180deg,rgba(16,20,23,0.72),rgba(16,20,23,0.98)_28%)] px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:-mx-5 sm:gap-2 sm:px-5 sm:pb-5 sm:pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-[0_0_28px_rgba(255,122,26,0.2)] transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:py-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Request My AI Report
                  </button>
                  <button
                    type="button"
                    onClick={markSeenAndClose}
                    className="h-11 w-full rounded-full border border-border/80 bg-background/35 px-5 text-sm font-medium text-muted-foreground transition hover:border-primary/45 hover:text-primary sm:h-auto sm:py-2.5"
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
