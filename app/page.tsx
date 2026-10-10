import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  FileDown,
  ShieldCheck,
  Braces,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import Availability from "@/components/sections/Availability";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { PageMotion } from "@/components/ui/PageMotion";
import { credentials, experience, profile, projects } from "@/lib/portfolio";
import { getAllArticles } from "@/lib/articles";

const capabilities = [
  {
    icon: Layers,
    title: "Product engineering",
    description:
      "I connect React and Next.js interfaces to Node.js and Python services, with the data models and deployment needed to run them.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable systems",
    description:
      "I build payment recovery, background jobs and identity migrations. I test what happens when requests repeat or a process stops.",
  },
  {
    icon: Braces,
    title: "Applied AI",
    description:
      "I’ve built recommendations and automated media workflows, and reviewed model-generated code against specific engineering tasks.",
  },
];

export default function Home() {
  const articles = getAllArticles().slice(0, 3);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.url,
    jobTitle: "Senior Full Stack Software Engineer",
    email: `mailto:${profile.email}`,
    sameAs: [profile.github],
    knowsAbout: [
      "TypeScript",
      "Next.js",
      "Node.js",
      "Payment systems",
      "LLM evaluation",
      "Software architecture",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <PageMotion />
      <main id="main-content">
        <div className="reading-progress" aria-hidden="true" />
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="intro">
              <span className="status-dot" /> Senior Full Stack Software
              Engineer
            </p>
            <h1 id="hero-title">
              <span className="hero-first-name">Israel</span>
              <br />
              Oduguwa<span className="hero-period">.</span>
            </h1>
            <p className="hero-description">
              Web applications, payment systems and AI features. I work across
              the interface, APIs, databases and deployment.
            </p>
            <div className="hero-client-links" aria-label="Recent projects">
              <a href="#work">SafeStripe</a>
              <span aria-hidden="true">/</span>
              <Link href="/work/kinscare">KinsCare</Link>
              <span aria-hidden="true">/</span>
              <Link href="/work/excelcna">Excel Health Careers</Link>
            </div>
            <div className="hero-actions">
              <a href="#work" className="button primary">
                View my work <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a
                href={profile.resume}
                className="button secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read my résumé <FileDown size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-availability">
              <span /> Open to full-time and contract roles
            </p>
          </div>
          <div className="portrait-frame">
            <div className="portrait-backdrop" aria-hidden="true" />
            <svg
              className="portrait-orbit"
              viewBox="0 0 520 600"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M56 486C-36 361 47 80 267 44C493 9 548 301 454 473"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M82 517C-19 465 17 157 215 94C414 30 545 191 500 414"
                stroke="currentColor"
                strokeOpacity=".25"
              />
              <circle cx="267" cy="44" r="7" fill="currentColor" />
              <path
                d="M435 97V125M421 111H449"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <Image
              src="/images/profile.png"
              alt="Israel Oduguwa"
              width={1123}
              height={1401}
              unoptimized
              preload
              sizes="(max-width: 700px) 80vw, 450px"
              className="portrait"
            />
            <div className="portrait-note">
              <Braces size={20} aria-hidden="true" />
              <div>
                <strong>Web applications & services</strong>
                <span>TypeScript · Node.js · Python</span>
              </div>
            </div>
          </div>
        </section>
        <div className="proof-strip shell">
          <p>
            <span className="proof-caption">Selected results</span>
            <a href="#work">
              See the work <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </p>
          <div>
            <strong>&gt;75%</strong>
            <span>
              Lower infrastructure spend
              <br />
              at KinsCare
            </span>
          </div>
          <div>
            <strong>+73%</strong>
            <span>
              Completed enrollments
              <br />
              at Excel Health Careers
            </span>
          </div>
          <div>
            <strong>8,000+</strong>
            <span>
              Successful transactions
              <br />
              at Excel Health Careers
            </span>
          </div>
        </div>

        <section id="work" className="section shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-kicker">
                <span>01</span> Work
              </p>
              <h2>
                Selected projects<span className="heading-period">.</span>
              </h2>
            </div>
            <p className="section-description">
              Payment recovery, healthcare hiring and student enrollment. Here’s
              what I built and what changed.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className={`project-card ${index === 0 ? "featured" : ""}`}
                data-reveal
              >
                <ProjectVisual project={project} />
                <div className="project-copy">
                  <p className="project-category">
                    <span className="project-number">0{index + 1}</span>
                    {project.category}
                  </p>
                  <h3>
                    <Link href={`/work/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p>{project.summary}</p>
                  {index > 0 && (
                    <div className="project-outcome">
                      <strong>{project.metrics[0].value}</strong>
                      <span>{project.metrics[0].label}</span>
                    </div>
                  )}
                  <div className="tags">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <Link href={`/work/${project.slug}`} className="text-link">
                    Read the case study{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                  {index === 0 && (
                    <p className="preview-note">
                      0.3 evaluation preview · public tests and limitations
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="experience-section">
          <div className="shell experience-grid">
            <div className="experience-intro">
              <p className="section-kicker">
                <span>02</span> Experience
              </p>
              <h2>Work experience</h2>
              <p className="section-description">
                Professional engineering since 2020: web products, payments,
                technical leadership and AI evaluation.
              </p>
              <a
                href={profile.resume}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download full résumé <FileDown size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="experience-list">
              {experience.map((item) => (
                <article key={item.company} data-reveal>
                  <p className="experience-date">{item.period}</p>
                  <h3>{item.company}</h3>
                  <p className="experience-role">{item.role}</p>
                  <p>{item.description}</p>
                  {item.project && (
                    <Link href={item.project} className="text-link">
                      See the work <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section shell">
          <div className="about-grid" data-reveal>
            <div>
              <p className="section-kicker">
                <span>03</span> About me
              </p>
              <h2>How I got started</h2>
            </div>
            <div className="about-copy">
              <p>
                I started programming in early 2015 because I was interested in
                making mobile games. I explored Scratch and Python, then
                completed Harvard’s CS50, which introduced me to algorithms and
                computer science.
              </p>
              <p>
                Later that year, I started learning HTML, CSS and JavaScript. I
                kept building web applications, and began working professionally
                in 2020. Since then, I’ve worked on career tools, training
                platforms, healthcare marketplaces and payment systems.
              </p>
              <p>
                I studied Food Science and Technology at Obafemi Awolowo
                University and graduated in 2022. In software, I’m interested in
                the decisions behind a product: how users complete a task, what
                it costs to run, and how the team fixes it when it fails.
              </p>
            </div>
          </div>
          <div className="capabilities">
            {capabilities.map((item) => (
              <article key={item.title} data-reveal>
                <item.icon size={25} strokeWidth={1.6} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="credentials-section shell"
          aria-labelledby="credentials-title"
        >
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-kicker">
                <span>04</span> Certificates
              </p>
              <h2 id="credentials-title">AI coursework</h2>
            </div>
            <p className="section-description">
              Two courses I completed alongside my engineering work. You can
              open the original certificates or verify them with the provider.
            </p>
          </div>
          <div className="credentials-grid">
            {credentials.map((cert) => (
              <article
                key={cert.verify}
                className="credential-card"
                data-reveal
              >
                <a
                  href={cert.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open certificate: ${cert.title}`}
                >
                  <Image
                    src={cert.image}
                    alt={`${cert.issuer} certificate issued to Israel Oduguwa`}
                    width={1000}
                    height={750}
                    sizes="(max-width: 700px) 90vw, 260px"
                  />
                </a>
                <div>
                  <p className="credential-issuer">
                    {cert.issuer} · {cert.date}
                  </p>
                  <h3>{cert.title}</h3>
                  <p>{cert.description}</p>
                  <a
                    href={cert.verify}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify credential{" "}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell" aria-labelledby="writing-title">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-kicker">
                <span>05</span> Writing
              </p>
              <h2 id="writing-title">Technical writing</h2>
            </div>
            <Link href="/articles" className="text-link">
              All writing <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="writing-list">
            {articles.map((article, index) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <span className="writing-number">0{index + 1}</span>
                <div>
                  <p>
                    {article.tags.join(" · ")} · {article.readingTime}
                  </p>
                  <h3>{article.title}</h3>
                  <span>{article.description}</span>
                </div>
                <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
        <Availability />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
