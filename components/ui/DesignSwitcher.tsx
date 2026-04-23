"use client";

import { useDesign } from "@/lib/config/design-context";
import { AppointmentFlow } from "@/components/levels/AppointmentFlow";
import { MedicalSchedulerProposal } from "@/components/levels/MedicalSchedulerProposal";
import { PdfViewer } from "@/components/ui/PdfViewer";

type DesignId = "original" | "medicitas" | "arquitectura" | "bocetos";

const DESIGNS: { id: DesignId; label: string; sublabel: string; description: string }[] = [
  {
    id: "arquitectura",
    label: "Arquitectura",
    sublabel: "Drivers",
    description: "Drivers arquitectónicos del caso de estudio",
  },
  {
    id: "bocetos",
    label: "Bocetos IHC",
    sublabel: "Evolución",
    description: "Bocetos de la interfaz aplicados a la IHC",
  },
  {
    id: "original",
    label: "Propuesta A",
    sublabel: "HealthCare+",
    description: "Flujo por niveles UX con configuración dinámica",
  },
  {
    id: "medicitas",
    label: "Propuesta B",
    sublabel: "MediCitas",
    description: "Propuesta de diseño final independiente",
  },
];

const DOC_BANNER: Record<string, { icon: string; title: string; body: string }> = {
  arquitectura: {
    icon: "🏗️",
    title: "Documento técnico — solo lectura",
    body: "Este documento presenta los drivers arquitectónicos aplicados al caso del Sistema de Citas Médicas. No interactúa con el laboratorio de niveles UX.",
  },
  bocetos: {
    icon: "✏️",
    title: "Documento de diseño — solo lectura",
    body: "Evolución de bocetos de la interfaz aplicados a la Interacción Humano-Computador. No interactúa con el laboratorio de niveles UX.",
  },
  medicitas: {
    icon: "⚠️",
    title: "Propuesta de diseño final independiente",
    body: "MediCitas es una propuesta alternativa completa para el caso de estudio. No está sujeta a los 5 niveles UX ni genera métricas de análisis.",
  },
};

export function DesignSwitcher() {
  const { activeDesign, setActiveDesign } = useDesign();
  const isLab = activeDesign === "original";
  const banner = DOC_BANNER[activeDesign];

  return (
    <div className="flex flex-col h-full">
      {/* Barra de selección */}
      <div
        style={{
          borderBottom: "1px solid var(--guru-border)",
          background: "#FAFAFA",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#64748B",
          textTransform: "uppercase", letterSpacing: 0.5, marginRight: 4, whiteSpace: "nowrap",
        }}>
          Caso de estudio:
        </span>
        {DESIGNS.map(d => {
          const isActive = activeDesign === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDesign(d.id)}
              title={d.description}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                border: isActive ? "1.5px solid var(--guru-green)" : "1.5px solid #E2E8F0",
                background: isActive ? "var(--guru-green-light)" : "#fff",
                color: isActive ? "var(--guru-green-dark)" : "#64748B",
                fontWeight: isActive ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                lineHeight: 1.2,
              }}
            >
              <span>{d.label}</span>
              <span style={{ fontSize: 10, opacity: 0.75 }}>{d.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Banner informativo (todo excepto Propuesta A) */}
      {!isLab && banner && (
        <div
          role="note"
          style={{
            background: "linear-gradient(90deg, #FFF7ED, #FFFBEB)",
            borderBottom: "1px solid #FED7AA",
            padding: "10px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{banner.icon}</span>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>{banner.title}</span>
            <p style={{ fontSize: 11, color: "#B45309", margin: "2px 0 0", lineHeight: 1.5 }}>
              {banner.body}
            </p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeDesign === "original" && <AppointmentFlow />}
        {activeDesign === "medicitas" && (
          <div className="flex-1 overflow-y-auto">
            <MedicalSchedulerProposal />
          </div>
        )}
        {activeDesign === "arquitectura" && (
          <PdfViewer
            src="/Medical_Flow_Architecture.pdf"
            title="Drivers Arquitectónicos — Sistema de Citas Médicas"
          />
        )}
        {activeDesign === "bocetos" && (
          <PdfViewer
            src="/Evolución_IHC_Medica.pdf"
            title="Bocetos IHC — Evolución de la Interfaz Médica"
          />
        )}
      </div>
    </div>
  );
}
