"use client"

import { useEffect, useState } from "react"
import {
  commitThemeVariantToDocument,
  readStoredThemeVariant,
  THEME_VARIANT_OPTIONS,
  type ThemeVariantId,
} from "@/lib/theme"

type ThemeVariantSwitcherProps = {
  className?: string
}

export function ThemeVariantSwitcher({
  className = "",
}: ThemeVariantSwitcherProps) {
  const [variant, setVariant] = useState<ThemeVariantId>("luxury")

  useEffect(() => {
    const stored = readStoredThemeVariant()
    setVariant(stored)
    commitThemeVariantToDocument(stored)
  }, [])

  function handleChange(next: ThemeVariantId) {
    setVariant(next)
    commitThemeVariantToDocument(next)
  }

  return (
    <div
      className={`flex min-w-0 items-center gap-2 rounded-full border border-primary/18 bg-background/45 px-2.5 py-1.5 shadow-[inset_0_1px_0_0_var(--shine-inset),0_12px_32px_-28px_var(--glow-primary)] backdrop-blur-xl ${className}`}
    >
      <span
        className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/78"
      >
        Theme
      </span>
      <select
        value={variant}
        onChange={(event) => handleChange(event.target.value as ThemeVariantId)}
        className="min-h-8 w-[8.25rem] min-w-0 touch-manipulation rounded-full border border-primary/14 bg-primary/[0.055] px-2.5 py-1 text-xs font-semibold tracking-tight text-foreground outline-none transition-colors hover:border-primary/28 hover:bg-primary/[0.09] focus-visible:ring-2 focus-visible:ring-ring/35"
        aria-label="Theme"
      >
        {THEME_VARIANT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id} className="bg-background text-foreground">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
