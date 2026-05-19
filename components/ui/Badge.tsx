import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "glow";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-white/10 text-gray-200 border border-white/10": variant === "default",
          "bg-transparent text-gray-400 border border-white/20": variant === "outline",
          "bg-primary/20 text-primary-foreground border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]": variant === "glow",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
