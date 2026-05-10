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
import type { LeadIntelligenceResult } from "@/lib/lead-intelligence"
import {
  createInitialLeadData,
  deriveLeadData,
  type LeadData,
} from "@/lib/lead-data"
import {
  BUDGET_RANGE_OPTIONS,
  PREFERRED_SERVICE_OPTIONS,
  buildFallbackSalesSummary,
  deriveRecommendedService,
  estimateOpportunityLevel,
} from "@/lib/intake-recommendation"
import {
  deriveAiDiagnosis,
  deriveStrategicIntelligence,
  type AiDiagnosis,
  type StrategicIntelligence,
  type StrategicScore,
} from "@/lib/ai-diagnosis"

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
  "Why am I not getting leads?",
  "How can AI improve my business?",
  "Audit my marketing strategy",
  "How should I position my brand?",
]

/** Short labels for suggestion chips; full text is sent as the user message */
const suggestionChips: { label: string; prompt: string }[] = [
  { label: "Why no leads?", prompt: "Why am I not getting leads?" },
  { label: "AI for my business", prompt: "How can AI improve my business?" },
  { label: "Marketing audit", prompt: "Audit my marketing strategy" },
  { label: "Brand positioning", prompt: "How should I position my brand?" },
]

const VISITOR_FRIENDLY_ERROR =
  "Something went wrong. Please try again or email info@pxlbrief.com."

const strategicAnalysisStates = [
  "Analyzing acquisition bottlenecks...",
  "Mapping growth inefficiencies...",
  "Evaluating positioning gaps...",
] as const

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatRequestMessage {
  role: "user" | "assistant"
  content: string
}

type IntakeStatus = "idle" | "analysing" | "ready" | "submitting" | "success"

interface IntakeFormState {
  fullName: string
  companyName: string
  email: string
  phoneNumber: string
  websiteInstagram: string
  budgetRange: string
  preferredService: string
  additionalNotes: string
}

function createEmptyIntakeForm(): IntakeFormState {
  return {
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    websiteInstagram: "",
    budgetRange: "",
    preferredService: "Growth Strategy",
    additionalNotes: "",
  }
}

function digitalPresenceFromLead(lead: LeadData): string {
  return [lead.website.trim(), lead.instagram.trim()].filter(Boolean).join(" / ")
}

