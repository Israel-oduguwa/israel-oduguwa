"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useSpring } from "@react-spring/web";
import { useTheme } from "next-themes";

export function GithubGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [width, setWidth] = useState(0);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        setWidth(canvasRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || width === 0) return;

    let phi = 0;

    const options: COBEOptions & {
      onRender: (state: Partial<COBEOptions>) => void;
    } = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 25000,
      mapBrightness: 6,
      baseColor: isDark ? [0.1, 0.1, 0.2] : [0.95, 0.95, 0.95],
      markerColor: [1, 0.1, 0.4],
      glowColor: isDark ? [0.1, 0.2, 0.5] : [0.8, 0.9, 1],
      markers: [
        // longitude, latitude, size
        { location: [37.7595, -122.4367], size: 0.06 }, // SF (USA)
        { location: [40.7128, -74.006], size: 0.08 }, // NY (USA)
        { location: [9.082, 8.6753], size: 0.1 }, // Nigeria
        { location: [51.5072, -0.1276], size: 0.07 }, // London
        { location: [43.65107, -79.347015], size: 0.06 }, // Toronto
        { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney
        { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
      ],
      onRender: (state) => {
        // Called on every animation frame.
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + r.get();
        // Slightly scale down to leave room for the glow effect
        state.width = width * 2 * 0.95;
        state.height = width * 2 * 0.95;
      },
    };

    const globe = createGlobe(canvasRef.current, options);

    return () => {
      globe.destroy();
    };
  }, [width, r, isDark]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: 1,
        margin: "auto",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
          animation: "fade-in 1s ease forwards",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
        }}
      />
    </div>
  );
}
