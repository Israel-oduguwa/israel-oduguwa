import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownArticle } from "@/components/articles/MarkdownArticle";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { headingId } from "@/lib/markdown";
import { profile } from "@/lib/portfolio";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Israel Oduguwa`,
    description: article.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/articles/${slug}`,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updatedAt || article.date,
      authors: [profile.name],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const headings = article.body
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => ({ text: line.slice(3), id: headingId(line.slice(3)) }));
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: { "@type": "Person", name: profile.name, url: profile.url },
    mainEntityOfPage: `${profile.url}/articles/${slug}`,
  };
  return (
    <>
      <Navbar />
      <main id="main-content" className="editorial-page shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
          }}
        />
        <header className="editorial-header article-header">
          <Link href="/articles" className="text-link">
            <ArrowLeft size={17} aria-hidden="true" /> All writing
          </Link>
          <div className="tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="article-byline">
            Israel Oduguwa <span>·</span> {article.readingTime}
            <span>·</span>
            <span>
              Published <time dateTime={article.date}>{article.date}</time>
            </span>
            {article.updatedAt && (
              <span>
                Revised{" "}
                <time dateTime={article.updatedAt}>{article.updatedAt}</time>
              </span>
            )}
            {article.contextDate && (
              <span>
                Technical context{" "}
                <time dateTime={article.contextDate}>{article.contextDate}</time>
              </span>
            )}
          </div>
        </header>
        <div className="article-layout">
          <article className="article-content">
            <MarkdownArticle markdown={article.body} skipFirstHeading />
            <div className="article-end">
              <p>About the author</p>
              <strong>Israel Oduguwa</strong>
              <p>
                Senior full-stack software engineer working on platform
                architecture, payment infrastructure and AI systems. Creator of
                SafeStripe and AI evaluation expert at micro1.
              </p>
              <Link href="/#work" className="text-link">
                View my engineering work
              </Link>
            </div>
          </article>
          <aside className="article-toc">
            <nav aria-label="On this page">
              <p>On this page</p>
              {headings.map((heading) => (
                <a href={`#${heading.id}`} key={heading.id}>
                  {heading.text}
                </a>
              ))}
            </nav>
            <Link href="/work/safestripe" className="article-project-link">
              <span>Related project</span>
              <strong>SafeStripe</strong>
              <p>
                Durable operations, worker ownership and transactional business
                effects across four database adapters.
              </p>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
