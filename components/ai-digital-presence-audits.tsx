"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  Globe2,
  Instagram,
  Linkedin,
  Search,
  Sparkles,
  Youtube,
} from "lucide-react"

type AuditToolId =
  | "instagram-audit"
  | "linkedin-audit"
  | "youtube-audit"
  | "seo-audit"
  | "aeo-audit"
  | "geo-audit"

type AuditField =
  | {
      type: "select"
      label: string
      options: readonly string[]
    }
  | {
      type: "text"
      label: string
      placeholder: string
    }

type AuditToolConfig = {
  id: AuditToolId
  label: string
  eyebrow: string
  primaryLabel: string
  primaryPlaceholder: string
  secondary: AuditField
  tertiary: AuditField
  serviceFallback: string
  icon: typeof Instagram
}

type AuditInputState = {
  primary: string
  secondary: string
  tertiary: string
}

type AuditSection = {
  label: string
  value?: string
  items?: string[]
}

type AuditReadout = {
  sections: AuditSection[]
}

type AuditState = {
  loading: boolean
  error: string | null
  readout: AuditReadout | null
}

type LeadStatus = "idle" | "submitting" | "success" | "error"

const businessCategoryOptions = [
  "Fashion & Lifestyle",
  "Beauty/Wellness",
  "Home Improvement",
  "Education",
  "B2B Services",
  "Retail",
  "Local Business",
  "Other",
] as const

const auditTools: readonly AuditToolConfig[] = [
  {
    id: "instagram-audit",
    label: "Instagram",
    eyebrow: "Social audit",
    primaryLabel: "Instagram handle or URL",
    primaryPlaceholder: "e.g. @brandname or instagram.com/brandname",
    secondary: {
      type: "select",
      label: "Business category",
      options: businessCategoryOptions,
    },
    tertiary: {
      type: "select",
      label: "Goal",
      options: ["Awareness", "Leads", "Sales", "Community", "Brand positioning"],
    },
    serviceFallback: "Digital Marketing & Performance Growth",
    icon: Instagram,
  },
  {
    id: "linkedin-audit",
    label: "LinkedIn",
    eyebrow: "Authority audit",
    primaryLabel: "LinkedIn profile/company URL",
    primaryPlaceholder: "e.g. linkedin.com/company/brand",
    secondary: {
      type: "select",
      label: "Business type",
      options: ["Founder", "B2B company", "Consultant", "Startup", "SME", "Agency", "Other"],
    },
    tertiary: {
      type: "select",
      label: "Goal",
      options: ["Authority", "Leads", "Hiring", "Partnerships", "Founder branding"],
    },
    serviceFallback: "Brand Strategy & Positioning",
    icon: Linkedin,
  },
  {
    id: "youtube-audit",
    label: "YouTube",
    eyebrow: "Channel audit",
    primaryLabel: "YouTube channel URL or handle",
    primaryPlaceholder: "e.g. youtube.com/@brandname",
    secondary: {
      type: "select",
      label: "Category",
      options: ["Education", "Brand", "Product", "Founder", "Service Business", "Local Business", "Other"],
    },
    tertiary: {
      type: "select",
      label: "Goal",
      options: ["Awareness", "Education", "Leads", "Monetization", "Authority"],
    },
    serviceFallback: "Digital Marketing & Performance Growth",
    icon: Youtube,
  },
  {
    id: "seo-audit",
    label: "Website SEO",
    eyebrow: "Search audit",
    primaryLabel: "Website URL",
    primaryPlaceholder: "e.g. https://brand.com",
    secondary: {
      type: "text",
      label: "Business category",
      placeholder: "e.g. B2B services, beauty clinic, local retail",
    },
    tertiary: {
      type: "text",
      label: "Target market/location",
      placeholder: "e.g. India, Gurgaon, UAE founders",
    },
    serviceFallback: "Website, SEO, AEO & GEO",
    icon: Search,
  },
  {
    id: "aeo-audit",
    label: "Website AEO",
    eyebrow: "Answer audit",
    primaryLabel: "Website URL",
    primaryPlaceholder: "e.g. https://brand.com",
    secondary: {
      type: "text",
      label: "Business category",
      placeholder: "e.g. SaaS, education, home improvement",
    },
    tertiary: {
      type: "text",
      label: "Main service/product",
      placeholder: "e.g. AI consulting, premium interiors",
    },
    serviceFallback: "Website, SEO, AEO & GEO",
    icon: Globe2,
  },
  {
    id: "geo-audit",
    label: "Website GEO",
    eyebrow: "AI search audit",
    primaryLabel: "Website URL",
    primaryPlaceholder: "e.g. https://brand.com",
    secondary: {
      type: "text",
      label: "Business category",
      placeholder: "e.g. B2B consulting, retail, healthcare",
    },
    tertiary: {
      type: "text",
      label: "Target audience",
      placeholder: "e.g. founders, homeowners, local buyers",
    },
    serviceFallback: "Website, SEO, AEO & GEO",
    icon: Sparkles,
  },
]

