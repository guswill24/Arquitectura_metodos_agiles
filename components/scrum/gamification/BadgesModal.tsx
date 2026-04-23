"use client";

import { useEffect, useRef } from "react";
import { useScrumStore, BADGES, getLevel } from "@/lib/store/scrum-store";

interface Props { onClose: () => void; }

export function BadgesModal({ onClose }: Props) {
  const { earnedBadges, xp } = useScrumStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Foco al abrir — WCAG 2.4.3 */
  useEffect(() => { closeRef.current?.focus(); }, []);

  /* Cerrar con Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const lvl = getLevel(xp);
  const nextLvl = lvl.level < 4
    ? { xp: lvl.maxXP + 1, name: lvl.name }
    : null;
  const pct = nextLvl
    ? Math.round(((xp - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100)
    : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="badges-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 12000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0F1120",
          border: "1px solid #1E2440",
          borderRadius: 20,
          padding: "32px 36px",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2
            id="badges-title"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#E2E8F0",
            }}
          >
            🏅 Mis Logros
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar panel de logros"
            style={{
              width: 36, height: 36, borderRadius: 8, border: "1px solid #1E2440",
              background: "transparent", color: "#64748B", cursor: "pointer",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Nivel y XP */}
        <div
          style={{
            background: "#131626",
            borderRadius: 14,
            padding: "20px 22px",
            marginBottom: 28,
            border: "1px solid #1E2440",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div
              aria-hidden="true"
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${lvl.color}25`,
                border: `1.5px solid ${lvl.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, flexShrink: 0,
              }}
            >
              {lvl.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: lvl.color, marginBottom: 3 }}>
                Nivel {lvl.level}
              </p>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>
                {lvl.name}
              </p>
            </div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 800, color: lvl.color }}>
              {xp} <span style={{ fontSize: 14, fontWeight: 600 }}>XP</span>
            </p>
          </div>

          {/* Barra XP */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>Progreso al siguiente nivel</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: lvl.color }}>{pct}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${pct}% hacia el siguiente nivel`}
              style={{ height: 8, background: "#1E2440", borderRadius: 6, overflow: "hidden" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: `linear-gradient(90deg,${lvl.color},#7C3AED)`,
                  borderRadius: 6,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            {lvl.level < 4 && (
              <p style={{ fontSize: 12, color: "#64748B", marginTop: 5 }}>
                {lvl.maxXP + 1 - xp} XP para alcanzar{" "}
                {lvl.level === 1 ? "Practicante Ágil" : lvl.level === 2 ? "Scrum Developer" : "Scrum Master"}
              </p>
            )}
          </div>
        </div>

        {/* Grid de insignias */}
        <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: 14 }}>
          Insignias — {earnedBadges.length}/{BADGES.length}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {BADGES.map((badge) => {
            const earned = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                aria-label={`${badge.name}${earned ? " — desbloqueada" : " — bloqueada"}`}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1px solid ${earned ? "rgba(0,180,216,0.3)" : "#1E2440"}`,
                  background: earned ? "rgba(0,180,216,0.06)" : "#131626",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.2s",
                  opacity: earned ? 1 : 0.45,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: 28,
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    background: earned ? "rgba(0,180,216,0.12)" : "#1E2440",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    filter: earned ? "none" : "grayscale(1)",
                  }}
                >
                  {earned ? badge.icon : "🔒"}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: earned ? "#E2E8F0" : "#64748B", marginBottom: 3 }}>
                    {badge.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    {earned ? badge.desc : "Aún no desbloqueada"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
