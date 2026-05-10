import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { rootMetadata } from '@/lib/seo'
import { DEFAULT_THEME, THEME_BOOT_SCRIPT } from '@/lib/theme'
import { SiteAmbient } from '@/components/site-ambient'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = rootMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth overflow-x-hidden bg-background"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
    >
      <body className="min-w-0 overflow-x-hidden font-sans antialiased">
        <Script id="pxl-theme-boot" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
        <SiteAmbient />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
