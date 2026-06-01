"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  ArrowRight,
  X,
  User,
  Sparkles,
  AlertCircle,
  Paperclip,
  Send,
  CheckCircle2,
} from "lucide-react"
import {
  createInitialConversationState,
  deriveConversationState,
  measureVendorSellerStrength,
  sanitizeConversationStateForChat,
  type ConversationStatePayload,
} from "@/lib/conversation-state"
import {
  createInitialLeadData,
  deriveLeadData,
  type LeadData,
} from "@/lib/lead-data"
import {
  AnalyticsEvent,
  trackAnalyticsEvent,
} from "@/lib/analytics-events"
import { ExecutiveIntelligencePanel } from "@/components/executive-intelligence-panel"
import { ExecutiveSignalsPanel } from "@/components/executive-signals-panel"
import type { ExecutiveSignalItem } from "@/lib/executive-signals-types"
import { ServiceRecommendationCard } from "@/components/service-recommendation-card"
import { StrategicBriefCard } from "@/components/strategic-brief-card"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { computePublicServiceRecommendation } from "@/lib/service-routing"
import type { StrategicBriefPayload } from "@/lib/strategic-brief-types"
import {
  PUBLIC_SUPPORT_EMAIL_MESSAGE,
  sanitizeEnquirySubmitErrorMessage,
} from "@/lib/public-errors"

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
] as const

const FILE_INPUT_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".")
  if (i < 0) return ""
  return name.slice(i).toLowerCase()
}

function isAllowedUploadFile(file: File): boolean {
  const ext = extensionOf(file.name)
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)
}

type VisitorUploadContext = "job" | "vendor" | "neutral"

function inferVisitorUploadContext(messages: Message[]): VisitorUploadContext {
  const text = messages.map((m) => m.content).join(" ").toLowerCase()
  const jobScore = [
    /\bjob\b/,
    /\bjobs\b/,
    /\bcareers?\b/,
    /\binternship\b/,
    /\bintern\b/,
    /\bapply\b/,
    /\bapplication\b/,
    /\bcv\b/,
    /\bresume\b/,
    /\bhiring\b/,
    /\bemployment\b/,
    /\bjob seeker\b/,
    /\blooking for work\b/,
    /\bjunior\b/,
    /\bopen role\b/,
    /\bwant\s+to\s+(?:join|work)\b/,
    /\bvacancy\b/,
  ].reduce((n, r) => n + (r.test(text) ? 1 : 0), 0)
  const vendorSellerStrength = measureVendorSellerStrength(text)
  if (jobScore === 0 && vendorSellerStrength === 0) return "neutral"
  if (jobScore > vendorSellerStrength + 1) return "job"
  if (vendorSellerStrength >= 2 && vendorSellerStrength > jobScore) return "vendor"
  return "neutral"
}

function uploadButtonLabel(messages: Message[]): string {
  const ctx = inferVisitorUploadContext(messages)
  if (ctx === "job") return "Upload CV"
  if (ctx === "vendor") return "Upload Brochure / Deck"
  return "Share Brief / Reference"
}

const placeholderPrompts = [
  "We are a B2B services company and need more qualified leads.",
  "Our marketing is scattered and we want clearer priorities.",
  "We want to use AI but do not know where to start.",
  "Our website is not converting enough enquiries.",
]

/** Short labels for suggestion chips; full text is sent as the user message */
const suggestionChips: { label: string; prompt: string }[] = [
  {
    label: "I need social media",
    prompt: "I need a social media agency.",
  },
  {
    label: "I need website help",
    prompt: "I need website development.",
  },
  {
    label: "Run diagnostic",
    prompt: "Run diagnostic.",
  },
  {
    label: "I need AI automation",
    prompt: "I need AI automation for my business.",
  },
  {
    label: "I need SEO",
    prompt: "I need SEO support.",
  },
  {
    label: "I need dashboards",
    prompt: "I need dashboards and better reporting.",
  },
]

type DiagnosticStepId =
  | "businessType"
  | "mainChallenge"
  | "marketingSetup"
  | "aiUsage"
  | "systemsStatus"
  | "urgency"
  | "digitalLink"
  | "contact"

type DiagnosticAnswers = Partial<Record<DiagnosticStepId, string>>

type DiagnosticSnapshot = {
  likelyBottleneck: string
  aiOpportunity: string
  recommendedFirstSystem: string
  recommendedService: string
  leadPriority: "Low" | "Medium" | "High"
  suggestedNextStep: string
}

type DiagnosticState = {
  answers: DiagnosticAnswers
  currentStepIndex: number
  snapshot: DiagnosticSnapshot | null
  leadStatus: "idle" | "submitting" | "success" | "error"
  leadMessage: string | null
}

type ChatFlowMode = "idle" | "service" | "diagnostic" | "clarify" | "chat"

type ServiceStepId = "whatsapp" | "company" | "link" | "email" | "urgency"

type ServiceIntakeAnswers = Partial<Record<ServiceStepId, string>>

type ServiceIntakeState = {
  initialMessage: string
  requestedService: string
  recommendedService: string
  answers: ServiceIntakeAnswers
  currentStepIndex: number
  submitted: boolean
  leadStatus: "idle" | "submitting" | "success" | "error"
  leadMessage: string | null
}

const diagnosticSteps: readonly {
  id: DiagnosticStepId
  question: string
  options?: readonly string[]
}[] = [
  {
    id: "businessType",
    question: "What type of business are you running?",
    options: [
      "Startup",
      "SME",
      "Consumer brand",
      "B2B company",
      "Traditional business",
      "Local business",
      "Other",
    ],
  },
  {
    id: "mainChallenge",
    question: "What is the main growth challenge you want to solve first?",
    options: [
      "Need more leads",
      "Marketing is scattered",
      "Want to use AI",
      "Website not converting",
      "Leads not tracked",
      "Brand positioning weak",
      "Need dashboards/reporting",
      "Team doing too much manual work",
    ],
  },
  {
    id: "marketingSetup",
    question: "What marketing channels are currently active?",
    options: [
      "Instagram/Facebook",
      "Google Ads/Search",
      "LinkedIn",
      "WhatsApp",
      "Website/SEO",
      "Referrals",
      "Offline sales",
      "Not much yet",
    ],
  },
  {
    id: "aiUsage",
    question: "How are you currently using AI?",
    options: [
      "Not using AI",
      "Casual ChatGPT use",
      "Content/research",
      "Workflow support",
      "Automation/CRM",
      "Advanced internal systems",
    ],
  },
  {
    id: "systemsStatus",
    question: "What systems do you currently have in place?",
    options: [
      "Website",
      "CRM",
      "Google Analytics",
      "Dashboard",
      "Lead tracking sheet",
      "WhatsApp follow-up",
      "None/basic",
    ],
  },
  {
    id: "urgency",
    question: "How soon do you want to act on this?",
    options: [
      "Exploring",
      "Need clarity this month",
      "Ready to act now",
      "Urgent intervention",
    ],
  },
  {
    id: "digitalLink",
    question:
      "Share your website, Instagram, LinkedIn, or any digital link we should review.",
  },
  {
    id: "contact",
    question:
      "Please share your name and email or WhatsApp so we can send a more detailed diagnostic follow-up if relevant.",
  },
]

const serviceSteps: readonly {
  id: ServiceStepId
  question: string
  optional?: boolean
}[] = [
  {
    id: "whatsapp",
    question: "To help us route this properly, could you share your WhatsApp number?",
  },
  {
    id: "company",
    question: "What is the company or business name, and what does it do?",
  },
  {
    id: "link",
    question: "Share your website, Instagram, LinkedIn, or any live social link.",
  },
  {
    id: "email",
    question: "What email ID should we use to send a detailed AI-led report?",
  },
  {
    id: "urgency",
    question: "What timeline are you working with?",
    optional: true,
  },
]

const clarificationChoices = [
  "I need a service",
  "Run diagnostic",
  "Talk to PxlBrief",
] as const

function createInitialDiagnosticState(): DiagnosticState {
  return {
    answers: {},
    currentStepIndex: 0,
    snapshot: null,
    leadStatus: "idle",
    leadMessage: null,
  }
}

function createInitialServiceIntakeState(): ServiceIntakeState {
  return {
    initialMessage: "",
    requestedService: "",
    recommendedService: "",
    answers: {},
    currentStepIndex: 0,
    submitted: false,
    leadStatus: "idle",
    leadMessage: null,
  }
}

