"use client";

import { useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useScrumStore } from "@/lib/store/scrum-store";

interface Role {
  id: string; icon: string; title: string; subtitle: string;
  color: string; points: string[]; important: string;
}

const ROLES: Role[] = [
  {
    id: "po", icon: "👔", title: "Product Owner", subtitle: "Maximizador de valor",
    color: "#00B4D8",
    points: [
      "Maximiza el valor del producto",
      "Prioriza los requerimientos en el Product Backlog",
      "Revisa y aprueba el trabajo entregado por el equipo",
      "Es el punto de contacto principal con los stakeholders",
      "Toma decisiones sobre el producto",
    ],
    important: "Es la única persona responsable de gestionar el Product Backlog.",
  },
  {
    id: "team", icon: "👥", title: "Equipo de Desarrollo", subtitle: "Team · 5–9 personas",
    color: "#7C3AED",
    points: [
      "Compuesto por 5 a 9 personas (tamaño óptimo)",
      "Multifuncional: cubre todos los skills necesarios",
      "Auto-organizado: decide cómo realizar el trabajo",
      "Sin sub-roles ni jerarquías internas",
      "Responsable de entregar incrementos de software funcional",
    ],
    important: "No existen títulos individuales dentro del equipo — todos son Desarrolladores.",
  },
  {
    id: "sm", icon: "🧭", title: "Scrum Master", subtitle: "Facilitador del proceso",
    color: "#10B981",
    points: [
      "Facilita la adopción y comprensión de Scrum",
      "Elimina impedimentos que bloquean al equipo",
      "Protege al equipo de interrupciones externas",
      "Coach del equipo en prácticas ágiles",
      "NO es el líder del proyecto ni del equipo",
    ],
    important: "El Scrum Master es un líder servicial, no un jefe de proyecto. No asigna tareas.",
  },
];

export function Section3Scrum() {
  const { addXP, unlockBadge } = useScrumStore();
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [, setViewedRoles] = useState<Set<string>>(new Set());
  const [bonusAwarded, setBonusAwarded] = useState(false);

  function handleToggleRole(roleId: string, isOpen: boolean) {
    setExpandedRole(isOpen ? null : roleId);
    if (!isOpen) {
      setViewedRoles((prev) => {
        const next = new Set(prev).add(roleId);
        // Otorgar badge cuando los 3 roles hayan sido vistos
        if (next.size === 3 && !bonusAwarded) {
          setBonusAwarded(true);
          addXP(50, "¡Exploraste los 3 roles de Scrum!");
          unlockBadge("conocedor_roles");
        }
        return next;
      });
    }
  }

  return (
    <SectionWrapper
      sectionNumber={3}
      icon="🔄"
      title="Scrum — Descripción General"
      objective="Identificar las características principales de Scrum y los tres roles que lo componen, comprendiendo sus responsabilidades específicas."
    >
      {/* Resumen de Scrum */}
      <section aria-labelledby="scrum-def-heading" style={{ marginBottom: 28 }}>
        <div className="sl-card" style={{ padding: "26px 30px" }}>
          <h2
            id="scrum-def-heading"
            style={{ fontSize: 20, fontWeight: 700, color: "var(--sl-text)", marginBottom: 18 }}
          >
            ¿Qué es Scrum?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {[
              { icon: "🏆", text: "Es el método ágil más popular y adoptado en la industria del software" },
              { icon: "🔁", text: "Permite desarrollo iterativo e incremental del producto" },
              { icon: "👥", text: "Equipo multifuncional y auto-organizado sin jerarquías rígidas" },
              { icon: "⏱️", text: "Iteraciones cortas (sprints) para inspeccionar y adaptar el producto" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 18px", background: "var(--sl-bg-soft)",
                  borderRadius: 10, border: "1px solid var(--sl-border)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.7 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section aria-labelledby="roles-heading">
        <h2
          id="roles-heading"
          style={{ fontSize: 22, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}
        >
          Los 3 Roles de Scrum
        </h2>
        <p style={{ fontSize: 15, color: "var(--sl-text-muted)", marginBottom: 22, lineHeight: 1.7 }}>
          Haz clic en cada rol para expandir sus detalles y responsabilidades.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ROLES.map((role) => {
            const isOpen = expandedRole === role.id;
            return (
              <div
                key={role.id}
                style={{
                  background: "var(--sl-card)",
                  border: `1px solid ${isOpen ? role.color : "var(--sl-border)"}`,
                  borderRadius: 12, overflow: "hidden",
                  transition: "border-color 0.2s ease",
                  boxShadow: isOpen ? `0 0 0 1px ${role.color}22, 0 4px 20px ${role.color}18` : "none",
                }}
              >
                <button
                  onClick={() => handleToggleRole(role.id, isOpen)}
                  aria-expanded={isOpen}
                  aria-controls={`role-detail-${role.id}`}
                  style={{
                    width: "100%", padding: "20px 24px",
                    display: "flex", alignItems: "center", gap: 16,
                    cursor: "pointer", background: "transparent", border: "none", textAlign: "left",
                    minHeight: 72,
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: `${role.color}20`, border: `1px solid ${role.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0,
                    }}
                  >
                    {role.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "var(--sl-text)", marginBottom: 3 }}>
                      {role.title}
                    </p>
                    <p style={{ fontSize: 14, color: "var(--sl-text-muted)" }}>{role.subtitle}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 16, color: "var(--sl-text-muted)",
                      transition: "transform 0.25s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </button>

                <div
                  id={`role-detail-${role.id}`}
                  hidden={!isOpen}
                  style={{ padding: "0 24px 22px", borderTop: `1px solid ${role.color}30` }}
                >
                  <ul style={{ paddingLeft: 0, margin: "18px 0 0", listStyle: "none" }}>
                    {role.points.map((point, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "10px 0", borderBottom: "1px solid var(--sl-border)",
                          fontSize: 15, color: "var(--sl-text-mid)",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: role.color, marginTop: 9, flexShrink: 0,
                          }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div
                    role="note"
                    style={{
                      marginTop: 18, padding: "14px 18px", borderRadius: 8,
                      background: `${role.color}12`, borderLeft: `3px solid ${role.color}`,
                    }}
                  >
                    <p style={{ fontSize: 14, color: role.color, fontWeight: 600, lineHeight: 1.6 }}>
                      💡 Punto clave: {role.important}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Síntesis */}
      <div className="sl-callout" style={{ marginTop: 28 }} role="note">
        <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--sl-primary)" }}>Recuerda:</strong> En
          Scrum no hay un &ldquo;jefe de proyecto&rdquo;. El{" "}
          <strong>Product Owner</strong> decide QUÉ hacer, el{" "}
          <strong>Equipo de Desarrollo</strong> decide CÓMO hacerlo, y el{" "}
          <strong>Scrum Master</strong> facilita que todo fluya correctamente.
        </p>
      </div>
    </SectionWrapper>
  );
}
