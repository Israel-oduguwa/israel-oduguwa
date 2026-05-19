"use client";

import React from "react";
import { motion } from "framer-motion";

export function Marquee() {
  const items = [
    "SaaS Platforms",
    "Product Dashboards",
    "AI-Powered Features",
    "Web Apps",
    "Admin Systems",
    "Onboarding Flows",
    "Automation Workflows",
    "API Integration",
    "React texts",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Performance",
  ];

  // Duplicate items to ensure smooth infinite scrolling
  const marqueeItems = [...items, ...items];

  return (
    <section className="relative overflow-hidden py-6 md:py-8">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-900/10 to-transparent dark:via-white/10" />

      <div className="relative mx-auto w-full max-w-[92rem] px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 px-0 py-4 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.9)] ring-1 ring-white/10 dark:border-white/10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

          <motion.div
            className="flex w-max min-w-full items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 34,
            }}
          >
            {marqueeItems.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span className="mx-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold tracking-[0.02em] text-white/90 shadow-inner shadow-white/[0.03] md:mx-4 md:px-5 md:text-base">
                  {item}
                </span>
                <span className="mx-2 text-base font-black text-fuchsia-300 md:mx-3 md:text-lg">
                  ✦
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
