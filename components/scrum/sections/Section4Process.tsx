"use client";

import { useState, useEffect } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { PdfViewer } from "@/components/ui/PdfViewer";

interface Ceremony {
  n: number;
  icon: string;
  name: string;
  result?: string;
  detail: string;
  phase: "pre" | "sprint";
}

type TimelineItemProps = {
  ceremony: Ceremony;
  expanded: boolean;
  onToggle: () => void;
};

const CEREMONIES: Ceremony[] = [
  {
    n: 1,
    icon: "✍️",
    phase: "pre",
    name: "Especificación de historias de usuario",
    detail: `Se redactan historias desde la perspectiva del usuario.

📌 Ejemplos:
• Como estudiante, quiero ver mi horario
• Como estudiante, quiero registrar tareas
• Como estudiante, quiero recibir recordatorios

🎯 META:
8–10 historias`,
  },
  {
    n: 2,
    icon: "🎯",
    phase: "pre",
    name: "Priorización de historias de usuario",
    detail: `Se ordenan por valor.

📌 Ejemplo:
Login antes que reportes`,
  },
  {
    n: 3,
    icon: "📋",
    phase: "pre",
    name: "Especificación de tareas",
    result: "Backlog del proyecto",
    detail: `Dividir historias en tareas.

📌 Ejemplo:
UI + lógica + backend`,
  },
  {
    n: 4,
    icon: "⚖️",
    phase: "pre",
    name: "Estimación de esfuerzo",
    detail: `Asignar puntos.

📌 Ejemplo:
Login → 3 puntos`,
  },
  {
    n: 5,
    icon: "📅",
    phase: "pre",
    name: "Planeación de entregas",
    detail: `Definir sprints.`,
  },
  {
    n: 6,
    icon: "🗺️",
    phase: "sprint",
    name: "Planeación del sprint",
    result: "Backlog del sprint",
    detail: `Seleccionar historias.`,
  },
  {
    n: 7,
    icon: "🔍",
    phase: "sprint",
    name: "Refinamiento de historias de usuario",
    detail: `Aclarar criterios.`,
  },
  {
    n: 8,
    icon: "💻",
    phase: "sprint",
    name: "Desarrollo del producto",
    detail: `Simular desarrollo.

🔥 CAMBIOS:

1. Nueva prioridad
2. Menos tiempo
3. Nueva funcionalidad
4. Sin internet`,
  },
  {
    n: 9,
    icon: "☀️",
    phase: "sprint",
    name: "Junta diaria del sprint",
    detail: `Responder:
   • Qué hice
   • Qué haré
   • Problemas`,
  },
  {
    n: 10,
    icon: "🎤",
    phase: "sprint",
    name: "Revisión del sprint (demostración)",
    detail: `Mostrar resultados.`,
  },
  {
    n: 11,
    icon: "🔄",
    phase: "sprint",
    name: "Retrospectiva del sprint",
    detail: `Reflexionar.`,
  },
  {
    n: 12,
    icon: "📝",
    phase: "sprint",
    name: "Refinamiento del backlog",
    detail: `Actualizar backlog.`,
  },
];

export function Section4Process() {
  const [expandedCeremony, setExpandedCeremony] = useState<number | null>(null);

  return (<SectionWrapper
    sectionNumber={4}
    icon="⚙️"
    title="El Proceso de Scrum"
    objective="Identificar y secuenciar las 12 ceremonias de Scrum, distinguiendo las fases Pre-Sprint y las ceremonias repetidas en cada Sprint."
  >
    {/* Timeline */}
    <section style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>
        Las 12 Ceremonias — Flujo del Proceso </h2>


      <div>
        {CEREMONIES.map((c) => (
          <TimelineItem
            key={c.n}
            ceremony={c}
            expanded={expandedCeremony === c.n}
            onToggle={() =>
              setExpandedCeremony(
                expandedCeremony === c.n ? null : c.n
              )
            }
          />
        ))}
      </div>
    </section>

    {/* PDF */}
    <PdfViewer src="/The_Scrum_Engine.pdf" title="Scrum Engine" />
  </SectionWrapper>


  );
}

// 🔥 COMPONENTE LIMPIO
function TimelineItem({
  ceremony,
  expanded,
  onToggle,
}: TimelineItemProps) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(10);

  useEffect(() => {
    if (!running || seconds <= 0) return;


    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);



  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      alert(`⏰ Tiempo terminado: ${ceremony.name}`);
      new Audio("/sounds/alert.mp3").play();
    }
  }, [seconds, running, ceremony.name]);

  function start() {
    setSeconds(minutes * 60);
    setRunning(true);
  }

  function format(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div style={{ border: "1px solid var(--sl-border)", marginBottom: 10 }}>
      <button onClick={onToggle} style={{ width: "100%", padding: 12 }}>
        {ceremony.n}. {ceremony.icon} {ceremony.name} </button>


      {expanded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            padding: 20,
          }}
        >
          <p style={{ whiteSpace: "pre-wrap" }}>{ceremony.detail}</p>

          <div style={{ textAlign: "center" }}>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />

            <div style={{ fontSize: 50, fontWeight: "bold" }}>
              {format(seconds)}
            </div>

            <button onClick={start}>▶</button>
            <button onClick={() => setRunning(false)}>⏸</button>
          </div>
        </div>
      )}
    </div>


  );
}
