"use client";

import { useCallback } from "react";
import { useScrumStore } from "@/lib/store/scrum-store";

export type SoundKey =
  | "click"
  | "xp"
  | "correct"
  | "wrong"
  | "complete"
  | "badge"
  | "levelup"
  | "start";

/* ── AudioContext singleton ────────────────────────────────── */
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

/* ── Utilidad para crear una nota ──────────────────────────── */
function note(
  ac: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  freqEnd?: number,
) {
  const osc  = ac.createOscillator();
  const gain = ac.createGain();

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);
  }

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.06);
}

/* ── Biblioteca de sonidos ─────────────────────────────────── */
const SOUNDS: Record<SoundKey, (ac: AudioContext) => void> = {

  /* Clic suave en botones */
  click: (ac) => {
    const t = ac.currentTime;
    note(ac, 880, t, 0.04, 0.06, "sine");
  },

  /* Inicio del recorrido — bienvenida ascendente */
  start: (ac) => {
    const t = ac.currentTime;
    [261, 329, 392, 523].forEach((f, i) =>
      note(ac, f, t + i * 0.08, 0.14, 0.18, "triangle"),
    );
  },

  /* XP ganado — arpeggio C-E-G rápido */
  xp: (ac) => {
    const t = ac.currentTime;
    note(ac, 523, t,        0.09, 0.20, "sine");
    note(ac, 659, t + 0.08, 0.09, 0.20, "sine");
    note(ac, 784, t + 0.16, 0.15, 0.25, "sine");
  },

  /* Respuesta correcta — dos dings ascendentes */
  correct: (ac) => {
    const t = ac.currentTime;
    note(ac, 659, t,        0.12, 0.20, "sine");
    note(ac, 880, t + 0.11, 0.20, 0.28, "sine");
  },

  /* Respuesta incorrecta — buzz descendente breve */
  wrong: (ac) => {
    const t = ac.currentTime;
    note(ac, 280, t,        0.10, 0.18, "sawtooth", 200);
    note(ac, 200, t + 0.12, 0.18, 0.14, "sawtooth", 150);
  },

  /* Sección completada — C-E-G-C cuarteto */
  complete: (ac) => {
    const t = ac.currentTime;
    note(ac, 523,  t,        0.10, 0.22, "triangle");
    note(ac, 659,  t + 0.10, 0.10, 0.22, "triangle");
    note(ac, 784,  t + 0.20, 0.10, 0.22, "triangle");
    note(ac, 1047, t + 0.30, 0.30, 0.28, "triangle");
  },

  /* Insignia desbloqueada — fanfarria C-E-G-C + brillo */
  badge: (ac) => {
    const t = ac.currentTime;
    [523, 659, 784, 1047].forEach((f, i) =>
      note(ac, f, t + i * 0.10, 0.14, 0.22, "triangle"),
    );
    /* Nota sostenida final con armónico */
    note(ac, 1047, t + 0.44, 0.55, 0.28, "sine");
    note(ac, 2093, t + 0.44, 0.30, 0.07, "sine"); // brillo C7
  },

  /* Subida de nivel — escala diatónica ascendente + remate */
  levelup: (ac) => {
    const t = ac.currentTime;
    const run = [392, 440, 494, 523, 659, 784]; // G4-A4-B4-C5-E5-G5
    run.forEach((f, i) =>
      note(ac, f, t + i * 0.07, 0.12, 0.20, "triangle"),
    );
    note(ac, 1047, t + run.length * 0.07, 0.55, 0.32, "triangle"); // C6 final
  },
};

/* ── Hook público ──────────────────────────────────────────── */
export function useSoundEffects() {
  const soundEnabled = useScrumStore((s) => s.soundEnabled);

  const play = useCallback(
    (key: SoundKey) => {
      if (!soundEnabled) return;
      const ac = getCtx();
      if (!ac) return;
      try {
        SOUNDS[key](ac);
      } catch {
        /* fallo silencioso si el navegador bloquea el audio */
      }
    },
    [soundEnabled],
  );

  return { play };
}

/* Versión sin hook (para usar fuera de componentes React) */
export function playSoundDirect(key: SoundKey, enabled: boolean) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  try { SOUNDS[key](ac); } catch { /* noop */ }
}
