"use client";

import { createContext, useContext, type ReactNode } from "react";
import { UX_LEVELS, type UXLevel } from "./ux-levels";
import { useStore } from "@/lib/store";

const UXContext = createContext<UXLevel | null>(null);

export function UXProvider({ children }: { children: ReactNode }) {
  const level = useStore((s) => s.uxLevel);
  const config = UX_LEVELS[level];
  return <UXContext.Provider value={config}>{children}</UXContext.Provider>;
}

export function useUXConfig(): UXLevel {
  const ctx = useContext(UXContext);
  if (!ctx) throw new Error("useUXConfig must be used inside UXProvider");
  return ctx;
}

/** Acceso directo al sub-objeto de features */
export function useUXFeatures() {
  return useUXConfig().features;
}

/** Acceso directo al sub-objeto de UI tokens */
export function useUIConfig() {
  return useUXConfig().ui;
}
