import Link from "next/link"
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"

const nav = [
  { href: "/services", label: "Services" },
  { href: "/#ai-lab", label: "AI Lab" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-header-bg/88 shadow-[0_1px_0_rgba(255,255,255,0.035),0_18px_48px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl supports-[backdrop-filter]:bg-header-bg/74 md:backdrop-blur-2xl">
      <div className="mx-auto flex h-12 max-w-6xl min-w-0 flex-nowrap items-center justify-between gap-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))] sm:h-14 md:h-16 md:gap-6 md:px-6 md:pt-0">
        <Link
          href="/"
          className="group min-w-0 flex-1 touch-manipulation py-1.5 text-[0.9375rem] font-semibold leading-none tracking-tight text-foreground transition-opacity hover:opacity-95 sm:text-base md:flex-none md:py-2 md:text-xl md:leading-tight"
        >
          <span className="block max-w-full truncate">
            Pxl<span className="text-primary transition-colors group-hover:text-primary/88">Brief</span>
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
              className="touch-manipulation rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/12 hover:bg-primary/[0.045] hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <a
            href={STRATEGY_CALL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-manipulation rounded-lg border border-primary/28 bg-gradient-to-b from-primary/14 to-primary/[0.07] px-3 py-2 text-sm font-semibold tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset),0_10px_28px_-22px_var(--glow-primary)] transition-all duration-300 hover:border-primary/42 hover:bg-primary/15 hover:shadow-[inset_0_1px_0_0_var(--shine-inset),0_14px_34px_-18px_var(--glow-primary)] md:ml-1 md:py-2.5"
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
