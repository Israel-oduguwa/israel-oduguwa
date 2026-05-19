"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type {
  GlobeConfig,
  GlobeMarker,
  Position,
} from "@/components/ui/globe";

const World = dynamic(
  () => import("@/components/ui/globe").then((module) => module.World),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] w-full animate-pulse bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_58%)]" />
    ),
  },
);

function GlobePlaceholder() {
  return (
    <div className="h-full min-h-[420px] w-full animate-pulse bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_58%)]" />
  );
}

type GlobeSceneProps = {
  data: Position[];
  globeConfig: GlobeConfig;
  markers?: GlobeMarker[];
};

export function GlobeScene({ data, globeConfig, markers }: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    if (!("IntersectionObserver" in globalThis)) {
      const timeout = globalThis.setTimeout(() => setShouldLoad(true), 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );

    const container = containerRef.current;
    if (container) observer.observe(container);

    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;

    if (!("IntersectionObserver" in globalThis)) {
      const timeout = globalThis.setTimeout(() => setIsVisible(true), 0);
      return () => globalThis.clearTimeout(timeout);
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="h-full w-full">
      {shouldLoad ? (
        <World
          data={data}
          globeConfig={globeConfig}
          isActive={isVisible}
          markers={markers}
        />
      ) : (
        <GlobePlaceholder />
      )}
    </div>
  );
}
