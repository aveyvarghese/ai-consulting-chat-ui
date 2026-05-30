"use client"

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
    label: "I need more leads",
    prompt: "I need more leads for my business.",
  },
  {
    label: "My marketing is scattered",
    prompt: "My marketing is scattered and I need a clearer growth system.",
  },
  {
    label: "I want to use AI",
    prompt: "I want to use AI in my business but do not know where to start.",
  },
  {
    label: "My website is not converting",
    prompt: "My website is not converting enough visitors into enquiries.",
  },
  {
    label: "Leads are not tracked",
    prompt: "Leads are not tracked properly across our website, CRM, and follow-up.",
  },
  {
    label: "I need better dashboards",
    prompt: "I need better dashboards and reporting for founder-level decisions.",
  },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatRequestMessage {
  role: "user" | "assistant"
  content: string
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
  const chatOpenedTrackedRef = useRef(false)

  const hasMessages = messages.length > 0 || error !== null

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
        return "Share Brief / Reference"
      default:
        return uploadButtonLabel(messages)
    }
  }, [conversationState.visitorType, messages])

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
    const visitorType = conversationState.visitorType
    if (visitorType !== "potential_client" && visitorType !== "unknown") {
      setExecutiveSignals(null)
      setExecSignalsBusy(false)
      return
    }
    const userTurns = messages.filter((m) => m.role === "user").length
    if (userTurns < 2) {
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
    conversationState.visitorType,
  ])

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
      className="section-hero-dark relative flex min-h-[min(70vh,700px)] scroll-mt-24 flex-col items-center justify-center overflow-x-hidden px-3 pb-9 pt-6 sm:px-4 sm:pb-20 sm:pt-12 md:min-h-[min(82vh,900px)] md:pb-28 md:pt-20 lg:pt-24"
      aria-label="Run your AI growth diagnostic"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[18%] h-[min(92vw,420px)] w-[min(98vw,520px)] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[72px] md:top-[22%] md:h-[min(92vw,760px)] md:w-[min(98vw,980px)] md:bg-primary/[0.06] md:blur-[136px]"
          style={{ animation: "pxl-breathe 14s ease-in-out infinite" }}
        />
        <div
          className="hidden md:absolute md:-top-[18%] md:right-[8%] md:block md:h-[min(64vw,520px)] md:w-[min(64vw,520px)] md:rounded-full md:bg-[color-mix(in_oklab,var(--primary)_28%,transparent)] md:opacity-[0.16] md:blur-[120px]"
          aria-hidden
        />
        <div
          className="absolute bottom-[16%] right-[4%] h-[min(56vw,260px)] w-[min(56vw,260px)] rounded-full bg-accent/[0.045] blur-[72px] md:bottom-[13%] md:right-[8%] md:h-[min(70vw,520px)] md:w-[min(70vw,520px)] md:bg-accent/[0.065] md:blur-[118px]"
          style={{
            animation: "pxl-breathe 18s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16] pxl-data-grid md:opacity-[0.23] md:pxl-data-grid-shift"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/90 to-transparent md:h-44" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-background/35 to-section-tint/55 md:h-40" />
      </div>

      {!hasMessages ? (
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,0.98fr)_minmax(390px,0.82fr)] lg:gap-10 xl:gap-14">
            <div className="text-center lg:text-left">
              <div className="mb-3 md:mb-8 lg:mb-9">
                <span className="inline-flex max-w-full rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary/90 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-[0.6875rem] sm:tracking-[0.22em]">
                  PxlBrief AI diagnostic
                </span>
                <span className="mt-3 block text-lg font-semibold tracking-tight text-foreground sm:text-xl md:mt-6 md:text-2xl">
                  Pxl<span className="text-primary">Brief</span>
                </span>
              </div>

              <h1 className="mx-auto mb-3 max-w-4xl text-balance text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground min-[390px]:text-[2.18rem] sm:text-[2.45rem] md:mb-8 md:text-5xl md:leading-[1.03] md:tracking-[-0.045em] lg:mx-0 lg:text-[3.45rem] xl:text-[3.85rem]">
                Run Your AI Growth Diagnostic
              </h1>

              <p className="mx-auto mb-4 max-w-xl text-pretty text-[0.9375rem] font-normal leading-[1.55] text-muted-foreground/90 md:mb-8 md:max-w-2xl md:text-lg md:leading-relaxed lg:mx-0 lg:max-w-xl">
                <span className="md:hidden">
                  Answer a few focused questions and PxlBrief AI will identify
                  your likely bottleneck, AI opportunity, and next step.
                </span>
                <span className="hidden md:inline">
                  Answer a few focused questions and PxlBrief AI will identify
                  your likely growth bottleneck, AI opportunity, and recommended
                  next step.
                </span>
              </p>

              <div className="mx-auto mb-4 flex w-full max-w-xl flex-col gap-2.5 sm:flex-row md:mb-9 lg:mx-0">
                <button
                  type="button"
                  onClick={() => inputRef.current?.focus()}
                  className="inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/35 bg-gradient-to-b from-primary via-primary/95 to-primary/82 px-6 py-3.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_18px_48px_-24px_var(--glow-primary)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/48 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.26),0_24px_58px_-20px_var(--glow-primary)] active:scale-[0.985] motion-reduce:transition-colors sm:w-auto sm:flex-1 lg:flex-none"
                >
                  <span>Run My Growth Diagnostic</span>
                </button>
                <a
                  href="#ai-lab"
                  className="inline-flex min-h-[3.125rem] w-full touch-manipulation items-center justify-center rounded-[0.875rem] border border-primary/14 bg-card/62 px-6 py-3.5 text-sm font-semibold tracking-tight text-foreground shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/34 hover:bg-primary/[0.06] hover:text-foreground hover:shadow-[0_14px_40px_-28px_var(--glow-primary)] sm:w-auto sm:flex-1 lg:flex-none"
                >
                  <span className="md:hidden">Explore AI Lab</span>
                  <span className="hidden md:inline">Enter AI Lab</span>
                </a>
              </div>

              <div className="relative mx-auto mb-4 w-full max-w-sm lg:hidden">
                <div className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-primary/[0.035] blur-xl" />
                <ExecutiveIntelligencePanel compact />
              </div>

              <p className="mb-2 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-primary/80 md:mb-3 md:text-[0.6875rem] md:tracking-[0.22em] lg:text-left">
                Start here: tell us what kind of business you run and what you
                want to improve.
              </p>
              <div
                ref={diagnosticPanelRef}
                className={`relative mx-auto mb-4 w-full min-w-0 max-w-2xl rounded-[1.125rem] transition-[box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:mb-6 lg:mx-0 ${
                  isFocused || isLandingHighlighted
                    ? "drop-shadow-[0_0_28px_var(--glow-ambient)]"
                    : ""
                }`}
              >
                <div
                  className={`absolute -inset-px rounded-[1.125rem] bg-gradient-to-r from-primary/25 via-primary/[0.12] to-primary/25 blur-md transition-opacity duration-500 ease-out ${
                    isFocused || isLandingHighlighted ? "opacity-90" : "opacity-35"
                  }`}
                  style={{
                    animation: "pulse-glow 4s ease-in-out infinite",
                  }}
                />

                <form onSubmit={handleSubmit}>
                  <div
                    className={`relative flex min-w-0 items-center rounded-[1.125rem] border bg-card/95 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-card/[0.72] ${
                      isFocused
                        ? "border-primary/45 shadow-[0_18px_48px_-30px_var(--glow-primary),inset_0_1px_0_0_var(--shine-inset)] ring-1 ring-primary/15"
                        : "border-primary/14 hover:border-primary/28 hover:bg-card dark:hover:bg-card/[0.78]"
                    }`}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={displayedPlaceholder}
                      className="min-h-[3.125rem] min-w-0 flex-1 touch-manipulation bg-transparent px-4 py-3.5 text-[0.9375rem] font-normal leading-snug text-foreground outline-none placeholder:text-muted-foreground/45 sm:px-5 sm:py-5 md:min-h-[3.75rem] md:px-6 md:py-6 md:text-lg"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="mr-2 flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-[0.625rem] border border-primary/28 bg-gradient-to-b from-primary to-primary/82 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_32px_-20px_var(--glow-primary)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/44 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_18px_42px_-18px_var(--glow-primary)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none disabled:active:scale-100 motion-reduce:transition-colors sm:mr-2.5 md:mr-3 md:h-[3.25rem] md:w-[3.25rem]"
                    >
                      <ArrowRight className="h-[1.125rem] w-[1.125rem] md:h-5 md:w-5" />
                    </button>
                  </div>
                </form>
              </div>

              <div
                className="mx-auto mb-5 grid w-full min-w-0 max-w-2xl grid-cols-2 gap-x-2 gap-y-2 justify-items-stretch md:mb-12 md:flex md:max-w-2xl md:flex-wrap md:justify-center md:gap-2.5 lg:mx-0 lg:justify-start"
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
                    className="flex min-h-[2.35rem] w-full touch-manipulation items-center justify-center rounded-full border border-primary/12 bg-card/72 px-2 py-2 text-center text-[0.75rem] font-medium leading-snug text-pretty text-muted-foreground/90 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/32 hover:bg-primary/[0.065] hover:text-foreground active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45 dark:bg-card/[0.32] md:min-h-11 md:w-auto md:justify-start md:px-4 md:py-2.5 md:text-left md:text-sm motion-reduce:transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="mx-auto max-w-xl text-[0.75rem] leading-relaxed text-muted-foreground/65 md:text-sm lg:mx-0">
                A premium diagnostic layer for business bottlenecks, AI
                opportunity, and the next system to build.
              </p>
            </div>

            <div className="relative mx-auto hidden w-full max-w-md min-w-0 lg:mx-0 lg:block lg:max-w-none">
              <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06] blur-3xl" />
              <div className="pointer-events-none absolute inset-0 translate-x-5 translate-y-5 rounded-[1.5rem] border border-primary/8 opacity-65 pxl-data-grid" />
              <div className="relative">
                <ExecutiveIntelligencePanel />
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
        <div className="relative z-10 mx-auto mt-8 w-full min-w-0 max-w-3xl px-2 sm:mt-10 sm:px-3 md:mt-12 md:px-0">
          <div className="relative overflow-hidden rounded-[1.125rem] border border-hairline bg-card/95 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl sm:rounded-[1.25rem] dark:bg-card/[0.55]">
            <div className="flex min-w-0 items-center justify-between gap-2 border-b border-hairline bg-chrome-bar px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] border border-primary/20 bg-primary/[0.12]">
                  <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-medium tracking-tight text-foreground">
                    PxlBrief
                  </span>
                  <span className="text-[0.6875rem] text-muted-foreground/75">
                    Intelligence layer
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-[0.5rem] text-muted-foreground transition-colors duration-200 hover:bg-foreground/[0.06] hover:text-foreground"
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

            <div className="max-h-[min(50vh,480px)] space-y-6 overflow-y-auto overscroll-contain px-4 py-5 sm:max-h-[min(52vh,520px)] sm:space-y-7 sm:px-5 sm:py-6 md:space-y-8 md:px-6 md:py-7">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex min-w-0 gap-2.5 sm:gap-3 md:gap-3.5 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-primary/15 bg-primary/[0.08]">
                      <Sparkles
                        className="h-3.5 w-3.5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[min(calc(100vw-5.5rem),28rem)] rounded-[1.05rem] px-3.5 py-3 sm:max-w-[min(85%,28rem)] sm:px-4 md:px-[1.125rem] md:py-3.5 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-md shadow-black/10"
                        : "border border-hairline bg-muted/[0.35] text-foreground shadow-sm"
                    }`}
                  >
                    <div className="break-words whitespace-pre-wrap text-[0.8125rem] leading-[1.62] md:text-[0.9375rem] md:leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-hairline bg-foreground/[0.04]">
                      <User
                        className="h-3.5 w-3.5 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex min-w-0 justify-start gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-primary/15 bg-primary/[0.08]">
                    <Sparkles
                      className="h-3.5 w-3.5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="rounded-[1.05rem] border border-hairline bg-muted/[0.35] px-4 py-3.5 shadow-sm md:px-5">
                    <div className="mb-2 flex items-center gap-2">
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
                <div className="flex min-w-0 justify-start gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-red-500/20 bg-red-500/[0.08]">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div className="max-w-[min(calc(100vw-5.5rem),28rem)] rounded-[1.05rem] border border-red-500/20 bg-red-500/[0.07] px-3.5 py-3 text-red-200/90 sm:max-w-[min(85%,28rem)] sm:px-4 md:px-[1.125rem] md:py-3.5">
                    <p className="text-[0.8125rem] leading-relaxed md:text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {attachedFile && (
                <div className="flex min-w-0 justify-end gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="flex max-w-[min(calc(100vw-5.5rem),28rem)] items-center gap-2.5 rounded-[1.05rem] border border-hairline bg-muted/[0.28] px-3.5 py-2.5 text-left shadow-sm backdrop-blur-sm sm:max-w-[min(85%,28rem)] sm:gap-3 sm:px-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-primary/15 bg-primary/[0.1]">
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
                      className="inline-flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-[0.5rem] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                      aria-label="Remove attachment"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-hairline bg-foreground/[0.04]">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {!enquirySubmitSuccess ? (
              <ExecutiveSignalsPanel
                signals={executiveSignals}
                loading={execSignalsBusy}
              />
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="border-t border-hairline bg-chrome-bar p-3.5 sm:p-4 md:p-5"
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
                messages.filter((m) => m.role === "user").length >= 2 && (
                  <ServiceRecommendationCard
                    recommendation={serviceRecommendation}
                    onDismiss={() => setRoutingCardDismissed(true)}
                  />
                )}
              <div className="mb-3 flex min-w-0 justify-start">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => chatFileInputRef.current?.click()}
                  className="inline-flex min-h-11 max-w-full touch-manipulation items-center gap-2 rounded-[0.625rem] border border-hairline bg-foreground/[0.04] px-3 py-2.5 text-left text-[0.75rem] font-medium text-muted-foreground/95 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-45 md:text-[0.8125rem]"
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary/90 md:h-4 md:w-4" />
                  <span className="text-left leading-snug">
                    {attachmentUploadLabel}
                  </span>
                </button>
              </div>
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
              <div className="flex min-w-0 items-center gap-2 rounded-[0.875rem] border border-hairline bg-card/35 px-2.5 py-1.5 shadow-inner transition-all duration-200 focus-within:border-primary/35 focus-within:ring-1 focus-within:ring-primary/15 sm:px-3 md:gap-3 md:px-4 md:py-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Add detail or your next move…"
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 touch-manipulation bg-transparent py-2 text-[0.875rem] text-foreground outline-none placeholder:text-muted-foreground/40 disabled:opacity-45 md:text-[0.9375rem]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-[0.625rem] bg-primary text-primary-foreground shadow-md shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/[0.94] hover:shadow-lg active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none motion-reduce:transition-colors"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  disabled={
                    leadSubmitBusy ||
                    isLoading ||
                    conversationState.visitorType === "unknown"
                  }
                  onClick={handleSubmitEnquiry}
                  className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-[0.875rem] border border-hairline bg-foreground/[0.04] px-4 py-3.5 text-[0.8125rem] font-medium tracking-tight text-foreground/95 transition-all duration-300 ease-out hover:border-primary/28 hover:bg-primary/[0.06] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 md:text-sm"
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
