"use client";

import { useStore } from "@/lib/store";
import { UX_LEVELS, type UXFeatures } from "@/lib/config/ux-levels";

/* ── Metadatos de cada nivel para la nav ── */
const LEVEL_META: Record<1 | 2 | 3 | 4 | 5, { icon: string; dot: string }> = {
  1: { icon: "💀", dot: "#E03131" },
  2: { icon: "😐", dot: "#E8650A" },
  3: { icon: "👍", dot: "#C49A00" },
  4: { icon: "⭐", dot: "#1971C2" },
  5: { icon: "🏆", dot: "#4D9E25" },
};

/* ── Grupos de principios IHC ── */
type ToggleDef = { key: keyof UXFeatures; label: string; hint: string };

const PRINCIPLES: ToggleDef[] = [
  { key: "validation",        label: "Validación",            hint: "Verifica campos obligatorios" },
  { key: "inlineErrors",      label: "Errores en línea",      hint: "Feedback mientras el usuario escribe" },
  { key: "feedback",          label: "Feedback visual",       hint: "Confirmaciones y estados claros" },
  { key: "loadingStates",     label: "Estados de carga",      hint: "El sistema avisa que procesa" },
  { key: "navigationClarity", label: "Flujo en pasos",        hint: "Proceso dividido en etapas" },
  { key: "visualHierarchy",   label: "Jerarquía visual",      hint: "Títulos y estructura ordenada" },
  { key: "accessibility",     label: "ARIA / Roles",          hint: "Atributos para tecnologías asistivas" },
  { key: "keyboardNavigation",label: "Teclado",               hint: "Controles accesibles sin ratón" },
  { key: "colorContrast",     label: "Contraste de color",    hint: "Cumple WCAG AA mínimo" },
  { key: "microinteractions", label: "Microinteracciones",    hint: "Animaciones Framer Motion" },
  { key: "formSimplification",label: "Formulario simplificado", hint: "Campos inteligentes y claros" },
  { key: "helpText",          label: "UX Writing",            hint: "Lenguaje empático y guiado" },
];

const WCAG_FEATURES: ToggleDef[] = [
  { key: "wcagContrast",     label: "Contraste visual",    hint: "AA/AAA · Focus rings visibles" },
  { key: "cognitiveSupport", label: "Soporte cognitivo",   hint: "Tracker de pasos · Etiquetas descriptivas" },
  { key: "motorSupport",     label: "Accesibilidad motriz",hint: "Targets ≥44px · Skip link · Atajos" },
];

/* ── Componente toggle checkbox estilo guru ── */
function ToggleRow({
  def,
  isOn,
  onToggle,
}: {
  def: ToggleDef;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      className="w-full flex items-start gap-2.5 px-3 py-2 rounded text-left transition-colors hover:bg-[#EBEBEB] group"
    >
      {/* Checkbox visual */}
      <span
        className="flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all"
        style={{
          background: isOn ? "var(--guru-green)" : "#fff",
          borderColor: isOn ? "var(--guru-green)" : "#BBBBBB",
        }}
      >
        {isOn && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span
          className="block text-[13px] leading-snug"
          style={{ color: isOn ? "var(--guru-green-dark)" : "var(--guru-text-mid)", fontWeight: isOn ? 600 : 400 }}
        >
          {def.label}
        </span>
        <span className="block text-[11px]" style={{ color: "var(--guru-text-muted)" }}>
          {def.hint}
        </span>
      </span>
    </button>
  );
}

/* ── Componente principal ── */
export function UXBuilder() {
  const { uxLevel, setLevel } = useStore();
  const currentConfig = UX_LEVELS[uxLevel];

  const handleToggle = (feature: keyof UXFeatures) => {
    const levels = ([1, 2, 3, 4, 5] as const);
    const isActive = currentConfig.features[feature];

    if (!isActive) {
      const target = levels.find((l) => UX_LEVELS[l].features[feature]);
      if (target && target > uxLevel) setLevel(target);
    } else {
      const target = [...levels].reverse().find((l) => !UX_LEVELS[l].features[feature]);
      if (target && target < uxLevel) setLevel(target);
    }
  };

  const activeCount = Object.values(currentConfig.features).filter(Boolean).length;

  return (
    <nav
      className="flex flex-col h-full overflow-y-auto"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      aria-label="Navegación de aprendizaje UX"
    >
      {/* ── Sección: Niveles UX ── */}
      <div className="pt-5 pb-2 px-4">
        <p className="guru-section-title mb-2">Niveles de experiencia</p>
        <div className="flex flex-col gap-0.5">
          {([1, 2, 3, 4, 5] as const).map((l) => {
            const lvl = UX_LEVELS[l];
            const meta = LEVEL_META[l];
            const isActive = l === uxLevel;
            return (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`guru-nav-item ${isActive ? "guru-nav-item-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: meta.dot }}
                />
                <span className="flex-1 min-w-0">
                  <span
                    className="block text-[11px] leading-none mb-0.5"
                    style={{ color: isActive ? "var(--guru-green)" : "var(--guru-text-muted)" }}
                  >
                    Nivel {l}
                  </span>
                  <span className="block text-[13px] leading-snug truncate">
                    {lvl.name}
                  </span>
                </span>
                <span className="text-base leading-none" aria-hidden="true">{meta.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-4 my-3" style={{ borderTop: "1px solid var(--guru-border)" }} />

      {/* ── Sección: Principios IHC ── */}
      <div className="px-4 pb-2">
        <p className="guru-section-title mb-2">Principios IHC activos</p>
        <div className="flex flex-col gap-0.5">
          {PRINCIPLES.map((def) => (
            <ToggleRow
              key={def.key}
              def={def}
              isOn={currentConfig.features[def.key]}
              onToggle={() => handleToggle(def.key)}
            />
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-4 my-3" style={{ borderTop: "1px solid var(--guru-border)" }} />

      {/* ── Sección: WCAG 2.1 ── */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="guru-section-title">WCAG 2.1</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "#EDF7E5", color: "var(--guru-green-dark)" }}
          >
            Nivel 5
          </span>
        </div>
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid #C3E6AB" }}
        >
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{ background: "#EDF7E5" }}
          >
            <span className="text-sm" aria-hidden="true">♿</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--guru-green-dark)" }}>
              Accesibilidad avanzada activable
            </span>
          </div>
          <div className="p-1.5 bg-white flex flex-col gap-0.5">
            {WCAG_FEATURES.map((def) => (
              <ToggleRow
                key={def.key}
                def={def}
                isOn={currentConfig.features[def.key]}
                onToggle={() => handleToggle(def.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Pie: contador de features ── */}
      <div
        className="mx-4 mb-4 px-3 py-2.5 rounded-lg text-xs"
        style={{
          background: "var(--guru-bg-soft)",
          border: "1px solid var(--guru-border-light)",
          color: "var(--guru-text-muted)",
        }}
      >
        <span className="font-bold" style={{ color: "var(--guru-text)" }}>
          {activeCount}
        </span>
        /15 principios activos
        {activeCount <= 2 && " · Nivel básico"}
        {activeCount >= 14 && (
          <span style={{ color: "var(--guru-green-dark)", fontWeight: 600 }}>
            {" "}· WCAG 2.1 completo ✓
          </span>
        )}
      </div>
    </nav>
  );
}
