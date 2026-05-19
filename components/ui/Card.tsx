import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function Card({ className, children, gradient = false, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl glass overflow-hidden",
        gradient && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
