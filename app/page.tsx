import type { Metadata } from "next"
import { CredibilityStrip } from "@/components/credibility-strip"
import { HeroSection } from "@/components/hero-section"
import { HomeBrandReportPopup } from "@/components/home-brand-report-popup"
import { StrategicSystemsWeBuildSection } from "@/components/strategic-systems-we-build-section"
import { pageMetadata, professionalServiceJsonLd } from "@/lib/seo"
import {
  AIGrowthDiagnosticPreviewSection,
  AILabPreviewSection,
  CaseIntelligencePreviewSection,
  FinalGrowthCtaSection,
  FounderCredibilitySection,
  IndustryPlaybooksPreviewSection,
  ProblemSection,
} from "@/components/ai-growth-homepage-sections"

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "PxlBrief | AI Growth Consulting, Digital Marketing & AI Automation",
  description:
    "PxlBrief helps founder-led businesses use AI implementation, brand strategy, digital marketing, SEO, AEO, GEO, CRM, dashboards, and automation to build smarter growth systems.",
})

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd()) }}
      />
      <HomeBrandReportPopup />
      <HeroSection />
      <CredibilityStrip />
      <FounderCredibilitySection />
      <ProblemSection />
      <AIGrowthDiagnosticPreviewSection />
      <StrategicSystemsWeBuildSection />
      <AILabPreviewSection />
      <IndustryPlaybooksPreviewSection />
      <CaseIntelligencePreviewSection />
      <FinalGrowthCtaSection />
    </main>
  )
}
