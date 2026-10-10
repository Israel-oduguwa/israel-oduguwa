"use client";

import { useEffect, useState } from "react";

type NavigatorConnection = {
  saveData?: boolean;
};

type NavigatorWithHints = Navigator & {
  connection?: NavigatorConnection;
  deviceMemory?: number;
};

export function useLowPowerMode() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(true);

  useEffect(() => {
    let frame = 0;
    const nav = navigator as NavigatorWithHints;
    const prefersDataSaving = Boolean(nav.connection?.saveData);
    const hasLimitedMemory =
      typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const hasLimitedCpu =
      typeof nav.hardwareConcurrency === "number" &&
      nav.hardwareConcurrency <= 4;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setIsLowPowerMode(
        prefersDataSaving ||
          hasLimitedMemory ||
          hasLimitedCpu ||
          reducedMotion.matches,
      );

    frame = requestAnimationFrame(() => {
      update();
    });
    reducedMotion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return isLowPowerMode;
}
