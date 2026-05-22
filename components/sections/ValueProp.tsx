"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useLowPowerMode } from "@/components/hooks/usePerformanceMode";
import {
  BrainCircuit,
  Bug,
  CheckCircle2,
  Database,
  LayoutDashboard,
  Layers,
  LockKeyhole,
  type LucideIcon,
  PanelsTopLeft,
  Server,
  Sparkles,
  UserPlus,
} from "lucide-react";

type IllustrationProps = {
  accent: string;
  dot: string;
};

type ValueItem = {
  title: string;
  text: string;
  tags: string[];
  Icon: LucideIcon;
  accent: string;
  dot: string;
  glow: string;
  Illustration: React.ComponentType<IllustrationProps>;
};

const items: ValueItem[] = [
  {
    title: "SaaS Platforms & Dashboards",
    text: "Interfaces that help teams see, manage, and act on important business information without fighting the software.",
    tags: ["Dashboards", "Admin UI", "Analytics"],
    Icon: LayoutDashboard,
    accent: "text-sky-300",
    dot: "bg-sky-300",
    glow: "from-sky-400/25 via-blue-500/10 to-transparent",
    Illustration: DashboardIllustration,
  },
  {
    title: "Product Interfaces",
    text: "Clean React and Next.js experiences with thoughtful states, strong hierarchy, and responsive behavior that makes a product feel reliable.",
    tags: ["React UI", "States", "Responsive"],
    Icon: PanelsTopLeft,
    accent: "text-violet-300",
    dot: "bg-violet-300",
    glow: "from-violet-400/25 via-indigo-500/10 to-transparent",
    Illustration: InterfaceIllustration,
  },
  {
    title: "Full-Stack Features",
    text: "Useful product work from interface to logic, data, integrations, and the backend pieces needed to make the experience hold together.",
    tags: ["APIs", "Auth", "Database"],
    Icon: Layers,
    accent: "text-amber-200",
    dot: "bg-amber-200",
    glow: "from-amber-300/25 via-orange-500/10 to-transparent",
    Illustration: FullStackIllustration,
  },
  {
    title: "Product Optimization & Debugging",
    text: "Fixing broken flows, improving performance, strengthening SEO, and removing the small issues that slow users down or weaken trust.",
    tags: ["Debugging", "SEO", "Cost Optimization"],
    Icon: Bug,
    accent: "text-rose-300",
    dot: "bg-rose-300",
    glow: "from-rose-400/25 via-red-500/10 to-transparent",
    Illustration: PolishIllustration,
  },
  {
    title: "Onboarding & User Flows",
    text: "Cleaner paths from first visit to useful action, designed to reduce confusion and help people move through the product with less friction.",
    tags: ["Setup", "Forms", "Activation"],
    Icon: UserPlus,
    accent: "text-emerald-300",
    dot: "bg-emerald-300",
    glow: "from-emerald-400/25 via-teal-500/10 to-transparent",
    Illustration: OnboardingIllustration,
  },
  {
    title: "AI-Powered Features",
    text: "Practical AI and automation where they remove repetitive work, support better workflows, or help a business respond faster.",
    tags: ["AI UX", "Outputs", "Automation"],
    Icon: BrainCircuit,
    accent: "text-fuchsia-300",
    dot: "bg-fuchsia-300",
    glow: "from-fuchsia-400/25 via-pink-500/10 to-transparent",
    Illustration: AiIllustration,
  },
];

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