function splitDigitalPresence(value: string): Pick<LeadData, "website" | "instagram"> {
  const parts = value
    .split(/[,\n/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  const instagram =
    parts.find((part) => /(^@|instagram\.com)/i.test(part)) ??
    (/^@|instagram\.com/i.test(value.trim()) ? value.trim() : "")
  const website =
    parts.find((part) => part !== instagram && /(?:https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(part)) ??
    (!instagram ? value.trim() : "")

  return {
    website,
    instagram,
  }
}

function leadQualityFrom(
  diagnosis: AiDiagnosis,
  intelligence: StrategicIntelligence
): "Cold" | "Warm" | "Hot" {
  if (
    diagnosis.leadScore === "High" ||
    diagnosis.urgencyLevel === "High" ||
    intelligence.confidenceLevel >= 78
  ) {
    return "Hot"
  }
  if (
    diagnosis.leadScore === "Medium" ||
    diagnosis.urgencyLevel === "Medium" ||
    intelligence.confidenceLevel >= 50
  ) {
    return "Warm"
  }
  return "Cold"
}

function leadQualityClasses(quality: "Cold" | "Warm" | "Hot"): string {
  if (quality === "Hot") return "border-emerald-300/30 bg-emerald-300/[0.11] text-emerald-200 shadow-[0_0_38px_-20px_rgba(110,231,183,0.95)]"
  if (quality === "Warm") return "border-primary/30 bg-primary/[0.1] text-primary shadow-[0_0_34px_-20px_oklch(0.75_0.12_180/0.95)]"
  return "border-white/[0.09] bg-white/[0.04] text-muted-foreground"
}

function DiagnosisField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[0.85rem] border border-white/[0.07] bg-white/[0.035] p-3 transition-colors duration-300 hover:border-primary/22 hover:bg-primary/[0.045]">
      <p className="mb-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/66">
        {label}
      </p>
      <p className="text-[0.8125rem] font-medium leading-snug text-foreground/92">
        {value}
      </p>
    </div>
  )
}

function DiagnosisList({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div>
      <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/82">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[0.75rem] leading-relaxed text-muted-foreground/88"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/75 shadow-[0_0_12px_0_oklch(0.75_0.12_180/0.65)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StrategicSnapshotCard({
  diagnosis,
  intelligence,
}: {
  diagnosis: AiDiagnosis
  intelligence: StrategicIntelligence
}) {
  if (!intelligence.isReady) return null

  return (
    <div className="flex justify-start gap-3 md:gap-3.5">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-primary/18 bg-primary/[0.1]">
        <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
      </div>
      <article className="w-full max-w-[min(92%,34rem)] overflow-hidden rounded-[1.05rem] border border-primary/18 bg-gradient-to-br from-primary/[0.1] via-card/[0.48] to-black/[0.16] p-4 text-left shadow-[0_20px_56px_-34px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.055)] backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary/90">
            AI Strategic Snapshot
          </p>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.045] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground/78">
            {intelligence.confidenceLevel}% confidence
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <DiagnosisField label="Main growth issue" value={diagnosis.mainBottleneck} />
          <DiagnosisField
            label="Likely opportunity"
            value={intelligence.estimatedMissedRevenueAreas[0] ?? diagnosis.recommendedGrowthDirection}
          />
          <DiagnosisField
            label="Solution direction"
            value={diagnosis.recommendedGrowthDirection}
          />
          <DiagnosisField label="Urgency level" value={diagnosis.urgencyLevel} />
        </div>
        <div className="mt-3 rounded-[0.85rem] border border-white/[0.07] bg-black/20 p-3">
          <p className="mb-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/66">
            Suggested next step
          </p>
          <p className="text-[0.8125rem] leading-relaxed text-foreground/90">
            {diagnosis.recommendedNextActions[0]}
          </p>
        </div>
      </article>
    </div>
  )
}

function StrategicScoreCard({ score }: { score: StrategicScore }) {
  return (
    <div className="rounded-[0.9rem] border border-white/[0.075] bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          {score.label}
        </p>
        <span className="font-mono text-sm font-semibold text-primary">
          {score.value}
        </span>
      </div>
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/35 via-primary to-emerald-300/60"
          style={{
            width: `${score.value}%`,
            animation: "pxl-shimmer 5s ease-in-out infinite",
          }}
        />
      </div>
      <p className="text-[0.7rem] leading-relaxed text-muted-foreground/78">
        {score.detail}
      </p>
    </div>
  )
}

function ObservedSignalGrid({
  signals,
}: {
  signals: StrategicIntelligence["observedSignals"]
}) {
  const rows = [
    ["Founder mindset", signals.founderMindset],
    ["Business maturity", signals.businessMaturity],
    ["Marketing gaps", signals.marketingGaps],
    ["Operational gaps", signals.operationalGaps],
    ["Acquisition weakness", signals.customerAcquisitionWeaknesses],
  ] as const

  return (
    <div>
      <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/82">
        Observed Signals
      </p>
      <div className="space-y-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[0.85rem] border border-white/[0.07] bg-white/[0.035] p-3"
          >
            <p className="mb-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/66">
              {label}
            </p>
            <p className="text-[0.75rem] leading-relaxed text-foreground/86">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StrategicIntelligenceDashboard({
  intelligence,
  isAnalyzing,
}: {
  intelligence: StrategicIntelligence
  isAnalyzing: boolean
}) {
  return (
    <div className="mt-6 border-t border-white/[0.07] pt-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-primary/85">
            Strategic Intelligence Layer
          </p>
          <h4 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
            Founder advisory model
          </h4>
        </div>
        <div className="text-right">
          <p className="text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground/65">
            Confidence
          </p>
          <p className="font-mono text-sm font-semibold text-primary">
            {intelligence.confidenceLevel}%
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-[1rem] border border-primary/14 bg-primary/[0.055] p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[0.7rem] font-medium text-foreground/88">
            {intelligence.confidenceLabel}
          </span>
          <span className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.13em] text-primary/80">
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              style={{ animation: "pxl-dot-pulse 1.4s ease-in-out infinite" }}
            />
            {isAnalyzing || !intelligence.isReady
              ? "Analyzing strategically"
              : "Signal locked"}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/45 via-primary to-emerald-300/70"
            style={{
              width: `${intelligence.confidenceLevel}%`,
              animation: "pxl-shimmer 4.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {!intelligence.isReady ? (
        <div className="rounded-[1rem] border border-white/[0.075] bg-black/20 p-4">
          <p className="text-sm font-medium text-foreground/90">
            Building strategic context...
          </p>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground/78">
            The intelligence layer unlocks after a few meaningful business
            signals, so recommendations stay strategic rather than generic.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className="h-1.5 rounded-full bg-primary/35"
                style={{
                  animation: `pxl-dot-pulse 1.35s ease-in-out ${index * 120}ms infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {intelligence.scores.map((score) => (
              <StrategicScoreCard key={score.label} score={score} />
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
            <DiagnosisList
              title="Estimated Growth Blockers"
              items={intelligence.estimatedGrowthBlockers}
            />
            <DiagnosisList
              title="Estimated Missed Revenue Areas"
              items={intelligence.estimatedMissedRevenueAreas}
            />
            <DiagnosisList
              title="Estimated Operational Inefficiencies"
              items={intelligence.estimatedOperationalInefficiencies}
            />
            <DiagnosisList
              title="Suggested Strategic Priorities"
              items={intelligence.suggestedStrategicPriorities}
            />
            <ObservedSignalGrid signals={intelligence.observedSignals} />
            <DiagnosisList
              title="What PxlBrief Would Likely Do"
              items={intelligence.likelyPxlBriefActions}
            />
          </div>
        </>
      )}
    </div>
  )
}

function AiDiagnosisPanel({
  diagnosis,
  intelligence,
  isAnalyzing,
  analysisLabel,
}: {
  diagnosis: AiDiagnosis
  intelligence: StrategicIntelligence
  isAnalyzing: boolean
  analysisLabel: string
}) {
  const leadQuality = leadQualityFrom(diagnosis, intelligence)
  const opportunityScore =
    intelligence.scores.find((score) => score.label === "Opportunity Score")
      ?.value ?? intelligence.confidenceLevel
  const growthPotential =
    intelligence.scores.find((score) => score.label === "Growth Readiness Score")
      ?.value ?? intelligence.confidenceLevel

  return (
    <aside className="relative overflow-hidden rounded-[1.25rem] border border-primary/18 bg-gradient-to-b from-card/[0.66] via-card/[0.42] to-black/[0.24] p-4 text-left shadow-[0_28px_72px_-36px_rgba(0,0,0,0.9),0_0_54px_-34px_oklch(0.75_0.12_180/0.9),inset_0_1px_0_0_rgba(255,255,255,0.055)] backdrop-blur-2xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:p-4 xl:p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/[0.11] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_32%,rgba(255,255,255,0.015))]" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-primary/85">
              AI Command Center
            </p>
            <h3 className="text-base font-semibold tracking-[-0.015em] text-foreground">
              Strategic intelligence
            </h3>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${leadQualityClasses(leadQuality)}`}>
            {leadQuality}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-[0.9rem] border border-primary/14 bg-primary/[0.055] px-3 py-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            style={{ animation: "pxl-dot-pulse 1.35s ease-in-out infinite" }}
          />
          <p className="truncate text-[0.68rem] font-medium uppercase tracking-[0.12em] text-primary/85">
            {isAnalyzing ? analysisLabel : "Live intelligence stream"}
          </p>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <DiagnosisField label="Opportunity Score" value={`${opportunityScore}/100`} />
          <DiagnosisField label="Growth Potential" value={`${growthPotential}/100`} />
          <DiagnosisField label="Lead Quality" value={leadQuality} />
          <DiagnosisField label="Strategic Priority" value={intelligence.suggestedStrategicPriorities[0] ?? diagnosis.serviceFit} />
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <DiagnosisField label="Industry" value={diagnosis.industry} />
          <DiagnosisField label="Business stage" value={diagnosis.businessStage} />
          <DiagnosisField label="Revenue Leak Signals" value={`${diagnosis.potentialRevenueLeaks.length} detected`} />
          <DiagnosisField label="Recommended Systems" value={diagnosis.suggestedSystems.slice(0, 2).join(" + ")} />
        </div>

        <div className="mb-4 rounded-[1rem] border border-white/[0.075] bg-black/20 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/72">
              Lead signal
            </p>
            <span className={`font-mono text-lg font-semibold ${
              leadQuality === "Hot"
                ? "text-emerald-300"
                : leadQuality === "Warm"
                  ? "text-primary"
                  : "text-muted-foreground"
            }`}>
              {leadQuality}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-emerald-300/70"
              style={{
                width:
                  leadQuality === "Hot"
                    ? "92%"
                    : leadQuality === "Warm"
                      ? "66%"
                      : "34%",
                animation: "pxl-shimmer 4.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <DiagnosisField
            label="Main bottleneck"
            value={diagnosis.mainBottleneck}
          />
          <DiagnosisField
            label="Recommended growth direction"
            value={diagnosis.recommendedGrowthDirection}
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-primary/82">
            Suggested systems
          </p>
          <div className="flex flex-wrap gap-2">
            {diagnosis.suggestedSystems.map((system) => (
              <span
                key={system}
                className="rounded-full border border-white/[0.08] bg-white/[0.045] px-2.5 py-1 text-[0.7rem] font-medium text-foreground/88"
              >
                {system}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
          <DiagnosisList
            title="Potential Revenue Leaks"
            items={diagnosis.potentialRevenueLeaks}
          />
          <DiagnosisList
            title="Recommended Next Actions"
            items={diagnosis.recommendedNextActions}
          />
        </div>

        <StrategicIntelligenceDashboard
          intelligence={intelligence}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </aside>
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
  const [isIntakeOpen, setIsIntakeOpen] = useState(false)
  const [intakeStatus, setIntakeStatus] = useState<IntakeStatus>("idle")
  const [intakeForm, setIntakeForm] = useState<IntakeFormState>(
    createEmptyIntakeForm
  )
  const [intakeAiSummary, setIntakeAiSummary] = useState("")
  const [intakeLeadScore, setIntakeLeadScore] = useState<string>("")
  const [intakeError, setIntakeError] = useState<string | null>(null)
  const leadPrepFingerprintRef = useRef<string>("")

  const hasMessages = messages.length > 0 || error !== null

  const conversationReadyForLeadPrep = useMemo(
    () => shouldAutoPrepareLeadIntel(conversationState, messages.length),
    [conversationState, messages.length]
  )

  const recommendedService = useMemo(
    () => deriveRecommendedService(conversationState, messages, leadIntel),
    [conversationState, messages, leadIntel]
  )

  const opportunityLevel = useMemo(
    () =>
      estimateOpportunityLevel(
        intakeLeadScore || leadIntel?.leadScore,
        intakeForm.budgetRange,
        conversationState
      ),
    [conversationState, intakeForm.budgetRange, intakeLeadScore, leadIntel]
  )

  const aiDiagnosis = useMemo(
    () => deriveAiDiagnosis(conversationState, messages, leadIntel),
    [conversationState, messages, leadIntel]
  )

  const strategicIntelligence = useMemo(
    () =>
      deriveStrategicIntelligence(
        conversationState,
        messages,
        aiDiagnosis,
        leadIntel
      ),
    [aiDiagnosis, conversationState, messages, leadIntel]
  )

  const analysisStatusLabel =
    messages.length >= 3
      ? strategicAnalysisStates[messages.length % strategicAnalysisStates.length]
      : "Initializing advisory terminal..."

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
    if (!isIntakeOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && intakeStatus !== "submitting") {
        setIsIntakeOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isIntakeOpen, intakeStatus])

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
    } catch (err) {
      console.warn("Chat response failed", err)
      setError(VISITOR_FRIENDLY_ERROR)
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
    setIsIntakeOpen(false)
    setIntakeStatus("idle")
    setIntakeForm(createEmptyIntakeForm())
    setIntakeAiSummary("")
    setIntakeLeadScore("")
    setIntakeError(null)
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

  const prepareIntakeAnalysis = async (synced: LeadData) => {
    setIntakeStatus("analysing")
    setIntakeError(null)
    const service = synced.service.trim() || recommendedService
    setIntakeAiSummary(buildFallbackSalesSummary(conversationState, service))
    setIntakeLeadScore(leadIntel?.leadScore ?? "")

    try {
      const [summaryResult, intelResult] = await Promise.allSettled([
        fetch("/api/lead/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            leadData: synced,
            snapshot: conversationState,
            summaryFormat: "sales_intake",
            recommendedService: service,
          }),
        }),
        leadIntel
          ? Promise.resolve(null)
          : fetch("/api/lead/intelligence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                snapshot: conversationState,
                messages: messages.map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
              }),
            }),
      ])

      if (summaryResult.status === "fulfilled") {
        const sumRes = summaryResult.value
        const sumJson = await sumRes.json()
        if (sumRes.ok && typeof sumJson.professionalSummary === "string") {
          setIntakeAiSummary(sumJson.professionalSummary)
        }
      }

      if (
        intelResult.status === "fulfilled" &&
        intelResult.value instanceof Response
      ) {
        const intelJson = await intelResult.value.json()
        if (intelResult.value.ok && intelJson.intelligence) {
          setLeadIntel(intelJson.intelligence)
          setIntakeLeadScore(intelJson.intelligence.leadScore ?? "")
        }
      }
    } catch {
      /* Keep fallback summary; modal should still submit. */
    } finally {
      setIntakeStatus("ready")
    }
  }

  const handleSubmitEnquiry = async () => {
    if (conversationState.visitorType === "unknown") return
    const synced = deriveLeadData(leadData, messages, conversationState)
    setLeadData(synced)
    const nextService = synced.service.trim() || recommendedService
    setIntakeForm({
      fullName: synced.name || conversationState.name,
      companyName: synced.company || conversationState.company,
      email: synced.email || conversationState.email,
      phoneNumber: synced.phone || conversationState.whatsapp,
      websiteInstagram: digitalPresenceFromLead(synced),
      budgetRange: "",
      preferredService: nextService,
      additionalNotes: synced.notes,
    })
    setLeadSubmitMessage(null)
    setIsIntakeOpen(true)
    void prepareIntakeAnalysis({ ...synced, service: nextService })
  }

  const handlePremiumIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (conversationState.visitorType === "unknown") return
    setLeadSubmitBusy(true)
    setIntakeStatus("submitting")
    setIntakeError(null)
    try {
      const digitalPresence = splitDigitalPresence(intakeForm.websiteInstagram)
      const synced = deriveLeadData(leadData, messages, conversationState)
      const leadForSubmit: LeadData = {
        ...synced,
        visitorType: conversationState.visitorType,
        name: intakeForm.fullName.trim() || synced.name,
        company: intakeForm.companyName.trim() || synced.company,
        email: intakeForm.email.trim() || synced.email,
        phone: intakeForm.phoneNumber.trim() || synced.phone,
        website: digitalPresence.website || synced.website,
        instagram: digitalPresence.instagram || synced.instagram,
        service: intakeForm.preferredService.trim() || recommendedService,
        notes: intakeForm.additionalNotes.trim() || synced.notes,
      }
      const professionalSummary =
        intakeAiSummary.trim() ||
        buildFallbackSalesSummary(conversationState, leadForSubmit.service)
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
          leadData: leadForSubmit,
          professionalSummary,
          intake: {
            ...intakeForm,
            aiSummary: professionalSummary,
            recommendedService,
            opportunityLevel,
          },
          attachment,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setLeadData(leadForSubmit)
      setIntakeStatus("success")
      setLeadSubmitMessage(
        "Your enquiry has been submitted successfully. Our team will review it and connect shortly."
      )
    } catch (err) {
      console.warn("Premium intake submission failed", err)
      setIntakeError(VISITOR_FRIENDLY_ERROR)
      setLeadSubmitMessage(VISITOR_FRIENDLY_ERROR)
      setIntakeStatus("ready")
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
      className={`relative flex scroll-mt-24 flex-col items-center px-4 ${
        hasMessages
          ? "min-h-0 justify-start pb-10 pt-8 md:pb-12 md:pt-10"
          : "min-h-[88vh] justify-center pb-24 pt-16 md:min-h-[92vh] md:pb-32 md:pt-28"
      }`}
      aria-label="PxlBrief — AI consulting hero"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[24%] h-[min(96vw,780px)] w-[min(105vw,1040px)] -translate-x-1/2 rounded-full bg-primary/[0.075] blur-[138px]"
          style={{ animation: "pxl-breathe 14s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[12%] right-[8%] h-[min(72vw,560px)] w-[min(72vw,560px)] rounded-full bg-accent/[0.06] blur-[120px]"
          style={{
            animation: "pxl-breathe 18s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute -left-[12%] top-[12%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-cyan-300/[0.035] blur-[118px]"
          style={{ animation: "pxl-drift 20s ease-in-out infinite" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_45%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
        <div className={hasMessages ? "mb-3 md:mb-4" : "mb-7 md:mb-8"}>
          <span className="inline-flex items-center rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-sm font-semibold tracking-tight text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:text-base">
            Pxl<span className="text-primary">Brief</span>
          </span>
        </div>

        <h1
          className={`mx-auto text-balance font-semibold leading-[0.98] text-foreground ${
            hasMessages
              ? "mb-2 max-w-4xl text-2xl tracking-[-0.035em] md:text-4xl"
              : "mb-6 max-w-5xl text-[2.7rem] tracking-[-0.055em] md:text-6xl lg:text-[4.8rem]"
          }`}
        >
          {hasMessages
            ? "PxlBrief AI Operating System"
            : "AI Systems, Creative Intelligence & Growth Infrastructure for Modern Brands."}
        </h1>

        <p
          className={`mx-auto max-w-3xl text-pretty font-normal text-muted-foreground/90 ${
            hasMessages
              ? "mb-0 text-[0.8125rem] leading-relaxed md:text-sm"
              : "mb-8 text-[1rem] leading-[1.75] md:text-xl md:leading-relaxed"
          }`}
        >
          {hasMessages
            ? "Strategic diagnosis, lead intelligence and advisory workflow in one live command center."
            : "We design AI automation, brand systems, growth infrastructure, performance marketing loops and AI workflows for brands that need sharper decisions and cleaner execution."}
        </p>

        {!hasMessages && (
          <>
            <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-[0.95rem] bg-primary px-6 py-3 text-sm font-semibold tracking-tight text-primary-foreground shadow-[0_18px_42px_-24px_oklch(0.75_0.12_180/0.7)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_22px_56px_-24px_oklch(0.75_0.12_180/0.9)] active:scale-[0.99] sm:w-auto"
              >
                Start AI Consultation
              </button>
              <a
                href="#what-we-build"
                className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-[0.95rem] border border-white/[0.1] bg-white/[0.045] px-6 py-3 text-sm font-semibold tracking-tight text-foreground/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.07] active:scale-[0.99] sm:w-auto"
              >
                View Capabilities
              </a>
            </div>

            <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-primary/80">
              PxlBrief AI
            </p>
            <div
              className={`relative mx-auto mb-6 w-full max-w-2xl transition-[box-shadow,filter] duration-500 ease-out md:mb-7 ${
                isFocused ? "drop-shadow-[0_0_28px_oklch(0.75_0.12_180/0.12)]" : ""
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
                  className={`relative flex items-center rounded-[1.125rem] border bg-card/[0.72] shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] backdrop-blur-2xl transition-all duration-300 ease-out ${
                    isFocused
                      ? "border-primary/45 shadow-lg shadow-primary/[0.08] ring-1 ring-primary/15"
                      : "border-white/[0.08] hover:border-primary/25 hover:bg-card/[0.78]"
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
                  className="rounded-full border border-white/[0.07] bg-card/[0.35] px-3.5 py-2 text-left text-[0.8125rem] font-medium leading-snug text-muted-foreground/90 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/[0.07] hover:text-foreground active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 md:px-4 md:text-sm"
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/65 md:text-sm">
              Helping brands scale through AI, growth systems and strategic
              marketing.
            </p>
          </>
        )}
      </div>

      {hasMessages && (
        <div className="relative z-10 mt-5 grid w-full max-w-[88rem] gap-3 px-0 md:mt-7 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-4 xl:grid-cols-[minmax(0,1fr)_27rem]">
          <div className="relative min-w-0 overflow-hidden rounded-[1.25rem] border border-white/[0.09] bg-card/[0.55] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.65),inset_0_1px_0_0_oklch(1_0_0/0.05)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/[0.15] px-4 py-3 md:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] border border-primary/20 bg-primary/[0.12]">
                  <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-medium tracking-tight text-foreground">
                    PxlBrief AI
                  </span>
                  <span className="text-[0.6875rem] text-muted-foreground/75">
                    Strategic consultant
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-[0.5rem] p-2 text-muted-foreground transition-colors duration-200 hover:bg-white/[0.06] hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {isLoading && (
              <div className="relative h-px w-full overflow-hidden bg-white/[0.05]">
                <div
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  style={{
                    animation: "pxl-shimmer 1.45s ease-in-out infinite",
                  }}
                />
              </div>
            )}

            <div className="max-h-[min(60vh,640px)] space-y-5 overflow-y-auto px-4 py-5 md:space-y-6 md:px-5 md:py-5">
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
                        : "border border-white/[0.06] bg-muted/[0.35] text-foreground shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-[0.8125rem] leading-[1.62] md:text-[0.9375rem] md:leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-white/[0.06] bg-white/[0.04]">
                      <User
                        className="h-3.5 w-3.5 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>
              ))}

              <StrategicSnapshotCard
                diagnosis={aiDiagnosis}
                intelligence={strategicIntelligence}
              />

              {isLoading && (
                <div className="flex justify-start gap-3 md:gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-primary/15 bg-primary/[0.08]">
                    <Sparkles
                      className="h-3.5 w-3.5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="rounded-[1.05rem] border border-white/[0.06] bg-muted/[0.35] px-4 py-3.5 shadow-sm md:px-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                        {analysisStatusLabel}
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
                  <div className="max-w-[min(85%,28rem)] rounded-[1.05rem] border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-red-300/95 md:px-[1.125rem] md:py-3.5">
                    <div className="mb-1 text-[0.8125rem] font-medium">
                      Something went wrong
                    </div>
                    <div className="text-[0.8125rem] leading-relaxed text-red-200/80">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {attachedFile && (
                <div className="flex justify-end gap-3 md:gap-3.5">
                  <div className="flex max-w-[min(85%,28rem)] items-center gap-3 rounded-[1.05rem] border border-white/[0.08] bg-muted/[0.28] px-4 py-2.5 text-left shadow-sm backdrop-blur-sm">
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
                      className="flex-shrink-0 rounded-[0.5rem] p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                      aria-label="Remove attachment"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.5rem] border border-white/[0.06] bg-white/[0.04]">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-white/[0.06] bg-black/[0.12] p-3.5 md:p-4"
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
                    className="inline-flex items-center gap-2 rounded-[0.625rem] border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[0.75rem] font-medium text-muted-foreground/95 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-45 md:text-[0.8125rem]"
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
                        className="text-[0.6875rem] text-muted-foreground/75 md:text-xs"
                        aria-live="polite"
                      >
                        {leadPrepBusy
                          ? "Preparing structured lead preview…"
                          : leadIntel
                            ? `Lead signal: ${leadIntel.leadScore}`
                            : null}
                      </span>
                    )}
                </div>
              </div>
              {leadSubmitMessage && (
                <p
                  className={`mb-3 text-[0.8125rem] leading-relaxed md:text-sm ${
                    leadSubmitMessage.startsWith("Your enquiry")
                      ? "text-muted-foreground/85"
                      : "text-red-400/95"
                  }`}
                >
                  {leadSubmitMessage}
                </p>
              )}
              <div className="flex items-center gap-2 rounded-[0.875rem] border border-white/[0.1] bg-black/25 px-3 py-1.5 shadow-inner transition-all duration-200 focus-within:border-primary/35 focus-within:ring-1 focus-within:ring-primary/15 md:gap-3 md:px-4 md:py-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Continue the conversation..."
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
                  className="flex w-full items-center justify-center gap-2 rounded-[0.95rem] border border-primary/18 bg-gradient-to-r from-primary/[0.13] via-white/[0.045] to-primary/[0.08] px-4 py-3 text-[0.8125rem] font-semibold tracking-tight text-foreground/95 shadow-[0_18px_42px_-30px_oklch(0.75_0.12_180/0.8)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.12] hover:shadow-[0_24px_56px_-30px_oklch(0.75_0.12_180/0.95)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 md:text-sm"
                >
                  <Send className="h-4 w-4 shrink-0 text-primary/90" />
                  {leadSubmitBusy ? "Submitting audit request…" : "Request Strategic Audit"}
                </button>
              </div>
            </form>
          </div>
          <AiDiagnosisPanel
            diagnosis={aiDiagnosis}
            intelligence={strategicIntelligence}
            isAnalyzing={isLoading || leadPrepBusy}
            analysisLabel={analysisStatusLabel}
          />
        </div>
      )}

      {isIntakeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 py-4 backdrop-blur-xl sm:items-center sm:px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-intake-title"
        >
          <div
            className="absolute inset-0"
            onClick={() => {
              if (intakeStatus !== "submitting") setIsIntakeOpen(false)
            }}
          />
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/[0.1] bg-card/[0.78] text-left shadow-[0_32px_120px_-42px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.16] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-accent/[0.1] blur-3xl" />

            <div className="relative flex items-start justify-between gap-5 border-b border-white/[0.07] px-5 py-5 sm:px-7">
              <div>
                <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary/85">
                  Premium AI Sales Intake
                </p>
                <h2
                  id="premium-intake-title"
                  className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl"
                >
                  Confirm the brief before we route it.
                </h2>
                <p className="mt-2 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground/82 sm:text-sm">
                  PxlBrief AI has analysed the conversation and prepared a concise
                  sales context for the team.
                </p>
              </div>
              <button
                type="button"
                disabled={intakeStatus === "submitting"}
                onClick={() => setIsIntakeOpen(false)}
                className="rounded-[0.65rem] p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                aria-label="Close intake modal"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <form
              onSubmit={handlePremiumIntakeSubmit}
              className="relative grid max-h-[calc(92vh-7.5rem)] gap-0 overflow-y-auto lg:grid-cols-[1fr_0.86fr]"
            >
              <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Full Name
                    </span>
                    <input
                      required
                      value={intakeForm.fullName}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Company Name
                    </span>
                    <input
                      value={intakeForm.companyName}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                      placeholder="Brand / company"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      value={intakeForm.email}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                      placeholder="name@company.com"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Phone Number
                    </span>
                    <input
                      required
                      value={intakeForm.phoneNumber}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                      placeholder="+91..."
                    />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                    Website / Instagram
                  </span>
                  <input
                    value={intakeForm.websiteInstagram}
                    onChange={(e) =>
                      setIntakeForm((prev) => ({
                        ...prev,
                        websiteInstagram: e.target.value,
                      }))
                    }
                    className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                    placeholder="Website, Instagram, or both"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Budget Range
                    </span>
                    <select
                      value={intakeForm.budgetRange}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          budgetRange: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="">Select range</option>
                      {BUDGET_RANGE_OPTIONS.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                      Preferred Service
                    </span>
                    <select
                      value={intakeForm.preferredService}
                      onChange={(e) =>
                        setIntakeForm((prev) => ({
                          ...prev,
                          preferredService: e.target.value,
                        }))
                      }
                      className="w-full rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                    >
                      {PREFERRED_SERVICE_OPTIONS.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/72">
                    Additional Notes
                  </span>
                  <textarea
                    rows={4}
                    value={intakeForm.additionalNotes}
                    onChange={(e) =>
                      setIntakeForm((prev) => ({
                        ...prev,
                        additionalNotes: e.target.value,
                      }))
                    }
                    className="w-full resize-none rounded-[0.8rem] border border-white/[0.09] bg-black/25 px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary/45 focus:ring-1 focus:ring-primary/20"
                    placeholder="Anything the team should know before replying?"
                  />
                </label>
              </div>

              <aside className="border-t border-white/[0.07] bg-black/[0.16] px-5 py-5 sm:px-7 sm:py-6 lg:border-l lg:border-t-0">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      intakeStatus === "success"
                        ? "bg-emerald-400"
                        : intakeStatus === "analysing" ||
                            intakeStatus === "submitting"
                          ? "bg-primary"
                          : "bg-muted-foreground/50"
                    }`}
                  />
                  <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/78">
                    {intakeStatus === "analysing"
                      ? "Analysing enquiry..."
                      : intakeStatus === "submitting"
                        ? "Submitting enquiry..."
                        : intakeStatus === "success"
                          ? "Enquiry submitted"
                          : "AI intake ready"}
                  </span>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1rem] border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/68">
                      Lead Score
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {intakeLeadScore || leadIntel?.leadScore || "Analysing"}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-primary/18 bg-primary/[0.075] p-4">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-primary/82">
                      Recommended Service
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {recommendedService}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/68">
                      Estimated Opportunity Level
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {opportunityLevel}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-white/[0.08] bg-black/20 p-4">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/68">
                      AI Summary
                    </p>
                    <p className="mt-2 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground/92">
                      {intakeStatus === "analysing"
                        ? "Analysing enquiry..."
                        : intakeAiSummary || "Preparing concise summary..."}
                    </p>
                  </div>
                </div>

                {intakeError && (
                  <p className="mt-4 rounded-[0.9rem] border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-[0.8125rem] leading-relaxed text-red-300">
                    {intakeError}
                  </p>
                )}

                {intakeStatus === "success" ? (
                  <div className="mt-5 rounded-[1rem] border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-300/[0.12] animate-in zoom-in-50 duration-300">
                      <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                    </div>
                    <p className="text-sm font-medium text-emerald-100">
                      Enquiry submitted successfully.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">
                      The PxlBrief team has the AI summary and intake context.
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      intakeStatus === "analysing" ||
                      intakeStatus === "submitting"
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-[0.95rem] bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/[0.08] transition hover:bg-primary/92 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55"
                  >
                    <Send className="h-4 w-4" />
                    {intakeStatus === "submitting"
                      ? "Submitting enquiry..."
                      : intakeStatus === "analysing"
                        ? "Analysing enquiry..."
                        : "Submit premium enquiry"}
                  </button>
                )}
              </aside>
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
