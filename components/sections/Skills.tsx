"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { Card } from "../ui/Card";

export function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "ShadCN UI", "Responsive UI", "Component architecture"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Firebase / Firestore", "Authentication flows", "Server-side rendering"],
    },
    {
      title: "AI & Automation",
      skills: ["OpenAI API", "Structured outputs", "n8n automation", "Content workflows", "Prompted features", "Workflow planning"],
    },
    {
      title: "Product & Growth",
      skills: ["SaaS dashboards", "Onboarding flows", "Admin panels", "Landing pages", "Conversion tracking", "GA4", "GTM", "Mixpanel", "VWO", "Microsoft Clarity"],
    },
  ];

  return (
    <section className="py-24 relative bg-black/30" id="skills">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader
          title="Technical Skills"
          subtitle="The tools I use most often across frontend-heavy product work and full-stack implementation."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full border-white/5 hover:border-white/20 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-primary/50 block" />
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-white/5 rounded-md border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
