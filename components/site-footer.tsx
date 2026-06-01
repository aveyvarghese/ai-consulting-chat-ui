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
    <footer className="relative overflow-hidden border-t border-white/5 bg-black text-white">
      <div className="relative mx-auto max-w-7xl space-y-12 px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="space-y-4 md:col-span-5">
            <Link
              href="/"
              className="inline-block text-xl font-black tracking-tight"
            >
              <span className="text-white">Pxl</span><span className="text-[#ff7f50]">Brief</span>
            </Link>
            <p className="text-xs font-light leading-relaxed text-slate-400 md:text-sm">
              Principal-led AI strategy, automation, and executive intelligence —
              installed as operating infrastructure, not slideware.
            </p>
            <p className="font-mono text-xs text-slate-300">
              <span>Direct line: </span>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="text-[#ff7f50] underline-offset-4 transition-colors duration-300 hover:underline"
              >
                {SITE_CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5 text-[11px] font-light leading-relaxed text-slate-500 md:col-span-4">
            <strong className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Strategy Sessions:
            </strong>
            <p>
              Strategy sessions and new mandates are scheduled deliberately.
              Expect a thoughtful reply — most outreach is answered within one to
              two business days.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-4 font-mono text-xs text-slate-400 md:col-span-3"
            aria-label="Footer"
          >
            <div className="flex flex-col space-y-2">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                // Navigation
              </span>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-9 touch-manipulation items-center transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                // Active AI
              </span>
              <Link
                href="/#consulting-chat"
                className="inline-flex min-h-9 touch-manipulation items-center font-bold text-[#ff7f50] transition-colors hover:text-[#ffa07a]"
              >
                Talk to PxlBrief AI
              </Link>
              <StrategicSessionBookingLink
                source="footer"
                className="inline-flex min-h-9 touch-manipulation items-center transition-colors hover:text-white"
              >
                Book Strategic Session
              </StrategicSessionBookingLink>
            </div>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 font-mono text-[10px] text-slate-600 sm:flex-row">
          <span>© {new Date().getFullYear()} PxlBrief. All rights reserved.</span>
          <span className="select-none text-slate-700">SYSTEM_SECURE_MANDATE_VERIFIED</span>
        </div>
      </div>
    </footer>
  )
}
