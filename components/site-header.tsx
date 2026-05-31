"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/ai-growth-audit", label: "AI Audit" },
  { href: "/ai-lab", label: "AI Lab" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-header-bg/88 shadow-[0_1px_0_rgba(255,255,255,0.035),0_18px_48px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl supports-[backdrop-filter]:bg-header-bg/74 md:backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl min-w-0 flex-nowrap items-center justify-between gap-3 pl-[max(0.875rem,env(safe-area-inset-left))] pr-[max(0.875rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))] sm:h-14 md:h-16 md:gap-6 md:px-6 md:pt-0">
        <Link
          href="/"
          className="group min-w-0 flex-1 touch-manipulation py-1.5 text-[1.28rem] font-bold leading-none tracking-[-0.025em] text-foreground transition-opacity hover:opacity-95 sm:text-base sm:font-semibold sm:tracking-tight md:flex-none md:py-2 md:text-xl md:leading-tight"
        >
          <span className="block max-w-full truncate">
            Pxl<span className="text-primary transition-colors group-hover:text-primary/88">Brief</span>
          </span>
        </Link>
        <nav
          className="hidden min-w-0 items-center justify-end gap-1 md:flex md:gap-2"
          aria-label="Primary"
        >
          {nav.map(({ href, label }) => {
            const isActive = isActivePath(pathname, href)

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative touch-manipulation rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-300 after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:border-primary/12 hover:bg-primary/[0.045] hover:text-foreground",
                  isActive
                    ? "border-primary/18 bg-primary/[0.065] text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)] after:scale-x-100"
                    : "border-transparent text-muted-foreground"
                )}
              >
                {label}
              </Link>
            )
          })}
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
