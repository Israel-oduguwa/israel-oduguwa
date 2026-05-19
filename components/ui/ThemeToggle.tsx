"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full" />; // Placeholder
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label="Toggle theme"
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{
          rotate: isDark ? -90 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <mask id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.circle
            initial={false}
            animate={{
              cx: isDark ? 12 : 30,
              cy: isDark ? 4 : 0,
              r: isDark ? 9 : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            fill="black"
          />
        </mask>

        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#moon-mask)"
          initial={false}
          animate={{
            r: isDark ? 9 : 5,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />

        <motion.g
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          stroke="currentColor"
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </button>
  );
}
