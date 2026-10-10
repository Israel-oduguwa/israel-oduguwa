"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

import { useLowPowerMode } from "@/components/hooks/usePerformanceMode";
import type { GlobeConfig, GlobeMarker, Position } from "@/components/ui/globe";

function loadGlobeModule() {
  return import("@/components/ui/globe");
}

const World = dynamic(() => loadGlobeModule().then((module) => module.World), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

function GlobePlaceholder() {
  return (
    <div className="relative h-full min-h-[360px] w-full">
      <Image
        src="/images/globe-static.svg"
        alt=""
        fill
        unoptimized
        sizes="(max-width: 800px) 100vw, 800px"
        className="object-contain"
      />
    </div>
  );
}

class GlobeBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <GlobePlaceholder /> : this.props.children;
  }
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
    <div ref={containerRef} className="h-full w-full" aria-hidden="true">
      {shouldLoad && !isLowPowerMode ? (
        <GlobeBoundary>
          <World
            data={data}
            globeConfig={globeConfig}
            isActive={isVisible}
            markers={markers}
          />
        </GlobeBoundary>
      ) : (
        <GlobePlaceholder />
      )}
    </div>
  );
}
