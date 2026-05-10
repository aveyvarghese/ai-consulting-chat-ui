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
} from "lucide-react"
import {
  createInitialConversationState,
  deriveConversationState,
  measureVendorSellerStrength,
  sanitizeConversationStateForChat,
  type ConversationStatePayload,
} from "@/lib/conversation-state"
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import {
  createInitialLeadData,
  deriveLeadData,
  type LeadData,
} from "@/lib/lead-data"
import {
  LEAD_SUBMIT_SUCCESS_MESSAGE,
  STRATEGY_CALL_BOOKING_URL,
} from "@/lib/booking"
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

function shouldAutoPrepareLeadIntel(
  state: ConversationStatePayload,
  messageCount: number
): boolean {
  if (state.visitorType === "unknown") return false
  if (messageCount < 4) return false
  if (
    state.visitorType === "potential_client" &&
    state.potentialClientStage >= 3
  )
    return true
  if (state.visitorType === "job_seeker" && state.name && state.role)
    return true
  if (
    state.visitorType === "vendor" &&
    (state.company.trim().length > 0 || state.role.trim().length > 0)
  )
    return true
  return messageCount >= 10
}

const placeholderPrompts = [
  "Where is operational drag hiding?",
  "Map our automation architecture.",
  "Pressure-test our growth plan.",
  "What should leadership see weekly?",
]

