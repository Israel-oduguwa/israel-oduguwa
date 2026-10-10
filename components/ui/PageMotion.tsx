"use client";

import { useEffect } from "react";

export function PageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (
      preference.matches ||
      connection?.saveData ||
      !("IntersectionObserver" in window)
    )
      return;

    const elements = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );

    // Only defer offscreen content; the first screen never waits for JavaScript.
    for (const element of elements) {
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      element.classList.add("reveal-pending");
      observer.observe(element);
    }

    const restore = () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("reveal-pending"));
    };
    const onPreferenceChange = () => {
      if (preference.matches) restore();
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      restore();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);
  return null;
}
