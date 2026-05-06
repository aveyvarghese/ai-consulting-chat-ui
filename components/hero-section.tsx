"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

const placeholderPrompts = [
  "Why am I not getting leads?",
  "How can AI improve my business?",
  "Audit my marketing strategy",
  "How should I position my brand?",
]

export function HeroSection() {
  const [inputValue, setInputValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentPrompt = placeholderPrompts[placeholderIndex]
    
    if (isTyping) {
      if (displayedPlaceholder.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentPrompt.slice(0, displayedPlaceholder.length + 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length)
        setIsTyping(true)
      }
    }
  }, [displayedPlaceholder, isTyping, placeholderIndex])

  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 md:py-28">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
          Diagnose. Strategize. Scale.
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          AI consulting, growth strategy, performance marketing and brand intelligence — built to scale modern businesses.
        </p>

        {/* AI Chat Input Box - Immersive */}
        <div
          className={`relative w-full max-w-2xl mx-auto mb-6 transition-all duration-500 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
        >
          {/* Animated glow effect */}
          <div
            className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 blur-md transition-opacity duration-500 ${
              isFocused ? "opacity-100" : "opacity-40"
            }`}
            style={{
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
          
          <div
            className={`relative flex items-center bg-card/90 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
              isFocused
                ? "border-primary/60 shadow-2xl shadow-primary/20"
                : "border-border/60 hover:border-primary/30"
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={displayedPlaceholder}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base md:text-lg px-6 py-6 md:py-7 outline-none"
            />
            <button
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mr-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Trust Line */}
        <p className="text-sm text-muted-foreground/70">
          Helping brands scale through AI, growth systems and strategic marketing.
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  )
}
