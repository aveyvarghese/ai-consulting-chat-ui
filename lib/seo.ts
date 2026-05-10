import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site"

export const SITE_NAME = "PxlBrief"

/** Primary positioning phrases for metadata.keywords and copy support */
export const POSITIONING_KEYWORDS = [
  "AI consulting India",
  "AI automation consulting",
  "AI growth systems",
  "AI strategy consultant",
  "business automation",
  "performance marketing systems",
  "AI workflows for brands",
] as const

const KEYWORDS_STRING = [...POSITIONING_KEYWORDS].join(", ")

export const DEFAULT_TITLE =
  "PxlBrief | AI consulting, growth systems & automation for brands"

export const DEFAULT_DESCRIPTION =
  "PxlBrief is an AI strategy consultant for founders and marketing leaders—AI consulting India and globally, AI automation consulting, AI growth systems, business automation, performance marketing systems, and AI workflows for brands. Install intelligence your team can run."

export function rootMetadata(): Metadata {
  const base = getSiteUrl()
  const title = DEFAULT_TITLE
  const description = DEFAULT_DESCRIPTION

  return {
    metadataBase: base,
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: KEYWORDS_STRING,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: base.href }],
    creator: SITE_NAME,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: base,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: new URL("/icon.svg", base).toString(),
          width: 180,
          height: 180,
          alt: `${SITE_NAME} mark`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    formatDetection: {
      telephone: false,
    },
  }
}

export function pageMetadata(opts: {
  path: string
  title: string
  description: string
}): Metadata {
  const { path, title, description } = opts
  const canonicalPath = path.startsWith("/") ? path : `/${path}`

  return {
    title,
    description,
    keywords: KEYWORDS_STRING,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalPath,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: "/icon.svg",
          width: 180,
          height: 180,
          alt: `${SITE_NAME} mark`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}
