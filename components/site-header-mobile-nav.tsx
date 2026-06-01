"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/ai-growth-audit", label: "AI Growth Audit" },
  { href: "/ai-lab", label: "AI Lab" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function SiteHeaderMobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-[0.8rem] border border-primary/16 bg-foreground/[0.035] text-foreground shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors hover:bg-primary/[0.06] active:bg-foreground/[0.08] [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:size-10 sm:rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="size-[1.45rem] sm:size-[1.125rem]" strokeWidth={2.25} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="z-[60] w-[min(100vw,22rem)] max-w-[calc(100vw-env(safe-area-inset-left))] gap-0 overflow-hidden border-l border-primary/18 bg-gradient-to-b from-header-bg/98 via-header-bg/96 to-background/96 p-0 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(2.75rem,env(safe-area-inset-right))] shadow-[0_0_0_1px_rgba(255,255,255,0.035),-28px_0_80px_-44px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:max-w-sm"
      >
        <div
          className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] pxl-data-grid"
          aria-hidden
        />
        <SheetHeader className="relative border-b border-primary/10 px-4 pb-4 pt-3 text-left sm:px-5 sm:pt-2">
          <SheetTitle className="text-[1.28rem] font-bold tracking-[-0.025em] text-foreground sm:text-base sm:font-semibold sm:tracking-tight">
            Pxl<span className="text-primary">Brief</span>
          </SheetTitle>
          <p className="mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70 sm:mt-1 sm:text-[0.6875rem]">
            Executive AI growth systems
          </p>
        </SheetHeader>
        <nav
          className="relative flex flex-col gap-1.5 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:gap-1 sm:px-4"
          aria-label="Primary mobile"
        >
          {nav.map(({ href, label }) => {
            const isActive = isActivePath(pathname, href)

            return (
              <SheetClose asChild key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative touch-manipulation rounded-[0.9rem] border px-4 py-3.5 text-[0.9375rem] font-semibold shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all [-webkit-tap-highlight-color:transparent] before:absolute before:inset-y-2.5 before:left-2 before:w-0.5 before:scale-y-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:border-primary/22 hover:bg-primary/[0.055] active:bg-foreground/[0.08] sm:rounded-[0.85rem] sm:px-3.5 sm:py-3 sm:text-sm",
                    isActive
                      ? "border-primary/24 bg-primary/[0.08] pl-4 text-primary before:scale-y-100"
                      : "border-primary/10 bg-foreground/[0.025] text-foreground/92"
                  )}
                >
                  {label}
                </Link>
              </SheetClose>
            )
          })}
          <SheetClose asChild>
            <StrategicSessionBookingLink
              source="mobile_menu"
              className="cta-gradient-motion cta-primary-booking mt-3 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-[0.9rem] border border-primary/32 px-4 py-3 text-center text-[0.9375rem] font-semibold leading-snug tracking-tight text-primary-foreground shadow-[inset_0_1px_0_0_var(--shine-inset),0_10px_28px_-22px_var(--glow-primary)] transition-all [-webkit-tap-highlight-color:transparent] hover:border-primary/44 sm:rounded-[0.85rem] sm:px-3.5 sm:py-3 sm:text-sm"
            >
              Book Strategic Session
            </StrategicSessionBookingLink>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
