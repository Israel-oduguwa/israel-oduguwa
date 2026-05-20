"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { buttonClasses } from "../ui/Button";
import { ArrowRight, Play, Send, X } from "lucide-react";

const syntaxSnippets = [
  {
    text: "const dev = true;",
    className:
      "left-[5%] top-[22%] hidden rotate-[-8deg] lg:block lg:left-[8%]",
    delay: 0,
  },
  {
    text: "<Product />",
    className: "right-[6%] top-[24%] hidden rotate-[10deg] lg:block lg:right-[10%]",
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
const introVideoEmbedUrl =
  "https://www.youtube.com/embed/9sbIcFZz80A?autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080";

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

function IntroVideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-xl sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-video-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <motion.div
            className="relative w-full max-w-7xl rounded-[2rem] border border-white/15 bg-white/[0.04] p-2 shadow-[0_40px_140px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p id="intro-video-title" className="sr-only">
              Watch my intro
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close intro video"
              className="absolute -right-3 -top-3 z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-slate-950/85 text-white shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-xl transition hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 sm:-right-4 sm:-top-4"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-[1.45rem] bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={introVideoEmbedUrl}
                title="Israel Oduguwa intro video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const canUsePointerTilt = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
  );
  const enableAmbientMotion = canUsePointerTilt && !shouldReduceMotion;

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

  const openIntroVideo = () => setIsVideoOpen(true);
  const closeIntroVideo = useCallback(() => setIsVideoOpen(false), []);

  return (
    <>
      <section
        ref={containerRef}
        onMouseEnter={updateBounds}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-background pb-10 pt-24 perspective-1000 sm:pb-14 sm:pt-32 md:pb-16 md:pt-36 lg:min-h-[720px] lg:pb-20 lg:pt-36 xl:min-h-[780px] 2xl:min-h-[90vh] 2xl:pb-24 2xl:pt-40"
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

        <div className="relative z-10 mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-6 px-5 sm:gap-10 sm:px-6 md:px-8 lg:grid-cols-12 lg:gap-6 lg:px-10 xl:gap-8 xl:px-12">
          {/* Left Column: Typography */}
          <div className="z-20 flex w-full max-w-[22rem] flex-col items-start text-left min-[390px]:max-w-[24rem] sm:max-w-[42rem] md:max-w-[50rem] lg:col-span-7 lg:max-w-none">
            <motion.h1
              className="mb-5 w-full text-[2.45rem] font-black leading-[1.03] text-foreground min-[390px]:text-[2.85rem] sm:mb-6 sm:text-[3.75rem] md:text-[4rem] lg:mb-7 lg:text-[4.15rem] xl:text-[4.75rem] 2xl:text-[5.65rem]"
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
              className="mb-7 max-w-[38rem] text-[0.95rem] font-medium leading-[1.65] text-slate-700 sm:mb-8 sm:text-lg sm:leading-8 md:mb-10 lg:mb-10 lg:max-w-[35rem] lg:text-[1.05rem] lg:leading-8 xl:max-w-xl xl:text-lg 2xl:text-xl 2xl:leading-relaxed"
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
              className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
            >
              <a
                href="#contact"
                className={buttonClasses({
                  size: "lg",
                  className:
                    "group relative h-11 w-full overflow-hidden rounded-full bg-primary px-6 text-base font-semibold text-white shadow-[0_20px_55px_-18px_rgba(37,99,235,0.5)] ring-1 ring-white/25 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-700 hover:text-white hover:shadow-[0_26px_70px_-20px_rgba(37,99,235,0.7)] sm:h-[3.25rem] sm:w-auto sm:px-7 lg:text-base 2xl:h-14 2xl:px-8 2xl:text-lg",
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
                    "group relative h-11 w-full overflow-hidden rounded-full border border-slate-900/10 bg-white/70 px-6 text-base font-semibold text-slate-950 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-[transform,background-color,box-shadow,border-color] duration-300 before:absolute before:inset-y-0 before:left-0 before:w-10 before:-translate-x-14 before:skew-x-[-18deg] before:bg-white/70 before:opacity-0 before:transition-[transform,opacity] before:duration-500 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.8)] hover:before:translate-x-64 hover:before:opacity-70 dark:border-white/15 dark:bg-white/10 dark:text-white dark:before:bg-white/30 dark:hover:bg-white/15 sm:h-[3.25rem] sm:w-auto sm:px-7 lg:text-base 2xl:h-14 2xl:px-8 2xl:text-lg",
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
            className="relative z-10 mt-2 flex items-center justify-center perspective-1000 sm:mt-6 lg:col-span-5 lg:mt-0 lg:justify-end"
          >
            <div className="relative flex aspect-4/5 w-full max-w-[18rem] items-end justify-center min-[390px]:max-w-[20rem] sm:max-w-[23rem] md:max-w-[25rem] lg:max-w-[22rem] xl:max-w-[25rem] 2xl:max-w-[28rem]">
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
                sizes="(min-width: 1536px) 42rem, (min-width: 1280px) 37rem, (min-width: 1024px) 32rem, (min-width: 640px) 34rem, 28rem"
                className="relative z-10 h-auto w-[140%] max-w-none object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:w-[145%] lg:w-[140%] 2xl:w-[150%]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <motion.button
                type="button"
                onClick={openIntroVideo}
                aria-label="Watch intro video"
                className="group absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/65 bg-white/18 text-white shadow-[0_24px_70px_rgba(15,23,42,0.34)] backdrop-blur-xl transition hover:scale-105 hover:bg-white/24 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/85 sm:h-20 sm:w-20 lg:h-[4.5rem] lg:w-[4.5rem] xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
                initial={{ opacity: 0, x: "-50%", y: "-38%", scale: 0.96 }}
                animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.95,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {!shouldReduceMotion ? (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/80"
                      animate={{ scale: [1, 1.8], opacity: [0.58, 0] }}
                      transition={{
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/60"
                      animate={{ scale: [1, 2.35], opacity: [0.42, 0] }}
                      transition={{
                        duration: 1.9,
                        delay: 0.45,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </>
                ) : null}
                <span className="relative grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-primary shadow-[0_16px_38px_rgba(37,99,235,0.36)] sm:h-14 sm:w-14 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16">
                  <Play
                    className="ml-0.5 h-5 w-5 fill-current transition-transform group-hover:scale-110 sm:ml-1 sm:h-6 sm:w-6 2xl:h-7 2xl:w-7"
                    aria-hidden="true"
                  />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <IntroVideoModal isOpen={isVideoOpen} onClose={closeIntroVideo} />
    </>
  );
}
