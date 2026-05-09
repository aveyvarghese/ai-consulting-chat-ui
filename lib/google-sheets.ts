import { createSign } from "crypto"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets"
const GOOGLE_SHEETS_APPEND_RANGE = "A:M"
const REQUEST_TIMEOUT_MS = 8_000

export const GOOGLE_SHEETS_LEAD_COLUMNS = [
  "submittedAt",
  "visitorType",
  "leadScore",
  "name",
  "company",
  "businessVertical",
  "serviceNeeded",
  "phone / WhatsApp",
  "email",
  "website",
  "instagram",
  "uploadedFileName",
  "conversationSummary",
] as const

export interface GoogleSheetsLeadRow {
  submittedAt: string
  visitorType: string
  leadScore: string
  name: string
  company: string
  businessVertical: string
  serviceNeeded: string
  phoneOrWhatsApp: string
  email: string
  website: string
  instagram: string
  uploadedFileName: string
  conversationSummary: string
}

interface GoogleSheetsConfig {
  clientEmail: string
  privateKey: string
  spreadsheetId: string
}

interface GoogleTokenResponse {
  access_token?: unknown
  error?: unknown
  error_description?: unknown
}

function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim()
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY)
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim()

  const missing = [
    !clientEmail && "GOOGLE_SHEETS_CLIENT_EMAIL",
    !privateKey && "GOOGLE_SHEETS_PRIVATE_KEY",
    !spreadsheetId && "GOOGLE_SHEETS_SPREADSHEET_ID",
  ].filter(Boolean)

  if (missing.length > 0) {
    throw new Error(
      `Google Sheets CRM logging is not configured: missing ${missing.join(", ")}`
    )
  }

  return {
    clientEmail: clientEmail!,
    privateKey: privateKey!,
    spreadsheetId: spreadsheetId!,
  }
}

function normalizePrivateKey(raw: string | undefined): string {
  if (!raw) return ""
  return raw.trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n")
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function signJwt(unsignedToken: string, privateKey: string): string {
  const signer = createSign("RSA-SHA256")
  signer.update(unsignedToken)
  signer.end()
  return signer
    .sign(privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function createServiceAccountJwt(config: GoogleSheetsConfig): string {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: "RS256",
    typ: "JWT",
  }
  const claimSet = {
    iss: config.clientEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 60 * 60,
    iat: now,
  }

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(claimSet)
  )}`
  return `${unsignedToken}.${signJwt(unsignedToken, config.privateKey)}`
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function getAccessToken(config: GoogleSheetsConfig): Promise<string> {
  const assertion = createServiceAccountJwt(config)
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  })

  const response = await fetchWithTimeout(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })
  const data = (await response.json()) as GoogleTokenResponse

  if (!response.ok || typeof data.access_token !== "string") {
    const description =
      typeof data.error_description === "string"
        ? data.error_description
        : typeof data.error === "string"
          ? data.error
          : `HTTP ${response.status}`
    throw new Error(`Google OAuth token request failed: ${description}`)
  }

  return data.access_token
}

function clampCell(value: string): string {
  const trimmed = value.trim()
  return trimmed.length <= 50_000 ? trimmed : `${trimmed.slice(0, 49_999)}…`
}

function toSheetValues(row: GoogleSheetsLeadRow): string[] {
  return [
    row.submittedAt,
    row.visitorType,
    row.leadScore,
    row.name,
    row.company,
    row.businessVertical,
    row.serviceNeeded,
    row.phoneOrWhatsApp,
    row.email,
    row.website,
    row.instagram,
    row.uploadedFileName,
    row.conversationSummary,
  ].map(clampCell)
}

export async function appendLeadToGoogleSheets(
  row: GoogleSheetsLeadRow
): Promise<void> {
  const config = getGoogleSheetsConfig()
  const accessToken = await getAccessToken(config)
  const encodedRange = encodeURIComponent(GOOGLE_SHEETS_APPEND_RANGE)
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      config.spreadsheetId
    )}/values/${encodedRange}:append`
  )
  url.searchParams.set("valueInputOption", "RAW")
  url.searchParams.set("insertDataOption", "INSERT_ROWS")

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [toSheetValues(row)],
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `Google Sheets append failed: HTTP ${response.status}${
        message ? ` - ${message.slice(0, 500)}` : ""
      }`
    )
  }
}
