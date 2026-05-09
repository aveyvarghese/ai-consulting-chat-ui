/** Shared typing for frontend chat memory + payloads to /api/chat */

export type VisitorType =
  | "potential_client"
  | "job_seeker"
  | "vendor"
  | "unknown"

/** Sequential discovery for potential_client (1–5). Forward-only in derive. */
export type PotentialClientStructuredStage = 1 | 2 | 3 | 4 | 5

export type ConversationStage =
  | "classifying"
  | "client_discovery"
  | "client_deepening"
  | "client_scheduling_focus"
  | "job_collect_name"
  | "job_collect_role"
  | "job_request_cv"
  | "job_closing"
  | "vendor_collect_company"
  | "vendor_collect_offering"
  | "vendor_request_material"
  | "vendor_closing"

const CONVERSATION_STAGES = new Set<ConversationStage>([
  "classifying",
  "client_discovery",
  "client_deepening",
  "client_scheduling_focus",
  "job_collect_name",
  "job_collect_role",
  "job_request_cv",
  "job_closing",
  "vendor_collect_company",
  "vendor_collect_offering",
  "vendor_request_material",
  "vendor_closing",
])

/** Sanitize payloads from `/api/chat` clients */
export function normalizeConversationPayload(
  raw: unknown
): ConversationStatePayload {
  const base = createInitialConversationState()
  if (!raw || typeof raw !== "object") return base
  const o = raw as Record<string, unknown>

  const vt = o.visitorType
  const visitorType: VisitorType =
    vt === "potential_client" ||
    vt === "job_seeker" ||
    vt === "vendor" ||
    vt === "unknown"
      ? vt
      : "unknown"

  const stageRaw = o.conversationStage
  const conversationStage: ConversationStage =
    typeof stageRaw === "string" && CONVERSATION_STAGES.has(stageRaw as ConversationStage)
      ? (stageRaw as ConversationStage)
      : "classifying"

  const strField = (key: string, maxLen: number) => {
    const v = o[key]
    if (typeof v !== "string") return ""
    return v.trim().slice(0, maxLen)
  }

  const rawPc = o.potentialClientStage
  let potentialClientStage: PotentialClientStructuredStage = 1
  if (
    typeof rawPc === "number" &&
    Number.isInteger(rawPc) &&
    rawPc >= 1 &&
    rawPc <= 5
  ) {
    potentialClientStage = rawPc as PotentialClientStructuredStage
  }

  const credRaw = o.clientCredibilityDelivered
  const clientCredibilityDelivered =
    credRaw === true || credRaw === "true"

  return {
    visitorType,
    name: strField("name", 500),
    company: strField("company", 500),
    role: strField("role", 500),
    email: strField("email", 320),
    whatsapp: strField("whatsapp", 120),
    uploadedFileName: strField("uploadedFileName", 500),
    conversationStage,
    potentialClientStage,
    clientCredibilityDelivered,
    businessVertical: strField("businessVertical", 500),
    businessStage: strField("businessStage", 240),
    servicesInterested: strField("servicesInterested", 500),
    currentChallenge: strField("currentChallenge", 800),
    acquisitionChannels: strField("acquisitionChannels", 500),
    conversationSummary: strField("conversationSummary", 12000),
  }
}

export interface ConversationStatePayload {
  visitorType: VisitorType
  /** Person's display name where relevant */
  name: string
  company: string
  /** Desired role for job_seeker; vendor may use service/offering synopsis */
  role: string
  email: string
  whatsapp: string
  uploadedFileName: string
  conversationStage: ConversationStage
  /** potential_client progression; ignored for other visitor types */
  potentialClientStage: PotentialClientStructuredStage
  /** Set true after assistant has included the one-time credibility statement */
  clientCredibilityDelivered: boolean
  /** Structured lead inference (potential_client-heavy; best-effort for others) */
  businessVertical: string
  businessStage: string
  servicesInterested: string
  currentChallenge: string
  acquisitionChannels: string
  /** Full transcript digest for CRM / intelligence — omit from `/api/chat` via sanitize */
  conversationSummary: string
}