const initialInputs = auditTools.reduce(
  (acc, tool) => {
    acc[tool.id] = {
      primary: "",
      secondary: tool.secondary.type === "select" ? tool.secondary.options[0] : "",
      tertiary: tool.tertiary.type === "select" ? tool.tertiary.options[0] : "",
    }
    return acc
  },
  {} as Record<AuditToolId, AuditInputState>
)

const initialAuditStates = auditTools.reduce(
  (acc, tool) => {
    acc[tool.id] = { loading: false, error: null, readout: null }
    return acc
  },
  {} as Record<AuditToolId, AuditState>
)

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPhoneLike(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 8 && digits.length <= 16 && /^[+\d\s().-]+$/.test(value)
}

function compactJson(value: unknown, maxLength = 1600): string {
  const text = JSON.stringify(value, null, 2)
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text
}

function formatReadout(readout: AuditReadout): string {
  return readout.sections
    .map((section) =>
      [section.label, section.value, ...(section.items ?? []).map((item) => `- ${item}`)]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n")
    .slice(0, 3000)
}

function getSection(readout: AuditReadout | null, includes: string) {
  return readout?.sections.find((section) =>
    section.label.toLowerCase().includes(includes.toLowerCase())
  )
}

function resolveRecommendedService(readout: AuditReadout | null, fallback: string) {
  return getSection(readout, "Recommended PxlBrief service")?.value?.trim() || fallback
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: AuditField
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/72">
        {field.label}
      </span>
      {field.type === "select" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors placeholder:text-muted-foreground/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
      )}
    </label>
  )
}

