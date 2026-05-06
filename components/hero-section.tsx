"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

const placeholderExamples = [
  "How can I scale my business using AI?",
  "Why am I not getting leads?",
  "Audit my digital marketing strategy",
]

const suggestionChips = [
  "AI Consulting",
  "Performance Marketing",
  "Branding",
  "SEO / GEO",
  "Go-To-Market",
]

export function HeroSection() {
  const [inputValue, setInputValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  const handleChipClick = (chip: string) => {
    setInputValue(`Tell me about ${chip.toLowerCase()}`)
  }

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Consulting</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
          Your AI-Powered Growth Consultant
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
          AI strategy, marketing intelligence, branding, growth systems and go-to-market consulting.
        </p>

        {/* AI Chat Input Box */}
        <div
          className={`relative w-full max-w-2xl mx-auto mb-8 transition-all duration-300 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
        >
          <div
            className={`relative flex items-center bg-card/80 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
              isFocused
                ? "border-primary/50 shadow-lg shadow-primary/10"
                : "border-border/50 hover:border-border"
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholderExamples[placeholderIndex]}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base md:text-lg px-6 py-5 outline-none"
            />
            <button
              className="flex items-center justify-center w-12 h-12 mr-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() =>
                setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length)
              }
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-secondary-foreground border border-border/50 hover:bg-secondary hover:border-border transition-all duration-200"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
