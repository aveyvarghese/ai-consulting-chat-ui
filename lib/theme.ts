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
export const THEME_VARIANT_STORAGE_KEY = "pxl-theme-variant"

/** First paint + invalid localStorage; user choice still wins when stored. */
export const DEFAULT_THEME = "luxury" satisfies ThemeId

export const THEME_VARIANT_IDS = [
  "luxury",
  "bronze",
  "emerald",
  "minimalist-luxe",
  "deep-emerald",
  "aurora-pastel",
  "luminous-tech",
] as const

export type ThemeVariantId = (typeof THEME_VARIANT_IDS)[number]

export const THEME_VARIANT_OPTIONS: {
  id: ThemeVariantId
  label: string
}[] = [
  { id: "luxury", label: "Luxury" },
  { id: "bronze", label: "Bronze" },
  { id: "emerald", label: "Emerald" },
  { id: "minimalist-luxe", label: "Minimalist Luxe" },
  { id: "deep-emerald", label: "Deep Emerald" },
  { id: "aurora-pastel", label: "Aurora Pastel" },
  { id: "luminous-tech", label: "Luminous Tech" },
]

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return (
    value === "palantir" ||
    value === "luxury" ||
    value === "cinematic" ||
    value === "executive-light" ||
    value === "executive-sunrise"
  )
}

export function isThemeVariantId(
  value: string | null | undefined
): value is ThemeVariantId {
  return (
    value === "luxury" ||
    value === "bronze" ||
    value === "emerald" ||
    value === "minimalist-luxe" ||
    value === "deep-emerald" ||
    value === "aurora-pastel" ||
    value === "luminous-tech"
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

export function commitThemeVariantToDocument(id: ThemeVariantId): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.dataset.themeVariant = id
  try {
    window.localStorage.setItem(THEME_VARIANT_STORAGE_KEY, id)
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
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;r.dataset.theme=${JSON.stringify(DEFAULT_THEME)};r.classList.add("dark");})();`

export const THEME_VARIANT_BOOT_SCRIPT = `(function(){var r=document.documentElement;try{var k=${JSON.stringify(THEME_VARIANT_STORAGE_KEY)},v=localStorage.getItem(k),d=${JSON.stringify("luxury")},a=${JSON.stringify([...THEME_VARIANT_IDS])};if(a.indexOf(v)>-1)d=v;r.dataset.themeVariant=d;}catch(e){r.dataset.themeVariant=${JSON.stringify("luxury")};}})();`

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

export function readStoredThemeVariant(): ThemeVariantId {
  if (typeof window === "undefined") return "luxury"
  try {
    const raw = window.localStorage.getItem(THEME_VARIANT_STORAGE_KEY)
    if (isThemeVariantId(raw)) return raw
  } catch {
    /* ignore */
  }
  return "luxury"
}