export function createInitialConversationState(): ConversationStatePayload {
  return {
    visitorType: "unknown",
    name: "",
    company: "",
    role: "",
    email: "",
    whatsapp: "",
    uploadedFileName: "",
    conversationStage: "classifying",
    potentialClientStage: 1,
    clientCredibilityDelivered: false,
    businessVertical: "",
    businessStage: "",
    servicesInterested: "",
    currentChallenge: "",
    acquisitionChannels: "",
    conversationSummary: "",
  }
}

/** Drops transcript digest before sending conversation memory to `/api/chat` */
export function sanitizeConversationStateForChat(
  state: ConversationStatePayload
): Omit<ConversationStatePayload, "conversationSummary"> {
  const { conversationSummary: _omit, ...rest } = state
  return rest
}

function inferBusinessVertical(t: string): string {
  const lower = t.toLowerCase()
  if (/women'?s\s+wear|menswear|kids\s+wear|fashion|apparel|boutique|garment/i.test(lower))
    return "Fashion / apparel"
  if (/saas|software|devtools|platform|\bapi\b|cloud\b/i.test(lower))
    return "SaaS / technology"
  if (/restaurant|cafe|(?:f|&|and)\s*b\b|food\s+beverage|kitchen/i.test(lower))
    return "Food & beverage"
  if (/hotel|hospitality|travel|tourism/i.test(lower))
    return "Hospitality & travel"
  if (/beauty|skincare|cosmetic/i.test(lower)) return "Beauty & personal care"
  if (/education|edtech|course|cohort/i.test(lower)) return "Education"
  if (/health|wellness|fitness|clinic/i.test(lower)) return "Health & wellness"
  if (/real\s+estate|property|broker/i.test(lower)) return "Real estate"
  if (/consumer|d2c|dtc|e-?commerce|ecomm/i.test(lower)) return "D2C / ecommerce"
  return ""
}

function inferBusinessStageLine(
  t: string,
  pcStage: PotentialClientStructuredStage
): string {
  const lower = t.toLowerCase()
  if (/\b(scal(?:e|ing)|growth\s+stage|post[-\s]revenue|series\s+[a-z])\b/i.test(lower))
    return "Scaling / growth phase"
  if (/\b(already\s+sell|selling|revenue|orders|traction|live)\b/i.test(lower))
    return "Operating with revenue / traction"
  if (/\b(launch(?:ing|ed)?|pre[-\s]launch|mvp|coming\s+soon|about\s+to\s+launch)\b/i.test(lower))
    return "Pre-launch / early launch"
  if (pcStage >= 3) return "Further qualification in chat"
  return ""
}

function inferServicesInterestedLine(t: string): string {
  const lower = t.toLowerCase()
  const bits: string[] = []
  if (/\bseo\b|\baeo\b|search\s+optim/i.test(lower)) bits.push("SEO")
  if (/\b(marketing|growth|performance|ads?|cro\b|funnel)\b/i.test(lower))
    bits.push("Marketing & performance")
  if (/\bbrand|positioning|identity|visual/i.test(lower)) bits.push("Branding")
  if (/\bai\b|automat|workflow|ops/i.test(lower)) bits.push("AI & automation")
  if (/strateg|consult|advisory/i.test(lower)) bits.push("Strategy / consulting")
  if (/website|landing|cms/i.test(lower)) bits.push("Web & SEO")
  if (/social|content|community/i.test(lower)) bits.push("Social & content")
  return bits.length ? [...new Set(bits)].join("; ") : ""
}

function inferCurrentChallengeLine(t: string): string {
  const lower = t.toLowerCase()
  const bits: string[] = []
  if (/lead|pipeline|inbound|demand\s+gen/i.test(lower)) bits.push("Lead generation")
  if (/conversion|checkout|cart|cro\b/i.test(lower)) bits.push("Conversion / CRO")
  if (/position|differentiat|aware/i.test(lower)) bits.push("Positioning / brand clarity")
  if (/cac|cpa|blended|unit\s+econ/i.test(lower)) bits.push("Unit economics / paid efficiency")
  if (/retention|ltv|churn|repeat/i.test(lower)) bits.push("Retention / LTV")
  if (/website|site\s+speed|ux/i.test(lower)) bits.push("Website / UX")
  return bits.length ? [...new Set(bits)].join("; ") : ""
}

function inferAcquisitionChannelsLine(t: string): string {
  const lower = t.toLowerCase()
  const bits: string[] = []
  if (/\binstagram|\big\b/i.test(lower)) bits.push("Instagram")
  if (/\bmeta|facebook|\bfb\s+ads/i.test(lower)) bits.push("Meta ads")
  if (/google\s+ads|search\s+ads/i.test(lower)) bits.push("Google Ads")
  if (/tiktok/i.test(lower)) bits.push("TikTok")
  if (/marketplace|amazon|flipkart|myntra|nykaa/i.test(lower)) bits.push("Marketplaces")
  if (/\boffline\b|retail|store/i.test(lower)) bits.push("Offline / retail")
  if (/\bseo\b|organic/i.test(lower)) bits.push("SEO / organic")
  if (/influencer/i.test(lower)) bits.push("Influencer")
  return bits.length ? [...new Set(bits)].join("; ") : ""
}

function formatConversationSummary(
  messages: { role: string; content: string }[]
): string {
  return messages
    .map((m) => `${m.role === "user" ? "Visitor" : "PxlBrief AI"}: ${m.content}`)
    .join("\n\n")
    .slice(0, 12000)
}

export function stringifyVisitorTypeLabels(t: VisitorType): string {
  switch (t) {
    case "potential_client":
      return "potential client"
    case "job_seeker":
      return "job seeker"
    case "vendor":
      return "vendor / partner"
    default:
      return "unknown — still classify with one natural question before locking"
  }
}

const JOB_RE =
  /\b(job|jobs|full[-\s]?time|internship|intern|cv|resume|apply|application|hiring|open role|position|employment|career|candidate|vacancy)\b/i

/** Vendor = selling / pitching services TO PxlBrief — not “I need a digital agency”. */
const VENDOR_SELLER_RES: RegExp[] = [
  /\bwe\s+offer\b/,
  /\bwe\s+provide\b/,
  /\bour\s+services\s+(?:to|for)\s+you\b/,
  /\boutsource\s+(?:to|for)\s+you\b/,
  /\brate\s+card\b/,
  /\bpitch(?:ing)?\s+(?:you|our)\b/,
  /\bvendor\s+registration\b/,
  /\bbecome\s+your\s+(?:vendor|supplier|partner)\b/,
  /\bchannel\s+partner\b.*\b(?:proposal|deck|services)\b/,
  /\bwhite[-\s]?label\s+(?:services|solutions|partner(?:ship)?)\b/,
  /\bsell\s+(?:you|your)\b.*\b(?:services|solution|package)\b/,
  /\b(?:partner|collaborate)\s+with\s+you\b.*\b(?:our\s+)?(?:services|offering|proposal)\b/,
]

const CLIENT_RE =
  /\b(consult|consulting|need\s+help|looking\s+for\s+help|pricing|budget|marketing|campaign|conversion|cpa|cac|ltv|funnel|leads\s|pipeline|saas|growth|scale|scaling|automate\b|strategy|discovery\s+call|growth\s+partner|performance\s+marketing|social\s+media|branding|seo\b|website|digital\s+agency|e-?commerce|d2c|dtc)\b/i

const OWN_VENTURE_RES: RegExp[] = [
  /\b(?:my|our)\s+(?:business|startup|brand|company|product|store|shop|boutique|label|venture|project|e-?commerce|ecomm)\b/i,
  /\b(?:i|we)\s+(?:run|own|have|started|built|operate|manage)(?:\s+a|\s+the)?\s+/i,
  /\b(?:founder|co-?founder)\b/i,
]

const BUYER_SEEKING_HELP_RES: RegExp[] = [
  /\b(?:need|want|looking\s+for|hire|get)\s+(?:a\s+)?digital\s+agency\b/i,
  /\blooking\s+for\s+(?:a\s+)?(?:digital\s+)?(?:marketing\s+)?agency\b/i,
  /\b(?:need|want|seeking|searching\s+for|trying\s+to\s+find|hire|get)\s+(?:a\s+)?(?:digital\s+)?(?:marketing\s+)?agency\b/i,
  /\bneed\s+help\s+with\s+(?:branding|marketing|seo|growth|website|performance|social|ads)\b/i,
  /\b(?:digital\s+)?agency\b.*\b(need|want|looking|hire|find)\b/i,
  /\b(?:marketing|branding|growth|seo|social|performance)\s+help\b/i,
  /\b(?:website|landing|online)\s+(?:build|redesign|launch)\b/i,
  /\bai[-\s]?(?:powered\s+)?(?:growth|marketing|systems?|consulting)?\b.*\b(?:business|startup|brand)\b/i,
]

function scoreAgainst(text: string, re: RegExp): number {
  const m = text.match(new RegExp(re.source, "gi"))
  return m?.length ?? 0
}

function scorePatternList(textLower: string, list: RegExp[]): number {
  return list.reduce((n, r) => n + (r.test(textLower) ? 1 : 0), 0)
}

function scoreBuyerClientIntent(fullTextLower: string): number {
  let score = scoreAgainst(fullTextLower, CLIENT_RE)
  score += 2 * scorePatternList(fullTextLower, OWN_VENTURE_RES)
  score += 2 * scorePatternList(fullTextLower, BUYER_SEEKING_HELP_RES)
  if (
    /\blooking\s+for\b/i.test(fullTextLower) &&
    /\bdigital\s+agency\b/i.test(fullTextLower)
  ) {
    score += 4
  }
  if (
    /\b(?:women|mens?|kids|baby|luxury\s+fashion)\b/i.test(fullTextLower) &&
    /\b(startup|brand|boutique|label|business)\b/i.test(fullTextLower)
  ) {
    score += 2
  }
  return score
}

function lineLooksLikeVendorSeller(line: string): boolean {
  const t = line.toLowerCase()
  return VENDOR_SELLER_RES.some((r) => r.test(t))
}

export function measureVendorSellerStrength(text: string): number {
  return scoreVendorSellerIntent(text.toLowerCase())
}

function scoreVendorSellerIntent(fullTextLower: string): number {
  let score = scorePatternList(fullTextLower, VENDOR_SELLER_RES)
  /** Penalise buyer language — avoids “agency” phrases classifying sellers */
  const buyerBleed =
    /\b(?:looking\s+for|need|want|trying\s+to\s+(?:hire|find)|searching\s+for)\b(?:.{0,64}?)\b(?:agency|agency\s+partner|firm|help\s+with|marketing\s+support|growth\s+partner)\b/i.test(
      fullTextLower
    )
  if (buyerBleed) score -= 6
  if (/\blooking\s+for\s+(?:a\s+)?(?:digital\s+)?agency\b/i.test(fullTextLower)) {
    score -= 8
  }
  return score < 0 ? 0 : score
}

function inferVisitorFromTranscript(fullTextLower: string): VisitorType {
  const job = scoreAgainst(fullTextLower, JOB_RE)
  const sellerVendor = scoreVendorSellerIntent(fullTextLower)
  const buyerClient = scoreBuyerClientIntent(fullTextLower)

  /** Job seeker with clear dominance */
  if (job >= 2 && job > sellerVendor && job > buyerClient) return "job_seeker"
  if (job >= 1 && job > sellerVendor + 1 && job > buyerClient) return "job_seeker"

  /** Own business + growth/marketing need → client, not vendor */
  if (buyerClient >= 3 && buyerClient > sellerVendor) return "potential_client"
  if (
    scorePatternList(fullTextLower, OWN_VENTURE_RES) >= 1 &&
    (scorePatternList(fullTextLower, BUYER_SEEKING_HELP_RES) >= 1 ||
      scoreAgainst(fullTextLower, CLIENT_RE) >= 1)
  ) {
    return "potential_client"
  }

  /** True vendor / partner pitch */
  if (sellerVendor >= 2 && sellerVendor > buyerClient && sellerVendor > job) {
    return "vendor"
  }

  if (buyerClient >= 2 && buyerClient >= sellerVendor) return "potential_client"
  if (job > 0 && job >= sellerVendor && job >= buyerClient) return "job_seeker"
  if (sellerVendor > 0 && sellerVendor > buyerClient) return "vendor"
  if (buyerClient > 0) return "potential_client"

  return "unknown"
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

function extractWhatsApp(text: string): string {
  const lineMatch = text.match(
    /(?:whatsapp|wa|signal|telegram|mob(?:ile)|phone(?:\s*#)?)[:\s\-]*(\+?[\d][\d\s().-]{7,}\d|\d{10,})/i
  )
  if (lineMatch?.[1]) return lineMatch[1].replace(/\s+/g, " ").trim()
  const loose = text.match(/\+?\d[\d\s().-]{9,}\d(?!\.)|\b\d{10,}\b/)
  return loose?.[0]?.replace(/\s+/g, " ").trim() ?? ""
}

function extractCompany(text: string): string {
  const patterns: RegExp[] = [
    /(?:company\s*(?:name)?|we(?:'|\s)a?re\s+from|from|at)\s*[:\-\s]+\s*(.{2,72})/i,
    /\b[A-Z][A-Za-z0-9&]+\s+(?:LLC|Ltd|Limited|Inc|GmbH|Corp|PLC|Studio|Labs|Partners)\b/,
    /(?:agency|firm|studio)\s+(?:called|named)\s+([A-Za-z0-9& .'-]{2,48})/i,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    const raw = (m?.[1] ?? m?.[0])?.trim()
    if (raw && !/@/.test(raw) && raw.length <= 96) return raw.replace(/[.,]+$/, "")
  }
  return ""
}

function extractRoleOffering(text: string): string {
  const m =
    text.match(/\b(?:for|apply(?:ing)?\s+(?:for|as))\s+[:\-]?\s*([^.!?\n]{3,96})/i) ||
    text.match(/\bmy\s+(?:target\s+)?role\s+(?:is|would be)\s*([^.!?\n]{3,80})/i) ||
    text.match(
      /\bposition\s*[:\-]?\s*(?:I\s+want\s+)?([^.!?\n]{3,80})/i
    )
  let r = m?.[1]?.trim()?.replace(/^["']+|["'.]+$/g, "") ?? ""
  if (/^this\s|^the\s|^a\s|^an\s|^i\s|^we\s/i.test(r)) return ""
  if (r.length > 96) return r.slice(0, 96)
  return r
}

function plausiblePersonName(raw: string): boolean {
  const t = raw.trim()
  if (t.length < 2 || t.length > 48) return false
  if (/@|[\d]/.test(t)) return false
  const words = t.split(/\s+/)
  return words.length >= 1 && words.length <= 4 && /^[A-Za-z][A-Za-z'.-]*(?:\s+[A-Za-z][A-Za-z'.-]*)*$/u.test(t)
}

/** First short user utterance plausible as a name once job_seeker/vendor path is engaged */
function extractNaiveName(
  visitorType: VisitorType,
  userLines: string[]
): string {
  if (visitorType !== "job_seeker" && visitorType !== "vendor") return ""
  for (const line of userLines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (
      JOB_RE.test(trimmed) ||
      lineLooksLikeVendorSeller(trimmed) ||
      CLIENT_RE.test(trimmed)
    )
      continue
    if (extractEmail(trimmed)) continue
    if (extractCompany(trimmed)) continue
    if (plausiblePersonName(trimmed) && trimmed.length <= 42) return trimmed
  }
  return ""
}

/** Detects the mandated one-shot credibility phrase in an assistant reply. */
export function assistantDeliveredCredibilityPhrase(content: string): boolean {
  const t = content.toLowerCase().replace(/\s+/g, " ")
  if (!/\bpxlbrief\b/i.test(content)) return false
  const nine =
    /\b9\s*years?\b|\bnine\s+years?\b|\b9\+\s*years?\b|over\s+nine\s+years/.test(
      t
    )
  const brands =
    /\b50\s*\+?\s*brands?\b/.test(t) ||
    /\b50\s*\+\s*brands?\b/.test(t) ||
    /\bmore\s+than\s+50\b.*\bbrands?\b|\bbrands\b.*\b50\b/i.test(content)
  return nine && brands
}

function derivePotentialClientStructuredStage(
  messages: { role: string; content: string }[],
  prevStage: PotentialClientStructuredStage,
  usersLower: string
): PotentialClientStructuredStage {
  const userCount = messages.filter((m) => m.role === "user").length
  const assistantCount = messages.filter((m) => m.role === "assistant").length
  let s = prevStage
  const t = usersLower

  const verticalOrCategory =
    userCount >= 1 &&
    (/\b(startup|brand|business|company|store|shop|boutique|label|vertical|sell|launch|e-?commerce|saas|d2c|dtc|category|niche)\b/i.test(t) ||
      t.length >= 28)

  const sig2 =
    /\b(launch(?:ing|ed)?|pre[-\s]?launch|mvp|already\s+sell(?:ing)?|sell(?:ing)?\b|shipping|went\s+live|live\b|traction|revenue|orders\b|scaling|scale\b|bootstrapped|early[-\s]stage|\b(?:pre[-\s])?revenue\b|growth\s+stage|profitable|opera(?:te|ting))\b/i.test(
      t
    )
  const sig3 =
    /\b(branding|brand\s+(?:built|story|voice)|aware(?:ness)?|position(?:ing)?|differentiat|lead|leads\b|conversion|cro\b|website|landing|pages?\b|funnel|\bcpa\b|\bcac\b|traffic\b|paid\s+|ad\s+|ads\b|creative|checkout|catalogue|pricing|seo\b|retention|churn|carts?\b)\b/i.test(
      t
    )
  const sig4 =
    /\b(instagram|\big\b|meta\b|facebook|\bfb\b|google\s+ads|tiktok|linkedin|youtube|influencer|marketplace\b|amazon|flipkart|myntra|nykaa|\boffline\b|retail|storefront|\borganic\b\s+traffic|sms\b|\bseo\b)/i.test(
      t
    )

  if (verticalOrCategory) s = Math.max(s, 1 as PotentialClientStructuredStage)

  /* Stage 2: business stage language or enough back-and-forth */
  if (sig2 || (assistantCount >= 1 && userCount >= 2)) {
    s = Math.max(s, 2 as PotentialClientStructuredStage)
  }
  /* Stage 3: pressure / challenge surfaced */
  if (sig3 || (assistantCount >= 2 && userCount >= 3)) {
    s = Math.max(s, 3 as PotentialClientStructuredStage)
  }
  /* Stage 4: channels */
  if (sig4 || (assistantCount >= 3 && userCount >= 4)) {
    s = Math.max(s, 4 as PotentialClientStructuredStage)
  }

  /* Stage 5: long thread → lead capture */
  const deep = messages.length >= 12 || assistantCount >= 5
  const veryLong = messages.length >= 18 || assistantCount >= 8
  if ((s >= 4 && deep) || veryLong || (assistantCount >= 6 && userCount >= 5)) {
    s = Math.max(s, 5 as PotentialClientStructuredStage)
  }

  const clamped = Math.min(5, Math.max(1, s))
  return clamped as PotentialClientStructuredStage
}

function deriveStage(
  visitorType: VisitorType,
  s: Omit<ConversationStatePayload, "conversationStage" | "visitorType">,
  _exchangeDepth: number,
  structuredClientStage?: PotentialClientStructuredStage
): ConversationStage {
  if (visitorType === "unknown") return "classifying"

  if (visitorType === "potential_client") {
    const pcs = structuredClientStage ?? 1
    if (pcs >= 5) return "client_scheduling_focus"
    if (pcs >= 3) return "client_deepening"
    return "client_discovery"
  }

  if (visitorType === "job_seeker") {
    if (!s.name) return "job_collect_name"
    if (!s.role) return "job_collect_role"
    if (!s.uploadedFileName.trim()) return "job_request_cv"
    return "job_closing"
  }

  /* vendor */
  if (!s.company.trim()) return "vendor_collect_company"
  if (!s.role.trim()) return "vendor_collect_offering"
  if (!s.uploadedFileName.trim()) return "vendor_request_material"
  return "vendor_closing"
}

export interface ConversationDeriveDeps {
  /** Current selected attachment file name, if any */
  attachedFileName: string | null
}

/** Merge sticky visitor type + heuristically filled fields + stage before each model call */
export function deriveConversationState(
  messages: { role: string; content: string }[],
  prev: ConversationStatePayload,
  deps: ConversationDeriveDeps
): ConversationStatePayload {
  const fullLower = messages.map((m) => m.content).join(" ").toLowerCase()

  let visitorType: VisitorType =
    prev.visitorType !== "unknown"
      ? prev.visitorType
      : inferVisitorFromTranscript(fullLower)

  if (visitorType === "unknown" && messages.length >= 4) {
    // Default toward client flow once the dialogue has progressed without job/vendor cues
    const secondGuess = inferVisitorFromTranscript(fullLower)
    visitorType =
      secondGuess === "unknown" ? "potential_client" : secondGuess
  }

  const users = messages.filter((m) => m.role === "user")
  const usersText = userTranscript(messages)
  const userLines = users.map((m) => m.content)

  let name = prev.name.trim()
  let company = prev.company.trim()
  let role = prev.role.trim()
  const email = extractEmail(usersText) || prev.email.trim()
  const whatsapp = extractWhatsApp(usersText) || prev.whatsapp.trim()

  const co = extractCompany(usersText)
  if (visitorType === "vendor" && co) company = company || co

  const ro = extractRoleOffering(usersText)
  if (visitorType === "job_seeker" && ro && !JOB_RE.test(ro)) role = role || ro
  if (visitorType === "vendor" && ro) role = role || ro

  const naive = extractNaiveName(visitorType, userLines)
  if (
    naive &&
    !name &&
    !(visitorType === "vendor" && extractCompany(usersText))
  )
    name = naive

  // If still missing name but user signed with one line greeting + name-ish
  if (
    visitorType === "job_seeker" &&
    !name &&
    users.length &&
    plausiblePersonName(users[users.length - 1]?.content ?? "")
  )
    name = users[users.length - 1]?.content.trim() ?? ""

  const uploaded =
    deps.attachedFileName != null && deps.attachedFileName !== ""
      ? deps.attachedFileName.trim()
      : ""

  const assistantCount = messages.filter((m) => m.role === "assistant").length
  const exchangeDepth =
    assistantCount + messages.filter((m) => m.role === "user").length

  const prevWasClient = prev.visitorType === "potential_client"
  const prevPcStage = prev.potentialClientStage
  let potentialClientStage: PotentialClientStructuredStage = 1
  let clientCredibilityDelivered = false

  if (visitorType === "potential_client") {
    potentialClientStage = prevWasClient ? prevPcStage : 1
    clientCredibilityDelivered = prevWasClient
      ? prev.clientCredibilityDelivered
      : false

    potentialClientStage = derivePotentialClientStructuredStage(
      messages,
      potentialClientStage,
      fullLower
    )

    const last = messages[messages.length - 1]
    if (last?.role === "assistant") {
      clientCredibilityDelivered =
        clientCredibilityDelivered ||
        assistantDeliveredCredibilityPhrase(last.content)
    }
  } else {
    potentialClientStage = 1
    clientCredibilityDelivered = false
  }

  const conversationSummary = formatConversationSummary(messages)

  let businessVertical =
    inferBusinessVertical(usersText) || prev.businessVertical.trim()
  let businessStage = inferBusinessStageLine(
    usersText,
    visitorType === "potential_client" ? potentialClientStage : 1
  )
  if (!businessStage.trim()) businessStage = prev.businessStage.trim()
  let servicesInterested =
    inferServicesInterestedLine(usersText) ||
    prev.servicesInterested.trim()
  let currentChallenge =
    inferCurrentChallengeLine(usersText) || prev.currentChallenge.trim()
  let acquisitionChannels =
    inferAcquisitionChannelsLine(usersText) ||
    prev.acquisitionChannels.trim()

  const base = {
    name,
    company,
    role,
    email,
    whatsapp,
    uploadedFileName: uploaded,
    potentialClientStage,
    clientCredibilityDelivered,
    businessVertical,
    businessStage,
    servicesInterested,
    currentChallenge,
    acquisitionChannels,
    conversationSummary,
  }

  return {
    visitorType,
    ...base,
    conversationStage: deriveStage(
      visitorType,
      base,
      exchangeDepth,
      visitorType === "potential_client" ? potentialClientStage : undefined
    ),
  }
}
