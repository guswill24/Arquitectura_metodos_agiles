"use client";

import { useState, useEffect, useRef } from "react";
import { useScrumStore, getLevel, BADGES } from "@/lib/store/scrum-store";
import { BadgesModal } from "./gamification/BadgesModal";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

const SECTIONS = [
  { n: 1, icon: "🏠", label: "Bienvenida" },
  { n: 2, icon: "🌱", label: "Métodos Ágiles" },
  { n: 3, icon: "🔄", label: "Scrum General" },
  { n: 4, icon: "⚙️", label: "Proceso Scrum" },
  { n: 5, icon: "🏗️", label: "Arquitectura en Scrum" },
  { n: 6, icon: "💳", label: "Deuda Técnica" },
  { n: 7, icon: "📝", label: "Evaluación Final" },
];

export function Sidebar() {
  const {
    currentSection, completedSections, goToSection,
    studentName, xp, earnedBadges, soundEnabled, toggleSound,
  } = useScrumStore();

  const { play } = useSoundEffects();
  const [showBadges, setShowBadges] = useState(false);
  const prevLevelRef = useRef<number>(0);

  const progress = Math.round((completedSections.length / 7) * 100);
  const lvl = getLevel(xp);
  const lvlPct = lvl.level < 4
    ? Math.round(((xp - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100)
    : 100;

  /* Detectar subida de nivel y reproducir sonido */
  useEffect(() => {
    if (prevLevelRef.current === 0) { prevLevelRef.current = lvl.level; return; }
    if (lvl.level > prevLevelRef.current) {
      prevLevelRef.current = lvl.level;
      play("levelup");
    }
  }, [lvl.level, play]);

  return (
    <>
      <aside
        aria-label="Navegación del curso"
        style={{
          width: 272,
          flexShrink: 0,
          background: "var(--sl-sidebar)",
          borderRight: "1px solid var(--sl-border)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--sl-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
            <div
              aria-hidden="true"
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--sl-gradient)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}
            >
              🚀
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-space),'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "var(--sl-text)", lineHeight: 1.2 }}>
                Scrum Lab
              </p>
              <p style={{ fontSize: 13, color: "var(--sl-text-muted)", marginTop: 1 }}>
                Arquitectura &amp; Ágiles
              </p>
            </div>

            {/* Botón de silencio / sonido */}
            <button
              onClick={() => { toggleSound(); play("click"); }}
              aria-label={soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}
              aria-pressed={!soundEnabled}
              title={soundEnabled ? "Silenciar" : "Activar sonidos"}
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                border: "1px solid var(--sl-border-light)",
                background: "transparent",
                color: soundEnabled ? "var(--sl-primary)" : "var(--sl-text-muted)",
                cursor: "pointer", fontSize: 17,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>

          {studentName && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--sl-primary-glow)", borderRadius: 8, fontSize: 13, color: "var(--sl-primary)", fontWeight: 500 }}>
              👤 {studentName}
            </div>
          )}
        </div>

        {/* Bloque de gamificación */}
        <div style={{ padding: "14px 12px", borderBottom: "1px solid var(--sl-border)" }}>
          {/* Nivel + XP */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              aria-hidden="true"
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `${lvl.color}20`,
                border: `1.5px solid ${lvl.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}
            >
              {lvl.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: lvl.color }}>
                Nv.{lvl.level} · {lvl.name}
              </p>
              {/* Mini barra de XP */}
              <div
                role="progressbar"
                aria-valuenow={lvlPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${xp} XP — ${lvlPct}% hacia el siguiente nivel`}
                style={{ height: 5, background: "var(--sl-border)", borderRadius: 3, overflow: "hidden", marginTop: 5 }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${lvlPct}%`,
                    background: `linear-gradient(90deg,${lvl.color},#7C3AED)`,
                    borderRadius: 3,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
            <span
              aria-label={`${xp} puntos de experiencia`}
              style={{ fontFamily: "var(--font-space),'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 800, color: lvl.color, flexShrink: 0 }}
            >
              {xp}
            </span>
          </div>

          {/* Botón de insignias */}
          <button
            onClick={() => setShowBadges(true)}
            aria-label={`Ver logros: ${earnedBadges.length} de ${BADGES.length} insignias desbloqueadas`}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--sl-border-light)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            {/* Miniaturas de las últimas insignias ganadas */}
            <div style={{ display: "flex", gap: 3 }}>
              {BADGES.slice(0, 5).map((b) => (
                <span
                  key={b.id}
                  aria-hidden="true"
                  style={{
                    fontSize: 15,
                    filter: earnedBadges.includes(b.id) ? "none" : "grayscale(1) opacity(0.35)",
                    transition: "filter 0.3s",
                  }}
                >
                  {b.icon}
                </span>
              ))}
            </div>
            <span style={{ flex: 1, fontSize: 13, color: "var(--sl-text-muted)", textAlign: "left" }}>
              {earnedBadges.length}/{BADGES.length} logros
            </span>
            <span aria-hidden="true" style={{ fontSize: 12, color: "var(--sl-text-muted)" }}>›</span>
          </button>
        </div>

        {/* Navegación */}
        <nav aria-label="Secciones del curso" style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sl-text-muted)", padding: "6px 12px", marginBottom: 4 }}>
            Secciones
          </p>

          {SECTIONS.map(({ n, icon, label }) => {
            const isActive = currentSection === n;
            const isDone   = completedSections.includes(n);
            return (
              <button
                key={n}
                onClick={() => goToSection(n)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Ir a sección ${n}: ${label}${isDone ? " (completada)" : ""}`}
                className={`sl-nav-item ${isActive ? "sl-nav-item-active" : ""}`}
              >
                <span aria-hidden="true" style={{ fontSize: 17, lineHeight: 1 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {isDone && !isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "var(--sl-success-bg)", border: "1px solid var(--sl-success)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "var(--sl-success)", flexShrink: 0, fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
                {isActive && (
                  <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sl-primary)", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Progreso del curso */}
        <div role="region" aria-label="Progreso del curso" style={{ padding: "16px", borderTop: "1px solid var(--sl-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--sl-text-muted)" }}>Progreso</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--sl-primary)" }}>{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress}% del curso completado`}
            style={{ height: 6, background: "var(--sl-border)", borderRadius: 4, overflow: "hidden" }}
          >
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--sl-gradient)", borderRadius: 4, transition: "width 0.4s ease" }} />
          </div>
          <p style={{ fontSize: 13, color: "var(--sl-text-muted)", marginTop: 8 }}>
            {completedSections.length} de 7 secciones completadas
          </p>
        </div>
      </aside>

      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}
    </>
  );
}
