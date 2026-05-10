export const THEME_IDS = [
  "palantir",
  "luxury",
  "cinematic",
  "executive-light",
  "executive-sunrise",
] as const

export type ThemeId = (typeof THEME_IDS)[number]

export const THEME_OPTIONS: { id: ThemeId; label: string; short: string }[] = [
  { id: "palantir", label: "Palantir Intelligence", short: "Palantir" },
  { id: "luxury", label: "Luxury Executive", short: "Executive" },
  { id: "cinematic", label: "Cinematic AI", short: "Cinematic" },
  {
    id: "executive-light",
    label: "Executive Light — Enterprise",
    short: "Light",
  },
  { id: "executive-sunrise", label: "Executive Sunrise", short: "Sunrise" },
]

export const THEME_STORAGE_KEY = "pxl-theme"

/** First paint + invalid localStorage; user choice still wins when stored. */
export const DEFAULT_THEME = "executive-sunrise" satisfies ThemeId

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return (
    value === "palantir" ||
    value === "luxury" ||
    value === "cinematic" ||
    value === "executive-light" ||
    value === "executive-sunrise"
  )
}

/** Dark Tailwind `dark:` variant; light test themes omit `.dark`. */
export function isDarkAppearanceTheme(id: ThemeId): boolean {
  return id !== "executive-light" && id !== "executive-sunrise"
}

/** Sync `data-theme`, `.dark`, and localStorage (no animation). */
export function commitThemeToDocument(id: ThemeId): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.dataset.theme = id
  root.classList.toggle("dark", isDarkAppearanceTheme(id))
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

/**
 * Apply theme with a smooth cross-fade when View Transitions are available.
 * Falls back to instant `commitThemeToDocument` when not supported.
 */
export function applyThemeWithTransition(id: ThemeId): void {
  if (typeof document === "undefined") return
  const go = () => commitThemeToDocument(id)
  if (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.startViewTransition(go)
  } else {
    go()
  }
}

/** Minified boot snippet for `next/script` `beforeInteractive`. */
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;try{var k=${JSON.stringify(THEME_STORAGE_KEY)},v=localStorage.getItem(k),t=${JSON.stringify(DEFAULT_THEME)},a=${JSON.stringify([...THEME_IDS])},L=${JSON.stringify("executive-light")},S=${JSON.stringify("executive-sunrise")};if(a.indexOf(v)>-1)t=v;r.dataset.theme=t;if(t===L||t===S){r.classList.remove("dark");}else{r.classList.add("dark");}}catch(e){r.dataset.theme=${JSON.stringify(DEFAULT_THEME)};r.classList.remove("dark");}})();`

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemeId(raw)) return raw
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}