/** Short labels for suggestion chips; full text is sent as the user message */
const suggestionChips: { label: string; prompt: string }[] = [
  { label: "Find operational drag", prompt: "Where is operational drag hiding?" },
  { label: "Automation map", prompt: "Map our automation architecture." },
  { label: "Growth pressure-test", prompt: "Pressure-test our growth plan." },
  { label: "Leadership view", prompt: "What should leadership see weekly?" },
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
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const chatFileInputRef = useRef<HTMLInputElement>(null)

  const [conversationState, setConversationState] =
    useState<ConversationStatePayload>(createInitialConversationState)
  const [leadData, setLeadData] = useState<LeadData>(createInitialLeadData)
  const [leadIntel, setLeadIntel] = useState<LeadIntelligenceResult | null>(
    null
  )
  const [leadPrepBusy, setLeadPrepBusy] = useState(false)
  const [leadSubmitBusy, setLeadSubmitBusy] = useState(false)
  const [leadSubmitMessage, setLeadSubmitMessage] = useState<string | null>(
    null
  )
  const leadPrepFingerprintRef = useRef<string>("")

  const hasMessages = messages.length > 0 || error !== null

  const conversationReadyForLeadPrep = useMemo(
    () => shouldAutoPrepareLeadIntel(conversationState, messages.length),
    [conversationState, messages.length]
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
    console.log("Lead Data:", leadData)
  }, [leadData])

  useEffect(() => {
    if (!hasMessages || !conversationReadyForLeadPrep) return

    const fingerprint = [
      messages.length,
      conversationState.potentialClientStage,
      conversationState.visitorType,
      conversationState.businessVertical.slice(0, 40),
      conversationState.currentChallenge.slice(0, 40),
      conversationState.uploadedFileName,
      messages[messages.length - 1]?.id ?? "",
    ].join("|")

    if (fingerprint === leadPrepFingerprintRef.current) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      leadPrepFingerprintRef.current = fingerprint
      setLeadPrepBusy(true)
      try {
        const res = await fetch("/api/lead/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            snapshot: conversationState,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        })
        const data = await res.json()
        if (!res.ok || data.error) return
        if (data.skipped) return
        if (data.intelligence) setLeadIntel(data.intelligence)
      } catch {
        /* aborted or network */
      } finally {
        setLeadPrepBusy(false)
      }
    }, 750)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [
    hasMessages,
    conversationReadyForLeadPrep,
    conversationState,
    messages,
  ])

  const submitMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

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
    setMessages([])
    setError(null)
    setConversationState(createInitialConversationState())
    setLeadData(createInitialLeadData())
    setAttachedFile(null)
    setLeadIntel(null)
    setLeadSubmitMessage(null)
    setLeadPrepBusy(false)
    leadPrepFingerprintRef.current = ""
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
    try {
      const synced = deriveLeadData(leadData, messages, conversationState)
      setLeadData(synced)

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
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setLeadSubmitMessage(LEAD_SUBMIT_SUCCESS_MESSAGE)
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Failed to submit enquiry"
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
      className="relative flex min-h-[78vh] scroll-mt-24 flex-col items-center justify-center px-4 pb-24 pt-16 md:min-h-[80vh] md:pb-28 md:pt-24"
      aria-label="PxlBrief — strategic intelligence and consulting"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[28%] h-[min(90vw,720px)] w-[min(95vw,920px)] -translate-x-1/2 rounded-full bg-primary/[0.055] blur-[128px]"
          style={{ animation: "pxl-breathe 14s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[18%] right-[12%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-accent/[0.04] blur-[110px]"
          style={{
            animation: "pxl-breathe 18s ease-in-out infinite 2s",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div className="mb-7 md:mb-8">
          <span className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Pxl<span className="text-primary">Brief</span>
          </span>
        </div>

        <h1 className="mx-auto mb-5 max-w-4xl text-balance text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground md:mb-6 md:text-5xl md:tracking-[-0.035em] lg:text-[3.25rem]">
          Systems for serious leverage, not experiments.
        </h1>

        <p className="mx-auto mb-12 max-w-xl text-pretty text-[0.9375rem] font-normal leading-[1.65] text-muted-foreground/90 md:mb-14 md:max-w-2xl md:text-lg md:leading-relaxed">
          We architect AI systems, automation, and growth infrastructure your
          operators can run. Founders get signal, not noise.
        </p>

        {!hasMessages && (
          <>
            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/80">
              Strategic session
            </p>
            <div
              className={`relative mx-auto mb-6 w-full max-w-2xl transition-[box-shadow,filter] duration-500 ease-out md:mb-7 ${
                isFocused ? "drop-shadow-[0_0_28px_var(--glow-ambient)]" : ""
              }`}
            >
              <div
                className={`absolute -inset-px rounded-[1.125rem] bg-gradient-to-r from-primary/25 via-primary/[0.12] to-primary/25 blur-md transition-opacity duration-500 ease-out ${
                  isFocused ? "opacity-90" : "opacity-35"
                }`}
                style={{
                  animation: "pulse-glow 4s ease-in-out infinite",
                }}
              />

              <form onSubmit={handleSubmit}>
                <div
                  className={`relative flex items-center rounded-[1.125rem] border bg-card/95 shadow-[inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl transition-all duration-300 ease-out dark:bg-card/[0.72] ${
                    isFocused
                      ? "border-primary/45 shadow-lg shadow-primary/[0.08] ring-1 ring-primary/15"
                      : "border-hairline hover:border-primary/25 hover:bg-card dark:hover:bg-card/[0.78]"
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
                    className="min-h-[3.25rem] flex-1 bg-transparent px-5 py-5 text-[0.9375rem] font-normal leading-snug text-foreground outline-none placeholder:text-muted-foreground/45 md:min-h-[3.75rem] md:px-6 md:py-6 md:text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.625rem] bg-primary text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:bg-primary/92 hover:shadow-md hover:shadow-primary/15 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none disabled:active:scale-100 md:mr-3 md:h-[3.25rem] md:w-[3.25rem]"
                  >
                    <ArrowRight className="h-[1.125rem] w-[1.125rem] md:h-5 md:w-5" />
                  </button>
                </div>
              </form>
            </div>

            <div
              className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2 md:gap-2.5"
              role="group"
              aria-label="Suggested prompts"
            >
              {suggestionChips.map(({ label, prompt }) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void submitMessage(prompt)}
                  className="rounded-full border border-hairline bg-card/96 px-3.5 py-2 text-left text-[0.8125rem] font-medium leading-snug text-muted-foreground/90 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/[0.07] hover:text-foreground active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 dark:bg-card/[0.35] md:px-4 md:text-sm"
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/65 md:text-sm">
              Same rigor we bring to boards and operating reviews—now at first
              contact.
            </p>
          </>
        )}
      </div>

      {hasMessages && (
        <div className="relative z-10 mt-10 w-full max-w-3xl px-0 md:mt-12">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-hairline bg-card/95 shadow-[var(--shadow-chat-depth),inset_0_1px_0_0_var(--shine-inset)] backdrop-blur-2xl dark:bg-card/[0.55]">
            <div className="flex items-center justify-between border-b border-hairline bg-chrome-bar px-5 py-3.5 md:px-6 md:py-4">
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
                className="rounded-[0.5rem] p-2 text-muted-foreground transition-colors duration-200 hover:bg-foreground/[0.06] hover:text-foreground"
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

            <div className="max-h-[min(52vh,520px)] space-y-7 overflow-y-auto px-5 py-6 md:space-y-8 md:px-6 md:py-7">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 md:gap-3.5 ${
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
                    className={`max-w-[min(85%,28rem)] rounded-[1.05rem] px-4 py-3 md:px-[1.125rem] md:py-3.5 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-md shadow-black/10"
                        : "border border-hairline bg-muted/[0.35] text-foreground shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-[0.8125rem] leading-[1.62] md:text-[0.9375rem] md:leading-relaxed">
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
                <div className="flex justify-start gap-3 md:gap-3.5">
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
                <div className="flex justify-start gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-red-500/20 bg-red-500/[0.08]">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div className="max-w-[min(85%,28rem)] rounded-[1.05rem] border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-red-200/90 md:px-[1.125rem] md:py-3.5">
                    <p className="text-[0.8125rem] leading-relaxed md:text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {attachedFile && (
                <div className="flex justify-end gap-3 md:gap-3.5">
                  <div className="flex max-w-[min(85%,28rem)] items-center gap-3 rounded-[1.05rem] border border-hairline bg-muted/[0.28] px-4 py-2.5 text-left shadow-sm backdrop-blur-sm">
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
                      className="flex-shrink-0 rounded-[0.5rem] p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
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

            <form
              onSubmit={handleSubmit}
              className="border-t border-hairline bg-chrome-bar p-4 md:p-5"
            >
              <input
                ref={chatFileInputRef}
                type="file"
                className="hidden"
                accept={FILE_INPUT_ACCEPT}
                onChange={handleChatFileChange}
                aria-label="Attach PDF or document"
              />
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex justify-start">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => chatFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-[0.625rem] border border-hairline bg-foreground/[0.04] px-3 py-2 text-[0.75rem] font-medium text-muted-foreground/95 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-45 md:text-[0.8125rem]"
                  >
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary/90 md:h-4 md:w-4" />
                    <span className="text-left leading-snug">
                      {attachmentUploadLabel}
                    </span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">
                  {(leadPrepBusy || leadIntel) &&
                    conversationState.visitorType !== "unknown" && (
                      <span
                        className="text-[0.6875rem] font-medium text-primary/85 md:text-xs"
                        aria-live="polite"
                      >
                        Context mapping active
                      </span>
                    )}
                </div>
              </div>
              {leadSubmitMessage &&
                (leadSubmitMessage === LEAD_SUBMIT_SUCCESS_MESSAGE ? (
                  <div className="mb-4 rounded-[0.875rem] border border-hairline bg-card/96 p-4 shadow-sm backdrop-blur-sm dark:bg-card/[0.35] md:p-5">
                    <p className="text-[0.8125rem] font-medium leading-relaxed text-foreground/95 md:text-sm">
                      {LEAD_SUBMIT_SUCCESS_MESSAGE}
                    </p>
                    <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground/80 md:text-[0.8125rem]">
                      Prefer a calendar hold?
                    </p>
                    <a
                      href={STRATEGY_CALL_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-[0.875rem] border border-primary/35 bg-primary/[0.06] px-5 py-2.5 text-sm font-semibold tracking-tight text-primary transition-all duration-300 hover:border-primary/50 hover:bg-primary/12 hover:shadow-md hover:shadow-primary/10"
                    >
                      Schedule working session
                    </a>
                  </div>
                ) : (
                  <p className="mb-3 text-[0.8125rem] leading-relaxed text-red-400/95 md:text-sm">
                    {leadSubmitMessage}
                  </p>
                ))}
              <div className="flex items-center gap-2 rounded-[0.875rem] border border-hairline bg-card/35 px-3 py-1.5 shadow-inner transition-all duration-200 focus-within:border-primary/35 focus-within:ring-1 focus-within:ring-primary/15 md:gap-3 md:px-4 md:py-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Add detail or your next move…"
                  disabled={isLoading}
                  className="min-h-[2.75rem] flex-1 bg-transparent py-2 text-[0.8125rem] text-foreground outline-none placeholder:text-muted-foreground/40 disabled:opacity-45 md:text-[0.9375rem]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.625rem] bg-primary text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:bg-primary/92 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none md:h-10 md:w-10"
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
                  className="flex w-full items-center justify-center gap-2 rounded-[0.875rem] border border-hairline bg-foreground/[0.04] px-4 py-3 text-[0.8125rem] font-medium tracking-tight text-foreground/95 transition-all duration-300 ease-out hover:border-primary/28 hover:bg-primary/[0.06] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 md:text-sm"
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
