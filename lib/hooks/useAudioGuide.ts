"use client";

import { useCallback, useRef, useState, useEffect } from "react";

export type AudioGuide = {
  enabled: boolean;
  supported: boolean;
  toggle: () => void;
  speak: (text: string, options?: SpeakOptions) => void;
  stop: () => void;
};

type SpeakOptions = {
  /** Si true, cancela el audio en curso antes de hablar */
  interrupt?: boolean;
  rate?: number;
};

// Instrucciones por paso del flujo
export const STEP_AUDIO: Record<number, string> = {
  0: "Paso uno de cuatro: selección de especialidad. Elige el tipo de consulta médica que necesitas de la lista. Usa la tecla Tab para navegar y Enter para seleccionar.",
  1: "Paso dos de cuatro: selección de médico. Elige un profesional disponible según la especialidad que escogiste. Los médicos no disponibles están deshabilitados.",
  2: "Paso tres de cuatro: fecha y horario. Selecciona el día y la hora que mejor se ajusten a tu agenda. Solo aparecen horarios disponibles.",
  3: "Paso cuatro de cuatro: confirmación. Revisa el resumen de tu cita. Cuando todo esté correcto, presiona Confirmar cita.",
};

export const COMPLETED_AUDIO =
  "¡Listo! Tu cita médica ha sido confirmada exitosamente. Recibirás un recordatorio próximamente.";

export function useAudioGuide(): AudioGuide {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!enabled || !synthRef.current) return;

      if (options.interrupt !== false) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = options.rate ?? 0.88;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Preferir voz en español si existe
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(
        (v) => v.lang.startsWith("es") && !v.name.includes("compact")
      );
      if (spanishVoice) utterance.voice = spanishVoice;

      synthRef.current.speak(utterance);
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      if (prev) synthRef.current?.cancel();
      return !prev;
    });
  }, []);

  return { enabled, supported, toggle, speak, stop };
}
