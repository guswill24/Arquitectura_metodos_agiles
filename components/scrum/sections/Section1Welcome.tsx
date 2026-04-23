"use client";

import { useState } from "react";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

export function Section1Welcome() {
  const { studentName, setStudentName, goToSection, markComplete, addXP, unlockBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [inputVal, setInputVal] = useState(studentName);
  const [error, setError] = useState("");

  function handleStart() {
    if (!inputVal.trim()) {
      play("wrong");
      setError("Por favor ingresa tu nombre para continuar.");
      return;
    }
    play("start");
    setStudentName(inputVal.trim());
    markComplete(1);
    addXP(50, "¡Bienvenido al Scrum Lab!");
    unlockBadge("primer_paso");
    goToSection(2);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondos decorativos — aria-hidden para no interferir con lectores */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: "20%", left: "50%",
          transform: "translateX(-50%)", width: 600, height: 400,
          background: "radial-gradient(ellipse at center, rgba(0,180,216,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "15%", right: "10%",
          width: 300, height: 300,
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 660, textAlign: "center", width: "100%" }}>
        {/* Badge contextual */}
        <div
          role="note"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 24,
            border: "1px solid var(--sl-border-light)",
            background: "var(--sl-card)",
            fontSize: 14, color: "var(--sl-text-muted)",
            marginBottom: 32,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "var(--sl-success)", display: "inline-block",
            }}
          />
          Laboratorio interactivo · Métodos Ágiles &amp; Scrum
        </div>

        {/* Título principal */}
        <h1
          style={{
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
            fontSize: "clamp(38px, 5vw, 54px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "var(--sl-text)",
          }}
        >
          Scrum Lab:{" "}
          <span className="sl-gradient-text">
            Arquitectura y Métodos Ágiles
          </span>
        </h1>

        {/* Descripción */}
        <p
          style={{
            fontSize: 18,
            color: "var(--sl-text-mid)",
            lineHeight: 1.8,
            marginBottom: 40,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}
        >
          Explora cómo Scrum organiza el desarrollo de software y cómo se
          integra la arquitectura en un contexto ágil. Una experiencia educativa
          interactiva, paso a paso.
        </p>

        {/* Características */}
        <div
          aria-label="Características del laboratorio"
          style={{
            display: "flex", gap: 12, justifyContent: "center",
            flexWrap: "wrap", marginBottom: 44,
          }}
        >
          {[
            { icon: "🎯", label: "7 secciones" },
            { icon: "🎮", label: "Actividades prácticas" },
            { icon: "📊", label: "Simuladores" },
            { icon: "🧠", label: "Quiz final" },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 8,
                background: "var(--sl-card)", border: "1px solid var(--sl-border)",
                fontSize: 14, color: "var(--sl-text-mid)",
              }}
            >
              <span aria-hidden="true">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Formulario de nombre */}
        <div
          style={{
            background: "var(--sl-card)",
            border: "1px solid var(--sl-border-light)",
            borderRadius: 16,
            padding: "32px 36px",
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          <label
            htmlFor="student-name"
            style={{
              display: "block",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--sl-text-mid)",
              marginBottom: 12,
            }}
          >
            ¿Cuál es tu nombre?
          </label>
          <input
            id="student-name"
            type="text"
            className="sl-input"
            placeholder="Ej: María García"
            value={inputVal}
            autoComplete="given-name"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "name-error" : undefined}
            onChange={(e) => { setInputVal(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          {error && (
            <p
              id="name-error"
              role="alert"
              style={{
                fontSize: 14,
                color: "var(--sl-danger)",
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              ⚠ {error}
            </p>
          )}
        </div>

        <button
          onClick={handleStart}
          className="sl-btn sl-btn-primary"
          style={{ fontSize: 16, padding: "14px 40px", width: "100%" }}
        >
          🚀 Comenzar el recorrido
        </button>

        <p
          style={{
            fontSize: 14,
            color: "var(--sl-text-muted)",
            marginTop: 18,
            lineHeight: 1.6,
          }}
        >
          Basado en el Capítulo 7: Arquitectura de Software y Métodos Ágiles (Scrum)
        </p>
      </div>
    </div>
  );
}
