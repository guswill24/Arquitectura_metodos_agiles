"use client";

import { useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

interface Ceremony {
  n: number; icon: string; name: string; result?: string; detail: string;
  phase: "pre" | "sprint";
}

const CEREMONIES: Ceremony[] = [
  { n: 1, icon: "✍️", phase: "pre", name: "Especificación de historias de usuario",
    detail: "Se redactan las historias de usuario que describen funcionalidades desde la perspectiva del usuario final." },
  { n: 2, icon: "🎯", phase: "pre", name: "Priorización de historias de usuario",
    detail: "El Product Owner ordena las historias según valor de negocio, riesgo y dependencias técnicas." },
  { n: 3, icon: "📋", phase: "pre", name: "Especificación de tareas", result: "Backlog del proyecto",
    detail: "Las historias se descomponen en tareas técnicas. El resultado es el Backlog completo del proyecto." },
  { n: 4, icon: "⚖️", phase: "pre", name: "Estimación de esfuerzo",
    detail: "El equipo estima las historias en puntos de historia usando técnicas como Planning Poker." },
  { n: 5, icon: "📅", phase: "pre", name: "Planeación de entregas",
    detail: "Se define cantidad de sprints, duración, costo estimado y distribución de historias por sprint." },
  { n: 6, icon: "🗺️", phase: "sprint", name: "Planeación del sprint", result: "Backlog del sprint",
    detail: "El equipo selecciona las historias del Backlog que desarrollará en el sprint." },
  { n: 7, icon: "🔍", phase: "sprint", name: "Refinamiento de historias de usuario",
    detail: "Se detallan criterios de aceptación de historias seleccionadas para asegurar claridad." },
  { n: 8, icon: "💻", phase: "sprint", name: "Desarrollo del producto",
    detail: "El equipo trabaja en las historias del sprint implementando funcionalidades." },
  { n: 9, icon: "☀️", phase: "sprint", name: "Junta diaria del sprint",
    detail: "Reunión de 15 min diarios: ¿qué hice ayer? ¿qué haré hoy? ¿hay impedimentos?" },
  { n: 10, icon: "🎤", phase: "sprint", name: "Revisión del sprint (demostración)",
    detail: "El equipo demuestra el software funcional al Product Owner y stakeholders." },
  { n: 11, icon: "🔄", phase: "sprint", name: "Retrospectiva del sprint",
    detail: "El equipo reflexiona: ¿qué salió bien? ¿qué mejorar? ¿qué acciones tomar?" },
  { n: 12, icon: "📝", phase: "sprint", name: "Refinamiento del backlog",
    detail: "Se actualizan y priorizan historias pendientes para preparar el siguiente sprint." },
];

const SPRINT_CERS = CEREMONIES.filter((c) => c.phase === "sprint");

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function Section4Process() {
  const { addXP, unlockBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [expandedCeremony, setExpandedCeremony] = useState<number | null>(null);
  const [simItems] = useState<Ceremony[]>(() => shuffle(SPRINT_CERS));
  const [selected, setSelected] = useState<number[]>([]);
  const [simChecked, setSimChecked] = useState(false);
  const [bonusAwarded, setBonusAwarded] = useState(false);

  function selectCeremony(n: number) {
    if (simChecked) return;
    setSelected((s) => s.includes(n) ? s.filter((x) => x !== n) : [...s, n]);
  }

  function resetSim() { setSelected([]); setSimChecked(false); }

  const correctOrder = SPRINT_CERS.map((c) => c.n);
  const isCorrect = simChecked && selected.length === correctOrder.length
    && selected.every((n, i) => n === correctOrder[i]);

  function handleVerify() {
    setSimChecked(true);
    if (!bonusAwarded) {
      setBonusAwarded(true);
      const correct = selected.filter((n, i) => n === correctOrder[i]).length;
      if (correct === correctOrder.length) {
        play("correct");
        addXP(75, "¡Secuencia perfecta del sprint!");
        unlockBadge("maestro_proceso");
      } else if (correct >= 4) {
        play("correct");
        addXP(30, `Buen orden: ${correct}/${correctOrder.length} correctas`);
      } else {
        play("wrong");
      }
    }
  }

  return (
    <SectionWrapper
      sectionNumber={4}
      icon="⚙️"
      title="El Proceso de Scrum"
      objective="Identificar y secuenciar las 12 ceremonias de Scrum, distinguiendo las fases Pre-Sprint y las ceremonias repetidas en cada Sprint."
    >
      {/* Conceptos clave */}
      <section aria-labelledby="concepts-heading" style={{ marginBottom: 32 }}>
        <h2
          id="concepts-heading"
          className="sr-only"
        >
          Conceptos clave
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { icon: "⏳", title: "Sprint", color: "#00B4D8",
              desc: "Iteración de duración fija de 1 a 4 semanas" },
            { icon: "⚡", title: "Velocidad", color: "#7C3AED",
              desc: "Puntos de historia completados por sprint. Se estabiliza tras el 3.er sprint" },
            { icon: "📦", title: "Backlog", color: "#10B981",
              desc: "Del proyecto (global) vs. del sprint (comprometido en la iteración)" },
          ].map((c) => (
            <div key={c.title} className="sl-card" style={{ padding: "18px 20px" }}>
              <div aria-hidden="true" style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</p>
              <p style={{ fontSize: 14, color: "var(--sl-text-muted)", lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-heading" style={{ marginBottom: 44 }}>
        <h2
          id="timeline-heading"
          style={{ fontSize: 22, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          Las 12 Ceremonias — Flujo del Proceso
        </h2>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 22, lineHeight: 1.7 }}>
          Haz clic en cada ceremonia para ver sus detalles.
        </p>

        {/* Pre-Sprint */}
        <div style={{ marginBottom: 28 }}>
          <PhaseLabel label="PRE-SPRINT" color="var(--sl-warning)" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CEREMONIES.filter((c) => c.phase === "pre").map((c) => (
              <TimelineItem
                key={c.n} ceremony={c}
                expanded={expandedCeremony === c.n}
                onToggle={() => setExpandedCeremony(expandedCeremony === c.n ? null : c.n)}
                phaseColor="#F59E0B"
              />
            ))}
          </div>
        </div>

        {/* Sprint */}
        <div>
          <PhaseLabel
            label="DURANTE CADA SPRINT · Patrón: Planeación → Desarrollo → Demo → Retro"
            color="var(--sl-primary)"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CEREMONIES.filter((c) => c.phase === "sprint").map((c) => (
              <TimelineItem
                key={c.n} ceremony={c}
                expanded={expandedCeremony === c.n}
                onToggle={() => setExpandedCeremony(expandedCeremony === c.n ? null : c.n)}
                phaseColor="#00B4D8"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Simulador de Sprint */}
      <section
        aria-labelledby="sim-heading"
        style={{
          background: "var(--sl-bg-soft)", border: "1px solid var(--sl-border)",
          borderRadius: 16, padding: "28px",
        }}
      >
        <h3
          id="sim-heading"
          style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          🎮 Simulador de Sprint
        </h3>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 22, lineHeight: 1.7 }}>
          Las ceremonias del sprint están desordenadas. Haz clic en ellas{" "}
          <strong>en el orden correcto</strong> para construir la secuencia ideal de un sprint.
        </p>

        {/* Orden seleccionado */}
        {selected.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: "14px 18px", background: "var(--sl-card)", borderRadius: 10,
              marginBottom: 18, border: "1px solid var(--sl-border)",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Tu orden ({selected.length}/{SPRINT_CERS.length}):
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {selected.map((n, idx) => {
                const c = SPRINT_CERS.find((x) => x.n === n)!;
                const ok = !simChecked || n === correctOrder[idx];
                return (
                  <div
                    key={n}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "5px 12px", borderRadius: 20, fontSize: 13,
                      background: simChecked
                        ? ok ? "var(--sl-success-bg)" : "var(--sl-danger-bg)"
                        : "var(--sl-border)",
                      color: simChecked
                        ? ok ? "var(--sl-success)" : "var(--sl-danger)"
                        : "var(--sl-text-mid)",
                    }}
                  >
                    <span>{idx + 1}.</span>
                    <span aria-hidden="true">{c.icon}</span>
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ceremonias barajadas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {simItems.map((c) => {
            const isSel = selected.includes(c.n);
            const selIdx = selected.indexOf(c.n);
            return (
              <button
                key={c.n}
                onClick={() => selectCeremony(c.n)}
                disabled={simChecked}
                aria-pressed={isSel}
                aria-label={isSel ? `${c.name} — posición ${selIdx + 1} en tu orden` : c.name}
                style={{
                  padding: "14px 18px", borderRadius: 10, minHeight: 56,
                  border: `1px solid ${isSel ? "var(--sl-primary)" : "var(--sl-border)"}`,
                  background: isSel ? "var(--sl-primary-glow)" : "var(--sl-card)",
                  color: isSel ? "var(--sl-primary)" : "var(--sl-text-mid)",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: simChecked ? "default" : "pointer", textAlign: "left",
                  fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                  fontSize: 14, fontWeight: isSel ? 600 : 400, transition: "all 0.15s",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 18 }}>{c.icon}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                {isSel && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "var(--sl-primary)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {selIdx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {selected.length === SPRINT_CERS.length && !simChecked && (
            <button onClick={handleVerify} className="sl-btn sl-btn-primary">
              ✓ Verificar secuencia
            </button>
          )}
          <button onClick={resetSim} className="sl-btn sl-btn-ghost">🔄 Reiniciar</button>
          {simChecked && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 15,
                background: isCorrect ? "var(--sl-success-bg)" : "var(--sl-warning-bg)",
                color: isCorrect ? "var(--sl-success)" : "var(--sl-warning)",
              }}
            >
              {isCorrect ? "🏆 ¡Secuencia perfecta!" : "⚠ Revisa las posiciones marcadas en rojo"}
            </div>
          )}
        </div>
      </section>

      {/* Documento de referencia: The Scrum Engine */}
      <section
        aria-labelledby="scrum-doc-heading"
        style={{ marginTop: 48 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--sl-primary-glow)",
              border: "1px solid rgba(0,180,216,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            📄
          </div>
          <div>
            <h2
              id="scrum-doc-heading"
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--sl-text)",
                marginBottom: 3,
              }}
            >
              Documento de referencia: The Scrum Engine
            </h2>
            <p style={{ fontSize: 14, color: "var(--sl-text-muted)" }}>
              Visualiza el PDF completo del proceso Scrum. Usa el botón
              <strong style={{ color: "var(--sl-primary)" }}> Pantalla completa</strong> para
              una mejor lectura, o ábrelo en una nueva pestaña.
            </p>
          </div>
        </div>

        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--sl-border)",
            height: 620,
            display: "flex",
            flexDirection: "column",
            background: "#0F172A",
          }}
        >
          <PdfViewer
            src="/The_Scrum_Engine.pdf"
            title="The Scrum Engine — Proceso Scrum"
          />
        </div>
      </section>
    </SectionWrapper>
  );
}

function PhaseLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ height: 2, flex: 1, background: "var(--sl-border)" }} />
      <span
        className="sl-tag"
        style={{ background: `${color}18`, color, flexShrink: 0, textAlign: "center" }}
      >
        {label}
      </span>
      <div style={{ height: 2, flex: 1, background: "var(--sl-border)" }} />
    </div>
  );
}

