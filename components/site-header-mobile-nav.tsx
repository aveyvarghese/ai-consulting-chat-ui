"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { STRATEGY_CALL_BOOKING_URL } from "@/lib/booking"

const nav = [
  { href: "/services", label: "Services" },
  { href: "/ai-growth-audit", label: "AI Growth Audit" },
  { href: "/ai-lab", label: "AI Lab" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeaderMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-primary/10 bg-foreground/[0.025] text-foreground shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-colors hover:bg-primary/[0.06] active:bg-foreground/[0.08] [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:size-10"
          aria-label="Open menu"
        >
          <Menu className="size-[1.125rem]" strokeWidth={1.75} aria-hidden />
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
        <SheetHeader className="relative border-b border-primary/10 px-4 pb-4 pt-2 text-left sm:px-5">
          <SheetTitle className="text-base font-semibold tracking-tight text-foreground">
            Pxl<span className="text-primary">Brief</span>
          </SheetTitle>
          <p className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
            Executive AI growth systems
          </p>
        </SheetHeader>
        <nav
          className="relative flex flex-col gap-1 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4"
          aria-label="Primary mobile"
        >
          {nav.map(({ href, label }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="touch-manipulation rounded-[0.85rem] border border-primary/10 bg-foreground/[0.025] px-3.5 py-3 text-sm font-semibold text-foreground/92 shadow-[inset_0_1px_0_0_var(--shine-inset)] transition-all [-webkit-tap-highlight-color:transparent] hover:border-primary/22 hover:bg-primary/[0.055] active:bg-foreground/[0.08]"
              >
                {label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <a
              href={STRATEGY_CALL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 touch-manipulation rounded-[0.85rem] border border-primary/32 bg-gradient-to-b from-primary/15 to-primary/[0.075] px-3.5 py-3 text-center text-sm font-semibold leading-snug tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset),0_10px_28px_-22px_var(--glow-primary)] transition-all [-webkit-tap-highlight-color:transparent] hover:border-primary/44 hover:bg-primary/12"
            >
              Strategic session
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
