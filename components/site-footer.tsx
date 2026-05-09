import Link from "next/link"

const links = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/[0.15]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:flex md:items-start md:justify-between md:px-6 md:py-16">
        <div className="mb-8 md:mb-0">
          <Link
            href="/"
            className="inline-block text-lg font-semibold tracking-tight text-foreground md:text-xl"
          >
            Pxl<span className="text-primary">Brief</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground/80">
            AI-native consulting — strategy, brand, growth and systems.
          </p>
        </div>
        <nav
          className="flex flex-col gap-3 sm:flex-row sm:gap-8"
          aria-label="Footer"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#consulting-chat"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/90"
          >
            PxlBrief AI
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/[0.04] py-4 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} PxlBrief. All rights reserved.
      </div>
    </footer>
  )
}
