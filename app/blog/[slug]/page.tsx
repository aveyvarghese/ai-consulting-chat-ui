import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react"
import { blogPosts, getBlogPost } from "@/lib/blog-posts"
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/seo"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {}
  }

  return pageMetadata({
    path: `/blog/${post.slug}`,
    title: `${post.title} | PxlBrief Blog`,
    description: post.description,
    keywords: post.keywords,
    type: "article",
  })
}

function blogPostingJsonLd(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }}
      />
      <article>
        <section className="section-hero-dark relative overflow-hidden px-3 py-12 sm:px-4 sm:py-18 md:px-6 md:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] pxl-data-grid" aria-hidden />
          <div
            className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-primary/[0.08] blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex min-h-10 touch-manipulation items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/24 hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to insights
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <span>{post.category}</span>
              <span className="h-1 w-1 rounded-full bg-primary/45" aria-hidden />
              <span>{formatDate(post.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-primary/45" aria-hidden />
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3" aria-hidden />
                {post.readingTime}
              </span>
            </div>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {post.description}
            </p>
          </div>
        </section>

        <section className="section-deep px-3 py-10 sm:px-4 sm:py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-6 shadow-[inset_0_1px_0_0_var(--shine-inset),0_28px_80px_-58px_rgba(0,0,0,0.9)] sm:px-7 sm:py-9 md:px-10">
            <div className="space-y-8 sm:space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-[0.9375rem] leading-relaxed text-muted-foreground/92 sm:text-base sm:leading-8"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </article>

      <section className="section-cta-glow px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-primary/18 bg-primary/[0.055] p-5 text-center shadow-[inset_0_1px_0_0_var(--shine-inset),0_28px_90px_-62px_var(--glow-primary)] sm:p-8 md:p-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Next step
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Turn the article into a growth system conversation.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Use the AI Growth Audit or AI Lab tools to identify where your business should focus first.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/ai-growth-audit"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-xl border border-primary/32 bg-primary/14 px-5 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/46 hover:bg-primary/18"
            >
              Run My Growth Diagnostic
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/ai-lab"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/22 hover:bg-primary/[0.055]"
            >
              Explore AI Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
