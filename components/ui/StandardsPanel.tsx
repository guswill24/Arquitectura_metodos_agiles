"use client";

import { useState } from "react";

type Item = {
  emoji: string;
  title: string;
  tagline: string;
  example: string[];
  activity: string;
};

type Standard = {
  id: string;
  label: string;
  fullLabel: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  intro: string;
  items: Item[];
  footer?: string;
};

const STANDARDS: Standard[] = [
  {
    id: "nielsen",
    label: "Nielsen",
    fullLabel: "Heurísticas de Nielsen",
    emoji: "🧠",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    intro: "10 principios de usabilidad de Jakob Nielsen para diseñar interfaces claras, eficientes y fáciles de usar.",
    items: [
      {
        emoji: "🧠",
        title: "1. Visibilidad del estado",
        tagline: "El sistema informa qué está pasando.",
        example: ["Barra de carga al subir un archivo", "Mensajes como 'Guardando...' o 'Completado'"],
        activity: "Identificar si una app muestra feedback o deja al usuario en el aire.",
      },
      {
        emoji: "🗣️",
        title: "2. Lenguaje del usuario",
        tagline: "Usar conceptos familiares, no técnicos.",
        example: ["Ícono de papelera para borrar", "'Carrito de compras' en vez de 'gestor de transacciones'"],
        activity: "Comparar una interfaz técnica vs una amigable.",
      },
      {
        emoji: "↩️",
        title: "3. Control y libertad",
        tagline: "El usuario puede deshacer acciones.",
        example: ["Botón 'Deshacer'", "Confirmación antes de borrar algo importante"],
        activity: "Simular errores y verificar si se pueden revertir.",
      },
      {
        emoji: "📏",
        title: "4. Consistencia y estándares",
        tagline: "No reinventar lo que ya es convención.",
        example: ["Botón 'Inicio' siempre en su lugar esperado", "Enlaces en azul (convención web)"],
        activity: "Buscar inconsistencias en una interfaz real.",
      },
      {
        emoji: "⚠️",
        title: "5. Prevención de errores",
        tagline: "Mejor evitar errores que corregirlos.",
        example: ["Validar formularios antes de enviar", "Desactivar botones si faltan datos"],
        activity: "Diseñar un formulario que evite errores comunes.",
      },
      {
        emoji: "👁️",
        title: "6. Reconocimiento vs. recuerdo",
        tagline: "No obligar al usuario a memorizar.",
        example: ["Menús visibles", "Autocompletado en campos"],
        activity: "Comparar interfaz de comandos vs interfaz con opciones visibles.",
      },
      {
        emoji: "⚡",
        title: "7. Flexibilidad y eficiencia",
        tagline: "Sirve a principiantes y a expertos.",
        example: ["Atajos de teclado", "Personalización de vistas"],
        activity: "Probar una herramienta con y sin atajos de teclado.",
      },
      {
        emoji: "🎯",
        title: "8. Diseño minimalista",
        tagline: "Menos es más.",
        example: ["Interfaces limpias", "Solo información relevante visible"],
        activity: "Rediseñar una pantalla saturada de elementos.",
      },
      {
        emoji: "🧩",
        title: "9. Ayuda ante errores",
        tagline: "Mensajes claros, no técnicos.",
        example: ["❌ Error 404  →  ✅ No encontramos la página. Verifica la URL."],
        activity: "Reescribir mensajes de error confusos en lenguaje simple.",
      },
      {
        emoji: "📘",
        title: "10. Ayuda y documentación",
        tagline: "Soporte accesible cuando se necesita.",
        example: ["FAQ, tutoriales, tooltips en contexto"],
        activity: "Evaluar si una app tiene ayuda útil y fácil de encontrar.",
      },
    ],
  },
  {
    id: "iso",
    label: "ISO 9241",
    fullLabel: "ISO 9241-210",
    emoji: "🔄",
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    intro: "Norma internacional sobre Diseño Centrado en el Usuario (UCD). Propone diseñar los sistemas pensando en las personas desde el inicio, no al final.",
    footer: "ISO 9241-210 no es una checklist — es una forma de trabajar: entender al usuario, probar constantemente y mejorar de forma continua.",
    items: [
      {
        emoji: "👥",
        title: "1. Usuarios reales",
        tagline: "Entender quién usará el sistema.",
        example: ["Entrevistas con usuarios", "Perfiles (personas) de usuario"],
        activity: "Crear una 'persona' de usuario (edad, necesidades, contexto).",
      },
      {
        emoji: "📍",
        title: "2. Contexto de uso",
        tagline: "Saber dónde, cómo y por qué se usa.",
        example: ["¿Usan celular o computador?", "¿Están apurados? ¿En oficina o en movilidad?"],
        activity: "Analizar en qué contexto usarían una app específica.",
      },
      {
        emoji: "🔁",
        title: "3. Diseño iterativo",
        tagline: "Diseñar, probar, mejorar… repetir.",
        example: ["Ciclo: Prototipo → prueba → mejora → nuevo prototipo"],
        activity: "Hacer un boceto y mejorarlo tras feedback de compañeros.",
      },
      {
        emoji: "📊",
        title: "4. Evaluación con usuarios",
        tagline: "Probar con personas reales.",
        example: ["Test de usabilidad", "Observación directa en uso"],
        activity: "Un estudiante usa la app, otro observa y documenta problemas.",
      },
      {
        emoji: "🧩",
        title: "5. Experiencia completa",
        tagline: "No solo la interfaz, sino todo el proceso.",
        example: ["Antes, durante y después de usar el sistema"],
        activity: "Mapear el viaje del usuario (user journey map).",
      },
      {
        emoji: "👨‍👩‍👧‍👦",
        title: "6. Equipo multidisciplinario",
        tagline: "No solo diseñadores.",
        example: ["Programadores + Diseñadores + Expertos de negocio + Usuarios"],
        activity: "Simular roles en equipo para resolver un problema de diseño.",
      },
    ],
  },
  {
    id: "wcag",
    label: "WCAG 2.1",
    fullLabel: "WCAG 2.1 AA",
    emoji: "♿",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    intro: "Estándar internacional para sitios web accesibles. Se organiza en 4 principios: Percibible, Operable, Comprensible y Robusto (POUR).",
    footer: "Nivel AA es el equilibrio ideal: accesible, realista de implementar y exigido en leyes y proyectos reales.",
    items: [
      {
        emoji: "👁️",
        title: "1. Percibible",
        tagline: "La información puede ser percibida por todos.",
        example: ["Texto alternativo en imágenes (alt)", "Subtítulos en videos", "Contraste mínimo 4.5:1"],
        activity: "Revisar una web: imágenes sin alt, texto con bajo contraste.",
      },
      {
        emoji: "⌨️",
        title: "2. Operable",
        tagline: "Navegar e interactuar sin problemas.",
        example: ["Navegación completa con teclado (sin mouse)", "Menús accesibles con Tab / Enter"],
        activity: "Navegar una página solo con teclado e identificar bloqueos.",
      },
      {
        emoji: "🧩",
        title: "3. Comprensible",
        tagline: "El contenido es fácil de entender.",
        example: ["'Ingresa un correo válido (ej: nombre@email.com)'", "Mensajes de error descriptivos y accionables"],
        activity: "Evaluar formularios: ¿explican claramente los errores?",
      },
      {
        emoji: "🧱",
        title: "4. Robusto",
        tagline: "Funciona con distintas tecnologías.",
        example: ["Compatibilidad con lectores de pantalla", "HTML semántico: label, button, nav"],
        activity: "Revisar código o usar herramientas como axe o Lighthouse.",
      },
    ],
  },
];

