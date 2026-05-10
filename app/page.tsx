import { CredibilityStrip } from "@/components/credibility-strip"
import { HeroSection } from "@/components/hero-section"
import { StrategicCaseIntelligenceSection } from "@/components/strategic-case-intelligence-section"
import { StrategicSystemsWeBuildSection } from "@/components/strategic-systems-we-build-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  HowWeWorkSection,
  IndustriesSection,
  ResultsSection,
  FinalCtaSection,
} from "@/components/landing-sections"
import { StrategicSystemsSection } from "@/components/strategic-systems-section"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <CredibilityStrip />
      <StrategicSystemsWeBuildSection />
      <StrategicCaseIntelligenceSection />
      <ServicesGrid />
      <StrategicSystemsSection />
      <HowWeWorkSection />
      <IndustriesSection />
      <ResultsSection />
      <FinalCtaSection />
    </main>
  )
}
