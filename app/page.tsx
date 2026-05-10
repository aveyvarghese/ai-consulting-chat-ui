import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  AfterEnquireSection,
  ExampleUseCasesSection,
  HowWeWorkSection,
  ResultsSection,
  FinalCtaSection,
  TrustLayerSection,
  WhyBrandsChooseUsSection,
} from "@/components/landing-sections"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
      <ServicesGrid />
      <ResultsSection />
      <HowWeWorkSection />
      <ExampleUseCasesSection />
      <AfterEnquireSection />
      <WhyBrandsChooseUsSection />
      <TrustLayerSection />
      <FinalCtaSection />
    </main>
  )
}
