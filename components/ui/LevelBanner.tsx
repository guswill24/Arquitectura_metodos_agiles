"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUXConfig } from "@/lib/config/ux-context";

const LEVEL_META: Record<1 | 2 | 3 | 4 | 5, {
  icon: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  learn: string;
  applies: string[];
}> = {
  1: {
    icon: "💀", badgeBg: "#FEE2E2", badgeText: "#B91C1C", borderColor: "#E03131",
    learn: "Identifica los errores críticos: sin contraste, sin etiquetas accesibles, sin flujo guiado. Esta interfaz viola principios básicos de IHC.",
    applies: ["Heurísticas de Nielsen violadas", "Contraste WCAG reprobado", "Sin jerarquía visual", "Carga cognitiva máxima"],
  },
  2: {
    icon: "😐", badgeBg: "#FFEDD5", badgeText: "#C2410C", borderColor: "#E8650A",
    learn: "La validación existe, pero solo al enviar. Sin feedback inline ni estados de carga, el usuario no sabe si sus acciones tuvieron efecto.",
    applies: ["Validación tardía (on-submit)", "Sin errores en línea", "Sin estados de carga", "Fricción alta"],
  },
  3: {
    icon: "👍", badgeBg: "#FEF9C3", badgeText: "#854D0E", borderColor: "#C49A00",
    learn: "Estándar funcional: errores inline, feedback claro y jerarquía visual consistente. Cumple lo básico pero carece de accesibilidad completa.",
    applies: ["Errores en tiempo real", "Feedback visual claro", "Jerarquía tipográfica", "Flujo en pasos"],
  },
  4: {
    icon: "⭐", badgeBg: "#DBEAFE", badgeText: "#1E40AF", borderColor: "#1971C2",
    learn: "ARIA completo, navegación por teclado y microinteracciones con Framer Motion. El usuario siente que el sistema lo guía con precisión.",
    applies: ["ARIA roles y atributos", "Teclado: Tab / Enter / Esc", "Microinteracciones Framer Motion", "Focus management"],
  },
  5: {
    icon: "🏆", badgeBg: "#DCFCE7", badgeText: "#15803D", borderColor: "#4D9E25",
    learn: "Máximo nivel: WCAG 2.1 activable, contraste AA/AAA, soporte cognitivo con tracker de pasos y accesibilidad motriz con targets de 56px.",
    applies: ["WCAG 2.1 AA/AAA (contraste)", "Soporte cognitivo (etiquetas + tracker)", "Accesibilidad motriz (targets ≥ 44px)", "Skip link + atajos de teclado"],
  },
};

export function LevelBanner() {
  const config = useUXConfig();
  const meta = LEVEL_META[config.id];
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="sticky top-0 z-20"
      style={{ borderBottom: "1px solid var(--guru-border)" }}
    >
      {/* ── Barra siempre visible ── */}
      <div
        className="flex items-center justify-between px-6 py-2.5"
        style={{ background: meta.badgeBg }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none" aria-hidden="true">{meta.icon}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: meta.badgeText + "22", color: meta.badgeText }}
          >
            Nivel {config.id}
          </span>
          <span className="text-sm font-semibold" style={{ color: meta.badgeText }}>
            {config.name}
          </span>
          <span
            className="text-xs hidden sm:inline"
            style={{ color: meta.badgeText + "99" }}
          >
            · &ldquo;{config.tagline}&rdquo;
          </span>
        </div>

        {/* Botón toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{
            background: "white",
            color: meta.badgeText,
            border: `1px solid ${meta.borderColor}44`,
          }}
          aria-expanded={expanded}
          aria-controls="level-info-panel"
        >
          {expanded ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Minimizar
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ver descripción del nivel
            </>
          )}
        </button>
      </div>

      {/* ── Panel expandido ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id="level-info-panel"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden", background: "white", borderTop: `1px solid ${meta.borderColor}33` }}
          >
            <div className="px-8 py-5">
              {/* Callout educativo */}
              <div
                className="rounded-r-lg px-4 py-3 mb-4"
                style={{
                  borderLeft: `4px solid ${meta.borderColor}`,
                  background: meta.badgeBg,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: meta.badgeText }}
                >
                  ¿Qué observarás en este nivel?
                </p>
                <p className="text-sm" style={{ color: "var(--guru-text)" }}>
                  {meta.learn}
                </p>
              </div>

              {/* Tags de conceptos */}
              <div className="flex flex-wrap gap-2">
                {meta.applies.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--guru-bg-soft)",
                      color: "var(--guru-text-mid)",
                      border: "1px solid var(--guru-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
