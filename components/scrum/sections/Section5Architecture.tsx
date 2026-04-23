"use client";

import { useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

interface Scenario { id: number; text: string; context: string; correct: 4|9; explanation: string; }

const SCENARIOS: Scenario[] = [
  { id: 1, correct: 4, context: "Nuevo proyecto, Sprint 0",
    text: "Inicias un nuevo sistema de gestión universitaria. El equipo acaba de formarse y ningún código ha sido escrito.",
    explanation: "La Ceremonia 4 (Definición de la arquitectura base) es obligatoria y se realiza UNA SOLA VEZ antes del primer sprint. Define el patrón arquitectónico, la estrategia de implantación y las tecnologías base." },
  { id: 2, correct: 9, context: "Sprint 3 — Problema emergente",
    text: "En el sprint 3, el equipo descubrió que la base de datos elegida no soporta eficientemente las consultas de reportes complejos.",
    explanation: "La Ceremonia 9 (Refinamiento de la arquitectura) se aplica en los sprints 1 a n cuando surgen elementos nuevos o problemas que requieren ajustar decisiones arquitectónicas." },
  { id: 3, correct: 9, context: "Sprint 5 — Nueva restricción",
    text: "El sprint 5 introduce historias con criterios de aceptación complejos relacionados con seguridad y encriptación no contemplados antes.",
    explanation: "La Ceremonia 9 corresponde aquí: se necesita seleccionar nuevos conceptos de diseño para los criterios complejos y actualizar la documentación con nuevos elementos tecnológicos." },
  { id: 4, correct: 4, context: "Antes del primer sprint",
    text: "El equipo necesita decidir si usará arquitectura en capas, microservicios o cliente-servidor para el sistema que va a construir.",
    explanation: "Esta es exactamente la tarea principal de la Ceremonia 4: seleccionar el patrón/estilo arquitectónico antes de iniciar cualquier desarrollo." },
];

export function Section5Architecture() {
  const { addXP, unlockBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, 4|9>>({});
  const [checked, setChecked] = useState(false);
  const [bonusAwarded, setBonusAwarded] = useState(false);

  function handleVerify() {
    const sc = SCENARIOS.filter((s) => answers[s.id] === s.correct).length;
    setChecked(true);
    if (!bonusAwarded) {
      setBonusAwarded(true);
      if (sc === 4) {
        play("correct");
        addXP(75, "¡Arquitecto perfecto! 4/4");
        unlockBadge("arquitecto_agil");
      } else if (sc >= 3) {
        play("correct");
        addXP(30, `Buena identificación: ${sc}/4 ceremonias`);
      } else {
        play("wrong");
      }
    }
  }

  function selectAnswer(id: number, c: 4|9) {
    if (checked) return;
    setAnswers((a) => ({ ...a, [id]: c }));
  }

  function reset() { setAnswers({}); setChecked(false); }

  const allAnswered = SCENARIOS.every((s) => answers[s.id] !== undefined);
  const score = SCENARIOS.filter((s) => answers[s.id] === s.correct).length;

  return (
    <SectionWrapper
      sectionNumber={5}
      icon="🏗️"
      title="Arquitectura de Software en Scrum"
      objective="Comprender cómo se integra el diseño arquitectónico en Scrum mediante dos ceremonias, y distinguir cuándo aplicar cada una."
    >
      {/* Problema */}
      <div className="sl-callout-warning" style={{ marginBottom: 28 }} role="note">
        <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--sl-warning)" }}>⚠ El problema:</strong>{" "}
          Scrum no tiene un rol de arquitecto explícito ni una ceremonia de diseño de
          arquitectura. Sin abordarlo deliberadamente, el sistema acumula deuda técnica.
        </p>
      </div>

      {/* Enfoques */}
      <section aria-labelledby="design-approaches" style={{ marginBottom: 32 }}>
        <h2
          id="design-approaches"
          style={{ fontSize: 22, fontWeight: 700, color: "var(--sl-text)", marginBottom: 16 }}
        >
          Dos Enfoques de Diseño
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="sl-card" style={{ padding: "22px", borderColor: "var(--sl-danger)" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-danger)", marginBottom: 12 }}>
              ❌ Diseño Emergente
            </p>
            <p style={{ fontSize: 15, color: "var(--sl-text-muted)", lineHeight: 1.8 }}>
              El diseño &ldquo;emerge&rdquo; de la implementación sin planeación previa. No
              siempre es adecuado y suele generar deuda técnica significativa.
            </p>
          </div>
          <div className="sl-card" style={{ padding: "22px", borderColor: "var(--sl-success)" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-success)", marginBottom: 12 }}>
              ✅ Diseño Planeado Incremental
            </p>
            <p style={{ fontSize: 15, color: "var(--sl-text-muted)", lineHeight: 1.8 }}>
              Se planea deliberadamente antes de implementar y se refina
              gradualmente sprint a sprint. Es el enfoque propuesto para Scrum.
            </p>
          </div>
        </div>
      </section>

      {/* Ceremonias */}
      <section aria-labelledby="ceremonies-heading" style={{ marginBottom: 36 }}>
        <h2
          id="ceremonies-heading"
          style={{ fontSize: 22, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          Dos Ceremonias Propuestas
        </h2>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 20, lineHeight: 1.7 }}>
          Haz clic en cada tarjeta para expandir los detalles.
        </p>

        <CeremonyCard
          number={4} icon="🏛️" color="#F59E0B"
          title="Definición de la arquitectura base"
          subtitle="Obligatoria · Una sola vez · Antes del primer sprint"
          isExpanded={expandedCard === "c4"}
          onToggle={() => setExpandedCard(expandedCard === "c4" ? null : "c4")}
          steps={[
            "Seleccionar patrón/estilo arquitectónico (ej: capas para sistemas web)",
            "Seleccionar estrategia de implantación (ej: cliente ligero + servidor de aplicaciones + servidor de datos)",
            "Selección inicial de tecnologías (ej: Hibernate para persistencia)",
            "Documentar la arquitectura (aspectos lógicos y físicos)",
            "Verificar el diseño: ¿soporta historias de mayor valor? ¿atiende restricciones? ¿modularidad, cohesión, acoplamiento bajo? ¿desarrollo paralelo?",
          ]}
          note="Esta ceremonia es OBLIGATORIA y se realiza solo una vez. Crea la base arquitectónica sobre la que se construirá todo el sistema."
        />

        <CeremonyCard
          number={9} icon="🔧" color="#7C3AED"
          title="Refinamiento de la arquitectura"
          subtitle="Opcional · Sprints 1 a n"
          isExpanded={expandedCard === "c9"}
          onToggle={() => setExpandedCard(expandedCard === "c9" ? null : "c9")}
          steps={[
            "Seleccionar conceptos de diseño para criterios de aceptación complejos",
            "Actualizar documentación y selección tecnológica si hay elementos nuevos",
            "Verificar que las nuevas decisiones no afecten negativamente el diseño existente",
          ]}
          note="Se aplica cuando surgen historias con criterios de aceptación complejos o cuando se detectan necesidades de ajuste arquitectónico."
        />
      </section>

      {/* Conceptos adicionales */}
      <section aria-labelledby="extra-concepts" style={{ marginBottom: 36 }}>
        <h3
          id="extra-concepts"
          style={{ fontSize: 18, fontWeight: 700, color: "var(--sl-text)", marginBottom: 16 }}
        >
          Conceptos adicionales
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "📊", title: "Atributos de calidad y restricciones",
              desc: "Se documentan en historias de usuario y en un tablero Kanban con columna de restricciones." },
            { icon: "🗺️", title: "Vistas de arquitectura",
              desc: "Documentación simple con notaciones informales, visible para todo el equipo. Sin grandes artefactos formales." },
            { icon: "🤝", title: "El arquitecto en Scrum",
              desc: "Responsabilidades compartidas. Si hay una persona con ese rol, actúa como facilitador y también codifica." },
          ].map((item) => (
            <div
              key={item.title}
              className="sl-card"
              style={{ padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "var(--sl-text)", marginBottom: 6 }}>
                  {item.title}
                </p>
                <p style={{ fontSize: 15, color: "var(--sl-text-muted)", lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actividad */}
      <section
        aria-labelledby="activity-heading"
        style={{ background: "var(--sl-bg-soft)", border: "1px solid var(--sl-border)", borderRadius: 16, padding: "28px" }}
      >
        <h3
          id="activity-heading"
          style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          🎮 Actividad: ¿Qué ceremonia aplicarías?
        </h3>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 22, lineHeight: 1.7 }}>
          Actúa como arquitecto del equipo. Lee cada escenario y selecciona
          cuál de las dos ceremonias arquitectónicas aplicarías.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {SCENARIOS.map((scenario) => {
            const ans = answers[scenario.id];
            const isCorrect = checked && ans === scenario.correct;
            const isWrong = checked && ans !== undefined && ans !== scenario.correct;
            return (
              <div
                key={scenario.id}
                className="sl-card"
                style={{
                  padding: "20px 24px",
                  borderColor: isCorrect ? "var(--sl-success)" : isWrong ? "var(--sl-danger)" : "var(--sl-border)",
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--sl-text-muted)", display: "block", marginBottom: 6 }}>
                    Escenario {scenario.id} · {scenario.context}
                  </span>
                  <p style={{ fontSize: 16, color: "var(--sl-text-mid)", lineHeight: 1.8 }}>{scenario.text}</p>
                </div>

                <div role="group" aria-label={`Respuesta para escenario ${scenario.id}`} style={{ display: "flex", gap: 12 }}>
                  {([4, 9] as (4|9)[]).map((cn) => {
                    const isSel = ans === cn;
                    const btnOk = checked && cn === scenario.correct;
                    const btnBad = checked && isSel && cn !== scenario.correct;
                    return (
                      <button
                        key={cn}
                        onClick={() => selectAnswer(scenario.id, cn)}
                        disabled={checked}
                        aria-pressed={isSel}
                        aria-label={`Ceremonia ${cn}${isSel ? " (seleccionada)" : ""}`}
                        style={{
                          padding: "10px 24px", borderRadius: 8, minHeight: 44,
                          border: `1px solid ${btnOk ? "var(--sl-success)" : btnBad ? "var(--sl-danger)" : isSel ? "var(--sl-primary)" : "var(--sl-border-light)"}`,
                          background: btnOk ? "var(--sl-success-bg)" : btnBad ? "var(--sl-danger-bg)" : isSel ? "var(--sl-primary-glow)" : "var(--sl-card)",
                          color: btnOk ? "var(--sl-success)" : btnBad ? "var(--sl-danger)" : isSel ? "var(--sl-primary)" : "var(--sl-text-muted)",
                          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                          fontSize: 15, fontWeight: isSel ? 700 : 400,
                          cursor: checked ? "default" : "pointer", transition: "all 0.15s",
                        }}
                      >
                        Ceremonia {cn}
                      </button>
                    );
                  })}
                </div>

                {checked && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{
                      marginTop: 14, padding: "12px 16px", borderRadius: 8,
                      background: isCorrect ? "var(--sl-success-bg)" : "var(--sl-danger-bg)",
                    }}
                  >
                    <p style={{ fontSize: 14, color: isCorrect ? "var(--sl-success)" : "var(--sl-danger)", lineHeight: 1.7 }}>
                      <strong>{isCorrect ? "✓ Correcto:" : "✗ Incorrecto:"}</strong>{" "}
                      {scenario.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
          {allAnswered && !checked && (
            <button onClick={handleVerify} className="sl-btn sl-btn-primary">
              ✓ Verificar respuestas
            </button>
          )}
          <button onClick={reset} className="sl-btn sl-btn-ghost">🔄 Reiniciar</button>
          {checked && (
            <div
              role="status"
              style={{
                padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 15,
                background: score === 4 ? "var(--sl-success-bg)" : score >= 3 ? "var(--sl-warning-bg)" : "var(--sl-danger-bg)",
                color: score === 4 ? "var(--sl-success)" : score >= 3 ? "var(--sl-warning)" : "var(--sl-danger)",
              }}
            >
              {score === 4 ? "🏆 ¡Excelente! 4/4" : `Resultado: ${score}/4`}
            </div>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
}

function CeremonyCard({ number, title, subtitle, color, icon, isExpanded, onToggle, steps, note }: {
  number: number; title: string; subtitle: string; color: string; icon: string;
  isExpanded: boolean; onToggle: () => void; steps: string[]; note: string;
}) {
  return (
    <div
      style={{
        background: "var(--sl-card)",
        border: `1px solid ${isExpanded ? color : "var(--sl-border)"}`,
        borderRadius: 12, overflow: "hidden", marginBottom: 14,
        transition: "border-color 0.2s",
        boxShadow: isExpanded ? `0 0 0 1px ${color}22, 0 4px 20px ${color}18` : "none",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`ceremony-detail-${number}`}
        style={{
          width: "100%", padding: "20px 24px", display: "flex", alignItems: "center",
          gap: 16, cursor: "pointer", background: "transparent", border: "none",
          textAlign: "left", minHeight: 72,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 52, height: 52, borderRadius: 12,
            background: `${color}20`, border: `1px solid ${color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Ceremonia {number}
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--sl-text)", marginBottom: 3 }}>{title}</p>
          <p style={{ fontSize: 14, color: "var(--sl-text-muted)" }}>{subtitle}</p>
        </div>
        <span aria-hidden="true" style={{ color: "var(--sl-text-muted)", fontSize: 14, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      <div id={`ceremony-detail-${number}`} hidden={!isExpanded} style={{ padding: "0 24px 22px", borderTop: `1px solid ${color}30` }}>
        <ol style={{ paddingLeft: 22, margin: "18px 0 0" }}>
          {steps.map((step, i) => (
            <li key={i} style={{ color: "var(--sl-text-mid)", fontSize: 15, lineHeight: 1.8, paddingLeft: 4, marginBottom: 8 }}>
              {step}
            </li>
          ))}
        </ol>
        <div style={{ marginTop: 16, padding: "12px 16px", background: `${color}12`, borderRadius: 8, borderLeft: `3px solid ${color}` }} role="note">
          <p style={{ fontSize: 14, color, fontWeight: 600, lineHeight: 1.6 }}>💡 {note}</p>
        </div>
      </div>
    </div>
  );
}
