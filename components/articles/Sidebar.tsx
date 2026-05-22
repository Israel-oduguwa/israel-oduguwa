import Image from "next/image";
import Link from "next/link";

import { TableOfContents } from "./TableOfContents";
import { Article } from "@/lib/articles";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function Sidebar({
  markdown,
  tags,
  relatedArticles,
}: {
  markdown: string;
  tags: string[];
  relatedArticles: Article[];
}) {
  return (
    <aside className="space-y-12">
      {/* Social Share */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-slate-900 dark:text-white">
          Share on Social Media
        </h3>
        {/* <div className="flex gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-primary">
            <Instagram className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-primary">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-primary">
            <Facebook className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-primary">
            <Linkedin className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-primary">
            <Share2 className="h-4 w-4" />
          </button>
        </div> */}
      </div>

      {/* Table of Contents */}
      <TableOfContents markdown={markdown} />

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium text-slate-900 dark:text-white">
            All Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Blogs */}
      {relatedArticles.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium text-slate-900 dark:text-white">
            Related Blogs
          </h3>
          <div className="flex flex-col gap-4">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex gap-4 rounded-xl border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/5"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-indigo-500 opacity-20 dark:opacity-40" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(article.date)}
                  </div>
                  <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
