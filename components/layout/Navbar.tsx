"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonClasses } from "../ui/Button";
import { Download, Menu, Send, X } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AnimatedLogo } from "../ui/AnimatedLogo";

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#process" },
  { name: "Availability", href: "#availability" },
  { name: "Contact", href: "#contact" },
];

const darkSectionIds = ["process", "availability"];
const resumeUrl =
  "https://drive.google.com/file/d/1fCmYZ8ps7-5nYRNf2RHBXdXlzMEDRtuB/view?usp=sharing";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isScrolledRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    const updateScrolled = () => {
      frame = 0;
      const nextIsScrolled = window.scrollY > 20;

      if (isScrolledRef.current !== nextIsScrolled) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const darkSections = darkSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (darkSections.length === 0) return;

    const visibleDarkSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleDarkSections.add(entry.target.id);
          } else {
            visibleDarkSections.delete(entry.target.id);
          }
        }

        setIsOverDarkSection(visibleDarkSections.size > 0);
      },
      {
        rootMargin: "-56px 0px -72% 0px",
        threshold: 0,
      },
    );

    darkSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        <motion.div
          className={`pointer-events-auto flex items-center justify-between transition-[width,max-width,background-color,box-shadow,padding,border-radius,color,border-color] duration-500 ${
            isOverDarkSection
              ? "mx-auto w-[calc(100%-2rem)] max-w-5xl rounded-full border border-white/12 bg-[#050816]/78 px-5 py-3 text-white shadow-[0_24px_80px_rgba(0,0,0,0.36)] ring-1 ring-white/10 backdrop-blur-xl lg:px-6"
              : isScrolled
                ? "mx-auto w-[calc(100%-2rem)] max-w-5xl rounded-full border border-card-border bg-card/80 px-5 py-3 text-foreground shadow-2xl backdrop-blur-xl dark:border-white/12 dark:bg-[#050816]/76 dark:text-white dark:shadow-[0_24px_80px_rgba(0,0,0,0.34)] dark:ring-1 dark:ring-white/10 lg:px-6"
                : "w-full container mx-auto px-6 md:px-12 py-3 bg-transparent text-foreground"
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <a
            href="#top"
            className="z-50 scale-90 md:scale-100 origin-left"
            onClick={() => setMobileMenuOpen(false)}
          >
            <AnimatedLogo />
          </a>

          <div className="hidden items-center gap-5 lg:flex lg:gap-7">
            <nav className="flex items-center gap-5 lg:gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(link.href.slice(1))}
                  className={`relative pb-1 font-semibold transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-1/2 after:origin-left after:rounded-full after:transition-transform after:duration-300 ${
                    activeSection === link.href.slice(1)
                      ? isOverDarkSection
                        ? "text-white after:scale-x-100 after:bg-white"
                        : "text-foreground after:scale-x-100 after:bg-foreground"
                      : isOverDarkSection
                        ? "text-white/68 after:scale-x-0 after:bg-white hover:text-white"
                        : "text-muted-foreground after:scale-x-0 after:bg-foreground hover:text-foreground/85"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div
              className={`h-5 w-px ${isOverDarkSection ? "bg-white/15" : "bg-card-border"}`}
            />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({
                  variant: "secondary",
                  className: isOverDarkSection
                    ? "h-11 gap-2 rounded-full border-white/15 bg-white/10 px-5 text-white shadow-none hover:bg-white/15"
                    : "h-11 gap-2 rounded-full border-slate-200 bg-white px-5 text-slate-950 shadow-sm hover:bg-slate-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
                })}
              >
                <Download size={16} />
                Resume
              </a>
              <a
                href="mailto:oduguwa.israel22@gmail.com"
                className={buttonClasses({
                  variant: "primary",
                  className:
                    isOverDarkSection
                      ? "h-11 rounded-full bg-primary px-5 text-white shadow-[0_18px_40px_-20px_rgba(37,99,235,0.9)] hover:bg-blue-700 hover:text-white"
                      : "h-11 rounded-full bg-primary px-5 text-white shadow-[0_18px_40px_-20px_rgba(37,99,235,0.75)] hover:bg-blue-700 hover:text-white",
                })}
              >
                Contact Me
              </a>
            </div>
          </div>

          <div className="z-50 flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isOverDarkSection
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-foreground/5 text-foreground hover:bg-foreground/10"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="fixed inset-0 z-40 flex flex-col bg-background/95 px-6 pt-32 pb-6 backdrop-blur-2xl dark:bg-[#050816]/94 lg:hidden"
          >
            <nav className="flex flex-col gap-8 items-center justify-center h-full pb-20">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.href.slice(1));
                    setMobileMenuOpen(false);
                  }}
                  className={`relative pb-2 text-4xl font-bold tracking-tight transition-colors after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-1/2 after:origin-left after:rounded-full after:bg-foreground after:transition-transform after:duration-300 ${
                    activeSection === link.href.slice(1)
                      ? "text-foreground after:scale-x-100"
                      : "text-muted-foreground after:scale-x-0 hover:text-foreground/85"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-8 w-full max-w-xs">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "mb-3 h-14 w-full gap-2 rounded-full border-slate-200 bg-white px-8 text-lg font-semibold text-slate-950 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white",
                  })}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Download className="h-5 w-5" />
                  Download Resume
                </a>
                <a
                  href="mailto:oduguwa.israel22@gmail.com"
                  className={buttonClasses({
                    variant: "primary",
                    size: "lg",
                    className:
                      "group relative h-14 w-full overflow-hidden rounded-full bg-primary px-8 text-lg font-semibold text-white shadow-[0_20px_55px_-18px_rgba(37,99,235,0.5)] ring-1 ring-white/25 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-700 hover:text-white hover:shadow-[0_26px_70px_-20px_rgba(37,99,235,0.7)]",
                  })}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
                  Contact Me
                  <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
