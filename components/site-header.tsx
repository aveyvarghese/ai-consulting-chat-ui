import Link from "next/link"

const nav = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90 md:text-xl"
        >
          Pxl<span className="text-primary">Brief</span>
        </Link>
        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Primary"
        >
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground md:px-3"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#consulting-chat"
            className="ml-1 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 md:ml-2 md:px-3"
          >
            Chat
          </Link>
        </nav>
      </div>
    </header>
  )
}
