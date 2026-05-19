"use client";

import React from "react";
import { motion } from "framer-motion";

export function Trust() {
  const domains = [
    "SaaS product development",
    "Marketplace workflows",
    "Healthcare training platform",
    "Dashboard and admin UI",
    "Automation and analytics",
    "Landing pages and tracking",
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-black/40">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
          Built across real product challenges
        </h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {domains.map((domain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-gray-400 font-medium whitespace-nowrap px-4 py-2 bg-white/5 rounded-full border border-white/10"
            >
              {domain}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
