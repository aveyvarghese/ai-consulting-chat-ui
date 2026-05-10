import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  HowWeWorkSection,
  IndustriesSection,
  ResultsSection,
  FinalCtaSection,
} from "@/components/landing-sections"
import {
  HowPxlBriefThinksSection,
  StrategicSystemsSection,
} from "@/components/strategic-systems-section"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <ServicesGrid />
      <StrategicSystemsSection />
      <HowPxlBriefThinksSection />
      <HowWeWorkSection />
      <IndustriesSection />
      <ResultsSection />
      <FinalCtaSection />
    </main>
  )
}
