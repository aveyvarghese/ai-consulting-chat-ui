import type { MetadataRoute } from "next"
import { getSiteOrigin } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin()
  const now = new Date()

  const routes = ["", "/services", "/about", "/contact"] as const

  return routes.map((path) => ({
    url: path === "" ? `${base}/` : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }))
}