function ResultList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="min-w-0 rounded-[0.8rem] border border-hairline/75 bg-background/35 px-3 py-2.5">
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
      <ul className="mt-2 grid gap-1.5">
        {items.slice(0, 2).map((item) => (
          <li key={item} className="flex gap-2 text-[0.8125rem] leading-relaxed text-foreground/90">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/75" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LeadCapturePanel({
  tool,
  inputs,
  readout,
}: {
  tool: AuditToolConfig
  inputs: AuditInputState
  readout: AuditReadout
}) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<LeadStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setStatus("idle")
    setMessage(null)
  }, [readout])

  const recommendedService = resolveRecommendedService(readout, tool.serviceFallback)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanMobile = mobile.trim()
    const cleanEmail = email.trim()
    const cleanCompany = company.trim()

    if (!cleanName || !cleanMobile || !cleanEmail || !cleanCompany) {
      setStatus("error")
      setMessage("Please fill all details so we can send the report.")
      return
    }

    if (!isPhoneLike(cleanMobile)) {
      setStatus("error")
      setMessage("Please enter a valid mobile number.")
      return
    }

    if (!isValidEmail(cleanEmail)) {
      setStatus("error")
      setMessage("Please enter a valid email ID.")
      return
    }

    const inputDetails = {
      "Audit type": tool.label,
      [tool.primaryLabel]: inputs.primary,
      [tool.secondary.label]: inputs.secondary,
      [tool.tertiary.label]: inputs.tertiary,
    }
    const readoutText = formatReadout(readout)
    const inputsText = compactJson(inputDetails)
    const goodPoints = getSection(readout, "Good points")?.items ?? []
    const improvementPoints = getSection(readout, "Points that need work")?.items ?? []
    const summary = getSection(readout, "summary")?.value ?? ""

    const conversationSummary = [
      "AI DIGITAL PRESENCE AUDIT LEAD",
      "",
      "Source: AI Digital Presence Audit",
      `Audit type: ${tool.label}`,
      `Handle/URL: ${inputs.primary}`,
      `${tool.secondary.label}: ${inputs.secondary}`,
      `${tool.tertiary.label}: ${inputs.tertiary}`,
      `Recommended service: ${recommendedService}`,
      "Lead priority: High",
      "Page path: /ai-lab",
      "",
      `AI audit summary: ${summary}`,
      "",
      "Good points:",
      ...goodPoints.map((point) => `- ${point}`),
      "",
      "Improvement points:",
      ...improvementPoints.map((point) => `- ${point}`),
      "",
      "Full AI audit:",
      readoutText,
    ].join("\n")

    const payload = {
      messages: [
        {
          role: "user",
          content: `AI Digital Presence Audit requested.\n\n${inputsText}`,
        },
        {
          role: "assistant",
          content: readoutText,
        },
        {
          role: "user",
          content: `Detailed report requested by ${cleanName}. Mobile: ${cleanMobile}. Email: ${cleanEmail}. Brand/company: ${cleanCompany}.`,
        },
      ],
      snapshot: {
        visitorType: "potential_client",
        name: cleanName,
        company: cleanCompany,
        email: cleanEmail,
        whatsapp: cleanMobile,
        uploadedFileName: "",
        conversationStage: "client_scheduling_focus",
        potentialClientStage: 5,
        clientCredibilityDelivered: true,
        businessVertical: "AI Digital Presence Audit",
        businessStage: "Detailed report requested",
        servicesInterested: recommendedService,
        currentChallenge: `${tool.label} audit follow-up`,
        acquisitionChannels: "AI Lab /ai-lab",
        conversationSummary,
      },
      leadData: {
        visitorType: "potential_client",
        name: cleanName,
        company: cleanCompany,
        website: tool.id.includes("seo") || tool.id.includes("aeo") || tool.id.includes("geo")
          ? inputs.primary
          : "",
        instagram: tool.id === "instagram-audit" ? inputs.primary : "",
        service: recommendedService,
        email: cleanEmail,
        phone: cleanMobile,
        notes: conversationSummary.slice(0, 3900),
      },
      professionalSummary: [
        "Source: AI Digital Presence Audit.",
        `Audit type: ${tool.label}.`,
        `Handle/URL: ${inputs.primary}.`,
        `${tool.secondary.label}: ${inputs.secondary}.`,
        `${tool.tertiary.label}: ${inputs.tertiary}.`,
        `AI audit summary: ${summary}`,
        `Good points: ${goodPoints.join("; ")}.`,
        `Improvement points: ${improvementPoints.join("; ")}.`,
        `Recommended service: ${recommendedService}.`,
        "Lead priority: High.",
        "Page path: /ai-lab.",
      ].join(" "),
      serviceRecommendation: {
        directionLabel: recommendedService,
        whyItMatters:
          "The visitor requested a deeper review after generating a directional digital presence audit.",
        suggestedNextStep:
          "Review the audit input, validate the live presence, then send a detailed AI-led report.",
      },
      submitSource: "AI Digital Presence Audit",
    }

    setStatus("submitting")
    setMessage(null)

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Lead submit failed")
      }

      setStatus("success")
      setMessage("Report request received. We’ll review this more deeply and follow up shortly.")
    } catch {
      setStatus("error")
      setMessage("We could not submit this right now. Please email info@pxlbrief.com.")
    }
  }

  return (
    <div className="mt-3 rounded-[0.85rem] border border-hairline bg-card/88 p-3 shadow-[inset_0_1px_0_0_var(--shine-inset)] sm:p-3.5">
      {status === "success" ? (
        <p className="rounded-[0.75rem] border border-primary/18 bg-primary/[0.06] px-3 py-2.5 text-[0.8125rem] leading-relaxed text-foreground/90">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid min-w-0 gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Want the detailed report?
            </p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground/82">
              Share your details and we’ll review this more deeply and send a more
              detailed AI-led report.
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {[
              ["Name", name, setName, "text"],
              ["Mobile number", mobile, setMobile, "tel"],
              ["Email ID", email, setEmail, "email"],
              ["Brand/company name", company, setCompany, "text"],
            ].map(([label, value, setter, type]) => (
              <label key={label as string} className="block min-w-0">
                <span className="mb-1.5 block text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/72">
                  {label as string}
                </span>
                <input
                  type={type as string}
                  value={value as string}
                  onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                  disabled={status === "submitting"}
                  className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                />
              </label>
            ))}
          </div>
          {message ? (
            <p className="rounded-[0.7rem] border border-destructive/20 bg-destructive/[0.06] px-3 py-2 text-[0.75rem] leading-relaxed text-muted-foreground/90">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="cta-gradient-motion inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-[0.7rem] bg-primary px-4 py-2 text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94] disabled:pointer-events-none disabled:opacity-55"
          >
            {status === "submitting" ? "Submitting..." : "Send My Detailed Report"}
          </button>
        </form>
      )}
    </div>
  )
}

export function AiDigitalPresenceAudits() {
  const [activeTool, setActiveTool] = useState<AuditToolId>("instagram-audit")
  const [mobileActiveTool, setMobileActiveTool] = useState<AuditToolId | "">("")
  const [inputs, setInputs] = useState<Record<AuditToolId, AuditInputState>>(initialInputs)
  const [auditStates, setAuditStates] =
    useState<Record<AuditToolId, AuditState>>(initialAuditStates)

  const activeConfig = useMemo(
    () => auditTools.find((tool) => tool.id === activeTool) ?? auditTools[0],
    [activeTool]
  )
  const activeInputs = inputs[activeTool]
  const activeState = auditStates[activeTool]
  const Icon = activeConfig.icon

  const updateActiveInputs = (patch: Partial<AuditInputState>) => {
    setInputs((state) => ({
      ...state,
      [activeTool]: { ...state[activeTool], ...patch },
    }))
  }

  const generateAudit = async () => {
    const cleanPrimary = activeInputs.primary.trim()
    if (!cleanPrimary) {
      setAuditStates((state) => ({
        ...state,
        [activeTool]: {
          ...state[activeTool],
          error: `Please enter the ${activeConfig.primaryLabel.toLowerCase()}.`,
        },
      }))
      return
    }

    const requestInputs = {
      auditType: activeConfig.label,
      handleOrUrl: cleanPrimary,
      [activeConfig.primaryLabel]: cleanPrimary,
      [activeConfig.secondary.label]: activeInputs.secondary,
      [activeConfig.tertiary.label]: activeInputs.tertiary,
    }

    setAuditStates((state) => ({
      ...state,
      [activeTool]: { loading: true, error: null, readout: state[activeTool].readout },
    }))

    try {
      const response = await fetch("/api/ai-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: activeTool,
          inputs: requestInputs,
          directionalOutput: {
            disclosure:
              "Directional AI audit only; no live platform or website crawl was performed.",
            requestedSections:
              "Summary, 2 good points, 2 improvement points, improvement direction, next step, recommended PxlBrief service.",
          },
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data || !Array.isArray(data.sections)) {
        throw new Error("Invalid audit response")
      }

      setAuditStates((state) => ({
        ...state,
        [activeTool]: {
          loading: false,
          error: null,
          readout: {
            sections: data.sections
              .filter((section: unknown): section is AuditSection => {
                if (!section || typeof section !== "object") return false
                return typeof (section as AuditSection).label === "string"
              })
              .slice(0, 8),
          },
        },
      }))
    } catch {
      setAuditStates((state) => ({
        ...state,
        [activeTool]: {
          loading: false,
          error: "Unable to generate the audit right now. Please try again shortly.",
          readout: state[activeTool].readout,
        },
      }))
    }
  }

  const summary = getSection(activeState.readout, "summary")
  const goodPoints = getSection(activeState.readout, "Good points")
  const improvementPoints = getSection(activeState.readout, "Points that need work")
  const direction =
    activeState.readout?.sections.find((section) =>
      section.label.toLowerCase().includes("direction")
    ) ?? null
  const nextStep = getSection(activeState.readout, "Recommended next step")
  const recommendedService = resolveRecommendedService(
    activeState.readout,
    activeConfig.serviceFallback
  )

  return (
    <section className="mt-5 min-w-0 rounded-[1rem] border border-hairline bg-card/86 p-3.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl dark:bg-card/[0.34] sm:mt-6 sm:rounded-[1.25rem] sm:p-6 md:p-7">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-5">
        <div className="min-w-0">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/85">
            AI audit tools
          </p>
          <h3 className="mt-2 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            AI Digital Presence Audits
          </h3>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/88 sm:text-sm">
            Run a quick AI-led directional audit of your social presence, website
            visibility, answer readiness, or generative search readiness.
          </p>

          <div className="mt-4 sm:hidden">
            <select
              aria-label="Choose Audit Tool"
              value={mobileActiveTool}
              onChange={(event) => {
                const nextTool = event.target.value as AuditToolId | ""
                setMobileActiveTool(nextTool)
                if (nextTool) setActiveTool(nextTool)
              }}
              className="h-12 w-full min-w-0 rounded-[0.85rem] border border-primary/45 bg-background/75 px-3.5 text-[0.875rem] font-semibold text-foreground outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-primary/12"
            >
              <option value="">Choose Audit Tool</option>
              {auditTools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.label} Audit
                </option>
              ))}
            </select>
          </div>

          <div
            className="mt-4 hidden grid-cols-2 gap-1.5 rounded-[0.9rem] border border-hairline bg-background/32 p-1.5 sm:grid sm:grid-cols-3"
            role="tablist"
            aria-label="AI Digital Presence Audits"
          >
            {auditTools.map((tool) => {
              const isActive = activeTool === tool.id
              const ToolIcon = tool.icon
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTool(tool.id)}
                  className={`min-w-0 touch-manipulation rounded-[0.7rem] border px-2 py-2 text-left transition-colors [-webkit-tap-highlight-color:transparent] ${
                    isActive
                      ? "border-primary/30 bg-primary/[0.11] text-foreground"
                      : "border-transparent text-muted-foreground hover:border-primary/14 hover:bg-primary/[0.05] hover:text-foreground"
                  }`}
                >
                  <ToolIcon className="mb-1.5 h-3.5 w-3.5 text-primary/85" aria-hidden />
                  <span className="block truncate text-[0.75rem] font-semibold">
                    {tool.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className={`min-w-0 rounded-[0.95rem] border border-primary/18 bg-primary/[0.045] p-3 sm:block sm:p-4 ${
            mobileActiveTool ? "block" : "hidden"
          }`}
        >
          <div className="mb-3 flex items-start gap-3 border-b border-hairline/70 pb-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-primary/22 bg-primary/[0.08] text-primary">
              <Icon className="h-4.5 w-4.5" strokeWidth={1.65} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/85">
                {activeConfig.eyebrow}
              </p>
              <h4 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                {activeConfig.label} Audit
              </h4>
            </div>
          </div>

          <div className="grid min-w-0 gap-2.5 sm:grid-cols-2">
            <label className="block min-w-0 sm:col-span-2">
              <span className="mb-1.5 block text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/72">
                {activeConfig.primaryLabel}
              </span>
              <input
                type="text"
                value={activeInputs.primary}
                onChange={(event) => updateActiveInputs({ primary: event.target.value })}
                placeholder={activeConfig.primaryPlaceholder}
                className="h-10 w-full min-w-0 rounded-[0.7rem] border border-hairline/80 bg-background/45 px-3 text-[0.8125rem] font-medium text-foreground outline-none shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors placeholder:text-muted-foreground/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <FieldInput
              field={activeConfig.secondary}
              value={activeInputs.secondary}
              onChange={(secondary) => updateActiveInputs({ secondary })}
            />
            <FieldInput
              field={activeConfig.tertiary}
              value={activeInputs.tertiary}
              onChange={(tertiary) => updateActiveInputs({ tertiary })}
            />
          </div>

          <button
            type="button"
            onClick={generateAudit}
            disabled={activeState.loading}
            className="cta-gradient-motion mt-3 inline-flex min-h-10 w-full touch-manipulation items-center justify-center gap-2 rounded-[0.75rem] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/[0.94] disabled:pointer-events-none disabled:opacity-55"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {activeState.loading ? "Generating audit..." : "Generate AI Audit"}
          </button>

          {activeState.error ? (
            <p className="mt-3 rounded-[0.75rem] border border-destructive/20 bg-destructive/[0.06] px-3 py-2.5 text-[0.75rem] leading-relaxed text-muted-foreground/88">
              {activeState.error}
            </p>
          ) : null}

          {activeState.readout ? (
            <div className="mt-3 rounded-[0.85rem] border border-primary/20 bg-background/35 p-3">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
                Brief audit result
              </p>
              {summary?.value ? (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-foreground/90">
                  {summary.value}
                </p>
              ) : null}
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <ResultList label="2 good points" items={goodPoints?.items ?? []} />
                <ResultList
                  label="2 points that need work"
                  items={improvementPoints?.items ?? []}
                />
              </div>
              {direction?.value ? (
                <div className="mt-2.5 rounded-[0.8rem] border border-hairline/75 bg-background/35 px-3 py-2.5">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Improvement direction
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/90">
                    {direction.value}
                  </p>
                </div>
              ) : null}
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-[0.8rem] border border-hairline/75 bg-background/35 px-3 py-2.5">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Recommended next step
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/90">
                    {nextStep?.value ?? "Request a deeper audit before changing the strategy."}
                  </p>
                </div>
                <div className="rounded-[0.8rem] border border-primary/22 bg-primary/[0.065] px-3 py-2.5">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Recommended PxlBrief service
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] font-semibold leading-relaxed text-foreground">
                    {recommendedService}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground/75">
                This is a directional AI audit based on the information provided. A
                deeper audit requires platform and website review.
              </p>
              <LeadCapturePanel
                tool={activeConfig}
                inputs={activeInputs}
                readout={activeState.readout}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
