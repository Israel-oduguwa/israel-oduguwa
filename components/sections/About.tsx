"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section
      className="relative overflow-hidden border-y border-slate-200 bg-background py-16 dark:border-white/10 md:py-20"
      id="about"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[90px] dark:bg-primary/5" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            About
          </p>
          <p className="text-xl font-semibold leading-9 text-slate-900 text-balance dark:text-white md:text-3xl md:leading-[1.45]">
            I&apos;m Israel, a full-stack software engineer who turns messy
            product needs into clean web experiences. I care about interfaces
            that feel clear, workflows that hold together, and software that
            helps the business move faster.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
