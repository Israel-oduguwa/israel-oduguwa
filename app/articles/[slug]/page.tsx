import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { MarkdownArticle } from "@/components/articles/MarkdownArticle";
import { Sidebar } from "@/components/articles/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Israel Oduguwa",
    };
  }

  return {
    title: `${article.title} | Israel Oduguwa`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const allArticles = getAllArticles();
  let relatedArticles = allArticles
    .filter((a) => a.slug !== slug && a.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 3);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <article className="mx-auto max-w-7xl px-5 pb-28 pt-32 sm:px-6 md:px-8 lg:px-12">
          {/* Header Area */}
          <header className="mb-12 border-b border-slate-200 pb-10 dark:border-white/10">
            <Link
              href="/articles"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Home • Our Blogs • {article.tags[0] || "Articles"}
            </Link>

            <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[1.1] text-slate-950 dark:text-white md:text-6xl">
              {article.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-4 dark:border-white/10 dark:bg-white/5">
                <Image
                  src="/images/profile1.png"
                  alt="Israel Oduguwa"
                  width={28}
                  height={28}
                  className="rounded-full bg-slate-200 object-cover"
                />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Israel Oduguwa
                </span>
              </div>

              {article.tags.length > 0 && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {article.tags[0]}
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                <Clock className="h-4 w-4" />
                {article.readingTime}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.date)}
              </span>
            </div>
          </header>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:bg-slate-800">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 768px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="relative h-full w-full overflow-hidden bg-[#08111f]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(59,130,246,0.32),transparent_28%),radial-gradient(circle_at_76%_74%,rgba(14,165,233,0.24),transparent_30%)]" />
                    <div className="absolute inset-x-10 top-10 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm">
                      <div className="mb-6 flex gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="space-y-3">
                        <span className="block h-2.5 w-2/3 rounded-full bg-sky-200/55" />
                        <span className="ml-6 block h-2.5 w-5/6 rounded-full bg-white/20" />
                        <span className="ml-12 block h-2.5 w-3/5 rounded-full bg-blue-300/35" />
                        <span className="ml-6 block h-2.5 w-4/6 rounded-full bg-white/15" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="prose-lg">
                <MarkdownArticle
                  markdown={article.body}
                  skipFirstHeading
                  skipFirstImage={Boolean(article.coverImage)}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <Sidebar
                  markdown={article.body}
                  tags={article.tags}
                  relatedArticles={relatedArticles}
                />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
