"use client"

import { useEffect, useState } from "react"
import {
  DEFAULT_THEME,
  THEME_OPTIONS,
  applyThemeWithTransition,
  commitThemeToDocument,
  readStoredTheme,
  type ThemeId,
  isThemeId,
} from "@/lib/theme"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fromDom = document.documentElement.dataset.theme
    const initial = isThemeId(fromDom) ? fromDom : readStoredTheme()
    setTheme(initial)
    commitThemeToDocument(initial)
  }, [])

  if (!mounted) {
    return (
      <div
        className="h-9 w-[min(100%,13rem)] shrink-0 rounded-lg border border-hairline/60 bg-surface-elevated/40 md:w-[16rem]"
        aria-hidden
      />
    )
  }

  return (
    <>
      <label className="sr-only" htmlFor="pxl-theme-select">
        Site theme
      </label>
      <select
        id="pxl-theme-select"
        value={theme}
        title="Dark intelligence themes, enterprise light modes, or Executive Sunrise (local test)"
        onChange={(e) => {
          const v = e.target.value
          if (!isThemeId(v) || v === theme) return
          setTheme(v)
          applyThemeWithTransition(v)
        }}
        className="h-9 max-w-[min(100%,13rem)] shrink-0 cursor-pointer rounded-lg border border-hairline bg-surface-elevated/80 px-2.5 text-[0.6875rem] font-medium text-foreground/90 shadow-sm backdrop-blur-sm transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-primary/35 hover:bg-surface-elevated focus:border-primary/45 focus:outline-none focus:ring-1 focus:ring-primary/25 md:max-w-[16rem] md:text-xs"
      >
        {THEME_OPTIONS.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </>
  )
}
