import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="editorial-page shell">
        <header className="editorial-header">
          <p className="section-kicker">Page not found</p>
          <h1>This page isn’t here.</h1>
          <p>
            The link may have changed. You can find the projects and writing
            from the homepage.
          </p>
        </header>
        <Link className="button primary" href="/">
          Back to the portfolio
        </Link>
      </main>
      <Footer />
    </>
  );
}
