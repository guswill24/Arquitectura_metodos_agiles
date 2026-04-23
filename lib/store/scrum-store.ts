import { create } from 'zustand';

/* ── Insignias ─────────────────────────────────────────────── */
export interface BadgeDef {
  id: string; icon: string; name: string; desc: string;
}

export const BADGES: BadgeDef[] = [
  { id: 'primer_paso',       icon: '🌱', name: 'Primer Paso',        desc: 'Iniciaste el recorrido ingresando tu nombre' },
  { id: 'agil_corazon',      icon: '💚', name: 'Ágil de Corazón',    desc: 'Clasificaste todos los valores ágiles correctamente (8/8)' },
  { id: 'conocedor_roles',   icon: '👔', name: 'Conocedor de Roles', desc: 'Exploraste los 3 roles de Scrum en profundidad' },
  { id: 'maestro_proceso',   icon: '⚙️', name: 'Maestro del Proceso',desc: 'Ordenaste perfectamente las ceremonias del sprint' },
  { id: 'arquitecto_agil',   icon: '🏗️', name: 'Arquitecto Ágil',   desc: 'Identificaste correctamente las 4 ceremonias arquitectónicas' },
  { id: 'deuda_controlada',  icon: '💎', name: 'Deuda Controlada',   desc: 'Finalizaste el simulador con deuda técnica ≤ 30%' },
  { id: 'scrum_scholar',     icon: '🎓', name: 'Scrum Scholar',      desc: 'Obtuviste 80% o más en la evaluación final' },
  { id: 'campeon_agil',      icon: '🏆', name: 'Campeón Ágil',       desc: 'Completaste todo el curso con excelencia' },
];

/* ── Niveles ───────────────────────────────────────────────── */
export interface LevelDef {
  level: number; name: string; icon: string; color: string;
  minXP: number; maxXP: number;
}

export const LEVELS: LevelDef[] = [
  { level: 1, name: 'Aprendiz',          icon: '🌱', color: '#10B981', minXP: 0,    maxXP: 249  },
  { level: 2, name: 'Practicante Ágil',  icon: '⚡', color: '#F59E0B', minXP: 250,  maxXP: 599  },
  { level: 3, name: 'Scrum Developer',   icon: '🔄', color: '#00B4D8', minXP: 600,  maxXP: 999  },
  { level: 4, name: 'Scrum Master',      icon: '🏆', color: '#7C3AED', minXP: 1000, maxXP: 9999 },
];

export function getLevel(xp: number): LevelDef {
  return LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP) ?? LEVELS[LEVELS.length - 1];
}

/* ── Store ─────────────────────────────────────────────────── */
export interface XPToast { id: string; amount: number; reason: string; }

export interface ScrumState {
  /* Progreso */
  studentName: string;
  currentSection: number;
  completedSections: number[];
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;

  /* Gamificación */
  xp: number;
  earnedBadges: string[];
  pendingXPToast: XPToast | null;
  pendingBadge: BadgeDef | null;

  /* Acciones — progreso */
  setStudentName: (name: string) => void;
  goToSection: (n: number) => void;
  markComplete: (n: number) => void;
  setQuizAnswer: (q: number, a: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;

  /* Acciones — gamificación */
  addXP: (amount: number, reason: string) => void;
  unlockBadge: (id: string) => void;
  clearXPToast: () => void;
  clearBadge: () => void;

  /* Sonido */
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useScrumStore = create<ScrumState>((set) => ({
  studentName: '',
  currentSection: 1,
  completedSections: [],
  quizAnswers: {},
  quizSubmitted: false,

  xp: 0,
  earnedBadges: [],
  pendingXPToast: null,
  pendingBadge: null,

  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  setStudentName: (name) => set({ studentName: name }),

  goToSection: (n) => set({ currentSection: n }),

  markComplete: (n) =>
    set((s) => {
      if (s.completedSections.includes(n)) return {};
      // +100 XP por cada sección completada por primera vez
      const toast: XPToast = { id: Date.now().toString(), amount: 100, reason: `Sección ${n} completada` };
      return {
        completedSections: [...s.completedSections, n],
        xp: s.xp + 100,
        pendingXPToast: toast,
      };
    }),

  setQuizAnswer: (q, a) =>
    set((s) => ({ quizAnswers: { ...s.quizAnswers, [q]: a } })),

  submitQuiz: () => set({ quizSubmitted: true }),

  resetQuiz: () => set({ quizAnswers: {}, quizSubmitted: false }),

  addXP: (amount, reason) =>
    set((s) => ({
      xp: s.xp + amount,
      pendingXPToast: { id: Date.now().toString(), amount, reason },
    })),

  unlockBadge: (id) =>
    set((s) => {
      if (s.earnedBadges.includes(id)) return {};
      const def = BADGES.find((b) => b.id === id);
      if (!def) return {};

      const newBadges = [...s.earnedBadges, id];
      // Si se ganan los 8 logros, desbloquear Campeón Ágil automáticamente
      const allUnlocked =
        id === 'campeon_agil' || newBadges.length === BADGES.length - 1;

      return {
        earnedBadges: newBadges,
        pendingBadge: def,
        ...(allUnlocked && !newBadges.includes('campeon_agil')
          ? { earnedBadges: [...newBadges, 'campeon_agil'] }
          : {}),
      };
    }),

  clearXPToast: () => set({ pendingXPToast: null }),
  clearBadge:   () => set({ pendingBadge: null }),
}));
