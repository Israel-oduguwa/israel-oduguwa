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

    frame = requestAnimationFrame(() => {
      setIsLowPowerMode(
        prefersDataSaving || hasLimitedMemory || hasLimitedCpu,
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return isLowPowerMode;
}
