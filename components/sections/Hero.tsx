"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { buttonClasses } from "../ui/Button";
import { ArrowRight, Send } from "lucide-react";

const syntaxSnippets = [
  {
    text: "const dev = true;",
    className:
      "left-[5%] top-[22%] hidden rotate-[-8deg] md:block lg:left-[8%]",
    delay: 0,
  },
  {
    text: "<Product />",
    className: "right-[6%] top-[24%] rotate-[10deg] md:right-[10%]",
    delay: 0.6,
  },
  {
    text: "ship.clean();",
    className:
      "bottom-[10%] left-[8%] hidden rotate-[7deg] lg:block xl:left-[14%]",
    delay: 1.1,
  },
];

const MotionImage = motion.create(Image);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function HeroDecorations({
  enableAmbientMotion,
}: {
  enableAmbientMotion: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAmbientMotion && !shouldReduceMotion;
  const floatTransition = (delay = 0) =>
    !shouldAnimate
      ? { duration: 0 }
      : {
          duration: 7,
          delay,
          repeat: Infinity,
          repeatType: "mirror" as const,
          ease: "easeInOut" as const,
        };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-[2%] top-[44%] h-24 w-24 rounded-full border border-white/35 bg-white/12 shadow-[inset_18px_18px_40px_rgba(255,255,255,0.22),inset_-20px_-20px_42px_rgba(59,130,246,0.12),0_28px_80px_rgba(37,99,235,0.16)] backdrop-blur-xl dark:border-white/15 dark:bg-white/8 md:h-32 md:w-32"
        animate={!shouldAnimate ? undefined : { y: [-10, 14], x: [0, 8] }}
        transition={floatTransition(0.2)}
      />
      <motion.div
        className="absolute right-[4%] top-[42%] h-28 w-28 rounded-[38%_62%_45%_55%] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(148,163,184,0.28)_42%,rgba(15,23,42,0.38))] opacity-70 shadow-[0_28px_70px_rgba(15,23,42,0.18)] dark:opacity-45 md:right-[12%] md:h-36 md:w-36"
        animate={
          !shouldAnimate
            ? undefined
            : { y: [12, -14], rotate: [8, -4], scale: [1, 1.04] }
        }
        transition={floatTransition(0.4)}
      />
      <motion.div
        className="absolute bottom-[10%] right-[18%] hidden h-20 w-20 rotate-[-12deg] rounded-[1.5rem] bg-[linear-gradient(145deg,#f8fafc,#c7d2fe)] shadow-[18px_18px_40px_rgba(15,23,42,0.18),-12px_-12px_36px_rgba(255,255,255,0.65)] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.22),rgba(99,102,241,0.2))] dark:shadow-[18px_18px_40px_rgba(0,0,0,0.35)] md:block"
        animate={
          !shouldAnimate ? undefined : { y: [-8, 12], rotate: [-12, -4] }
        }
        transition={floatTransition(0.8)}
      >
        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/85 shadow-[0_10px_26px_rgba(37,99,235,0.35)]" />
      </motion.div>

      {syntaxSnippets.map((snippet) => (
        <motion.div
          key={snippet.text}
          className={`absolute rounded-2xl border border-slate-900/10 bg-white/72 px-4 py-2 font-mono text-xs font-semibold text-slate-800 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:text-sky-100 ${snippet.className}`}
          animate={
            !shouldAnimate ? undefined : { y: [-6, 10], opacity: [0.72, 0.98] }
          }
          transition={floatTransition(snippet.delay)}
        >
          <span className="text-primary">{"{"}</span>
          {snippet.text}
          <span className="text-accent">{"}"}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SketchUnderline({
  children,
  className = "",
  delay = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.svg
        viewBox="0 0 220 28"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-2 left-0 z-0 hidden h-[0.22em] w-full overflow-visible text-primary sm:block"
      >
        <motion.path
          d="M4 17 C42 6 74 26 112 14 C148 3 181 18 216 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M10 23 C56 14 82 29 126 19 C164 10 188 22 214 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-accent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.7, delay: delay + 0.18, ease: "circOut" }}
        />
      </motion.svg>
    </span>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const canUsePointerTilt = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
  );
  const enableAmbientMotion = canUsePointerTilt && !shouldReduceMotion;

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 40,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 40,
    stiffness: 150,
  });

  const updateBounds = useCallback(() => {
    boundsRef.current = containerRef.current?.getBoundingClientRect() ?? null;
  }, []);

  useEffect(() => {
    if (!canUsePointerTilt) {
      boundsRef.current = null;
      return;
    }

    updateBounds();
    window.addEventListener("resize", updateBounds, { passive: true });
    return () => window.removeEventListener("resize", updateBounds);
  }, [canUsePointerTilt, updateBounds]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canUsePointerTilt) return;

    const rect = boundsRef.current;
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={updateBounds}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-36 pb-16 md:pt-40 md:pb-24 overflow-hidden flex flex-col justify-center min-h-[90vh] perspective-1000 bg-background"
    >
      {/* 1. Global Subtle Grid / Noise */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMSkiLz48L3N2Zz4=')",
        }}
      />
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUwLCAxNTAsIDE1MCwgMC4yKSIvPjwvc3ZnPg==')] opacity-40 dark:opacity-20 mask-image-radial-gradient pointer-events-none"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at center, black 40%, transparent 80%)",
        }}
      />
      <HeroDecorations enableAmbientMotion={enableAmbientMotion} />

      {/* 2. Global Abstract SVG Paths & Waves */}
      <svg
        className="absolute inset-0 hidden w-full h-full opacity-30 dark:opacity-20 pointer-events-none md:block"
        aria-hidden="true"
      >
        <path
          d="M-100 200 Q 300 300 500 100 T 1200 250"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="text-primary/40"
        />
        <path
          d="M-100 600 Q 400 500 600 700 T 1400 500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="text-accent/40"
        />
      </svg>

      {/* 3. Global Gradient Blobs / Orbs */}
      <motion.div
        className="absolute -top-32 -right-32 hidden w-96 h-96 bg-primary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none md:block"
        animate={
          !enableAmbientMotion
            ? undefined
            : { scale: [1, 1.2, 1], x: [0, -30, 0] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -left-32 hidden w-80 h-80 bg-accent/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none md:block"
        animate={
          !enableAmbientMotion
            ? undefined
            : { scale: [1, 1.5, 1], y: [0, 40, 0] }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute -bottom-40 right-1/4 hidden w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none md:block"
        animate={
          !enableAmbientMotion
            ? undefined
            : { scale: [1, 1.3, 1], x: [0, 30, 0] }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* 4. Global Floating Product Badges */}

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Column: Typography */}
        <div className="z-20 flex w-full max-w-[20rem] flex-col items-start text-left min-[380px]:max-w-[21rem] sm:max-w-none lg:col-span-7">
          <motion.h1
            className="mb-8 w-full text-[2.3rem] font-black leading-[1.04] tracking-tighter text-foreground min-[380px]:text-[2.45rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            From <SketchUnderline delay={0.55}>idea</SketchUnderline> to <br />
            <SketchUnderline className="text-foreground" delay={0.85}>
              shipped product
            </SketchUnderline>
            <span className="hidden text-primary sm:inline">-</span>
            <br className="sm:hidden" />
            <span>
              clean, usable, and <br className="sm:hidden" />
              built to scale
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-700 mb-12 max-w-xl font-medium leading-relaxed"
          >
            Hi, I&apos;m Israel Oduguwa, a full-stack software engineer helping
            businesses build modern web products from polished interfaces and
            reliable backend integration to dashboards, automation, AI-powered
            features, and product systems that support real users.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#contact"
              className={buttonClasses({
                size: "lg",
                className:
                  "group relative h-14 w-full overflow-hidden rounded-full bg-primary px-8 text-lg font-semibold text-white shadow-[0_20px_55px_-18px_rgba(37,99,235,0.5)] ring-1 ring-white/25 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-700 hover:text-white hover:shadow-[0_26px_70px_-20px_rgba(37,99,235,0.7)] sm:w-auto",
              })}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
              Contact Me
              <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#work"
              className={buttonClasses({
                variant: "secondary",
                size: "lg",
                className:
                  "group relative h-14 w-full overflow-hidden rounded-full border border-slate-900/10 bg-white/70 px-8 text-lg font-semibold text-slate-950 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-[transform,background-color,box-shadow,border-color] duration-300 before:absolute before:inset-y-0 before:left-0 before:w-12 before:-translate-x-16 before:skew-x-[-18deg] before:bg-white/70 before:opacity-0 before:transition-[transform,opacity] before:duration-500 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.8)] hover:before:translate-x-72 hover:before:opacity-70 dark:border-white/15 dark:bg-white/10 dark:text-white dark:before:bg-white/30 dark:hover:bg-white/15 sm:w-auto",
              })}
            >
              <span className="relative z-10">View My Work</span>
              <span className="absolute bottom-3 left-8 right-8 h-px origin-left scale-x-0 bg-primary/60 transition-transform duration-300 group-hover:scale-x-100 dark:bg-sky-300/70" />
              <ArrowRight className="relative z-10 ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Profile Image */}
        <motion.div
          style={canUsePointerTilt ? { rotateX, rotateY } : undefined}
          className="lg:col-span-5 relative z-10 mt-16 lg:mt-0 flex items-center justify-center lg:justify-end perspective-1000"
        >
          <div className="relative w-full max-w-[450px] aspect-4/5 flex items-end justify-center">
            {/* Soft blue/radial glow strictly behind the image */}
            <motion.div
              className="absolute inset-0 bg-linear-to-tr from-primary/30 to-blue-400/30 rounded-full blur-[80px]"
              animate={
                !enableAmbientMotion
                  ? undefined
                  : { scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Profile Image */}
            <MotionImage
              src="/images/profile.png"
              alt="Israel Oduguwa"
              width={1123}
              height={1401}
              priority
              sizes="(min-width: 1024px) 675px, (min-width: 640px) 90vw, 130vw"
              className="relative z-10 h-auto w-[150%] max-w-none object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
