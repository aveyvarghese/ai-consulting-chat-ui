"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.055] bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.04),0_22px_70px_-48px_rgba(0,0,0,0.95)] backdrop-blur-md supports-[backdrop-filter]:bg-black/35 md:backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl min-w-0 flex-nowrap items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))] md:h-20 md:gap-6 md:px-8 md:pt-0">
        <Link
          href="/"
          className="group min-w-0 flex-1 touch-manipulation py-1.5 text-xl font-black leading-none tracking-tight text-white transition-opacity hover:opacity-95 md:flex-none md:py-2 md:text-2xl md:leading-tight"
        >
          <span className="block max-w-full truncate">
            Pxl<span className="text-[#ff7f50] transition-colors group-hover:text-[#ffa07a]">Brief</span>
          </span>
        </Link>
        <nav
          className="hidden min-w-0 items-center justify-end gap-2 text-sm font-medium text-slate-400 lg:flex lg:gap-4 xl:gap-6"
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
                  "relative touch-manipulation rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:text-white",
                  isActive
                    ? "border-white/10 bg-white/[0.055] text-white shadow-[0_0_15px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "border-transparent text-slate-400"
                )}
              >
                {label}
              </Link>
            )
          })}
          <StrategicSessionBookingLink
            source="desktop_header"
            className="touch-manipulation rounded-full border border-[#ff7f50]/35 bg-gradient-to-r from-[#ff7f50] to-[#ffa07a] px-4 py-2 text-xs font-semibold tracking-tight text-white shadow-[0_0_20px_rgba(255,127,80,0.3),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ffa07a]/55 hover:shadow-[0_0_30px_rgba(255,127,80,0.5),inset_0_1px_0_rgba(255,255,255,0.22)] md:ml-1 md:px-5 md:py-2.5 md:text-sm"
          >
            Book Strategic Session
          </StrategicSessionBookingLink>
        </nav>
        <div className="shrink-0 lg:hidden">
          <SiteHeaderMobileNav />
        </div>
      </div>
    </header>
  )
}
