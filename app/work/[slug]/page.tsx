import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { projects } from "@/lib/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} | Israel Oduguwa`,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.name}: engineering case study`,
      description: project.summary,
      url: `/work/${slug}`,
      images: [project.image],
    },
  };
}
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <>
      <Navbar />
      <main id="main-content" className="case-page shell">
        <Link href="/#work" className="text-link">
          <ArrowLeft size={17} aria-hidden="true" /> Selected work
        </Link>
        <header className="case-header">
          <p className="section-kicker">{project.category}</p>
          <h1>{project.name}</h1>
          <p className="case-summary">{project.summary}</p>
          <div className="case-meta">
            <div>
              <span>My role</span>
              <strong>{project.role}</strong>
            </div>
            <div>
              <span>Period</span>
              <strong>{project.period}</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>{project.tags.join(" · ")}</strong>
            </div>
          </div>
        </header>
        <figure className={`case-image ${project.theme}`}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1440}
            height={900}
            preload
            sizes="(max-width: 1200px) 94vw, 1120px"
          />
          <figcaption>
            {project.slug === "safestripe"
              ? "A teaching example from the public explainer: repeated payment updates for one payment."
              : "Public product view, captured October 2026. My contribution and work period are described below."}
          </figcaption>
        </figure>
        <div className="case-body">
          <aside className="case-aside">
            <h2>Project links</h2>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
            <div className="case-metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <p>{metric.label}</p>
                </div>
              ))}
            </div>
          </aside>
          <article className="case-narrative">
            <section>
              <h2>The problem</h2>
              <p>{project.challenge}</p>
            </section>
            <section>
              <h2>My contribution</h2>
              <p>{project.contribution}</p>
            </section>
            <section>
              <h2>Engineering decisions</h2>
              {project.decisions.map((decision, index) => (
                <div className="decision" key={decision.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{decision.title}</h3>
                    <p>{decision.body}</p>
                  </div>
                </div>
              ))}
            </section>
            <section>
              <h2>What changed</h2>
              <p>{project.result}</p>
            </section>
            <section className="case-boundary">
              <h2>Scope and evidence</h2>
              <p>{project.boundary}</p>
            </section>
          </article>
        </div>
        <div className="case-next">
          <p>Have a similar problem?</p>
          <Link className="button primary" href="/#contact">
            Discuss a project
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
