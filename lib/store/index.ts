import { create } from "zustand";
import type { UXLevelId } from "@/lib/config/ux-levels";

// ──────────────────────────────────────────
// Tipos del dominio
// ──────────────────────────────────────────

export type IssueType = "usabilidad" | "accesibilidad" | "ux" | "ihc";

export type Issue = {
  id: string;
  description: string;
  type: IssueType;
  severity: 1 | 2 | 3 | 4 | 5;
  levelDetected: UXLevelId;
  timestamp: number;
};

export type Improvement = {
  id: string;
  feature: string;
  label: string;
  appliedAt: number;
};

export type Metrics = {
  startTime: number | null;
  endTime: number | null;
  errorCount: number;
  clickCount: number;
  abandoned: boolean;
  level: UXLevelId;
};

export type SessionMetrics = {
  levelId: UXLevelId;
  timeToComplete: number | null;
  errorCount: number;
  clickCount: number;
};

// ──────────────────────────────────────────
// Store Zustand
// ──────────────────────────────────────────

type Store = {
  // Estado principal
  uxLevel: UXLevelId;
  issues: Issue[];
  improvements: Improvement[];
  metrics: Metrics;
  sessionHistory: SessionMetrics[];
  completed: boolean;

  // Acciones de nivel
  setLevel: (level: UXLevelId) => void;

  // Acciones de issues
  addIssue: (issue: Omit<Issue, "id" | "timestamp" | "levelDetected">) => void;
  removeIssue: (id: string) => void;

  // Acciones de mejoras
  addImprovement: (feature: string, label: string) => void;
  removeImprovement: (feature: string) => void;

  // Métricas
  startSession: () => void;
  endSession: () => void;
  incrementError: () => void;
  incrementClick: () => void;
  setAbandoned: () => void;

  // Reset
  resetSession: () => void;
  resetAll: () => void;
};

const defaultMetrics = (level: UXLevelId): Metrics => ({
  startTime: null,
  endTime: null,
  errorCount: 0,
  clickCount: 0,
  abandoned: false,
  level,
});

export const useStore = create<Store>((set, get) => ({
  uxLevel: 1,
  issues: [],
  improvements: [],
  metrics: defaultMetrics(1),
  sessionHistory: [],
  completed: false,

  setLevel: (level) =>
    set({ uxLevel: level, metrics: defaultMetrics(level), completed: false }),

  addIssue: (issue) => {
    const { uxLevel } = get();
    set((s) => ({
      issues: [
        ...s.issues,
        {
          ...issue,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          levelDetected: uxLevel,
        },
      ],
    }));
  },

  removeIssue: (id) =>
    set((s) => ({ issues: s.issues.filter((i) => i.id !== id) })),

  addImprovement: (feature, label) => {
    const exists = get().improvements.find((i) => i.feature === feature);
    if (exists) return;
    set((s) => ({
      improvements: [
        ...s.improvements,
        { id: crypto.randomUUID(), feature, label, appliedAt: Date.now() },
      ],
    }));
  },

  removeImprovement: (feature) =>
    set((s) => ({
      improvements: s.improvements.filter((i) => i.feature !== feature),
    })),

  startSession: () =>
    set((s) => ({
      metrics: { ...s.metrics, startTime: Date.now() },
    })),

  endSession: () => {
    const { metrics } = get();
    const endTime = Date.now();
    const timeToComplete =
      metrics.startTime ? endTime - metrics.startTime : null;
    set((s) => ({
      metrics: { ...s.metrics, endTime },
      completed: true,
      sessionHistory: [
        ...s.sessionHistory,
        {
          levelId: metrics.level,
          timeToComplete,
          errorCount: metrics.errorCount,
          clickCount: metrics.clickCount,
        },
      ],
    }));
  },

  incrementError: () =>
    set((s) => ({
      metrics: { ...s.metrics, errorCount: s.metrics.errorCount + 1 },
    })),

  incrementClick: () =>
    set((s) => ({
      metrics: { ...s.metrics, clickCount: s.metrics.clickCount + 1 },
    })),

  setAbandoned: () =>
    set((s) => ({ metrics: { ...s.metrics, abandoned: true } })),

  resetSession: () => {
    const { uxLevel } = get();
    set({ metrics: defaultMetrics(uxLevel), completed: false });
  },

  resetAll: () =>
    set({
      uxLevel: 1,
      issues: [],
      improvements: [],
      metrics: defaultMetrics(1),
      sessionHistory: [],
      completed: false,
    }),
}));