function TimelineItem({ ceremony, expanded, onToggle, phaseColor }: {
  ceremony: Ceremony; expanded: boolean; onToggle: () => void; phaseColor: string;
}) {
  return (
    <div
      style={{
        background: "var(--sl-card)",
        border: `1px solid ${expanded ? phaseColor : "var(--sl-border)"}`,
        borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`ceremony-${ceremony.n}`}
        style={{
          width: "100%", padding: "14px 18px", display: "flex", alignItems: "center",
          gap: 14, cursor: "pointer", background: "transparent", border: "none",
          textAlign: "left", minHeight: 56,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${phaseColor}20`, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0, fontSize: 15,
          }}
        >
          {ceremony.icon}
        </div>
        <div
          aria-hidden="true"
          style={{
            width: 26, height: 26, borderRadius: "50%", background: phaseColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}
        >
          {ceremony.n}
        </div>
        <span style={{ flex: 1, fontSize: 15, color: "var(--sl-text-mid)" }}>
          {ceremony.name}
        </span>
        {ceremony.result && (
          <span
            aria-label={`Resultado: ${ceremony.result}`}
            style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 10,
              background: `${phaseColor}20`, color: phaseColor, fontWeight: 700, flexShrink: 0,
            }}
          >
            → {ceremony.result}
          </span>
        )}
        <span
          aria-hidden="true"
          style={{
            color: "var(--sl-text-muted)", fontSize: 13,
            transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>
      <div
        id={`ceremony-${ceremony.n}`}
        hidden={!expanded}
        style={{ padding: "0 18px 18px", borderTop: `1px solid ${phaseColor}30` }}
      >
        <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.8, paddingTop: 14 }}>
          {ceremony.detail}
        </p>
      </div>
    </div>
  );
}
