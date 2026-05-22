import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Articles | Israel Oduguwa",
  description:
    "Technical articles on product engineering, SaaS systems, frontend architecture, and reliable web workflows.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden px-5 pb-14 pt-32 sm:px-6 md:px-8 lg:px-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_70%_20%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_18%_42%,rgba(79,70,229,0.08),transparent_28%)]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Articles
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] text-slate-950 dark:text-white sm:text-5xl md:text-6xl">
              Notes on building reliable web products.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Practical writing on product engineering, payment systems,
              frontend detail, and the decisions that make software hold up in
              real use.
            </p>
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-6 md:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-sky-300/30"
              >
                <div className="relative h-64 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 overflow-hidden bg-[#08111f]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(59,130,246,0.32),transparent_28%),radial-gradient(circle_at_76%_74%,rgba(14,165,233,0.24),transparent_30%)]" />
                      <div className="absolute inset-x-8 top-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-sm transition duration-500 group-hover:scale-[1.02]">
                        <div className="mb-4 flex gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="space-y-2">
                          <span className="block h-2 w-2/3 rounded-full bg-sky-200/55" />
                          <span className="ml-5 block h-2 w-5/6 rounded-full bg-white/20" />
                          <span className="ml-10 block h-2 w-3/5 rounded-full bg-blue-300/35" />
                          <span className="ml-5 block h-2 w-4/6 rounded-full bg-white/15" />
                        </div>
                      </div>
                      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full border border-white/10 bg-white/[0.04]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 dark:border-white/10 dark:bg-white/5">
                      <Image
                        src="/images/profile1.png"
                        alt="Israel Oduguwa"
                        width={24}
                        height={24}
                        className="rounded-full bg-slate-200 object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        Israel Oduguwa
                      </span>
                    </div>

                    {article.tags.length > 0 && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        {article.tags[0]}
                      </span>
                    )}
                  </div>

                  <h2
                    className="text-2xl font-black leading-tight text-slate-950 transition group-hover:text-primary dark:text-white dark:group-hover:text-primary md:text-3xl"
                  >
                    {article.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                    {article.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(article.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {article.readingTime}
                    </span>
                    <span className="ml-auto flex items-center justify-center rounded-full bg-slate-100 p-2 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-white/5 dark:group-hover:bg-primary">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
