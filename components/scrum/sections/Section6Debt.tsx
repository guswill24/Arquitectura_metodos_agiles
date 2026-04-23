"use client";

import { useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

interface SprintDecision {
  sprint: number; choice: "fast" | "design"; debtAdded: number; debtTotal: number;
}

const TOTAL_SPRINTS = 5;

export function Section6Debt() {
  const { addXP, unlockBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [decisions, setDecisions] = useState<SprintDecision[]>([]);
  const [finished, setFinished] = useState(false);
  const [bonusAwarded, setBonusAwarded] = useState(false);

  const currentSprint = decisions.length + 1;
  const currentDebt = decisions.length > 0 ? decisions[decisions.length - 1].debtTotal : 0;

  function decide(choice: "fast" | "design") {
    const prevDebt = decisions.length > 0 ? decisions[decisions.length - 1].debtTotal : 0;
    const debtAdded = choice === "fast" ? 20 : 3;
    const debtTotal = Math.min(100, prevDebt + debtAdded);
    const newDecisions = [...decisions, { sprint: currentSprint, choice, debtAdded, debtTotal }];
    setDecisions(newDecisions);
    if (newDecisions.length === TOTAL_SPRINTS) {
      setFinished(true);
      if (!bonusAwarded) {
        setBonusAwarded(true);
        const finalDebt = Math.min(100, prevDebt + debtAdded);
        if (finalDebt <= 30) {
          play("correct");
          addXP(75, "¡Deuda técnica controlada!");
          unlockBadge("deuda_controlada");
        } else if (finalDebt <= 60) {
          play("correct");
          addXP(30, "Deuda técnica moderada manejada");
        } else {
          play("wrong");
        }
      }
    }
  }

  function reset() { setDecisions([]); setFinished(false); }

  const fastCount = decisions.filter((d) => d.choice === "fast").length;
  const designCount = decisions.filter((d) => d.choice === "design").length;

  function getEndMsg() {
    if (fastCount >= 4) return { icon: "😰", color: "var(--sl-danger)", bg: "var(--sl-danger-bg)", title: "¡Tu equipo está en crisis!", text: `Con ${Math.round(currentDebt)}% de deuda técnica, el equipo pasa más tiempo corrigiendo problemas del pasado que entregando nuevo valor.` };
    if (fastCount >= 2) return { icon: "⚠️", color: "var(--sl-warning)", bg: "var(--sl-warning-bg)", title: "Deuda moderada — ¡Atención!", text: `Con ${Math.round(currentDebt)}% de deuda, el sistema empieza a mostrar deterioro. Los costos de mantenimiento aumentarán.` };
    return { icon: "🏆", color: "var(--sl-success)", bg: "var(--sl-success-bg)", title: "¡Excelente gestión!", text: `Con solo ${Math.round(currentDebt)}% de deuda técnica, tu equipo mantiene velocidad sostenida. El diseño cuidadoso rindió frutos.` };
  }

  return (
    <SectionWrapper
      sectionNumber={6}
      icon="💳"
      title="Deuda Técnica"
      objective="Comprender el concepto de deuda técnica, sus causas y consecuencias, y experimentar cómo las decisiones de diseño afectan la sostenibilidad del proyecto."
    >
      {/* Definición */}
      <div className="sl-card" style={{ padding: "26px 30px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 14 }}>
          ¿Qué es la Deuda Técnica?
        </h2>
        <p style={{ fontSize: 16, color: "var(--sl-text-mid)", lineHeight: 1.8 }}>
          Es la <strong style={{ color: "var(--sl-text)" }}>metáfora de la &ldquo;deuda&rdquo;</strong>{" "}
          que se adquiere al omitir diseño para acelerar las entregas. Como una deuda financiera,
          si no se paga genera &ldquo;intereses&rdquo;: costos crecientes en tiempo y salarios
          para realizar cambios futuros.
        </p>
      </div>

      {/* Causas y consecuencias */}
      <section aria-labelledby="causes-heading" style={{ marginBottom: 28 }}>
        <h2 id="causes-heading" className="sr-only">Causas y consecuencias</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="sl-card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-warning)", marginBottom: 14 }}>⚠ Causas</p>
            {["Requerimientos cambiantes sin rediseño", "Equipos sin experiencia en diseño", "Presión de fechas y entregas", "Omisión deliberada de arquitectura"].map((c, i, arr) => (
              <p key={i} style={{ fontSize: 15, color: "var(--sl-text-muted)", paddingBottom: 10, marginBottom: 10, borderBottom: i < arr.length - 1 ? "1px solid var(--sl-border)" : "none", lineHeight: 1.6 }}>
                · {c}
              </p>
            ))}
          </div>
          <div className="sl-card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-danger)", marginBottom: 14 }}>🔴 Consecuencias</p>
            {["Costos altos para realizar cambios", "Incremento del tiempo de desarrollo", "Alta probabilidad de defectos", "Equipos desmotivados y agotados"].map((c, i, arr) => (
              <p key={i} style={{ fontSize: 15, color: "var(--sl-text-muted)", paddingBottom: 10, marginBottom: 10, borderBottom: i < arr.length - 1 ? "1px solid var(--sl-border)" : "none", lineHeight: 1.6 }}>
                · {c}
              </p>
            ))}
          </div>
        </div>
      </section>

      <div className="sl-callout" style={{ marginBottom: 36 }} role="note">
        <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--sl-primary)" }}>💡 Mensaje clave:</strong>{" "}
          Minimizar la deuda técnica debe evaluarse conscientemente en todo proyecto, ágil o no.
          La deuda acumulada eventualmente paraliza al equipo.
        </p>
      </div>

      {/* Simulador */}
      <section
        aria-labelledby="debt-sim-heading"
        style={{ background: "var(--sl-bg-soft)", border: "1px solid var(--sl-border)", borderRadius: 16, padding: "28px" }}
      >
        <h3
          id="debt-sim-heading"
          style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          🎮 Simulador de Deuda Técnica
        </h3>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 24, lineHeight: 1.7 }}>
          Toma decisiones durante {TOTAL_SPRINTS} sprints y observa cómo la deuda se acumula
          o se controla. ¿Entregas rápido sin diseño o inviertes en arquitectura?
        </p>

        {/* Medidor de deuda */}
        <div
          role="region"
          aria-label="Nivel de deuda técnica"
          style={{ background: "var(--sl-card)", borderRadius: 12, padding: "22px", marginBottom: 22 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--sl-text-mid)" }}>
              Deuda técnica acumulada
            </span>
            <span
              style={{
                fontSize: 22, fontWeight: 700,
                color: currentDebt >= 60 ? "var(--sl-danger)" : currentDebt >= 30 ? "var(--sl-warning)" : "var(--sl-success)",
              }}
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${Math.round(currentDebt)} por ciento de deuda técnica`}
            >
              {Math.round(currentDebt)}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={Math.round(currentDebt)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Barra de deuda técnica"
            style={{ height: 18, background: "var(--sl-border)", borderRadius: 10, overflow: "hidden", position: "relative" }}
          >
            <div aria-hidden="true" style={{ position: "absolute", left: "30%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.15)" }} />
            <div aria-hidden="true" style={{ position: "absolute", left: "60%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.15)" }} />
            <div
              style={{
                height: "100%", width: `${currentDebt}%`, borderRadius: 10,
                background: currentDebt >= 60 ? "var(--sl-danger)" : currentDebt >= 30 ? "var(--sl-warning)" : "var(--sl-success)",
                transition: "width 0.5s ease, background 0.3s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 13, color: "var(--sl-success)" }}>Manejable</span>
            <span style={{ fontSize: 13, color: "var(--sl-warning)" }}>Moderada</span>
            <span style={{ fontSize: 13, color: "var(--sl-danger)" }}>Crítica</span>
          </div>
        </div>

        {/* Historial */}
        {decisions.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--sl-text-muted)", marginBottom: 12 }}>
              Historial de decisiones
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {decisions.map((d) => (
                <div
                  key={d.sprint}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    background: "var(--sl-card)", borderRadius: 8, border: "1px solid var(--sl-border)",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--sl-text-muted)", minWidth: 64 }}>
                    Sprint {d.sprint}
                  </span>
                  <span
                    style={{
                      fontSize: 13, padding: "3px 10px", borderRadius: 6, fontWeight: 600,
                      background: d.choice === "fast" ? "var(--sl-danger-bg)" : "var(--sl-success-bg)",
                      color: d.choice === "fast" ? "var(--sl-danger)" : "var(--sl-success)",
                    }}
                  >
                    {d.choice === "fast" ? "⚡ Entrega rápida" : "🏗️ Con diseño"}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--sl-text-muted)", flex: 1 }}>
                    +{d.debtAdded}% deuda
                  </span>
                  <div style={{ width: 64, height: 8, background: "var(--sl-border)", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%", width: `${d.debtTotal}%`, borderRadius: 4,
                        background: d.debtTotal >= 60 ? "var(--sl-danger)" : d.debtTotal >= 30 ? "var(--sl-warning)" : "var(--sl-success)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de decisión */}
        {!finished && (
          <div>
            <p
              aria-live="polite"
              style={{ fontSize: 16, fontWeight: 600, color: "var(--sl-text)", marginBottom: 16, textAlign: "center" }}
            >
              Sprint {currentSprint} de {TOTAL_SPRINTS} — ¿Qué decides?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <button
                onClick={() => decide("fast")}
                style={{
                  padding: "20px 22px", borderRadius: 12, minHeight: 100,
                  border: "1px solid var(--sl-danger)", background: "var(--sl-danger-bg)",
                  cursor: "pointer", textAlign: "left",
                }}
                aria-label={`Sprint ${currentSprint}: Entregar rápido sin diseño (+20% deuda)`}
              >
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-danger)", marginBottom: 8 }}>⚡ Entregar rápido</p>
                <p style={{ fontSize: 14, color: "var(--sl-text-muted)", lineHeight: 1.6 }}>
                  Sin diseño previo. Más features este sprint pero +20% deuda técnica.
                </p>
              </button>

              <button
                onClick={() => decide("design")}
                style={{
                  padding: "20px 22px", borderRadius: 12, minHeight: 100,
                  border: "1px solid var(--sl-success)", background: "var(--sl-success-bg)",
                  cursor: "pointer", textAlign: "left",
                }}
                aria-label={`Sprint ${currentSprint}: Invertir en diseño (+3% deuda)`}
              >
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--sl-success)", marginBottom: 8 }}>🏗️ Invertir en diseño</p>
                <p style={{ fontSize: 14, color: "var(--sl-text-muted)", lineHeight: 1.6 }}>
                  Velocidad inicial menor pero solo +3% deuda. Sostenible a largo plazo.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Resultado final */}
        {finished && (() => {
          const msg = getEndMsg();
          return (
            <div>
              <div
                role="status"
                aria-live="polite"
                style={{ padding: "24px 28px", borderRadius: 12, background: msg.bg, border: `1px solid ${msg.color}40`, marginBottom: 18 }}
              >
                <p aria-hidden="true" style={{ fontSize: 36, marginBottom: 10 }}>{msg.icon}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: msg.color, marginBottom: 10 }}>{msg.title}</p>
                <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.8, marginBottom: 20 }}>{msg.text}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  <Stat label="Deuda final" value={`${Math.round(currentDebt)}%`} color={msg.color} />
                  <Stat label="Sprints rápidos" value={`${fastCount}/${TOTAL_SPRINTS}`} color="var(--sl-danger)" />
                  <Stat label="Sprints con diseño" value={`${designCount}/${TOTAL_SPRINTS}`} color="var(--sl-success)" />
                </div>
              </div>
              <button onClick={reset} className="sl-btn sl-btn-ghost">
                🔄 Intentar con otra estrategia
              </button>
            </div>
          );
        })()}
      </section>
    </SectionWrapper>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-space),'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color }}>{value}</p>
      <p style={{ fontSize: 13, color: "var(--sl-text-muted)", marginTop: 4 }}>{label}</p>
    </div>
  );
}
