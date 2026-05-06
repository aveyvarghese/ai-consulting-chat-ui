"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowRight, X, User, Sparkles } from "lucide-react"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const hasMessages = messages.length > 0

  // Typewriter effect for placeholder
  useEffect(() => {
    if (hasMessages) return // Stop animation when chat is active
    
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
  }, [displayedPlaceholder, isTyping, placeholderIndex, hasMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue("")
  }

  const handleClose = () => {
    setMessages([])
  }

  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 md:py-28">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Brand Name */}
        <div className="mb-8">
          <span className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Pxl<span className="text-primary">Brief</span>
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
          Diagnose. Strategize. Scale.
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          AI consulting, growth strategy, performance marketing and brand intelligence — built to scale modern businesses.
        </p>

        {/* AI Chat Input Box - Initial State */}
        {!hasMessages && (
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
            
            <form onSubmit={handleSubmit}>
              <div
                className={`relative flex items-center bg-card/90 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
                  isFocused
                    ? "border-primary/60 shadow-2xl shadow-primary/20"
                    : "border-border/60 hover:border-primary/30"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={displayedPlaceholder}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base md:text-lg px-6 py-6 md:py-7 outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mr-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trust Line - Only show when no messages */}
        {!hasMessages && (
          <p className="text-sm text-muted-foreground/70">
            Helping brands scale through AI, growth systems and strategic marketing.
          </p>
        )}
      </div>

      {/* Chat Interface - Appears when conversation starts */}
      {hasMessages && (
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-8">
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">PxlBrief AI</span>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="max-h-[50vh] overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return <span key={index}>{part.text}</span>
                        }
                        return null
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted/50 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border/40">
              <div className="flex items-center gap-3 bg-background/50 border border-border/60 rounded-xl px-4 py-2 focus-within:border-primary/50 transition-colors">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Continue the conversation..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm md:text-base outline-none py-2"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
