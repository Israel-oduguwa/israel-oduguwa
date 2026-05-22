"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/[^\w\s-]/g, "");
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const [activeId, setActiveId] = useState<string>("");
  
  // Extract headings
  const headings = markdown
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const depth = line.startsWith("### ") ? 3 : 2;
      const rawText = line.replace(/^(###|##)\s/, "");
      const text = rawText
        .replace(/(\*\*|`)/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1");
      const id = slugify(stripMarkdown(rawText));

      return { id, text, depth };
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Table of Contents</h3>
      <nav className="flex flex-col space-y-2">
        {headings.map((heading) => (
          <Link
            key={heading.id}
            href={`#${heading.id}`}
            className={`text-sm transition-colors hover:text-primary ${
              heading.depth === 3 ? "ml-4" : ""
            } ${
              activeId === heading.id
                ? "font-medium text-primary"
                : "text-slate-600 dark:text-slate-400"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
              });
              setActiveId(heading.id);
            }}
          >
            {heading.text}
          </Link>
        ))}
      </nav>
    </div>
  );
}
