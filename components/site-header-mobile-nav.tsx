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
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeaderMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-lg text-foreground transition-colors hover:bg-foreground/[0.06] active:bg-foreground/[0.08] [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label="Open menu"
        >
          <Menu className="size-[1.125rem]" strokeWidth={1.75} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="z-[60] w-[min(100%,20rem)] max-w-[calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-1rem)] gap-0 border-hairline bg-header-bg p-0 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(2.75rem,env(safe-area-inset-right))] shadow-xl sm:max-w-sm"
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
                className="touch-manipulation rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/[0.06] active:bg-foreground/[0.08]"
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
              className="mt-3 touch-manipulation rounded-lg border border-primary/28 bg-primary/[0.07] px-3 py-2.5 text-center text-sm font-semibold leading-snug tracking-tight text-primary shadow-sm transition-colors [-webkit-tap-highlight-color:transparent] hover:border-primary/40 hover:bg-primary/12"
            >
              Strategic session
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
