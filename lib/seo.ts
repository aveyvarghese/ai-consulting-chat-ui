import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site"
import { SITE_CONTACT_EMAIL } from "@/lib/contact"

export const SITE_NAME = "PxlBrief"
export const SITE_TITLE = "PxlBrief | AI Growth Consulting for Brands & Businesses"
export const ORGANIZATION_DESCRIPTION =
  "AI growth consulting practice helping businesses connect AI implementation, brand strategy, digital marketing, websites, CRM, dashboards, and business intelligence."

/** Primary positioning phrases for metadata.keywords and copy support */
export const POSITIONING_KEYWORDS = [
  "AI consulting India",
  "AI growth consulting",
  "AI implementation for business",
  "digital marketing consultant India",
  "brand strategy consultant",
  "performance marketing consultant",
  "SEO AEO GEO consultant",
  "CRM automation consultant",
  "AI automation for businesses",
  "website SEO audit",
  "AI marketing consultant",
] as const

const KEYWORDS_STRING = [...POSITIONING_KEYWORDS].join(", ")

export const DEFAULT_TITLE =
  "PxlBrief | AI Growth Consulting, Digital Marketing & AI Automation"

export const DEFAULT_DESCRIPTION =
  "PxlBrief helps founder-led businesses use AI implementation, brand strategy, digital marketing, SEO, AEO, GEO, CRM, dashboards, and automation to build smarter growth systems."

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString()
}

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
  keywords?: readonly string[] | string
  type?: "website" | "article"
}): Metadata {
  const { path, title, description, type = "website" } = opts
  const canonicalPath = path.startsWith("/") ? path : `/${path}`
  const keywords =
    typeof opts.keywords === "string"
      ? opts.keywords
      : opts.keywords
        ? [...opts.keywords].join(", ")
        : KEYWORDS_STRING

  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type,
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
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl.toString(),
    email: SITE_CONTACT_EMAIL,
    description: ORGANIZATION_DESCRIPTION,
  }
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl.toString(),
    description: ORGANIZATION_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }
}

export function professionalServiceJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: siteUrl.toString(),
    email: SITE_CONTACT_EMAIL,
    description: ORGANIZATION_DESCRIPTION,
    areaServed: "India",
    serviceType: [
      "AI implementation consulting",
      "Brand strategy",
      "Digital marketing consulting",
      "SEO, AEO and GEO consulting",
      "CRM and dashboard consulting",
      "Sales enablement",
    ],
  }
}
