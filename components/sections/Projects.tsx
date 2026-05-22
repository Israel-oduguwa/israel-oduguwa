"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { buttonClasses } from "../ui/Button";
import { ExternalLink } from "lucide-react";
import { useLowPowerMode } from "@/components/hooks/usePerformanceMode";

type Project = {
  title: string;
  context: string;
  description: string;
  impact: string;
  tags: string[];
  hasDemo: boolean;
  videoSrc: string;
  caseStudyHref: string;
};

function ProjectVideo({
  videoSrc,
  title,
}: {
  videoSrc: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isLowPowerMode = useLowPowerMode();
  const [isReady, setIsReady] = useState(false);

  const isNearView = useInView(containerRef, {
    amount: 0,
    margin: "800px 0px",
    once: false,
  });

  const isInView = useInView(containerRef, {
    amount: 0.25,
    margin: "120px 0px",
    once: false,
  });

  const shouldPrepareVideo = isNearView && !shouldReduceMotion && !isLowPowerMode;
  const canUseVideo = isInView && shouldPrepareVideo;
  const showVideo = canUseVideo && isReady;

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldPrepareVideo) return;

    video.load();
  }, [shouldPrepareVideo]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (canUseVideo) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [canUseVideo]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-transparent"
    >
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_58%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.9))] transition-opacity duration-500 ${
          showVideo ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 pointer-events-none select-none ${
          showVideo ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        preload={canUseVideo ? "auto" : "metadata"}
        onCanPlay={() => setIsReady(true)}
      >
        {shouldPrepareVideo ? <source src={videoSrc} type="video/mp4" /> : null}
      </video>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_46%)]" />
      <span className="sr-only">{title} animated product preview</span>
    </div>
  );
}

export function Projects() {
  const projects: Project[] = [
    {
      title: "KinsCare",
      context: "Healthcare hiring marketplace",
      description:
        "Helped build and improve a platform that helps care providers find qualified caregivers faster, manage hiring interest, and reduce scattered manual communication.",
      impact:
        "Focused on making a high-trust hiring process easier to understand, easier to navigate, and less dependent on scattered manual steps.",
      tags: ["Next.js", "React", "Node.js", "MongoDB", "Clerk", "Twilio"],
      hasDemo: true,
      videoSrc: "/videos/kinscare.mp4",
      caseStudyHref: "https://www.kinscare.org/",
    },
    {
      title: "ExcelCNA",
      context: "Healthcare training and student acquisition",
      description:
        "Built and maintained the web platform for Excel Health Careers, a healthcare training business offering HCA, CPR, and BLS programs. The platform supports course discovery, student registration, enrollment flows, and business-facing operations.",
      impact:
        "Helped drive real student registrations and revenue by building a clearer online enrollment experience for healthcare training programs, making it easier for students to discover courses, understand requirements, and register online.",
      tags: ["Next.js", "React", "Firebase", "GA4", "GTM", "n8n", "OpenAI"],
      hasDemo: true,
      videoSrc: "/videos/excel-cna.mp4",
      caseStudyHref: "https://excelcna.com/",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-background py-28 md:py-32"
      id="work"
    >
      {/* Minimal ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mx-auto mb-20 max-w-4xl text-center md:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-[4.5rem] font-bold tracking-tight text-slate-900 dark:text-white leading-tight text-balance"
          >
            Real products I’ve helped build
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg"
          >
            A look at product systems I’ve worked on across healthcare hiring,
            student acquisition, workflow automation, analytics, and business
            operations.
          </motion.p>
        </div>

        <div className="space-y-32 md:space-y-56">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center"
            >
              {/* Video Container */}
              <div
                className={`group relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-transparent ${
                  index === 0 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_62%)] blur-2xl" />

                <ProjectVideo
                  videoSrc={project.videoSrc}
                  title={project.title}
                />
              </div>

              {/* Text Container */}
              <div
                className={`flex flex-col justify-center ${
                  index === 0 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
                  {project.title}
                </h3>
                {/* <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {project.context}
                </p> */}

                <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400 md:mt-8 md:text-lg">
                  {project.description}
                </p>

                <div className="mt-3">
                  <p className="text-base leading-7 text-slate-700 dark:text-slate-300 italic md:text-lg">
                    {/* <span className="font-medium not-italic text-slate-900 dark:text-white mr-3">
                      Contribution:
                    </span> */}
                    {project.impact}
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap gap-3">
                  {project.tags.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:px-5 sm:py-2.5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-14">
                  {project.hasDemo && (
                    <a
                      href={project.caseStudyHref}
                      className={buttonClasses({
                        variant: "primary",
                        className:
                          "group w-full gap-3 rounded-full px-8 py-4 text-base font-medium transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(37,99,235,0.75)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] sm:w-auto",
                      })}
                      aria-label={`View ${project.title} case study`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project Details{" "}
                      <ExternalLink
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        size={18}
                      />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
