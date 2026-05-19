"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-12 md:p-20 text-center border border-white/10 relative overflow-hidden"
        >
          {/* Inner glow */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-3xl mx-auto">
            Need a frontend-heavy full-stack developer?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            I can help build clean product interfaces, dashboards, onboarding flows, and the full-stack pieces behind them.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = 'mailto:oduguwa.israel22@gmail.com'}>
              Contact Me
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => window.open('/resume.pdf', '_blank')}>
              Download Resume
            </Button>
            <a href="#work" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                View Projects
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
