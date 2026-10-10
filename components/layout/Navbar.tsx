"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { profile } from "@/lib/portfolio";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Availability", href: "/#availability" },
  { label: "Writing", href: "/articles" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return (
    <header ref={container} className="site-nav">
      <div className="nav-bar">
        <Link
          href="/#top"
          className="wordmark"
          aria-label="Israel Oduguwa, home"
          onClick={() => setOpen(false)}
        >
          IO<span>.</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-resume"
          >
            Résumé <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <Link className="button primary nav-contact" href="/#contact">
            Let’s talk
          </Link>
          <button
            ref={trigger}
            className="menu-trigger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-nav"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)}>
            Contact <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </header>
  );
}
