import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn("text-slate-500 max-w-2xl text-lg", subtitleClassName)}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
