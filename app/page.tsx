import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ValueProp } from "@/components/sections/ValueProp";
import { Projects } from "@/components/sections/Projects";
import Availability from "@/components/sections/Availability";
import { Contact } from "@/components/sections/Contact";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Israel Oduguwa",
  url: "https://israeloduguwa.com",
  jobTitle: "Frontend-Heavy Full-Stack Engineer",
  email: "mailto:oduguwa.israel22@gmail.com",
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "SaaS dashboards",
    "Product interfaces",
    "Web performance",
    "Technical SEO",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Projects />
        {/* <ValueProp /> */}
        <Availability />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
