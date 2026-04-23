"use client";

import { ReactNode } from "react";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

interface Props {
  sectionNumber: number;
  icon: string;
  title: string;
  objective: string;
  children: ReactNode;
}

export function SectionWrapper({ sectionNumber, icon, title, objective, children }: Props) {
  const { goToSection, markComplete, completedSections } = useScrumStore();
  const { play } = useSoundEffects();
  const hasPrev = sectionNumber > 1;
  const hasNext = sectionNumber < 7;

  function handlePrev() {
    play("click");
    goToSection(sectionNumber - 1);
  }

  function handleNext() {
    const alreadyDone = completedSections.includes(sectionNumber);
    markComplete(sectionNumber);
    if (!alreadyDone) play("complete");
    else play("click");
    goToSection(sectionNumber + 1);
  }

  return (
    <div
      style={{
        maxWidth: 840,
        margin: "0 auto",
        padding: "44px 36px 72px",
        width: "100%",
      }}
    >
      {/* Header de sección */}
      <header style={{ marginBottom: 36 }}>
        <span
          className="sl-tag"
          style={{
            background: "var(--sl-primary-glow)",
            color: "var(--sl-primary)",
            marginBottom: 14,
            display: "inline-flex",
          }}
          aria-label={`Sección ${sectionNumber}`}
        >
          {icon} Sección {sectionNumber}
        </span>

        <h1
          style={{
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
            fontSize: 34,
            fontWeight: 700,
            color: "var(--sl-text)",
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Objetivo de aprendizaje — Nielsen H10: Ayuda y documentación */}
        <div
          className="sl-callout"
          role="note"
          aria-label="Objetivo de aprendizaje"
        >
          <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--sl-primary)" }}>
              🎯 Objetivo de aprendizaje:
            </strong>{" "}
            {objective}
          </p>
        </div>
      </header>

      {/* Contenido de la sección */}
      {children}

      {/* Navegación entre secciones */}
      <nav
        aria-label="Navegación entre secciones"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 56,
          paddingTop: 28,
          borderTop: "1px solid var(--sl-border)",
        }}
      >
        {hasPrev ? (
          <button
            onClick={handlePrev}
            aria-label={`Ir a la sección anterior (${sectionNumber - 1})`}
            className="sl-btn sl-btn-outline"
          >
            ← Anterior
          </button>
        ) : (
          <div />
        )}

        {hasNext ? (
          <button
            onClick={handleNext}
            aria-label={`Marcar sección completa e ir a la siguiente (${sectionNumber + 1})`}
            className="sl-btn sl-btn-primary"
          >
            Siguiente →
          </button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
