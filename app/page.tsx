import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  HowWeWorkSection,
  IndustriesSection,
  ResultsSection,
  FinalCtaSection,
} from "@/components/landing-sections"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <ServicesGrid />
      <HowWeWorkSection />
      <IndustriesSection />
      <ResultsSection />
      <FinalCtaSection />
    </main>
  )
}
