import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock3 } from "lucide-react"
import { blogPosts } from "@/lib/blog-posts"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/blog",
  title: "PxlBrief Blog | AI, Marketing, Branding & Growth Systems",
  description:
    "Read insights on AI implementation, digital marketing, brand strategy, SEO, AEO, GEO, CRM, dashboards, and growth systems for founder-led businesses.",
})

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <section className="section-hero-dark relative overflow-hidden px-3 py-14 sm:px-4 sm:py-20 md:px-6 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.2] pxl-data-grid" aria-hidden />
        <div
          className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/[0.09] blur-3xl md:h-96 md:w-96"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary shadow-[inset_0_1px_0_0_var(--shine-inset)]">
              <BookOpen className="size-3.5" aria-hidden />
              INSIGHTS
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl">
              AI, marketing, branding, and growth systems.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Practical thinking on how founder-led businesses can use AI, digital marketing,
              brand strategy, websites, and CRM intelligence to build smarter growth systems.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-primary/28 bg-primary/12 px-5 py-3 text-sm font-semibold text-primary shadow-[inset_0_1px_0_0_var(--shine-inset),0_14px_36px_-26px_var(--glow-primary)] transition-all hover:border-primary/44 hover:bg-primary/16"
              >
                Explore services
              </Link>
              <Link
                href="/ai-growth-audit"
                className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/22 hover:bg-primary/[0.055]"
              >
                Run AI Growth Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-deep px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex min-w-0 flex-col rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_0_var(--shine-inset),0_24px_70px_-54px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/24 hover:bg-primary/[0.045] sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-primary/45" aria-hidden />
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock3 className="size-3" aria-hidden />
                  {post.readingTime}
                </span>
              </div>
              <h2 className="mt-4 text-pretty text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground/90 sm:text-[0.9375rem]">
                {post.description}
              </p>
              <div className="mt-5 text-xs font-medium text-muted-foreground/70">
                {formatDate(post.publishedAt)}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl border border-primary/22 bg-primary/[0.08] px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary/38 hover:bg-primary/12"
              >
                Read article
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
