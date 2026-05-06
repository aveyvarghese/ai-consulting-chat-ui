"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowRight, X, User, Sparkles } from "lucide-react"

export function ChatSection() {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const hasMessages = messages.length > 0

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

  if (!hasMessages) return null

  return (
    <section className="relative w-full max-w-3xl mx-auto px-4 pb-12">
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
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
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

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 bg-background/50 border border-border/60 rounded-xl px-4 py-2 focus-within:border-primary/50 transition-colors">
            <input
              ref={inputRef}
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
    </section>
  )
}
