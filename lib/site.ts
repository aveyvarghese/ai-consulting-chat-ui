/**
 * Canonical site origin for metadata, sitemap, and OG URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://pxlbrief.com).
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) {
    const normalized = explicit.replace(/\/+$/, "")
    return new URL(normalized)
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "")
    return new URL(`https://${host}`)
  }
  return new URL("https://pxlbrief.com")
}

export function getSiteOrigin(): string {
  return getSiteUrl().origin
}
