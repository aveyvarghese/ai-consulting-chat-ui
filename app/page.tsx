import { CredibilityStrip } from "@/components/credibility-strip"
import { HeroSection } from "@/components/hero-section"
import { HomeBrandReportPopup } from "@/components/home-brand-report-popup"
import { StrategicSystemsWeBuildSection } from "@/components/strategic-systems-we-build-section"
import {
  AIGrowthDiagnosticPreviewSection,
  AILabPreviewSection,
  CaseIntelligencePreviewSection,
  FinalGrowthCtaSection,
  FounderCredibilitySection,
  IndustryPlaybooksPreviewSection,
  ProblemSection,
} from "@/components/ai-growth-homepage-sections"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HomeBrandReportPopup />
      <HeroSection />
      <CredibilityStrip />
      <ProblemSection />
      <AIGrowthDiagnosticPreviewSection />
      <StrategicSystemsWeBuildSection />
      <AILabPreviewSection />
      <IndustryPlaybooksPreviewSection />
      <CaseIntelligencePreviewSection />
      <FounderCredibilitySection />
      <FinalGrowthCtaSection />
    </main>
  )
}