function ItemCard({ item, color, bg, border }: { item: Item; color: string; bg: string; border: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${open ? border : "#E2E8F0"}`,
        background: open ? bg : "#fff",
        overflow: "hidden",
        transition: "all 0.2s ease",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", textAlign: "left",
          padding: "10px 14px",
          background: "transparent", border: "none",
          display: "flex", alignItems: "center", gap: 10,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{item.title}</div>
          <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.3, marginTop: 1 }}>{item.tagline}</div>
        </div>
        <span style={{
          fontSize: 10, color: color, flexShrink: 0,
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
              Ejemplo
            </p>
            {item.example.map((ex, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                <span style={{ color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{ex}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: `${color}10`, borderRadius: 8, padding: "8px 10px",
            border: `1px solid ${color}25`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 3px" }}>
              🧪 Actividad de laboratorio
            </p>
            <p style={{ fontSize: 12, color: "#334155", margin: 0, lineHeight: 1.5 }}>{item.activity}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function StandardsPanel() {
  const [active, setActive] = useState("nielsen");
  const std = STANDARDS.find(s => s.id === active)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sub-navegación entre estándares */}
      <div style={{
        display: "flex", gap: 4, padding: "10px 12px",
        borderBottom: "1px solid #E2E8F0",
        background: "#FAFAFA", flexShrink: 0,
      }}>
        {STANDARDS.map(s => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                flex: 1, padding: "6px 4px", borderRadius: 10,
                border: isActive ? `1.5px solid ${s.color}` : "1.5px solid transparent",
                background: isActive ? s.bg : "transparent",
                color: isActive ? s.color : "#64748B",
                fontWeight: isActive ? 700 : 500,
                fontSize: 11, cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 2, lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {/* Cabecera del estándar */}
        <div style={{
          background: std.bg, borderRadius: 12, padding: "12px 14px",
          border: `1px solid ${std.border}`, marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{std.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: std.color }}>{std.fullLabel}</span>
          </div>
          <p style={{ fontSize: 12, color: "#334155", margin: 0, lineHeight: 1.6 }}>{std.intro}</p>
        </div>

        {/* Ítems en acordeón */}
        {std.items.map((item, i) => (
          <ItemCard key={i} item={item} color={std.color} bg={std.bg} border={std.border} />
        ))}

        {/* Nota de cierre */}
        {std.footer && (
          <div style={{
            background: `${std.color}08`, borderRadius: 10, padding: "10px 12px",
            border: `1px dashed ${std.color}40`, marginTop: 4,
          }}>
            <p style={{ fontSize: 11, color: std.color, margin: 0, lineHeight: 1.6, fontWeight: 600, textAlign: "center" }}>
              🎯 {std.footer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
