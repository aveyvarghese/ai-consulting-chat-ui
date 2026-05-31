import Link from "next/link"
import { StrategicSessionBookingLink } from "@/components/strategic-session-booking-link"
import { SITE_CONTACT_EMAIL } from "@/lib/contact"

const links = [
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteFooter() {
  return (
    <footer className="relative border-t border-hairline bg-chrome-bar">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25] pxl-data-grid"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-3 py-9 sm:px-4 sm:py-14 md:px-6 md:py-20">
        <div className="grid gap-7 md:grid-cols-[minmax(0,1.15fr)_auto] md:items-start md:gap-16">
          <div className="max-w-xl">
            <Link
              href="/"
              className="inline-block text-lg font-semibold tracking-tight text-foreground md:text-xl"
            >
              Pxl<span className="text-primary">Brief</span>
            </Link>
            <p className="mt-3 text-[0.875rem] font-medium leading-relaxed tracking-tight text-foreground/90 sm:mt-5 sm:text-[0.9375rem] md:text-base md:leading-relaxed">
              Principal-led AI strategy, automation, and executive intelligence —
              installed as operating infrastructure, not slideware.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/85 sm:mt-6 md:text-[0.9375rem] md:leading-relaxed">
              <span className="font-medium text-foreground/80">Direct line: </span>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="text-primary underline-offset-4 transition-colors duration-300 hover:text-primary/85 hover:underline"
              >
                {SITE_CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-3 max-w-md text-[0.8125rem] leading-relaxed text-muted-foreground/75 sm:mt-4 md:text-sm">
              Strategy sessions and new mandates are scheduled deliberately.
              Expect a thoughtful reply — most outreach is answered within one to
              two business days.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-1 sm:flex-row sm:items-start sm:gap-10 md:flex-col md:gap-3"
            aria-label="Footer"
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-9 touch-manipulation items-center text-sm font-medium text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground sm:min-h-11"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#consulting-chat"
              className="inline-flex min-h-9 touch-manipulation items-center text-sm font-medium text-primary transition-colors duration-300 hover:text-primary/88 sm:min-h-11"
            >
              Talk to PxlBrief AI
            </Link>
            <StrategicSessionBookingLink
              source="footer"
              className="inline-flex min-h-9 touch-manipulation items-center text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/88 sm:min-h-11"
            >
              Book Strategic Session
            </StrategicSessionBookingLink>
          </nav>
        </div>
      </div>
      <div className="relative border-t border-hairline/60 py-3.5 text-center text-[0.6875rem] text-muted-foreground/55 sm:py-5 md:text-xs">
        © {new Date().getFullYear()} PxlBrief. All rights reserved.
      </div>
    </footer>
  )
}
