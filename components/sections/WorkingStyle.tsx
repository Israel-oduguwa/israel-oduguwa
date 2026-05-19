"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { Card } from "../ui/Card";

export function WorkingStyle() {
  const styles = [
    {
      title: "Product-first thinking",
      text: "I do not treat frontend work as decoration. I think through the user journey, the business goal, and what the feature needs to make clear.",
      number: "01"
    },
    {
      title: "Practical execution",
      text: "I break vague ideas into shippable pieces, make tradeoffs visible, and keep momentum without skipping the details that affect quality.",
      number: "02"
    },
    {
      title: "Clean frontend delivery",
      text: "I care about spacing, responsiveness, component structure, loading states, empty states, and the small UI decisions that make products feel reliable.",
      number: "03"
    },
    {
      title: "Reliable communication",
      text: "I can break vague ideas into clear tasks, explain tradeoffs, and give practical updates during the build.",
      number: "04"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader
          title="How I work"
          subtitle="My best work happens when the goal is clear, the product matters, and the frontend needs careful execution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {styles.map((style, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full flex flex-col gap-4 border-white/5 hover:bg-white/[0.03]">
                <div className="text-4xl font-light text-primary/30 mb-2 font-mono">
                  {style.number}
                </div>
                <h3 className="text-xl font-semibold text-white">{style.title}</h3>
                <p className="text-gray-400 leading-relaxed">{style.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
