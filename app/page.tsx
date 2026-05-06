import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesGrid />
    </main>
  )
}
