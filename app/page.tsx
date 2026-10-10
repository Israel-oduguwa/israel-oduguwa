import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  FileDown,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import Availability from "@/components/sections/Availability";
import { credentials, experience, profile, projects } from "@/lib/portfolio";
import { getAllArticles } from "@/lib/articles";

const capabilities = [
  {
    icon: Layers,
    title: "Product engineering",
    description:
      "Interfaces, APIs and data models that support the same user journey. React, Next.js, Node.js, TypeScript and Python.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable systems",
    description:
      "Payment state, retries, identity migrations and asynchronous jobs. I make the failure paths part of the design.",
  },
  {
    icon: Sparkles,
    title: "Applied AI",
    description:
      "Retrieval and recommendation services, agent workflows and media pipelines, with evaluation criteria and bounded execution.",
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
      <main id="main-content">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="intro">
              <span className="status-dot" /> Senior Full Stack Software
              Engineer
            </p>
            <h1 id="hero-title">
              Israel
              <br />
              Oduguwa<span>.</span>
            </h1>
            <p className="hero-description">
              I build and maintain web applications, from the interface to
              backend services and deployment. My recent work includes KinsCare,
              Excel Health Careers, and SafeStripe. I also work on AI
              integrations and software-engineering evaluations.
            </p>
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
            <p className="hero-location">
              Lagos, Nigeria · Remote with teams across time zones
            </p>
          </div>
          <div className="portrait-frame">
            <div className="portrait-glow" aria-hidden="true" />
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
          </div>
        </section>
        <div className="proof-strip shell">
          <p>
            Results from
            <br />
            <strong>selected projects</strong>
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
            <GitBranch size={22} aria-hidden="true" />
            <span>
              SafeStripe
              <br />
              <strong>Open-source reliability work</strong>
            </span>
          </div>
        </div>

        <section id="work" className="section shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2>Selected projects</h2>
            </div>
            <p className="section-description">
              A closer look at SafeStripe, KinsCare and Excel Health Careers:
              what I built, the decisions I made, and how the work helped each
              product.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className={`project-card ${index === 0 ? "featured" : ""}`}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className={`project-visual ${project.theme}`}
                  aria-label={`Read the ${project.name} case study`}
                >
                  <div className="browser-chrome" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <div>
                      {project.slug === "safestripe"
                        ? "safestripe · recovery explained"
                        : project.slug === "kinscare"
                          ? "kinscare.org"
                          : "excelcna.com"}
                    </div>
                  </div>
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    width={1440}
                    height={900}
                    sizes={
                      index === 0
                        ? "(max-width: 800px) 90vw, 600px"
                        : "(max-width: 800px) 90vw, 550px"
                    }
                    className="project-screenshot"
                  />
                </Link>
                <div className="project-copy">
                  <p className="project-category">{project.category}</p>
                  <h3>
                    <Link href={`/work/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p>{project.summary}</p>
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
              <p className="section-kicker">Experience</p>
              <h2>Work experience</h2>
              <p className="section-description">
                My professional work started in 2020. I’ve worked on product
                features, backend systems, technical leadership and AI model
                evaluation.
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
                <article key={item.company}>
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
          <div className="about-grid">
            <div>
              <p className="section-kicker">About me</p>
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
                University and graduated in 2022. Today, I work across
                full-stack development and applied AI. I care about how
                engineering decisions affect the people using a product, its
                operating costs, and the team maintaining it.
              </p>
            </div>
          </div>
          <div className="capabilities">
            {capabilities.map((item) => (
              <article key={item.title}>
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
          <div className="section-heading">
            <div>
              <p className="section-kicker">Certificates</p>
              <h2 id="credentials-title">AI coursework</h2>
            </div>
            <p className="section-description">
              Two courses I completed alongside my engineering work. You can
              open the original certificates or verify them with the provider.
            </p>
          </div>
          <div className="credentials-grid">
            {credentials.map((cert) => (
              <article key={cert.verify} className="credential-card">
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
          <div className="section-heading">
            <div>
              <p className="section-kicker">Engineering notes</p>
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