export function ValueProp() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isLowPowerMode = useLowPowerMode();
  const canUseServiceMotion = useMediaQuery("(min-width: 1024px)");
  const isSectionInView = useInView(sectionRef, {
    margin: "200px 0px",
    once: false,
  });
  const enableServiceMotion =
    canUseServiceMotion &&
    isSectionInView &&
    !shouldReduceMotion &&
    !isLowPowerMode;

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050816] py-28 text-white md:py-32"
      id="process"
    >
      <MotionConfig reducedMotion={enableServiceMotion ? "never" : "always"}>
        <div className="container relative z-10 mx-auto px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
          <div className="mx-auto mb-4 max-w-3xl text-center md:mb-5">
            {/* <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45 }}
              className="mb-3 text-xs font-bold uppercase text-sky-200"
            >
              Product engineering services
            </motion.p> */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-5xl font-bold leading-tight tracking-tight text-white text-balance md:text-7xl lg:text-[4.5rem]"
            >
              How I help your product
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg"
            >
              I help teams build cleaner interfaces, connect real backend logic,
              improve user flows, automate manual work, and ship product
              features that support real business goals.
            </motion.p>
          </div>

          <div className="lg:hidden">
            <AccordionList activeIndex={activeIndex} onSelect={handleSelect} />
            <IllustrationPanel item={items[activeIndex]} index={activeIndex} />
          </div>

          <div className="relative hidden lg:block">
            <div className="relative grid w-full items-start gap-8 py-20 pr-0 lg:grid-cols-[minmax(360px,0.72fr)_minmax(560px,1.28fr)] xl:gap-10 2xl:grid-cols-[minmax(390px,0.76fr)_minmax(620px,1.24fr)]">
              <ConnectorLine
                activeIndex={activeIndex}
                item={items[activeIndex]}
                enableMotion={enableServiceMotion}
              />
              <div className="relative z-10">
                <AccordionList
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                />
              </div>
              <div className="relative z-10">
                <IllustrationPanel
                  item={items[activeIndex]}
                  index={activeIndex}
                  enableMotion={enableServiceMotion}
                />
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

function ConnectorLine({
  activeIndex,
  item,
  enableMotion,
}: {
  activeIndex: number;
  item: ValueItem;
  enableMotion: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const startY = [40, 118, 196, 274, 352, 430][activeIndex] ?? 40;
  const midY = Math.max(56, Math.min(404, startY - 10));
  const startX = 380;
  const endX = 790;
  const endY = 250;
  const path = `M ${startX} ${startY} C 492 ${startY} 518 ${midY} 594 ${midY} C 672 ${midY} 700 ${endY} ${endX} ${endY}`;

  return (
    <motion.svg
      key={activeIndex}
      viewBox="0 0 1000 520"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible ${item.accent}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <defs>
        <filter
          id={`connector-glow-${activeIndex}`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="connector-gradient"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor="rgba(148,163,184,0)" />
          <stop offset="35%" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`connector-bloom-${activeIndex}`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.34" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`connector-strobe-${activeIndex}`}
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="46%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="54%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.5"
      />
      <circle
        cx={endX}
        cy={endY}
        r="116"
        fill={`url(#connector-bloom-${activeIndex})`}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#connector-gradient)"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.64"
        filter={`url(#connector-glow-${activeIndex})`}
        animate={
          shouldReduceMotion || !enableMotion
            ? undefined
            : {
                opacity: [0.52, 0.78, 0.52],
              }
        }
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.48"
      />
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#connector-strobe-${activeIndex})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="70 520"
        filter={`url(#connector-glow-${activeIndex})`}
        initial={{ strokeDashoffset: 520, opacity: 0 }}
        animate={
          shouldReduceMotion || !enableMotion
            ? { opacity: 0.45, strokeDashoffset: 0 }
            : { strokeDashoffset: [520, 0], opacity: [0, 1, 0.18] }
        }
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        r="5.5"
        fill="white"
        filter={`url(#connector-glow-${activeIndex})`}
        initial={{ cx: startX, cy: startY, opacity: 0 }}
        animate={
          shouldReduceMotion || !enableMotion
            ? { cx: endX, cy: endY, opacity: 0.5 }
            : {
                cx: [startX, 492, 594, 700, endX],
                cy: [startY, startY, midY, endY, endY],
                opacity: [0, 1, 1, 0.92, 0],
              }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle
        cx={startX}
        cy={startY}
        r="4"
        fill="currentColor"
        opacity="0.95"
      />
      <circle cx={endX} cy={endY} r="5" fill="currentColor" opacity="0.95" />
    </motion.svg>
  );
}

function AccordionList({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.09] bg-white/[0.035] shadow-[0_28px_100px_-72px_rgba(15,23,42,1)] backdrop-blur-2xl">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const Icon = item.Icon;

        return (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(index)}
            className={`group relative block w-full border-b border-white/[0.075] text-left transition-colors duration-300 last:border-b-0 ${
              isActive
                ? "bg-white/[0.075]"
                : "bg-transparent hover:bg-white/[0.045]"
            }`}
          >
            <div
              className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${
                item.glow
              } transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-25"}`}
            />

            <div className="flex min-h-[78px] items-start gap-4 px-5 py-4 md:px-6">
              <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] transition-[opacity,background-color,border-color,color] duration-300 ${
                  isActive
                    ? "scale-105 shadow-[0_18px_50px_-30px_rgba(255,255,255,0.5)]"
                    : "opacity-75 group-hover:opacity-100"
                }`}
              >
                <Icon className={`h-5 w-5 ${item.accent}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-3">
                  <span
                    className={`font-mono text-xs font-semibold transition-colors duration-300 ${
                      isActive ? item.accent : "text-white/35"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <div className="h-px w-8 bg-white/12" />
                </div>

                <h3
                  className={`text-base font-semibold leading-tight tracking-normal transition-colors duration-300 md:text-lg ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {item.title}
                </h3>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 md:text-[15px]">
                        {item.text}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/14 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function IllustrationPanel({
  item,
  index,
  enableMotion = false,
}: {
  item: ValueItem;
  index: number;
  enableMotion?: boolean;
}) {
  const Illustration = item.Illustration;
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableMotion && !shouldReduceMotion;

  if (!shouldAnimate) {
    const Icon = item.Icon;

    return (
      <div
        className={`relative mt-8 mb-0 lg:mt-0 lg:-mr-24 lg:mb-0 xl:-mr-36 2xl:mr-0 ${item.accent}`}
      >
        <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-current/20 bg-white/[0.045] p-8 shadow-[0_32px_120px_-70px_rgba(15,23,42,1)]">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.glow}`} />
          <div className="relative flex h-full min-h-[300px] flex-col justify-between rounded-[1.1rem] border border-white/10 bg-[#07111f]/82 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
                  <Icon className={`h-6 w-6 ${item.accent}`} />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">
                    Service 0{index + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
              <span className={`h-3 w-3 rounded-full ${item.dot}`} />
            </div>
            <div className="grid gap-3">
              <span className="h-3 w-4/5 rounded-full bg-white/18" />
              <span className="h-3 w-2/3 rounded-full bg-white/12" />
              <span className="h-3 w-3/5 rounded-full bg-white/10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative mt-8 mb-0 lg:mt-0 lg:-mr-24 lg:mb-0 xl:-mr-36 2xl:mr-0 ${item.accent}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-4 rounded-[1.65rem] border border-current/35 opacity-35 shadow-[0_0_42px_currentColor] [mask-image:radial-gradient(ellipse_at_center,black_0%,black_62%,transparent_84%)]"
        animate={
          shouldReduceMotion || !enableMotion
            ? undefined
            : {
                opacity: [0.22, 0.52, 0.22],
                boxShadow: [
                  "0 0 24px currentColor, 0 0 58px currentColor",
                  "0 0 38px currentColor, 0 0 98px currentColor",
                  "0 0 24px currentColor, 0 0 58px currentColor",
                ],
              }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-[1.35rem] bg-current opacity-[0.18] blur-xl"
        animate={
          shouldReduceMotion || !enableMotion
            ? undefined
            : {
                opacity: [0.1, 0.26, 0.1],
                scale: [0.985, 1.015, 0.985],
              }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -left-24 -right-20 -top-32 h-80 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.36),currentColor_24%,rgba(124,58,237,0.14)_54%,transparent_78%)] opacity-45 blur-3xl [mask-image:radial-gradient(ellipse_at_center,black_0%,black_52%,transparent_82%)]"
        animate={
          shouldReduceMotion || !enableMotion
            ? undefined
            : {
                opacity: [0.24, 0.48, 0.24],
                scale: [0.98, 1.04, 0.98],
              }
        }
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 -top-24 h-72 w-40 -translate-x-1/2 rounded-full bg-white/70 opacity-40 blur-3xl [mask-image:radial-gradient(ellipse_at_center,black_0%,black_46%,transparent_78%)]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.22, 0.42, 0.22],
                y: [0, 12, 0],
              }
        }
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-current opacity-16 blur-[72px] [mask-image:radial-gradient(ellipse_at_center,black_0%,black_50%,transparent_78%)]"
        animate={shouldReduceMotion ? undefined : { opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-current opacity-12 blur-md"
        animate={
          shouldReduceMotion ? undefined : { opacity: [0.08, 0.2, 0.08] }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050816] shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-emerald-300/80 shadow-[0_0_10px_rgba(110,231,183,0.5)]" />
          </div>
          <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-300">
            product-lab / 0{index + 1}
          </div>
        </div>

        <div className="relative min-h-[390px] overflow-hidden p-5 md:min-h-[500px] md:p-7 lg:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative h-full"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold uppercase ${item.accent}`}>
                    Active build system
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <motion.div
                  className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { scale: [1, 1.5, 1], opacity: [0.55, 1, 0.55] }
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <Illustration accent={item.accent} dot={item.dot} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DashboardIllustration({ dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <div className="absolute inset-0 rounded-lg border border-white/[0.08] bg-white/[0.035]" />
      <div className="absolute left-4 top-4 bottom-4 w-20 rounded-md border border-white/[0.07] bg-[#050816]/70 p-3">
        <div className={`mb-5 h-8 w-8 rounded-md ${dot} opacity-80`} />
        {[0, 1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            className="mb-3 rounded-md border border-white/[0.06] bg-white/[0.035] p-2"
            animate={{
              backgroundColor:
                item === 1
                  ? [
                      "rgba(255,255,255,0.035)",
                      "rgba(255,255,255,0.09)",
                      "rgba(255,255,255,0.035)",
                    ]
                  : undefined,
              opacity: [0.62, 1, 0.62],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: item * 0.16 }}
          >
            <div className="h-1.5 rounded-full bg-white/18" />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-32 right-4 top-4 grid grid-cols-3 gap-3">
        {[
          ["MRR", "+64%", 7],
          ["Users", "500.8k", 56],
          ["Uptime", "99.9%", 92],
        ].map(([label, value, width], index) => (
          <motion.div
            key={label}
            className="rounded-md border border-white/8 bg-white/[0.05] p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,1)]"
            animate={{ y: [0, index === 1 ? -5 : -3, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          >
            <div className="mb-2 text-[10px] font-bold uppercase text-slate-500">
              {label}
            </div>
            <div className="mb-4 text-sm font-semibold text-white">{value}</div>
            <motion.div
              className={`h-1.5 rounded-full ${dot}`}
              initial={{ width: "18%" }}
              animate={{ width: `${width}%` }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.18,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-32 right-4 top-32 bottom-4 rounded-md border border-white/[0.08] bg-white/[0.045] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="mb-2 h-2.5 w-28 rounded-full bg-white/18" />
            <div className="h-2 w-20 rounded-full bg-white/10" />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((item) => (
              <span key={item} className={`h-2 w-2 rounded-full ${dot}`} />
            ))}
          </div>
        </div>
        <svg viewBox="0 0 420 190" className="h-[68%] w-full overflow-visible">
          <defs>
            <linearGradient id="dashboardChart" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="dashboardArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110, 150].map((y) => (
            <line
              key={y}
              x1="0"
              x2="420"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
            />
          ))}
          <motion.path
            d="M4 145 C55 102 86 130 126 82 C168 32 202 92 244 58 C294 18 328 110 416 40 L416 188 L4 188 Z"
            fill="url(#dashboardArea)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M4 145 C55 102 86 130 126 82 C168 32 202 92 244 58 C294 18 328 110 416 40"
            fill="none"
            stroke="url(#dashboardChart)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            r="5"
            fill="#fff"
            initial={{ cx: 4, cy: 145, opacity: 0 }}
            animate={{
              cx: [4, 126, 244, 416],
              cy: [145, 82, 58, 40],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <div className="grid grid-cols-4 gap-2">
          {[44, 72, 52, 88].map((height, index) => (
            <div
              key={height}
              className="flex h-14 items-end rounded-sm bg-[#050816]/55 px-2"
            >
              <motion.div
                className={`w-full rounded-t-sm ${dot}`}
                animate={{
                  height: [`${height - 16}%`, `${height}%`, `${height - 16}%`],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.16,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InterfaceIllustration({ dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <div className="absolute inset-0 rounded-lg border border-white/[0.08] bg-white/[0.035] p-5">
        <motion.div
          className={`absolute left-[38%] top-20 z-20 h-24 w-36 rounded-md border ${dot} border-white/20 bg-white/[0.035] shadow-[0_0_30px_rgba(255,255,255,0.08)]`}
          animate={{ x: [-12, 118, 118, -12], y: [0, 0, 142, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        <motion.div
          className="absolute left-[54%] top-[46%] z-30 h-4 w-4 rotate-45 rounded-sm bg-white shadow-[0_0_24px_rgba(255,255,255,0.5)]"
          animate={{ x: [0, 56, 16, 0], y: [0, 36, 88, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="grid h-full grid-cols-[1fr_0.72fr] gap-4">
          <div className="space-y-4">
            <motion.div
              className="overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.055] p-4"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="mb-5 h-2.5 w-24 rounded-full bg-white/18" />
              <div className="grid grid-cols-[1.4fr_0.8fr] gap-3">
                <div className="h-14 rounded-md bg-white/[0.07]" />
                <div className={`h-14 rounded-md ${dot} opacity-20`} />
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="h-24 rounded-md border border-white/[0.08] bg-white/[0.045] p-3"
                  animate={{ opacity: [0.65, 1, 0.65] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: item * 0.14,
                  }}
                >
                  <div className={`mb-3 h-2 w-10 rounded-full ${dot}`} />
                  <div className="h-2 w-full rounded-full bg-white/12" />
                  <div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" />
                  <motion.div
                    className="mt-4 h-8 rounded-md border border-white/[0.06] bg-[#050816]/50"
                    animate={{ opacity: [0.45, 0.88, 0.45] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      delay: item * 0.12,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-white/[0.045] p-4">
            <div className="mb-5 h-3 w-20 rounded-full bg-white/18" />
            {[0, 1, 2].map((item) => (
              <motion.div
                key={item}
                className="mb-4 h-11 rounded-lg border border-white/[0.07] bg-[#050816]/60"
                animate={{ x: [0, item % 2 ? 3 : -3, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item * 0.2,
                }}
              />
            ))}
            <motion.div
              className={`mt-6 h-11 rounded-full ${dot}`}
              animate={{
                scale: [1, 1.025, 1],
                boxShadow: [
                  "0 0 0 rgba(255,255,255,0)",
                  "0 0 28px rgba(255,255,255,0.16)",
                  "0 0 0 rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <motion.div
                  key={item}
                  className="h-10 rounded-md border border-white/[0.06] bg-[#050816]/55"
                  animate={{ y: [0, item === 1 ? -4 : -2, 0] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item * 0.16,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingIllustration({ accent, dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <div className="absolute left-6 right-6 top-1 flex items-center justify-between">
        {[1, 2, 3, 4].map((step, index) => (
          <React.Fragment key={step}>
            <motion.div
              className={`z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[#0d1427] text-sm font-bold ${accent}`}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            >
              {step < 4 ? <CheckCircle2 className="h-5 w-5" /> : step}
            </motion.div>
            {index < 3 && (
              <div className="mx-2 h-px flex-1 bg-white/10">
                <motion.div
                  className={`h-full ${dot}`}
                  animate={{ width: ["0%", "100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.28,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        className="absolute left-10 right-10 top-18 rounded-lg border border-white/[0.08] bg-white/[0.045] p-6 shadow-[0_28px_80px_-56px_rgba(15,23,42,1)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mb-5 flex items-center gap-4">
          <motion.div
            className={`h-14 w-14 rounded-full ${dot} opacity-80`}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex-1">
            <div className="mb-3 h-3 w-32 rounded-full bg-white/18" />
            <div className="h-2 w-24 rounded-full bg-white/10" />
          </div>
        </div>
        {[0, 1, 2].map((item) => (
          <motion.div
            key={item}
            className="mb-3 flex h-11 items-center gap-3 rounded-lg border border-white/[0.07] bg-[#050816]/60 px-4"
            animate={{
              borderColor: [
                "rgba(255,255,255,0.07)",
                "rgba(255,255,255,0.18)",
                "rgba(255,255,255,0.07)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: item * 0.22 }}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="h-2 flex-1 rounded-full bg-white/12" />
            <span className="h-2 w-14 rounded-full bg-white/8" />
          </motion.div>
        ))}
        <motion.div
          className="mt-5 rounded-lg border border-white/[0.08] bg-white/[0.045] p-4"
          animate={{ opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
            <span>Activation</span>
            <span className={accent}>ready</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${dot}`}
              animate={{ width: ["34%", "86%", "34%"] }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className={`absolute bottom-10 right-8 rounded-full border border-white/10 bg-[#0d1427] px-4 py-2 text-xs font-semibold ${accent}`}
        animate={{ y: [0, -8, 0], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        Profile completed
      </motion.div>
    </div>
  );
}

function AiIllustration({ accent, dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <div className="absolute left-4 top-5 w-[58%] rounded-lg border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_26px_80px_-58px_rgba(15,23,42,1)]">
        <div className="mb-4 flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06]"
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className={`h-5 w-5 ${accent}`} />
          </motion.div>
          <div className="h-3 w-28 rounded-full bg-white/18" />
        </div>
        {[0, 1, 2].map((item) => (
          <motion.div
            key={item}
            className="mb-3 rounded-lg border border-white/[0.07] bg-[#050816]/60 p-3"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: item * 0.22 }}
          >
            <div className="h-2 w-full rounded-full bg-white/14" />
            <div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" />
            <motion.div
              className={`mt-3 h-1 rounded-full ${dot}`}
              animate={{ width: ["18%", "72%", "18%"] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item * 0.18,
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 430"
        aria-hidden="true"
      >
        <motion.path
          d="M270 150 C330 148 330 244 382 248"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 12"
          className={accent}
          animate={{ strokeDashoffset: [40, 0], opacity: [0.24, 0.72, 0.24] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      <div className="absolute bottom-7 right-5 w-[50%] rounded-lg border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_26px_80px_-58px_rgba(15,23,42,1)]">
        <div className="mb-4 text-xs font-bold uppercase text-slate-400">
          Structured output
        </div>
        {["Role", "Score", "Actions"].map((label, index) => (
          <motion.div
            key={label}
            className="mb-3 flex items-center justify-between rounded-md bg-[#050816]/70 px-3 py-2 text-xs text-slate-300"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.18 }}
          >
            <span>{label}</span>
            <span className={accent}>valid</span>
          </motion.div>
        ))}
        <motion.div
          className="mt-3 rounded-md border border-white/[0.07] bg-[#050816]/70 p-3"
          animate={{ opacity: [0.62, 1, 0.62] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="h-2 w-20 rounded-full bg-white/12" />
            <span className={`h-2 w-2 rounded-full ${dot}`} />
          </div>
          <div className={`h-1.5 w-2/3 rounded-full ${dot} opacity-80`} />
        </motion.div>
      </div>

      <motion.div
        className={`absolute left-[58%] top-[43%] h-2.5 w-2.5 rounded-full ${dot}`}
        animate={{ x: [-26, 56, -26], opacity: [0, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2, 3].map((item) => (
        <motion.div
          key={item}
          className={`absolute h-1.5 w-1.5 rounded-full ${dot}`}
          style={{
            left: `${46 + item * 8}%`,
            top: `${22 + (item % 2) * 16}%`,
          }}
          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.18, 0.9, 0.18] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item * 0.18,
          }}
        />
      ))}
    </div>
  );
}

function FullStackIllustration({ accent, dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <NodeCard
        className="left-5 top-8"
        icon={<PanelsTopLeft className="h-5 w-5" />}
        label="Frontend"
        accent={accent}
      />
      <NodeCard
        className="right-8 top-24"
        icon={<Server className="h-5 w-5" />}
        label="API layer"
        accent={accent}
      />
      <NodeCard
        className="left-14 bottom-16"
        icon={<LockKeyhole className="h-5 w-5" />}
        label="Auth"
        accent={accent}
      />
      <NodeCard
        className="right-12 bottom-8"
        icon={<Database className="h-5 w-5" />}
        label="Database"
        accent={accent}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 430"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="stackFlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M150 95 C230 95 250 150 340 150"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M360 188 C310 270 230 290 160 322"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M190 340 C280 370 330 350 382 315"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          fill="none"
        />
        {[
          "M150 95 C230 95 250 150 340 150",
          "M360 188 C310 270 230 290 160 322",
          "M190 340 C280 370 330 350 382 315",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke="url(#stackFlow)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            className={accent}
            strokeDasharray="70 240"
            animate={{ strokeDashoffset: [280, 0] }}
            transition={{
              duration: 2.7,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.28,
            }}
          />
        ))}
      </svg>

      {[0, 1, 2].map((point) => (
        <motion.div
          key={point}
          className={`absolute h-2.5 w-2.5 rounded-full ${dot}`}
          style={{
            left: point === 0 ? "32%" : point === 1 ? "62%" : "45%",
            top: point === 0 ? "24%" : point === 1 ? "58%" : "78%",
          }}
          animate={{ scale: [0.7, 1.25, 0.7], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: point * 0.35 }}
        />
      ))}

      <motion.div
        className="absolute left-[35%] top-[40%] rounded-full border border-white/10 bg-[#050816]/80 px-4 py-2 text-sm font-bold text-slate-100"
        animate={{ scale: [1, 1.04, 1], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        request → response
      </motion.div>
    </div>
  );
}

function PolishIllustration({ accent, dot }: IllustrationProps) {
  return (
    <div className="relative h-[360px] md:h-[430px]">
      <div className="absolute left-5 top-8 bottom-16 w-[44%] rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
        <div className="mb-4 text-xs font-bold uppercase text-slate-500">
          Before
        </div>
        <div className="mb-4 h-16 rounded-md border border-red-300/20 bg-red-400/5" />
        <div className="mb-3 h-3 w-full rounded-full bg-white/10" />
        <div className="mb-3 h-3 w-3/4 rounded-full bg-white/10" />
        <motion.div
          className="mt-8 h-16 rounded-md border border-red-300/25 bg-red-400/10"
          animate={{ x: [0, -4, 0], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <div className="h-full w-[62%] border-r border-red-300/25" />
        </motion.div>
      </div>

      <div className="absolute right-5 top-8 bottom-16 w-[44%] rounded-lg border border-white/[0.1] bg-white/[0.055] p-4">
        <div className={`mb-4 text-xs font-bold uppercase ${accent}`}>
          After
        </div>
        <motion.div
          className={`mb-4 h-16 rounded-md border border-white/10 ${dot} opacity-10`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <div className="mb-3 h-3 w-full rounded-full bg-white/18" />
        <div className="mb-3 h-3 w-3/4 rounded-full bg-white/14" />
        <svg viewBox="0 0 180 70" className="mt-8 h-20 w-full overflow-visible">
          <motion.path
            d="M4 58 C44 54 54 42 80 38 C116 31 128 16 176 10"
            fill="none"
            stroke="#fb7185"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.div
        className="absolute left-[44%] top-[42%] z-20 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#050816]/85 shadow-[0_0_34px_rgba(255,255,255,0.08)]"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <CheckCircle2 className={`h-7 w-7 ${accent}`} />
      </motion.div>

      {[64, 128, 192, 256].map((x, index) => (
        <motion.div
          key={x}
          className="absolute top-0 bottom-0 w-px bg-white/8"
          style={{ left: x }}
          animate={{ opacity: [0.12, 0.42, 0.12] }}
          transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
        />
      ))}

      <motion.div
        className="absolute bottom-5 left-10 right-14 h-1.5 rounded-full bg-white/10"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className={`h-full rounded-full ${dot}`}
          animate={{ width: ["42%", "91%", "42%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

function NodeCard({
  className,
  icon,
  label,
  accent,
}: {
  className: string;
  icon: React.ReactNode;
  label: string;
  accent: string;
}) {
  return (
    <motion.div
      className={`absolute z-10 min-w-36 rounded-lg border border-white/[0.08] bg-white/[0.055] p-4 shadow-[0_26px_80px_-58px_rgba(15,23,42,1)] ${className}`}
      animate={{
        y: [0, -6, 0],
        borderColor: [
          "rgba(255,255,255,0.08)",
          "rgba(255,255,255,0.18)",
          "rgba(255,255,255,0.08)",
        ],
      }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className={`mb-3 ${accent}`}>{icon}</div>
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="mt-2 h-2 w-20 rounded-full bg-white/12" />
      <motion.div
        className="mt-3 h-1.5 rounded-full bg-white/10"
        animate={{ width: ["38%", "76%", "38%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
