import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function buttonClasses({
  className,
  variant = "primary",
  size = "md",
}: {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-[transform,background-color,color,border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
    {
      "bg-white text-black hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]": variant === "primary",
      "bg-white/10 text-white hover:bg-white/20 border border-white/5": variant === "secondary",
      "bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5": variant === "outline",
      "bg-transparent text-gray-300 hover:text-white hover:bg-white/5": variant === "ghost",
      "h-9 px-4 text-sm": size === "sm",
      "h-11 px-6 text-base": size === "md",
      "h-14 px-8 text-lg": size === "lg",
    },
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ className, variant, size })}
      {...props}
    >
      {children}
    </button>
  );
}
