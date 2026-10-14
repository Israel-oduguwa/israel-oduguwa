import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAllArticles } from "@/lib/articles";
import { formatArticleDate } from "@/lib/dates";

export const metadata = {
  title: "Engineering notes | Israel Oduguwa",
  description:
    "Writing about AI benchmark design, engineering evaluation, platform architecture and payment reliability.",
  alternates: { canonical: "/articles" },
  openGraph: { url: "/articles" },
};
export default function ArticlesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="editorial-page shell">
        <header className="editorial-header">
          <p className="section-kicker">Engineering notes</p>
          <h1>Technical writing</h1>
          <p>
            Articles on AI benchmarks, engineering evaluation, platform
            architecture and payment reliability. Each one works through a specific engineering
            problem with examples and links to the relevant documentation.
          </p>
        </header>
        <div className="writing-list">
          {getAllArticles().map((article, index) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}>
              <span className="writing-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>
                  {article.tags.join(" · ")} · {article.readingTime}
                </p>
                <h3>{article.title}</h3>
                <span>{article.description}</span>
                <p className="article-date">
                  <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="editorial-footer">
          <p>Interested in the implementation behind the writing?</p>
          <Link href="/work/safestripe" className="text-link">
            Read the SafeStripe case study
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
