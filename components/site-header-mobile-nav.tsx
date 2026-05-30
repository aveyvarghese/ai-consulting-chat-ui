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
  { href: "/#ai-lab", label: "AI Lab" },
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
        className="z-[60] w-[min(100%,19rem)] max-w-[calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-1rem)] gap-0 border-primary/12 bg-header-bg/95 p-0 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(2.75rem,env(safe-area-inset-right))] shadow-2xl backdrop-blur-xl sm:max-w-sm sm:backdrop-blur-2xl"
      >
        <SheetHeader className="border-b border-hairline px-4 pb-3 pt-1 text-left sm:px-5">
          <SheetTitle className="text-sm font-semibold tracking-tight text-foreground">
            Navigate
          </SheetTitle>
        </SheetHeader>
        <nav
          className="flex flex-col gap-0.5 px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4"
          aria-label="Primary mobile"
        >
          {nav.map(({ href, label }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="touch-manipulation rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-foreground/90 transition-all [-webkit-tap-highlight-color:transparent] hover:border-primary/12 hover:bg-primary/[0.055] active:bg-foreground/[0.08]"
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
              className="mt-3 touch-manipulation rounded-lg border border-primary/30 bg-gradient-to-b from-primary/14 to-primary/[0.07] px-3 py-2.5 text-center text-sm font-semibold leading-snug tracking-tight text-primary shadow-[inset_0_1px_0_0_var(--shine-inset),0_10px_28px_-22px_var(--glow-primary)] transition-all [-webkit-tap-highlight-color:transparent] hover:border-primary/44 hover:bg-primary/12"
            >
              Strategic session
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
