import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  HowWeWorkSection,
  WhyBrandsChooseUsSection,
  ResultsSection,
  FinalCtaSection,
} from "@/components/landing-sections"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <ServicesGrid />
      <HowWeWorkSection />
      <WhyBrandsChooseUsSection />
      <ResultsSection />
      <FinalCtaSection />
    </main>
  )
}
