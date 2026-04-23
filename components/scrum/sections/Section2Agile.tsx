"use client";

import { useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

const MANIFESTO_VALUES = [
  { left: "Individuos e interacciones", right: "procesos y herramientas" },
  { left: "Software funcionando", right: "documentación extensiva" },
  { left: "Colaboración con el cliente", right: "negociación contractual" },
  { left: "Respuesta ante el cambio", right: "seguir un plan" },
];

const PRINCIPLES = [
  "Entrega temprana y continua de software funcional",
  "Bienvenidos los requisitos cambiantes",
  "Entregas frecuentes (semanas, no meses)",
  "Trabajo conjunto entre clientes y desarrolladores",
  "Individuos motivados con confianza y respaldo",
  "Comunicación cara a cara como método preferido",
  "Software funcional como medida de avance",
  "Desarrollo sostenido a ritmo constante",
  "Excelencia técnica y buen diseño continuo",
  "Simplicidad — maximizar el trabajo no hecho",
  "Equipos auto-organizados producen mejores diseños",
  "Adaptación regular a circunstancias cambiantes",
];

interface DragItem {
  id: number;
  text: string;
  category: "agil" | "tradicional";
}

const DRAG_ITEMS: DragItem[] = [
  { id: 1, text: "Los equipos se auto-organizan", category: "agil" },
  { id: 2, text: "Los requisitos son fijos desde el inicio del proyecto", category: "tradicional" },
  { id: 3, text: "El cliente colabora durante todo el proceso", category: "agil" },
  { id: 4, text: "El contrato define exactamente qué se entregará", category: "tradicional" },
  { id: 5, text: "Software funcionando es la medida de avance", category: "agil" },
  { id: 6, text: "Se sigue el plan inicial sin desviaciones", category: "tradicional" },
  { id: 7, text: "Responder al cambio tiene más valor que seguir el plan", category: "agil" },
  { id: 8, text: "Las aprobaciones se hacen por etapas en cascada", category: "tradicional" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function Section2Agile() {
  const { addXP, unlockBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [showPrinciples, setShowPrinciples] = useState(false);
  const [pending, setPending] = useState<DragItem[]>(() => shuffle(DRAG_ITEMS));
  const [agileBucket, setAgileBucket] = useState<DragItem[]>([]);
  const [tradBucket, setTradBucket] = useState<DragItem[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [bonusAwarded, setBonusAwarded] = useState(false);

  function moveItem(itemId: number, zone: "agil" | "tradicional" | "pending") {
    const item =
      pending.find((i) => i.id === itemId) ||
      agileBucket.find((i) => i.id === itemId) ||
      tradBucket.find((i) => i.id === itemId);
    if (!item) return;
    setPending((p) => p.filter((i) => i.id !== itemId));
    setAgileBucket((b) => b.filter((i) => i.id !== itemId));
    setTradBucket((b) => b.filter((i) => i.id !== itemId));
    if (zone === "agil") setAgileBucket((b) => [...b, item]);
    else if (zone === "tradicional") setTradBucket((b) => [...b, item]);
    else setPending((p) => [...p, item]);
    setChecked(false);
  }

  function onDrop(zone: "agil" | "tradicional") {
    if (draggingId !== null) { moveItem(draggingId, zone); setDraggingId(null); }
  }

  function onDropPending() {
    if (draggingId !== null) { moveItem(draggingId, "pending"); setDraggingId(null); }
  }

  function checkAnswers() {
    let correct = 0;
    agileBucket.forEach((item) => { if (item.category === "agil") correct++; });
    tradBucket.forEach((item) => { if (item.category === "tradicional") correct++; });
    setScore(correct);
    setChecked(true);
    // Gamificación: bonus por puntuación perfecta (solo una vez)
    if (!bonusAwarded) {
      setBonusAwarded(true);
      if (correct === 8) {
        play("correct");
        addXP(75, "¡Clasificación perfecta! 8/8");
        unlockBadge("agil_corazon");
      } else if (correct >= 6) {
        play("correct");
        addXP(30, `Buena clasificación: ${correct}/8`);
      } else {
        play("wrong");
      }
    }
  }

  function reset() {
    setPending(shuffle(DRAG_ITEMS));
    setAgileBucket([]); setTradBucket([]); setChecked(false); setScore(0);
  }

  const allPlaced = pending.length === 0;

  return (
    <SectionWrapper
      sectionNumber={2}
      icon="🌱"
      title="Métodos Ágiles — Fundamentos"
      objective="Comprender los valores y principios del Manifiesto Ágil y distinguirlos del enfoque de desarrollo tradicional."
    >
      {/* Definición */}
      <div className="sl-card" style={{ padding: "26px 30px", marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 14 }}>
          ¿Qué son los Métodos Ágiles?
        </h2>
        <p style={{ color: "var(--sl-text-mid)", fontSize: 16, lineHeight: 1.8 }}>
          Los <strong style={{ color: "var(--sl-text)" }}>métodos ágiles</strong> son
          métodos de desarrollo <em>iterativo e incremental</em> con equipos
          multifuncionales, auto-organizados e iteraciones cortas que producen
          partes operables del producto.
        </p>
      </div>

      {/* Los 4 valores */}
      <section aria-labelledby="valores-heading" style={{ marginBottom: 32 }}>
        <h2
          id="valores-heading"
          style={{ fontSize: 22, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          Manifiesto Ágil (2001) — Los 4 Valores
        </h2>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 18, lineHeight: 1.7 }}>
          El Manifiesto Ágil prioriza el elemento de la izquierda sobre el de
          la derecha, sin que el de la derecha carezca de valor.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MANIFESTO_VALUES.map((v, i) => (
            <div
              key={i}
              className="sl-card"
              style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--sl-primary)", minWidth: 22 }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--sl-text)", flex: 1 }}>
                {v.left}
              </span>
              <span
                style={{
                  fontSize: 12, background: "var(--sl-primary-glow)",
                  color: "var(--sl-primary)", padding: "3px 10px",
                  borderRadius: 6, fontWeight: 700, flexShrink: 0,
                }}
                aria-hidden="true"
              >
                sobre
              </span>
              <span
                style={{
                  fontSize: 15, color: "var(--sl-text-muted)", flex: 1, textAlign: "right",
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(148,163,184,0.4)",
                }}
              >
                {v.right}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Principios — colapsable */}
      <section aria-labelledby="principios-heading" style={{ marginBottom: 36 }}>
        <button
          id="principios-heading"
          onClick={() => setShowPrinciples((v) => !v)}
          aria-expanded={showPrinciples}
          aria-controls="principios-list"
          className="sl-card"
          style={{
            width: "100%", padding: "18px 22px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", border: "1px solid var(--sl-border)",
            background: "var(--sl-card)", borderRadius: 12,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--sl-text)" }}>
            📜 Los 12 Principios del Manifiesto Ágil
          </span>
          <span aria-hidden="true" style={{ color: "var(--sl-text-muted)", fontSize: 18 }}>
            {showPrinciples ? "▲" : "▼"}
          </span>
        </button>

        {showPrinciples && (
          <div
            id="principios-list"
            className="sl-card"
            style={{ padding: "22px 26px", marginTop: -1, borderRadius: "0 0 12px 12px", borderTop: "none" }}
          >
            <ol style={{ paddingLeft: 22, margin: 0 }}>
              {PRINCIPLES.map((p, i) => (
                <li
                  key={i}
                  style={{
                    color: "var(--sl-text-mid)", fontSize: 15,
                    lineHeight: 1.8, paddingLeft: 6, marginBottom: 6,
                  }}
                >
                  {p}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* Actividad Drag & Drop */}
      <section
        aria-labelledby="dragdrop-heading"
        style={{
          background: "var(--sl-bg-soft)", border: "1px solid var(--sl-border)",
          borderRadius: 16, padding: "28px",
        }}
      >
        <h3
          id="dragdrop-heading"
          style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          🎮 Actividad: Clasifica los Enfoques
        </h3>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 22, lineHeight: 1.7 }}>
          Arrastra cada frase a su categoría: <strong style={{ color: "var(--sl-primary)" }}>Valor Ágil</strong> o{" "}
          <strong style={{ color: "var(--sl-text-mid)" }}>Enfoque Tradicional</strong>.
          También puedes usar los botones de cada ítem para clasificarlo directamente.
        </p>

        {/* Items pendientes */}
        {pending.length > 0 && (
          <div
            className="sl-drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropPending}
            style={{ marginBottom: 22 }}
          >
            <p style={{ fontSize: 13, color: "var(--sl-text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
              Frases por clasificar
            </p>
            {pending.map((item) => (
              <DragCard
                key={item.id}
                item={item}
                isDragging={draggingId === item.id}
                checked={checked}
                onDragStart={() => setDraggingId(item.id)}
                onMoveAgil={() => moveItem(item.id, "agil")}
                onMoveTrad={() => moveItem(item.id, "tradicional")}
                showCorrect={false}
              />
            ))}
          </div>
        )}

        {/* Zonas de drop */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Ágil */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--sl-primary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🌱 Valor Ágil
            </p>
            <div
              className="sl-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop("agil")}
              style={{ minHeight: 150, borderColor: "rgba(0,180,216,0.3)", background: "rgba(0,180,216,0.04)" }}
              role="region"
              aria-label="Zona: Valor Ágil"
            >
              {agileBucket.length === 0 && (
                <p style={{ fontSize: 14, color: "var(--sl-text-muted)", textAlign: "center", padding: "24px 0" }}>
                  Suelta aquí
                </p>
              )}
              {agileBucket.map((item) => (
                <DragCard
                  key={item.id}
                  item={item}
                  isDragging={draggingId === item.id}
                  checked={checked}
                  isPlaced
                  isCorrect={item.category === "agil"}
                  onDragStart={() => setDraggingId(item.id)}
                  onMoveAgil={() => moveItem(item.id, "agil")}
                  onMoveTrad={() => moveItem(item.id, "tradicional")}
                  onMovePending={() => moveItem(item.id, "pending")}
                  showCorrect={checked}
                />
              ))}
            </div>
          </div>

          {/* Tradicional */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--sl-text-mid)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🏛️ Enfoque Tradicional
            </p>
            <div
              className="sl-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop("tradicional")}
              style={{ minHeight: 150, borderColor: "rgba(148,163,184,0.3)", background: "rgba(148,163,184,0.04)" }}
              role="region"
              aria-label="Zona: Enfoque Tradicional"
            >
              {tradBucket.length === 0 && (
                <p style={{ fontSize: 14, color: "var(--sl-text-muted)", textAlign: "center", padding: "24px 0" }}>
                  Suelta aquí
                </p>
              )}
              {tradBucket.map((item) => (
                <DragCard
                  key={item.id}
                  item={item}
                  isDragging={draggingId === item.id}
                  checked={checked}
                  isPlaced
                  isCorrect={item.category === "tradicional"}
                  onDragStart={() => setDraggingId(item.id)}
                  onMoveAgil={() => moveItem(item.id, "agil")}
                  onMoveTrad={() => moveItem(item.id, "tradicional")}
                  onMovePending={() => moveItem(item.id, "pending")}
                  showCorrect={checked}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          {allPlaced && !checked && (
            <button onClick={checkAnswers} className="sl-btn sl-btn-primary">
              ✓ Verificar respuestas
            </button>
          )}
          <button onClick={reset} className="sl-btn sl-btn-ghost">
            🔄 Reiniciar actividad
          </button>
          {checked && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 15,
                background: score >= 6 ? "var(--sl-success-bg)" : "var(--sl-warning-bg)",
                color: score >= 6 ? "var(--sl-success)" : "var(--sl-warning)",
              }}
            >
              {score === 8 ? "🏆 ¡Perfecto! 8/8" : score >= 6 ? `✓ Muy bien: ${score}/8` : `⚠ Sigue intentando: ${score}/8`}
            </div>
          )}
        </div>

        {!allPlaced && (
          <p style={{ fontSize: 14, color: "var(--sl-text-muted)", marginTop: 14, lineHeight: 1.6 }}>
            Clasifica todas las frases antes de verificar. Puedes arrastrarlas o usar los botones de cada ítem.
          </p>
        )}
      </section>
    </SectionWrapper>
  );
}

/* Tarjeta de drag con botones de accesibilidad como alternativa al arrastre */
function DragCard({
  item, isDragging, checked, isPlaced, isCorrect, showCorrect,
  onDragStart, onMoveAgil, onMoveTrad, onMovePending,
}: {
  item: DragItem; isDragging: boolean; checked: boolean;
  isPlaced?: boolean; isCorrect?: boolean; showCorrect?: boolean;
  onDragStart: () => void;
  onMoveAgil: () => void; onMoveTrad: () => void; onMovePending?: () => void;
}) {
  const correct = showCorrect ? isCorrect : undefined;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="sl-drag-item"
      style={{
        opacity: isDragging ? 0.4 : 1,
        borderColor: correct === true ? "var(--sl-success)" : correct === false ? "var(--sl-danger)" : undefined,
        background: correct === true ? "var(--sl-success-bg)" : correct === false ? "var(--sl-danger-bg)" : undefined,
        color: correct === true ? "var(--sl-success)" : correct === false ? "var(--sl-danger)" : undefined,
      }}
    >
      <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 14 }}>
        {correct === true ? "✓" : correct === false ? "✗" : "⠿"}
      </span>
      <span style={{ flex: 1, fontSize: 14 }}>{item.text}</span>
      {/* Controles de teclado — Nielsen H7: flexibilidad y eficiencia */}
      {!checked && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {!isPlaced ? (
            <>
              <button
                onClick={onMoveAgil}
                title="Mover a Valor Ágil"
                aria-label={`Clasificar "${item.text}" como Valor Ágil`}
                style={{
                  padding: "3px 8px", borderRadius: 5, border: "1px solid rgba(0,180,216,0.4)",
                  background: "rgba(0,180,216,0.1)", color: "var(--sl-primary)",
                  cursor: "pointer", fontSize: 12, fontWeight: 700, minHeight: 28,
                }}
              >
                Ágil
              </button>
              <button
                onClick={onMoveTrad}
                title="Mover a Enfoque Tradicional"
                aria-label={`Clasificar "${item.text}" como Enfoque Tradicional`}
                style={{
                  padding: "3px 8px", borderRadius: 5, border: "1px solid var(--sl-border-light)",
                  background: "rgba(148,163,184,0.1)", color: "var(--sl-text-mid)",
                  cursor: "pointer", fontSize: 12, fontWeight: 700, minHeight: 28,
                }}
              >
                Trad.
              </button>
            </>
          ) : onMovePending ? (
            <button
              onClick={onMovePending}
              title="Quitar clasificación"
              aria-label={`Quitar clasificación de "${item.text}"`}
              style={{
                padding: "3px 8px", borderRadius: 5, border: "1px solid var(--sl-border-light)",
                background: "transparent", color: "var(--sl-text-muted)",
                cursor: "pointer", fontSize: 12, minHeight: 28,
              }}
            >
              ✕
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
