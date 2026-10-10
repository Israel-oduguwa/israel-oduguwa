import Link from "next/link";
import { profile } from "@/lib/portfolio";

export function Footer() {
  return (
    <footer className="site-footer shell">
      <div>
        <Link href="/#top" className="wordmark" aria-label="Back to home">
          IO<span>.</span>
        </Link>
        <p>Israel Oduguwa · Software engineer</p>
      </div>
      <div className="footer-links">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <Link href="/articles">Writing</Link>
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
        <a href={`mailto:${profile.email}`}>Email</a>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} Israel Oduguwa</p>
    </footer>
  );
}