function makeMessage(role: Message["role"], content: string): Message {
  return {
    id: `${Date.now()}-${role}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  }
}

function stageForStep(stepIndex: number, complete: boolean): string {
  if (complete) return "Recommendation"
  if (stepIndex <= 0) return "Business context"
  if (stepIndex <= 2) return "Growth challenge"
  if (stepIndex <= 6) return "Systems review"
  return "Recommendation"
}

function extractEmail(text: string): string {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? ""
}

function extractPhone(text: string): string {
  return (
    text.match(/(?:\+?\d[\d\s().-]{8,18}\d)/)?.[0]?.replace(/\s+/g, " ").trim() ??
    ""
  )
}

function extractNameFromContact(text: string): string {
  const email = extractEmail(text)
  const phone = extractPhone(text)
  let name = text
    .replace(email, "")
    .replace(phone, "")
    .replace(/\b(my name is|i am|i'm|name is|email|whatsapp|phone|contact)\b/gi, "")
    .replace(/[,:;|/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (name.length > 80) name = name.slice(0, 80).trim()
  return name
}

function contactIsUsable(text: string): boolean {
  return Boolean(extractNameFromContact(text) && (extractEmail(text) || extractPhone(text)))
}

function isPhoneUsable(text: string): boolean {
  return Boolean(extractPhone(text))
}

function isEmailUsable(text: string): boolean {
  return Boolean(extractEmail(text))
}

function classifyServiceIntent(text: string):
  | { requestedService: string; recommendedService: string }
  | null {
  const t = text.toLowerCase()

  if (
    /\b(social media|instagram|content|meta ads?|facebook ads?|performance marketing|lead generation|digital marketing|marketing agency|marketing support)\b/i.test(
      t
    )
  ) {
    return {
      requestedService: "Social media / digital marketing",
      recommendedService: "Digital Marketing & Performance Growth",
    }
  }
  if (/\b(website|web development|website development|landing page|web design)\b/i.test(t)) {
    return {
      requestedService: "Website development",
      recommendedService: "Website, SEO, AEO & GEO",
    }
  }
  if (/\b(seo|aeo|geo|search engine|organic search)\b/i.test(t)) {
    return {
      requestedService: "SEO / search growth",
      recommendedService: "Website, SEO, AEO & GEO",
    }
  }
  if (/\b(branding|brand strategy|positioning|brand identity|rebrand)\b/i.test(t)) {
    return {
      requestedService: "Branding / positioning",
      recommendedService: "Brand Strategy & Positioning",
    }
  }
  if (/\b(ai automation|automation|workflow|ai implementation|ai system)\b/i.test(t)) {
    return {
      requestedService: "AI automation",
      recommendedService: "AI Implementation & Automation",
    }
  }
  if (/\b(crm|dashboard|dashboards|lead tracking|reporting|sales enablement)\b/i.test(t)) {
    return {
      requestedService: "CRM / dashboards / lead tracking",
      recommendedService: "CRM, Dashboards & Sales Enablement",
    }
  }
  if (/\b(market research|competitor|competition|business intelligence)\b/i.test(t)) {
    return {
      requestedService: "Market research / competitor intelligence",
      recommendedService: "Market Research & Business Intelligence",
    }
  }

  return null
}

function isDiagnosticIntent(text: string): boolean {
  return /\b(run diagnostic|diagnose|audit|growth is stuck|marketing is not working|don't know what i need|dont know what i need|not sure what i need|understand what to fix|identify gaps|help me identify|what should i fix|growth diagnostic)\b/i.test(
    text
  )
}

function isJobIntent(text: string): boolean {
  return /\b(job|internship|career|cv|resume|apply|hiring|open role|looking for work)\b/i.test(
    text
  )
}

function classifyInitialIntent(text: string):
  | "service"
  | "diagnostic"
  | "job"
  | "vendor"
  | "clarify" {
  if (isJobIntent(text)) return "job"
  if (measureVendorSellerStrength(text.toLowerCase()) >= 2) return "vendor"
  if (isDiagnosticIntent(text)) return "diagnostic"
  if (classifyServiceIntent(text)) return "service"
  return "clarify"
}

function serviceIntroCopy(requestedService: string): string {
  if (/social|marketing/i.test(requestedService)) {
    return "Great, we appreciate your interest. PxlBrief works with brands across social media strategy, content systems, campaign planning, paid amplification, and performance-led growth.\n\nTo help us route this properly, could you share your WhatsApp number?"
  }
  return `Thanks for reaching out. PxlBrief can help route this under ${requestedService} and match it to the right consulting track.\n\nTo help us route this properly, could you share your WhatsApp number?`
}

function serviceStageForStep(stepIndex: number, submitted: boolean): string {
  if (submitted) return "Preparing next step"
  if (stepIndex <= 1) return "Understanding requirement"
  if (stepIndex <= 3) return "Capturing details"
  return "Preparing next step"
}

function buildDiagnosticSnapshot(answers: DiagnosticAnswers): DiagnosticSnapshot {
  const challenge = (answers.mainChallenge ?? "").toLowerCase()
  const aiUsage = (answers.aiUsage ?? "").toLowerCase()
  const systems = (answers.systemsStatus ?? "").toLowerCase()
  const urgency = (answers.urgency ?? "").toLowerCase()

  let likelyBottleneck = "The growth system needs clearer prioritisation before execution expands."
  let aiOpportunity =
    "Use AI to turn repeatable work into a clearer operating layer for follow-up, reporting, and decision support."
  let recommendedFirstSystem = "AI Growth Audit"
  let recommendedService = "AI Growth Audit"

  if (challenge.includes("lead") && !challenge.includes("tracked")) {
    likelyBottleneck = "Demand generation and campaign structure are the likely constraint."
    recommendedFirstSystem = "Lead capture and campaign measurement system"
    recommendedService = "Digital Marketing & Performance Growth"
  } else if (challenge.includes("scattered")) {
    likelyBottleneck = "Activity is scattered across channels without a clear growth operating system."
    recommendedFirstSystem = "AI Growth Audit and priority roadmap"
    recommendedService = "AI Growth Audit"
  } else if (challenge.includes("website")) {
    likelyBottleneck = "The website or landing journey is not converting enough demand into qualified enquiries."
    recommendedFirstSystem = "Website conversion and search-readiness system"
    recommendedService = "Website, SEO, AEO & GEO"
  } else if (challenge.includes("tracked") || systems.includes("lead tracking")) {
    likelyBottleneck = "Lead tracking, ownership, and follow-up visibility are likely leaking opportunities."
    recommendedFirstSystem = "CRM, lead tracking, and follow-up system"
    recommendedService = "CRM, Dashboards & Sales Enablement"
  } else if (challenge.includes("positioning")) {
    likelyBottleneck = "Positioning clarity is likely limiting premium perception and campaign quality."
    recommendedFirstSystem = "Positioning and messaging system"
    recommendedService = "Brand Strategy & Positioning"
  } else if (challenge.includes("dashboard") || systems.includes("dashboard")) {
    likelyBottleneck = "Decision visibility is weak; reporting needs to surface actions, not just data."
    recommendedFirstSystem = "Founder dashboard and reporting cadence"
    recommendedService = "CRM, Dashboards & Sales Enablement"
  } else if (challenge.includes("manual") || challenge.includes("ai")) {
    likelyBottleneck = "Too much growth work still depends on manual effort and inconsistent workflows."
    recommendedFirstSystem = "AI workflow and automation roadmap"
    recommendedService = "AI Implementation & Automation"
  }

  if (aiUsage.includes("not using") || aiUsage.includes("casual")) {
    aiOpportunity =
      "Start with practical AI use cases: enquiry qualification, content research, follow-up prompts, and weekly decision summaries."
  } else if (aiUsage.includes("automation") || aiUsage.includes("advanced")) {
    aiOpportunity =
      "Move from isolated AI usage into governed workflows, CRM triggers, reporting, and team adoption."
  } else if (aiUsage.includes("content") || aiUsage.includes("workflow")) {
    aiOpportunity =
      "Convert current AI usage into repeatable workflows with templates, ownership, and measurable outputs."
  }

  const leadPriority =
    urgency.includes("urgent") || urgency.includes("ready")
      ? "High"
      : urgency.includes("clarity")
        ? "Medium"
        : "Low"

  const suggestedNextStep =
    leadPriority === "High"
      ? "Book a strategic session so we can review the diagnostic and decide the first build priority."
      : "Review the AI Growth Audit and use the diagnostic to clarify the first system before execution."

  return {
    likelyBottleneck,
    aiOpportunity,
    recommendedFirstSystem,
    recommendedService,
    leadPriority,
    suggestedNextStep,
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatRequestMessage {
  role: "user" | "assistant"
  content: string
}

function DiagnosticSnapshotPanel({
  snapshot,
  leadStatus,
  leadMessage,
}: {
  snapshot: DiagnosticSnapshot
  leadStatus: DiagnosticState["leadStatus"]
  leadMessage: string | null
}) {
  return (
    <div className="border-b border-hairline bg-gradient-to-b from-primary/[0.055] to-card/92 px-3 py-3.5 sm:px-5 sm:py-5 dark:to-card/[0.34]">
      <div className="rounded-[0.95rem] border border-primary/18 bg-background/45 p-3.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] sm:p-4">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/88">
          Diagnostic snapshot
        </p>
        <div className="mt-3 grid gap-2.5">
          {[
            ["Likely growth bottleneck", snapshot.likelyBottleneck],
            ["AI opportunity", snapshot.aiOpportunity],
            ["Recommended first system", snapshot.recommendedFirstSystem],
            ["Recommended PxlBrief service", snapshot.recommendedService],
            ["Lead priority", snapshot.leadPriority],
            ["Suggested next step", snapshot.suggestedNextStep],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[0.75rem] border border-hairline/75 bg-card/45 px-3 py-2.5"
            >
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/72">
                {label}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/90">
                {value}
              </p>
            </div>
          ))}
        </div>
        {leadStatus === "submitting" ? (
          <p className="mt-3 rounded-[0.75rem] border border-primary/14 bg-primary/[0.045] px-3 py-2 text-[0.75rem] leading-relaxed text-muted-foreground/88">
            Sending diagnostic follow-up request…
          </p>
        ) : leadMessage ? (
          <p
            className={`mt-3 rounded-[0.75rem] border px-3 py-2 text-[0.75rem] leading-relaxed ${
              leadStatus === "error"
                ? "border-red-500/20 bg-red-500/[0.06] text-muted-foreground/90"
                : "border-primary/16 bg-primary/[0.055] text-foreground/90"
            }`}
          >
            {leadMessage}
          </p>
        ) : null}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <StrategicSessionBookingLink
            source="growth_diagnostic_snapshot"
            className="cta-gradient-motion cta-primary-booking inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/32 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:border-primary/46"
          >
            Book Strategic Session
          </StrategicSessionBookingLink>
          <Link
            href="/ai-growth-audit"
            className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/24 bg-background/45 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/38 hover:bg-primary/[0.08]"
          >
            View AI Growth Audit
          </Link>
        </div>
      </div>
    </div>
  )
}

function ServiceIntakeConfirmationPanel({
  service,
  leadStatus,
  leadMessage,
}: {
  service: string
  leadStatus: ServiceIntakeState["leadStatus"]
  leadMessage: string | null
}) {
  return (
    <div className="border-b border-hairline bg-gradient-to-b from-primary/[0.045] to-card/92 px-3 py-3.5 sm:px-5 sm:py-5 dark:to-card/[0.34]">
      <div className="rounded-[0.95rem] border border-primary/18 bg-background/45 p-3.5 shadow-[inset_0_1px_0_0_var(--shine-inset)] sm:p-4">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/88">
          Intake captured
        </p>
        <p className="mt-2 text-[0.875rem] font-semibold leading-snug tracking-tight text-foreground">
          Recommended service: {service}
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/88">
          We have enough context to review the requirement and route it to the
          right PxlBrief track.
        </p>
        {leadStatus === "submitting" ? (
          <p className="mt-3 rounded-[0.75rem] border border-primary/14 bg-primary/[0.045] px-3 py-2 text-[0.75rem] leading-relaxed text-muted-foreground/88">
            Sending intake details…
          </p>
        ) : leadMessage ? (
          <p
            className={`mt-3 rounded-[0.75rem] border px-3 py-2 text-[0.75rem] leading-relaxed ${
              leadStatus === "error"
                ? "border-red-500/20 bg-red-500/[0.06] text-muted-foreground/90"
                : "border-primary/16 bg-primary/[0.055] text-foreground/90"
            }`}
          >
            {leadMessage}
          </p>
        ) : null}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <StrategicSessionBookingLink
            source="service_intake_confirmation"
            className="cta-gradient-motion cta-primary-booking inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/32 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:border-primary/46"
          >
            Book Strategic Session
          </StrategicSessionBookingLink>
          <Link
            href="/services"
            className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-[0.75rem] border border-primary/24 bg-background/45 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/38 hover:bg-primary/[0.08]"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  const [inputValue, setInputValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const diagnosticPanelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const chatFileInputRef = useRef<HTMLInputElement>(null)
  const [isLandingHighlighted, setIsLandingHighlighted] = useState(false)

  const [conversationState, setConversationState] =
    useState<ConversationStatePayload>(createInitialConversationState)
  const [leadData, setLeadData] = useState<LeadData>(createInitialLeadData)
  const [leadSubmitBusy, setLeadSubmitBusy] = useState(false)
  const [leadSubmitMessage, setLeadSubmitMessage] = useState<string | null>(
    null
  )
  const [enquirySubmitSuccess, setEnquirySubmitSuccess] = useState(false)
  const [routingCardDismissed, setRoutingCardDismissed] = useState(false)
  const [strategicBrief, setStrategicBrief] = useState<StrategicBriefPayload | null>(
    null
  )
  const [executiveSignals, setExecutiveSignals] = useState<
    ExecutiveSignalItem[] | null
  >(null)
  const [execSignalsBusy, setExecSignalsBusy] = useState(false)
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>(
    createInitialDiagnosticState
  )
  const [chatFlowMode, setChatFlowMode] = useState<ChatFlowMode>("idle")
  const [serviceIntakeState, setServiceIntakeState] =
    useState<ServiceIntakeState>(createInitialServiceIntakeState)
  const chatOpenedTrackedRef = useRef(false)

  const hasMessages = messages.length > 0 || error !== null
  const userTurnCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  )
  const currentDiagnosticStep =
    chatFlowMode === "diagnostic" && diagnosticState.snapshot === null
      ? diagnosticSteps[diagnosticState.currentStepIndex]
      : undefined
  const currentServiceStep =
    chatFlowMode === "service" && !serviceIntakeState.submitted
      ? serviceSteps[serviceIntakeState.currentStepIndex]
      : undefined
  const diagnosticStage = stageForStep(
    diagnosticState.currentStepIndex,
    diagnosticState.snapshot !== null
  )
  const intakeStage = serviceStageForStep(
    serviceIntakeState.currentStepIndex,
    serviceIntakeState.submitted
  )

  const serviceRecommendation = useMemo(
    () =>
      computePublicServiceRecommendation(
        messages,
        conversationState.visitorType
      ),
    [messages, conversationState.visitorType]
  )

  const attachmentUploadLabel = useMemo(() => {
    switch (conversationState.visitorType) {
      case "job_seeker":
        return "Upload CV"
      case "vendor":
        return "Upload Brochure / Deck"
      case "potential_client":
        return "Attach brief, deck, website audit, or reference"
      default:
        return chatFlowMode === "service"
          ? "Attach brief, deck, website audit, or reference"
          : uploadButtonLabel(messages)
    }
  }, [chatFlowMode, conversationState.visitorType, messages])

  useEffect(() => {
    if (hasMessages) return

    const currentPrompt = placeholderPrompts[placeholderIndex]

    if (isTyping) {
      if (displayedPlaceholder.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(
            currentPrompt.slice(0, displayedPlaceholder.length + 1)
          )
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length)
        setIsTyping(true)
      }
    }
  }, [displayedPlaceholder, isTyping, placeholderIndex, hasMessages])

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
      return
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, attachedFile])

  useEffect(() => {
    const focusDiagnosticInput = () => {
      if (window.location.hash !== "#consulting-chat") return

      const section = sectionRef.current
      if (section) {
        const offset = window.matchMedia("(max-width: 767px)").matches ? 72 : 88
        const top = section.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
      }

      setIsLandingHighlighted(true)
      window.setTimeout(() => {
        const target = chatInputRef.current ?? inputRef.current
        target?.focus({ preventScroll: true })
      }, 450)
      window.setTimeout(() => setIsLandingHighlighted(false), 1800)
    }

    const handleDiagnosticLinkClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]")
      const href = link?.getAttribute("href")
      if (href === "#consulting-chat" || href === "/#consulting-chat") {
        window.setTimeout(focusDiagnosticInput, 80)
      }
    }

    focusDiagnosticInput()
    window.addEventListener("hashchange", focusDiagnosticInput)
    document.addEventListener("click", handleDiagnosticLinkClick)
    return () => {
      window.removeEventListener("hashchange", focusDiagnosticInput)
      document.removeEventListener("click", handleDiagnosticLinkClick)
    }
  }, [])

  useEffect(() => {
    if (!hasMessages) return
    if (chatOpenedTrackedRef.current) return
    chatOpenedTrackedRef.current = true
    trackAnalyticsEvent(AnalyticsEvent.CHAT_OPENED)
  }, [hasMessages])

  useEffect(() => {
    setRoutingCardDismissed(false)
  }, [serviceRecommendation?.directionLabel])

  useEffect(() => {
    if (!hasMessages || enquirySubmitSuccess) {
      return
    }
    if (chatFlowMode === "service" || chatFlowMode === "clarify") {
      setExecutiveSignals(null)
      setExecSignalsBusy(false)
      return
    }
    const visitorType = conversationState.visitorType
    if (visitorType !== "potential_client" && visitorType !== "unknown") {
      setExecutiveSignals(null)
      setExecSignalsBusy(false)
      return
    }
    if (userTurnCount < 2) {
      setExecutiveSignals(null)
      setExecSignalsBusy(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setExecSignalsBusy(true)
      try {
        const res = await fetch("/api/chat/executive-signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            visitorType,
          }),
        })
        const data: { signals?: unknown } = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          setExecutiveSignals([])
          return
        }
        const list = Array.isArray(data.signals) ? data.signals : []
        setExecutiveSignals(list as ExecutiveSignalItem[])
      } catch {
        if (cancelled || controller.signal.aborted) return
        setExecutiveSignals([])
      } finally {
        if (!cancelled) setExecSignalsBusy(false)
      }
    }, 650)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [
    hasMessages,
    enquirySubmitSuccess,
    messages,
    userTurnCount,
    chatFlowMode,
    conversationState.visitorType,
  ])

  const syncDiagnosticConversationState = (
    thread: Message[],
    answers: DiagnosticAnswers,
    snapshot: DiagnosticSnapshot | null
  ) => {
    const contactText = answers.contact ?? ""
    const email = extractEmail(contactText)
    const phone = extractPhone(contactText)
    const name = extractNameFromContact(contactText)
    const summary = [
      "AI GROWTH DIAGNOSTIC",
      "",
      `Source: AI Growth Diagnostic`,
      `Business type: ${answers.businessType ?? "Not provided"}`,
      `Main challenge: ${answers.mainChallenge ?? "Not provided"}`,
      `Current marketing setup: ${answers.marketingSetup ?? "Not provided"}`,
      `AI usage level: ${answers.aiUsage ?? "Not provided"}`,
      `Systems status: ${answers.systemsStatus ?? "Not provided"}`,
      `Urgency: ${answers.urgency ?? "Not provided"}`,
      `Website/social link: ${answers.digitalLink ?? "Not provided"}`,
      snapshot ? "" : null,
      snapshot ? "Diagnostic snapshot:" : null,
      snapshot ? `Likely growth bottleneck: ${snapshot.likelyBottleneck}` : null,
      snapshot ? `AI opportunity: ${snapshot.aiOpportunity}` : null,
      snapshot
        ? `Recommended first system: ${snapshot.recommendedFirstSystem}`
        : null,
      snapshot ? `Recommended PxlBrief service: ${snapshot.recommendedService}` : null,
      snapshot ? `Lead priority: ${snapshot.leadPriority}` : null,
      snapshot ? `Suggested next step: ${snapshot.suggestedNextStep}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const base = deriveConversationState(
      thread.map((m) => ({ role: m.role, content: m.content })),
      conversationState,
      { attachedFileName: attachedFile?.name ?? null }
    )

    const nextState: ConversationStatePayload = {
      ...base,
      visitorType: "potential_client",
      name: name || base.name,
      company: answers.digitalLink ?? base.company,
      email: email || base.email,
      whatsapp: phone || base.whatsapp,
      conversationStage: snapshot ? "client_scheduling_focus" : "client_discovery",
      potentialClientStage: snapshot ? 5 : base.potentialClientStage,
      businessVertical: answers.businessType ?? base.businessVertical,
      businessStage: answers.urgency ?? base.businessStage,
      servicesInterested:
        snapshot?.recommendedService ?? base.servicesInterested,
      currentChallenge: answers.mainChallenge ?? base.currentChallenge,
      acquisitionChannels: answers.marketingSetup ?? base.acquisitionChannels,
      conversationSummary: summary,
    }

    setConversationState(nextState)
    setLeadData((prev) => ({
      ...deriveLeadData(prev, thread, nextState),
      visitorType: "potential_client",
      name: name || prev.name,
      company: answers.digitalLink ?? prev.company,
      website: answers.digitalLink ?? prev.website,
      service: snapshot?.recommendedService ?? prev.service,
      email: email || prev.email,
      phone: phone || prev.phone,
      notes: summary.slice(0, 1500),
    }))

    return nextState
  }

  const submitDiagnosticLead = async (
    thread: Message[],
    answers: DiagnosticAnswers,
    snapshot: DiagnosticSnapshot,
    syncedState: ConversationStatePayload
  ) => {
    const contactText = answers.contact ?? ""
    const email = extractEmail(contactText)
    const phone = extractPhone(contactText)
    const name = extractNameFromContact(contactText)
    const leadPayload: LeadData = {
      visitorType: "potential_client",
      name,
      company: answers.digitalLink ?? "",
      website: answers.digitalLink ?? "",
      instagram: answers.digitalLink?.startsWith("@") ? answers.digitalLink : "",
      service: snapshot.recommendedService,
      email,
      phone,
      notes: syncedState.conversationSummary.slice(0, 1500),
    }

    setDiagnosticState((state) => ({
      ...state,
      leadStatus: "submitting",
      leadMessage: null,
    }))
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: thread.map((m) => ({ role: m.role, content: m.content })),
          snapshot: syncedState,
          leadData: leadPayload,
          professionalSummary: syncedState.conversationSummary,
          submitSource: "AI Growth Diagnostic",
          serviceRecommendation: {
            directionLabel: snapshot.recommendedService,
            whyItMatters: snapshot.likelyBottleneck,
            suggestedNextStep: snapshot.suggestedNextStep,
          },
        }),
      })
      if (!res.ok) throw new Error("Diagnostic lead submit failed")
      setDiagnosticState((state) => ({
        ...state,
        leadStatus: "success",
        leadMessage:
          "Diagnostic received. We’ll review your answers and follow up shortly.",
      }))
    } catch {
      setDiagnosticState((state) => ({
        ...state,
        leadStatus: "error",
        leadMessage:
          "We could not submit this right now. Please email info@pxlbrief.com.",
      }))
    }
  }

  const syncServiceConversationState = (
    thread: Message[],
    intake: ServiceIntakeState
  ) => {
    const whatsapp = extractPhone(intake.answers.whatsapp ?? "")
    const email = extractEmail(intake.answers.email ?? "")
    const summary = [
      "PXLBRIEF AI INTAKE",
      "",
      "Source: PxlBrief AI Intake",
      "Intent type: Service Intent",
      `Service requested: ${intake.requestedService}`,
      `Recommended service: ${intake.recommendedService}`,
      `User message: ${intake.initialMessage}`,
      `WhatsApp: ${whatsapp || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      `Company: ${intake.answers.company ?? "Not provided"}`,
      `Website/social link: ${intake.answers.link ?? "Not provided"}`,
      `Timeline/urgency: ${intake.answers.urgency ?? "Not provided"}`,
      `Lead priority: ${
        /(urgent|ready|asap|this week|immediate)/i.test(intake.answers.urgency ?? "")
          ? "High"
          : "Medium"
      }`,
    ].join("\n")

    const base = deriveConversationState(
      thread.map((m) => ({ role: m.role, content: m.content })),
      conversationState,
      { attachedFileName: attachedFile?.name ?? null }
    )

    const nextState: ConversationStatePayload = {
      ...base,
      visitorType: "potential_client",
      company: intake.answers.company ?? base.company,
      email: email || base.email,
      whatsapp: whatsapp || base.whatsapp,
      conversationStage: intake.submitted
        ? "client_scheduling_focus"
        : "client_discovery",
      potentialClientStage: intake.submitted ? 5 : base.potentialClientStage,
      businessVertical: intake.requestedService || base.businessVertical,
      businessStage: intake.answers.urgency ?? base.businessStage,
      servicesInterested: intake.recommendedService || base.servicesInterested,
      currentChallenge: intake.initialMessage || base.currentChallenge,
      acquisitionChannels: intake.answers.link ?? base.acquisitionChannels,
      conversationSummary: summary,
    }

    setConversationState(nextState)
    setLeadData((prev) => ({
      ...deriveLeadData(prev, thread, nextState),
      visitorType: "potential_client",
      company: intake.answers.company ?? prev.company,
      website: intake.answers.link ?? prev.website,
      instagram: intake.answers.link?.startsWith("@")
        ? intake.answers.link
        : prev.instagram,
      service: intake.recommendedService || prev.service,
      email: email || prev.email,
      phone: whatsapp || prev.phone,
      notes: summary.slice(0, 1500),
    }))

    return nextState
  }

  const submitServiceLead = async (
    thread: Message[],
    intake: ServiceIntakeState,
    syncedState: ConversationStatePayload
  ) => {
    const whatsapp = extractPhone(intake.answers.whatsapp ?? "")
    const email = extractEmail(intake.answers.email ?? "")
    const leadPriority = /(urgent|ready|asap|this week|immediate)/i.test(
      intake.answers.urgency ?? ""
    )
      ? "High"
      : "Medium"

    const leadPayload: LeadData = {
      visitorType: "potential_client",
      name: "",
      company: intake.answers.company ?? "",
      website: intake.answers.link ?? "",
      instagram: intake.answers.link?.startsWith("@") ? intake.answers.link : "",
      service: intake.recommendedService,
      email,
      phone: whatsapp,
      notes: syncedState.conversationSummary.slice(0, 1500),
    }

    setServiceIntakeState((state) => ({
      ...state,
      leadStatus: "submitting",
      leadMessage: null,
    }))

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: thread.map((m) => ({ role: m.role, content: m.content })),
          snapshot: syncedState,
          leadData: leadPayload,
          professionalSummary: syncedState.conversationSummary,
          submitSource: "PxlBrief AI Intake",
          serviceRecommendation: {
            directionLabel: intake.recommendedService,
            whyItMatters: `The visitor asked for ${intake.requestedService}.`,
            suggestedNextStep:
              "Review the intake context and follow up with the right service path.",
          },
        }),
      })
      if (!res.ok) throw new Error("Service intake submit failed")
      setServiceIntakeState((state) => ({
        ...state,
        leadStatus: "success",
        leadMessage:
          "Intake received. We’ll review this and follow up with the right next step.",
      }))
    } catch {
      setServiceIntakeState((state) => ({
        ...state,
        leadStatus: "error",
        leadMessage:
          "We could not submit this right now. Please email info@pxlbrief.com.",
      }))
    }
  }

  const submitServiceAnswer = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    const step = serviceSteps[serviceIntakeState.currentStepIndex]
    if (!step || serviceIntakeState.submitted) {
      await submitMessage(text)
      return
    }

    if (step.id === "whatsapp" && !isPhoneUsable(text)) {
      const retryThread = [
        ...messages,
        makeMessage("user", text),
        makeMessage("assistant", "Please share a WhatsApp number so we can route this correctly."),
      ]
      setMessages(retryThread)
      setInputValue("")
      syncServiceConversationState(retryThread, serviceIntakeState)
      return
    }

    if (step.id === "email" && !isEmailUsable(text)) {
      const retryThread = [
        ...messages,
        makeMessage("user", text),
        makeMessage("assistant", "Please share a valid email ID for the detailed AI-led report."),
      ]
      setMessages(retryThread)
      setInputValue("")
      syncServiceConversationState(retryThread, serviceIntakeState)
      return
    }

    const nextAnswers: ServiceIntakeAnswers = {
      ...serviceIntakeState.answers,
      [step.id]: text,
    }
    const nextStepIndex = serviceIntakeState.currentStepIndex + 1
    const userMessage = makeMessage("user", text)

    if (nextStepIndex < serviceSteps.length) {
      const nextStep = serviceSteps[nextStepIndex]!
      const nextState: ServiceIntakeState = {
        ...serviceIntakeState,
        answers: nextAnswers,
        currentStepIndex: nextStepIndex,
        leadMessage: null,
      }
      const thread = [
        ...messages,
        userMessage,
        makeMessage("assistant", nextStep.question),
      ]
      setMessages(thread)
      setServiceIntakeState(nextState)
      setInputValue("")
      syncServiceConversationState(thread, nextState)
      return
    }

    const finalState: ServiceIntakeState = {
      ...serviceIntakeState,
      answers: nextAnswers,
      currentStepIndex: nextStepIndex,
      submitted: true,
      leadMessage: null,
    }
    const thread = [
      ...messages,
      userMessage,
      makeMessage(
        "assistant",
        `Captured. This looks like a fit for ${finalState.recommendedService}.\n\nWe’ll review the context and route it to the right next step.`
      ),
    ]
    setMessages(thread)
    setServiceIntakeState(finalState)
    setInputValue("")
    const syncedState = syncServiceConversationState(thread, finalState)
    await submitServiceLead(thread, finalState, syncedState)
  }

  const submitDiagnosticAnswer = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    const step = diagnosticSteps[diagnosticState.currentStepIndex]
    if (!step || diagnosticState.snapshot) {
      await submitMessage(text)
      return
    }

    if (messages.length === 0) {
      trackAnalyticsEvent(AnalyticsEvent.START_AI_CONSULTATION, {
        surface: "hero",
      })
      chatOpenedTrackedRef.current = true
    }

    const baseThread =
      messages.length === 0 ? [makeMessage("assistant", step.question)] : messages

    if (step.id === "contact" && !contactIsUsable(text)) {
      const retryThread = [
        ...baseThread,
        makeMessage("user", text),
        makeMessage(
          "assistant",
          "Please include your name and either an email or WhatsApp number in one line."
        ),
      ]
      setMessages(retryThread)
      setInputValue("")
      syncDiagnosticConversationState(retryThread, diagnosticState.answers, null)
      return
    }

    const nextAnswers: DiagnosticAnswers = {
      ...diagnosticState.answers,
      [step.id]: text,
    }
    const userMessage = makeMessage("user", text)
    const nextStepIndex = diagnosticState.currentStepIndex + 1

    if (nextStepIndex < diagnosticSteps.length) {
      const nextStep = diagnosticSteps[nextStepIndex]!
      const thread = [
        ...baseThread,
        userMessage,
        makeMessage("assistant", nextStep.question),
      ]
      setMessages(thread)
      setDiagnosticState((state) => ({
        ...state,
        answers: nextAnswers,
        currentStepIndex: nextStepIndex,
        leadMessage: null,
      }))
      setInputValue("")
      syncDiagnosticConversationState(thread, nextAnswers, null)
      return
    }

    const snapshot = buildDiagnosticSnapshot(nextAnswers)
    const snapshotMessage = makeMessage(
      "assistant",
      `Here is your diagnostic snapshot.\n\nLikely growth bottleneck: ${snapshot.likelyBottleneck}\n\nAI opportunity: ${snapshot.aiOpportunity}\n\nRecommended first system: ${snapshot.recommendedFirstSystem}\n\nRecommended PxlBrief service: ${snapshot.recommendedService}\n\nLead priority: ${snapshot.leadPriority}\n\nSuggested next step: ${snapshot.suggestedNextStep}`
    )
    const thread = [...baseThread, userMessage, snapshotMessage]
    setMessages(thread)
    setDiagnosticState((state) => ({
      ...state,
      answers: nextAnswers,
      currentStepIndex: nextStepIndex,
      snapshot,
      leadMessage: null,
    }))
    setInputValue("")
    const syncedState = syncDiagnosticConversationState(thread, nextAnswers, snapshot)
    await submitDiagnosticLead(thread, nextAnswers, snapshot, syncedState)
  }

  const startDiagnostic = () => {
    if (messages.length > 0) return
    const firstQuestion = diagnosticSteps[0]!.question
    const firstThread = [makeMessage("assistant", firstQuestion)]
    setMessages(firstThread)
    setChatFlowMode("diagnostic")
    setDiagnosticState(createInitialDiagnosticState())
    setError(null)
    setInputValue("")
    syncDiagnosticConversationState(firstThread, {}, null)
    window.setTimeout(() => chatInputRef.current?.focus({ preventScroll: true }), 120)
  }

  const startServiceIntake = (
    initialMessage: string,
    service: { requestedService: string; recommendedService: string }
  ) => {
    const userMessage = makeMessage("user", initialMessage)
    const assistantMessage = makeMessage(
      "assistant",
      serviceIntroCopy(service.requestedService)
    )
    const nextState: ServiceIntakeState = {
      ...createInitialServiceIntakeState(),
      initialMessage,
      requestedService: service.requestedService,
      recommendedService: service.recommendedService,
    }
    const thread = [...messages, userMessage, assistantMessage]
    if (messages.length === 0) {
      trackAnalyticsEvent(AnalyticsEvent.START_AI_CONSULTATION, {
        surface: "hero",
      })
      chatOpenedTrackedRef.current = true
    }
    setChatFlowMode("service")
    setMessages(thread)
    setServiceIntakeState(nextState)
    setInputValue("")
    setError(null)
    syncServiceConversationState(thread, nextState)
  }

  const startClarification = (initialMessage: string) => {
    const thread = [
      ...messages,
      makeMessage("user", initialMessage),
      makeMessage(
        "assistant",
        "Understood. Are you looking for a specific service such as marketing, website, branding, AI automation, or would you like to run a growth diagnostic first?"
      ),
    ]
    if (messages.length === 0) {
      trackAnalyticsEvent(AnalyticsEvent.START_AI_CONSULTATION, {
        surface: "hero",
      })
      chatOpenedTrackedRef.current = true
    }
    setChatFlowMode("clarify")
    setMessages(thread)
    setInputValue("")
    setError(null)
  }

  const handleClarificationChoice = (choice: string) => {
    if (choice === "Run diagnostic") {
      const firstQuestion = diagnosticSteps[0]!.question
      const thread = [
        ...messages,
        makeMessage("user", choice),
        makeMessage("assistant", firstQuestion),
      ]
      setChatFlowMode("diagnostic")
      setMessages(thread)
      setDiagnosticState(createInitialDiagnosticState())
      setInputValue("")
      syncDiagnosticConversationState(thread, {}, null)
      return
    }

    if (choice === "I need a service") {
      const thread = [
        ...messages,
        makeMessage("user", choice),
        makeMessage(
          "assistant",
          "Which service do you need help with — marketing, website, SEO, branding, AI automation, CRM, dashboards, or something else?"
        ),
      ]
      setChatFlowMode("clarify")
      setMessages(thread)
      setInputValue("")
      return
    }

    void submitMessage(choice)
  }

  const routeInitialMessage = async (text: string) => {
    const intent = classifyInitialIntent(text)
    if (intent === "diagnostic") {
      const thread = [
        makeMessage("user", text),
        makeMessage("assistant", diagnosticSteps[0]!.question),
      ]
      setChatFlowMode("diagnostic")
      setMessages(thread)
      setDiagnosticState(createInitialDiagnosticState())
      setInputValue("")
      syncDiagnosticConversationState(thread, {}, null)
      return
    }
    if (intent === "service") {
      const service = classifyServiceIntent(text)
      if (service) startServiceIntake(text, service)
      return
    }
    if (intent === "job" || intent === "vendor") {
      setChatFlowMode("chat")
      await submitMessage(text)
      return
    }
    startClarification(text)
  }

  const submitMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    if (messages.length === 0) {
      trackAnalyticsEvent(AnalyticsEvent.START_AI_CONSULTATION, {
        surface: "hero",
      })
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }

    const updatedMessages = [...messages, userMessage]
    const nextConversationState = deriveConversationState(
      updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      conversationState,
      { attachedFileName: attachedFile?.name ?? null }
    )

    setMessages(updatedMessages)
    setConversationState(nextConversationState)
    setLeadData((prev) =>
      deriveLeadData(prev, updatedMessages, nextConversationState)
    )
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map<ChatRequestMessage>((message) => ({
            role: message.role,
            content: message.content,
          })),
          conversationState: sanitizeConversationStateForChat(
            nextConversationState
          ),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || `Request failed with status ${response.status}`
        )
      }

      if (data.reply) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        }
        const fullThread = [...updatedMessages, assistantMessage]
        const afterConversationState = deriveConversationState(
          fullThread.map((m) => ({ role: m.role, content: m.content })),
          nextConversationState,
          { attachedFileName: attachedFile?.name ?? null }
        )
        setMessages(fullThread)
        setConversationState(afterConversationState)
        setLeadData((prev) =>
          deriveLeadData(prev, fullThread, afterConversationState)
        )
      } else {
        throw new Error("No reply received from the assistant")
      }
    } catch {
      setError(PUBLIC_SUPPORT_EMAIL_MESSAGE)
      setLeadData((prev) =>
        deriveLeadData(prev, updatedMessages, nextConversationState)
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (!text) return
    if (messages.length === 0 || chatFlowMode === "idle") {
      await routeInitialMessage(text)
      return
    }
    if (chatFlowMode === "service" && !serviceIntakeState.submitted) {
      await submitServiceAnswer(text)
      return
    }
    if (chatFlowMode === "diagnostic" && !diagnosticState.snapshot) {
      await submitDiagnosticAnswer(inputValue)
      return
    }
    if (chatFlowMode === "clarify") {
      const service = classifyServiceIntent(text)
      if (isDiagnosticIntent(text)) {
        handleClarificationChoice("Run diagnostic")
        return
      }
      if (service) {
        startServiceIntake(text, service)
        return
      }
    }
    await submitMessage(inputValue)
  }

  const handleClose = () => {
    chatOpenedTrackedRef.current = false
    setMessages([])
    setError(null)
    setConversationState(createInitialConversationState())
    setLeadData(createInitialLeadData())
    setAttachedFile(null)
    setLeadSubmitMessage(null)
    setEnquirySubmitSuccess(false)
    setRoutingCardDismissed(false)
    setStrategicBrief(null)
    setExecutiveSignals(null)
    setExecSignalsBusy(false)
    setDiagnosticState(createInitialDiagnosticState())
    setChatFlowMode("idle")
    setServiceIntakeState(createInitialServiceIntakeState())
    if (chatFileInputRef.current) chatFileInputRef.current.value = ""
  }

  const MAX_ENQUIRY_ATTACHMENT_BYTES = 3.5 * 1024 * 1024

  async function fileToBase64Payload(file: File) {
    if (file.size > MAX_ENQUIRY_ATTACHMENT_BYTES) {
      throw new Error("File is too large to attach (max about 3.5 MB).")
    }
    const buf = await file.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    return {
      filename: file.name.slice(0, 240),
      contentType: file.type || "application/octet-stream",
      base64: btoa(binary),
    }
  }

  const handleSubmitEnquiry = async () => {
    if (conversationState.visitorType === "unknown") return
    setLeadSubmitBusy(true)
    setLeadSubmitMessage(null)
    setEnquirySubmitSuccess(false)
    setStrategicBrief(null)
    try {
      const synced = deriveLeadData(leadData, messages, conversationState)
      setLeadData(synced)

      const routingPayload = computePublicServiceRecommendation(
        messages,
        conversationState.visitorType
      )

      const sumRes = await fetch("/api/lead/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          leadData: synced,
          snapshot: conversationState,
          ...(routingPayload ? { serviceRecommendation: routingPayload } : {}),
        }),
      })
      const sumJson = await sumRes.json()
      if (!sumRes.ok) {
        throw new Error(sumJson.error || "Could not generate lead summary")
      }
      const professionalSummary =
        typeof sumJson.professionalSummary === "string"
          ? sumJson.professionalSummary
          : ""

      let attachment:
        | {
            filename: string
            contentType: string
            base64: string
          }
        | undefined
      if (attachedFile) {
        attachment = await fileToBase64Payload(attachedFile)
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          snapshot: conversationState,
          leadData: synced,
          professionalSummary,
          attachment,
          submitSource: "Homepage · PxlBrief AI",
          ...(routingPayload ? { serviceRecommendation: routingPayload } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      const br = data.strategicBrief as StrategicBriefPayload | undefined
      if (br?.complete === true && br.fields) {
        setStrategicBrief({ complete: true, fields: br.fields })
      } else {
        setStrategicBrief({ complete: false })
      }
      setEnquirySubmitSuccess(true)
      setExecutiveSignals(null)
      setExecSignalsBusy(false)
      setLeadSubmitMessage(null)
      trackAnalyticsEvent(AnalyticsEvent.SUBMIT_ENQUIRY, { success: true })
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Failed to submit enquiry"
      setEnquirySubmitSuccess(false)
      setLeadSubmitMessage(sanitizeEnquirySubmitErrorMessage(raw))
    } finally {
      setLeadSubmitBusy(false)
    }
  }

  const handleChatFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!isAllowedUploadFile(file)) {
      event.target.value = ""
      return
    }
    setAttachedFile(file)
    const nextConv = deriveConversationState(
      messages.map((m) => ({ role: m.role, content: m.content })),
      conversationState,
      { attachedFileName: file.name }
    )
    setConversationState(nextConv)
    setLeadData((prev) => deriveLeadData(prev, messages, nextConv))
  }

  const removeAttachedFile = () => {
    setAttachedFile(null)
    if (chatFileInputRef.current) chatFileInputRef.current.value = ""
    const nextConv = deriveConversationState(
      messages.map((m) => ({ role: m.role, content: m.content })),
      conversationState,
      { attachedFileName: null }
    )
    setConversationState(nextConv)
    setLeadData((prev) => deriveLeadData(prev, messages, nextConv))
  }

  return (
    <section
      id="consulting-chat"
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-24 flex-col overflow-hidden bg-black px-4 pb-16 pt-10 text-white sm:px-5 sm:pb-20 md:min-h-[calc(100svh-5rem)] md:px-8 md:pb-24 md:pt-16 lg:pt-20"
      aria-label="Run your AI growth diagnostic"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 z-[2] h-px w-full max-w-7xl -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden
        />
        <div
          className="absolute left-[-10%] top-[-10%] z-0 h-[80vw] w-[80vw] rounded-full bg-cyan-500/10 blur-[80px] md:h-[500px] md:w-[500px] md:blur-[120px]"
          style={{ animation: "pxl-breathe 14s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[-10%] top-[20%] z-0 h-[80vw] w-[80vw] rounded-full bg-purple-500/10 blur-[80px] md:h-[600px] md:w-[600px] md:blur-[150px]"
          style={{ animation: "pxl-breathe 18s ease-in-out infinite 1.5s" }}
          aria-hidden
        />
        <div
          className="absolute bottom-[-18%] left-1/2 z-0 h-[70vw] w-[90vw] -translate-x-1/2 rounded-full bg-[#ff7f50]/[0.06] blur-[90px] md:h-[420px] md:w-[900px] md:blur-[140px]"
          style={{
            animation: "pxl-breathe 18s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:40px_40px]"
          aria-hidden
        />
        <div
          className="absolute inset-x-[-18%] bottom-[-24%] z-0 h-[46%] bg-[linear-gradient(120deg,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:72px_72px] opacity-45 [transform:perspective(760px)_rotateX(62deg)]"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-black/80 to-transparent md:h-44" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent via-black/45 to-black md:h-52" />
      </div>

      {!hasMessages ? (
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center">
          <div className="grid w-full grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col items-center space-y-6 text-center md:space-y-8 lg:col-span-7 lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-400 md:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.85)] animate-pulse" />
                AI Engine Live v3.5
              </div>

              <div className="space-y-4 md:space-y-6">
                <h1 className="mx-auto max-w-xl bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-4xl font-black leading-[1.05] tracking-tight text-transparent sm:text-5xl md:max-w-2xl md:text-6xl lg:mx-0 lg:text-7xl">
                  Run Your AI <br className="hidden sm:block" />
                  Growth Diagnostic
                </h1>

                <p className="mx-auto max-w-md text-base font-light leading-relaxed text-slate-400 md:max-w-xl md:text-lg lg:mx-0">
                  <span className="md:hidden">
                    Answer a few focused questions and PxlBrief AI will identify
                    your likely bottleneck, AI opportunity, and next step.
                  </span>
                  <span className="hidden md:inline">
                    Answer a few focused questions and PxlBrief AI will identify
                    your likely growth bottleneck, AI opportunity, and
                    recommended next step.
                  </span>
                </p>
              </div>

              <div className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
                <button
                  type="button"
                  onClick={startDiagnostic}
                  className="w-full touch-manipulation rounded-full border border-[#ff7f50]/35 bg-gradient-to-r from-[#ff7f50] to-[#ffa07a] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_0_25px_rgba(255,127,80,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(255,127,80,0.45),inset_0_1px_0_rgba(255,255,255,0.24)] active:translate-y-0 sm:w-auto md:text-base"
                >
                  <span>Discuss With PxlBrief AI</span>
                </button>
                <StrategicSessionBookingLink
                  source="homepage_hero"
                  className="inline-flex w-full touch-manipulation items-center justify-center rounded-full border border-white/10 bg-white/[0.045] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_22px_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.075] sm:w-auto md:text-base"
                >
                  Book Strategic Session
                </StrategicSessionBookingLink>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="group relative min-h-[430px] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.018] p-3 shadow-[0_35px_120px_-70px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm sm:p-4 md:min-h-[450px]">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.035] blur-2xl" />

                <div className="relative z-10 flex h-full min-h-[404px] flex-col justify-between rounded-[1rem] border border-white/[0.06] bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-4 md:min-h-[420px]">
                  <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <div>
                      <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Intelligent UI console pipeline
                      </p>
                      <p className="mt-1 text-sm font-semibold tracking-tight text-white">
                        Diagnostic console ready
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 shrink-0 animate-spin text-slate-500 [animation-duration:8s]" strokeWidth={1.25} />
                  </div>

                  <div className="my-5 grid gap-2 text-center text-[0.68rem] text-slate-400 sm:grid-cols-3">
                    <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.055] px-3 py-2">
                      Growth scan
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2">
                      AI map
                    </span>
                    <span className="rounded-full border border-[#ff7f50]/20 bg-[#ff7f50]/[0.055] px-3 py-2">
                      Next step
                    </span>
                  </div>

                  <div className="relative z-10 w-full">
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-5 shadow-2xl backdrop-blur-xl md:p-6">
                      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transition-all duration-500 group-hover:via-cyan-500/60" />
                      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#ff7f50]/10 blur-3xl" />

                      <div className="relative space-y-6">
                        <div className="space-y-1">
                          <p className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff7f50] md:text-xs">
                            Start Here: Tell us what kind of business you run
                            and what you want to improve
                          </p>
                        </div>

                        <div
                          ref={diagnosticPanelRef}
                          className={`relative flex flex-col items-stretch gap-3 transition-[box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex-row ${
                            isFocused || isLandingHighlighted
                              ? "drop-shadow-[0_0_34px_rgba(34,211,238,0.2)]"
                              : ""
                          }`}
                        >
                          <form onSubmit={handleSubmit} className="min-w-0 flex-1">
                            <div className="relative flex-1">
                              <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={displayedPlaceholder}
                                className={`w-full min-w-0 touch-manipulation rounded-xl border bg-black/40 py-4 pl-5 pr-16 text-sm font-light leading-snug text-white shadow-inner outline-none transition-all duration-300 placeholder:text-slate-600 focus:outline-none md:text-base ${
                                  isFocused
                                    ? "border-cyan-500/50 ring-1 ring-cyan-500/30"
                                    : "border-white/10 hover:border-cyan-500/25"
                                }`}
                              />
                              <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg bg-[#ff7f50]/10 p-2.5 text-[#ff7f50] transition-all duration-200 hover:bg-[#ff7f50]/20 hover:text-[#ffa07a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 md:h-5 md:w-5" />
                              </button>
                            </div>
                          </form>
                        </div>

                        <div className="space-y-3">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                            Suggested Entry Parameter Shortcuts:
                          </span>
                          <div
                            className="flex flex-wrap gap-2 md:gap-3"
                            role="group"
                            aria-label="Suggested prompts"
                          >
                            {suggestionChips.map(({ label, prompt }) => (
                              <button
                                key={prompt}
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                  setInputValue(prompt)
                                  inputRef.current?.focus()
                                }}
                                className="min-h-11 touch-manipulation rounded-full border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-slate-400 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-45"
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto mt-4 w-full max-w-md lg:hidden">
                <div className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-cyan-400/[0.04] blur-xl" />
                <ExecutiveIntelligencePanel compact />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!hasMessages ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent"
          aria-hidden
        />
      ) : null}

      {hasMessages && (
        <div className="relative z-10 mx-auto mt-4 w-full min-w-0 max-w-3xl px-1.5 sm:mt-10 sm:px-3 md:mt-12 md:px-0">
          <div className="relative overflow-hidden rounded-[1.125rem] border border-hairline bg-card/95 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.25rem] dark:bg-card/[0.55]">
            <div className="flex min-w-0 items-center justify-between gap-2 border-b border-hairline bg-chrome-bar px-3 py-2.5 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] border border-primary/20 bg-primary/[0.12] sm:h-8 sm:w-8">
                  <Sparkles className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="block text-[0.8125rem] font-medium tracking-tight text-foreground sm:text-sm">
                    PxlBrief Diagnostic
                  </span>
                  <span className="text-[0.625rem] text-muted-foreground/75 sm:text-[0.6875rem]">
                    Guided growth engine
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="inline-flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-[0.5rem] text-muted-foreground transition-colors duration-200 hover:bg-foreground/[0.06] hover:text-foreground sm:size-11"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {isLoading && (
              <div className="relative h-px w-full overflow-hidden bg-[color:var(--shine-track)]">
                <div
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  style={{
                    animation: "pxl-shimmer 1.45s ease-in-out infinite",
                  }}
                />
              </div>
            )}

            <div
              ref={messagesContainerRef}
              className="max-h-[min(42vh,360px)] space-y-3.5 overflow-y-auto overscroll-contain px-3 py-3.5 sm:max-h-[min(50vh,500px)] sm:space-y-5 sm:px-5 sm:py-5 md:max-h-[min(54vh,540px)] md:space-y-6 md:px-6 md:py-6"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex min-w-0 gap-2 sm:gap-3 md:gap-3.5 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-primary/15 bg-primary/[0.08] sm:h-8 sm:w-8">
                      <Sparkles
                        className="h-3.5 w-3.5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div
                    className={`rounded-[0.9rem] px-3 py-2.5 sm:px-4 md:px-[1.125rem] md:py-3.5 ${
                      message.role === "user"
                        ? "max-w-[min(calc(100vw-5rem),27rem)] border border-accent/28 bg-[#17191d]/92 text-foreground shadow-[0_0_24px_-18px_var(--glow-accent),inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:max-w-[min(84%,28rem)]"
                        : "max-w-[min(calc(100vw-5.25rem),25.5rem)] border border-primary/16 bg-muted/[0.31] text-foreground shadow-sm sm:max-w-[min(78%,26rem)]"
                    }`}
                  >
                    <div className="break-words whitespace-pre-wrap text-[0.8125rem] leading-[1.5] md:text-[0.9375rem] md:leading-[1.58]">
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-accent/18 bg-accent/[0.05] sm:h-8 sm:w-8">
                      <User
                        className="h-3.5 w-3.5 text-accent/85"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex min-w-0 justify-start gap-2 sm:gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-primary/15 bg-primary/[0.08] sm:h-8 sm:w-8">
                    <Sparkles
                      className="h-3.5 w-3.5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="rounded-[0.9rem] border border-primary/16 bg-muted/[0.31] px-3 py-2.5 shadow-sm md:px-4 md:py-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                        Synthesizing
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      role="status"
                      aria-label="Assistant is responding"
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary/75"
                          style={{
                            animation: `pxl-dot-pulse 1.15s ease-in-out ${i * 140}ms infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex min-w-0 justify-start gap-2 sm:gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-red-500/20 bg-red-500/[0.08] sm:h-8 sm:w-8">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div className="max-w-[min(calc(100vw-5.25rem),25.5rem)] rounded-[0.9rem] border border-red-500/20 bg-red-500/[0.07] px-3 py-2.5 text-red-200/90 sm:max-w-[min(78%,26rem)] sm:px-4 md:px-[1.125rem] md:py-3.5">
                    <p className="text-[0.8125rem] leading-[1.5] md:text-sm md:leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {attachedFile && (
                <div className="flex min-w-0 justify-end gap-2 sm:gap-3 md:gap-3.5">
                  <div className="flex max-w-[min(calc(100vw-5rem),27rem)] items-center gap-2 rounded-[0.9rem] border border-accent/22 bg-[#17191d]/88 px-3 py-2 text-left shadow-sm backdrop-blur-sm sm:max-w-[min(84%,28rem)] sm:gap-3 sm:px-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-primary/15 bg-primary/[0.1] sm:h-8 sm:w-8">
                      <Paperclip className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground/75">
                        Attachment
                      </div>
                      <div
                        className="truncate text-[0.8125rem] text-foreground"
                        title={attachedFile.name}
                      >
                        {attachedFile.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachedFile}
                      className="inline-flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-[0.5rem] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground sm:size-10"
                      aria-label="Remove attachment"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[0.45rem] border border-accent/18 bg-accent/[0.05] sm:h-8 sm:w-8">
                    <User className="h-3.5 w-3.5 text-accent/85" />
                  </div>
                </div>
              )}

              {currentDiagnosticStep?.options &&
              diagnosticState.snapshot === null ? (
                <div
                  className="ml-9 grid max-w-[min(calc(100vw-5.25rem),25.5rem)] grid-cols-1 gap-2 sm:ml-11 sm:max-w-[min(78%,26rem)] sm:grid-cols-2"
                  role="group"
                  aria-label={`${currentDiagnosticStep.question} quick replies`}
                >
                  {currentDiagnosticStep.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={isLoading}
                      onClick={() => submitDiagnosticAnswer(option)}
                      className="min-h-9 touch-manipulation rounded-full border border-primary/14 bg-primary/[0.055] px-3 py-2 text-left text-[0.75rem] font-medium leading-snug text-foreground/88 transition-colors hover:border-primary/32 hover:bg-primary/[0.095] disabled:pointer-events-none disabled:opacity-45"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}

              {chatFlowMode === "clarify" ? (
                <div
                  className="ml-9 grid max-w-[min(calc(100vw-5.25rem),25.5rem)] grid-cols-1 gap-2 sm:ml-11 sm:max-w-[min(78%,26rem)] sm:grid-cols-3"
                  role="group"
                  aria-label="Clarify intake path"
                >
                  {clarificationChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleClarificationChoice(choice)}
                      className="min-h-9 touch-manipulation rounded-full border border-primary/14 bg-primary/[0.055] px-3 py-2 text-left text-[0.75rem] font-medium leading-snug text-foreground/88 transition-colors hover:border-primary/32 hover:bg-primary/[0.095] disabled:pointer-events-none disabled:opacity-45"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            {diagnosticState.snapshot ? (
              <DiagnosticSnapshotPanel
                snapshot={diagnosticState.snapshot}
                leadStatus={diagnosticState.leadStatus}
                leadMessage={diagnosticState.leadMessage}
              />
            ) : null}

            {serviceIntakeState.submitted ? (
              <ServiceIntakeConfirmationPanel
                service={serviceIntakeState.recommendedService}
                leadStatus={serviceIntakeState.leadStatus}
                leadMessage={serviceIntakeState.leadMessage}
              />
            ) : null}

            {!enquirySubmitSuccess &&
            chatFlowMode !== "service" &&
            chatFlowMode !== "clarify" ? (
              <ExecutiveSignalsPanel
                signals={executiveSignals}
                loading={execSignalsBusy}
              />
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="border-t border-hairline bg-chrome-bar p-2.5 sm:p-4 md:p-5"
            >
              <input
                ref={chatFileInputRef}
                type="file"
                className="hidden"
                accept={FILE_INPUT_ACCEPT}
                onChange={handleChatFileChange}
                aria-label="Attach PDF or document"
              />
              {serviceRecommendation &&
                !routingCardDismissed &&
                !diagnosticState.snapshot &&
                chatFlowMode !== "service" &&
                chatFlowMode !== "clarify" &&
                userTurnCount >= 2 && (
                  <ServiceRecommendationCard
                    recommendation={serviceRecommendation}
                    onDismiss={() => setRoutingCardDismissed(true)}
                  />
                )}
              {chatFlowMode === "diagnostic" ? (
                <div className="mb-2 flex items-center justify-between gap-2 rounded-[0.75rem] border border-primary/12 bg-primary/[0.045] px-3 py-2 text-left shadow-[inset_0_1px_0_0_var(--shine-inset)]">
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/88">
                    Diagnostic stage
                  </span>
                  <span className="truncate text-[0.75rem] font-medium text-foreground/88">
                    {diagnosticStage}
                  </span>
                </div>
              ) : chatFlowMode === "service" || chatFlowMode === "clarify" ? (
                <div className="mb-2 flex items-center justify-between gap-2 rounded-[0.75rem] border border-primary/12 bg-primary/[0.045] px-3 py-2 text-left shadow-[inset_0_1px_0_0_var(--shine-inset)]">
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/88">
                    PxlBrief AI Intake
                  </span>
                  <span className="truncate text-[0.75rem] font-medium text-foreground/88">
                    {chatFlowMode === "service" ? intakeStage : "Understanding requirement"}
                  </span>
                </div>
              ) : null}
              {enquirySubmitSuccess ? (
                <div className="space-y-0">
                  <div
                    className="mb-4 rounded-[0.875rem] border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-card/96 p-5 shadow-sm backdrop-blur-sm dark:from-primary/[0.08] dark:to-card/[0.35] md:p-6"
                    role="status"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <p className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground md:text-base">
                            Thank you — your brief is in.
                          </p>
                          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground/90 md:text-sm">
                            A principal will review your thread and follow up personally.
                            Most replies land within one to two business days.
                          </p>
                        </div>
                        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/85 md:text-sm">
                          If the matter is time-sensitive, hold a strategy session so
                          we can align on cadence and ownership before the week moves
                          on.
                        </p>
                        <StrategicSessionBookingLink
                          source="hero_enquiry_success"
                          className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-[0.875rem] bg-primary px-5 py-3 text-sm font-semibold tracking-tight text-primary-foreground shadow-md shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/[0.94] hover:shadow-lg hover:shadow-primary/18 motion-reduce:transition-colors"
                        >
                          Book strategy session
                        </StrategicSessionBookingLink>
                      </div>
                    </div>
                  </div>
                  {strategicBrief !== null ? (
                    <StrategicBriefCard payload={strategicBrief} />
                  ) : null}
                </div>
              ) : leadSubmitMessage ? (
                <p className="mb-3 text-[0.8125rem] leading-relaxed text-muted-foreground md:text-sm">
                  {leadSubmitMessage}
                </p>
              ) : null}
              <div className="flex min-w-0 items-center gap-2 rounded-[0.75rem] border border-hairline bg-card/45 px-2 py-1.5 shadow-inner transition-all duration-200 focus-within:border-primary/35 focus-within:ring-1 focus-within:ring-primary/15 sm:px-3 md:gap-3 md:rounded-[0.875rem] md:px-4 md:py-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    currentDiagnosticStep
                      ? "Type your answer or choose below…"
                      : currentServiceStep
                        ? currentServiceStep.optional
                          ? "Type a timeline, or write skip…"
                          : "Type your answer…"
                        : "Add detail or your next move…"
                  }
                  disabled={isLoading}
                  className="min-h-10 min-w-0 flex-1 touch-manipulation bg-transparent py-1.5 text-[0.875rem] text-foreground outline-none placeholder:text-muted-foreground/40 disabled:opacity-45 md:min-h-11 md:py-2 md:text-[0.9375rem]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-[0.625rem] bg-primary text-primary-foreground shadow-md shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/[0.94] hover:shadow-lg active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none md:size-11 motion-reduce:transition-colors"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="mt-2.5 flex min-w-0 justify-start">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => chatFileInputRef.current?.click()}
                  className="inline-flex min-h-9 max-w-full touch-manipulation items-center gap-2 rounded-[0.625rem] border border-hairline bg-foreground/[0.035] px-3 py-2 text-left text-[0.75rem] font-medium text-muted-foreground/90 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-45"
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary/90" />
                  <span className="truncate text-left leading-snug">
                    {attachmentUploadLabel}
                  </span>
                </button>
              </div>
              <div className="mt-2.5 sm:mt-3">
                <button
                  type="button"
                  disabled={
                    leadSubmitBusy ||
                    isLoading ||
                    conversationState.visitorType === "unknown" ||
                    chatFlowMode === "service" ||
                    chatFlowMode === "clarify"
                  }
                  onClick={handleSubmitEnquiry}
                  className="flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-[0.75rem] border border-hairline bg-foreground/[0.04] px-4 py-3 text-[0.8125rem] font-medium tracking-tight text-foreground/95 transition-all duration-300 ease-out hover:border-primary/28 hover:bg-primary/[0.06] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 md:min-h-12 md:rounded-[0.875rem] md:py-3.5 md:text-sm"
                >
                  <Send className="h-4 w-4 shrink-0 text-primary/90" />
                  {leadSubmitBusy ? "Sending…" : "Send brief"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.32;
          }
          50% {
            opacity: 0.55;
          }
        }
      `}</style>
    </section>
  )
}
