import Link from "next/link"
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"

const nav = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-header-bg/95 backdrop-blur-xl supports-[backdrop-filter]:bg-header-bg/80">
      <div className="mx-auto flex h-14 max-w-6xl min-w-0 flex-nowrap items-center justify-between gap-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))] md:h-16 md:gap-6 md:px-6 md:pt-0">
        <Link
          href="/"
          className="min-w-0 flex-1 touch-manipulation py-1.5 text-[0.9375rem] font-semibold leading-none tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-base md:flex-none md:py-2 md:text-xl md:leading-tight"
        >
          <span className="block max-w-full truncate">
            Pxl<span className="text-primary">Brief</span>
          </span>
        </Link>
        <nav
          className="hidden min-w-0 items-center justify-end gap-1 md:flex md:gap-2"
          aria-label="Primary"
        >
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="touch-manipulation rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <a
            href={STRATEGY_CALL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-manipulation rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-semibold tracking-tight text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 md:ml-1 md:py-2.5"
          >
            Strategic session
          </a>
        </nav>
        <div className="shrink-0 md:hidden">
          <SiteHeaderMobileNav />
        </div>
      </div>
    </header>
  )
}
