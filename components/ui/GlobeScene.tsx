"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useLowPowerMode } from "@/components/hooks/usePerformanceMode";
import type {
  GlobeConfig,
  GlobeMarker,
  Position,
} from "@/components/ui/globe";

function loadGlobeModule() {
  return import("@/components/ui/globe");
}

const World = dynamic(
  () => loadGlobeModule().then((module) => module.World),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] w-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_58%)]" />
    ),
  },
);

function GlobePlaceholder() {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_58%)]">
      <div className="absolute left-1/2 top-1/2 h-[min(72vw,520px)] w-[min(72vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),rgba(56,189,248,0.12)_34%,rgba(15,23,42,0.5)_72%)] shadow-[0_0_90px_rgba(56,189,248,0.16)]" />
      <div className="absolute left-[18%] top-[42%] h-2 w-2 rounded-full bg-sky-200 shadow-[0_0_18px_rgba(125,211,252,0.85)]" />
      <div className="absolute left-[58%] top-[34%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_18px_rgba(221,214,254,0.7)]" />
    </div>
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
  const isLowPowerMode = useLowPowerMode();

  useEffect(() => {
    let idleId: number | undefined;
    let timeout: ReturnType<typeof globalThis.setTimeout> | undefined;

    if (isLowPowerMode) return;

    const warmAndMount = () => {
      loadGlobeModule()
        .catch(() => null)
        .finally(() => setShouldLoad(true));
    };

    if ("requestIdleCallback" in globalThis) {
      idleId = globalThis.requestIdleCallback(warmAndMount, {
        timeout: 2400,
      });
    } else {
      timeout = globalThis.setTimeout(warmAndMount, 1400);
    }

    return () => {
      if (idleId) globalThis.cancelIdleCallback(idleId);
      if (timeout) globalThis.clearTimeout(timeout);
    };
  }, [isLowPowerMode]);

  useEffect(() => {
    if (shouldLoad || isLowPowerMode) return;

    if (!("IntersectionObserver" in globalThis)) {
      const timeout = globalThis.setTimeout(() => setShouldLoad(true), 0);
      return () => globalThis.clearTimeout(timeout);
    }

    let idleId: number | undefined;
    let timeout: ReturnType<typeof globalThis.setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const load = () => {
            loadGlobeModule()
              .catch(() => null)
              .finally(() => setShouldLoad(true));
          };
          observer.disconnect();

          if ("requestIdleCallback" in globalThis) {
            idleId = globalThis.requestIdleCallback(load, {
              timeout: 1400,
            });
            return;
          }

          timeout = globalThis.setTimeout(load, 250);
        }
      },
      { rootMargin: "720px 0px", threshold: 0 },
    );

    const container = containerRef.current;
    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      if (idleId) globalThis.cancelIdleCallback(idleId);
      if (timeout) globalThis.clearTimeout(timeout);
    };
  }, [isLowPowerMode, shouldLoad]);

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
      {shouldLoad && !isLowPowerMode ? (
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
