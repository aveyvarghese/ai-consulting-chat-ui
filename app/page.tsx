import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import {
  HowWeWorkSection,
  IndustriesSection,
  ResultsSection,
  FinalCtaSection,
} from "@/components/landing-sections"

function SiteAmbient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,oklch(0.16_0.04_180/0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_50%,oklch(0.14_0.03_260/0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_0%_80%,oklch(0.12_0.025_200/0.2),transparent_45%)]" />
      <div
        className="absolute -left-[20%] top-[15%] h-[min(55vw,480px)] w-[min(55vw,480px)] rounded-full bg-primary/[0.045] blur-[100px]"
        style={{
          animation: "pxl-drift 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[15%] bottom-[10%] h-[min(45vw,420px)] w-[min(45vw,420px)] rounded-full bg-primary/[0.035] blur-[90px]"
        style={{
          animation: "pxl-drift 32s ease-in-out infinite reverse",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <SiteAmbient />
      <HeroSection />
      <ServicesGrid />
      <HowWeWorkSection />
      <IndustriesSection />
      <ResultsSection />
      <FinalCtaSection />
    </main>
  )
}
