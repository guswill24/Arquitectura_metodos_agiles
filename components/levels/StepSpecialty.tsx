"use client";

import { useUIConfig, useUXFeatures } from "@/lib/config/ux-context";
import { SPECIALTIES } from "@/lib/config/domain-data";

type Props = {
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export function StepSpecialty({ value, onChange, error }: Props) {
  const ui = useUIConfig();
  const features = useUXFeatures();

  // Nivel 1: todo al desnudo – sin label real, sin select, solo input
  if (!features.navigationClarity && !features.visualHierarchy) {
    return (
      <div className={ui.card}>
        <label className={ui.label}>Dato</label>
        <input
          className={ui.input}
          placeholder="Especialidad"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {features.inlineErrors && error && (
          <p className={ui.errorText}>{error}</p>
        )}
      </div>
    );
  }

  // Niveles 2-5: select real
  return (
    <div className={ui.card}>
      {features.visualHierarchy && (
        <h2 className={ui.subheading}>
          {features.helpText ? "Elige el tipo de consulta que necesitas" : "Especialidad"}
        </h2>
      )}

      {features.helpText && (
        <p className={ui.description + " mb-2"}>
          Selecciona la especialidad médica adecuada para tu consulta.
        </p>
      )}

      <label
        htmlFor="specialty-select"
        className={ui.label}
        aria-label={features.accessibility ? "Selecciona una especialidad médica" : undefined}
      >
        {features.helpText ? "Especialidad médica" : "Especialidad"}
      </label>

      <select
        id="specialty-select"
        className={ui.input + " cursor-pointer"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={features.accessibility ? "true" : undefined}
        aria-describedby={features.accessibility && error ? "specialty-error" : undefined}
        tabIndex={features.keyboardNavigation ? 0 : -1}
      >
        <option value="">
          {features.helpText ? "— Selecciona una especialidad —" : "Seleccionar"}
        </option>
        {SPECIALTIES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {features.inlineErrors && error && (
        <p
          id="specialty-error"
          className={ui.errorText}
          role={features.accessibility ? "alert" : undefined}
        >
          {error}
        </p>
      )}
      {!features.inlineErrors && error && (
        <p className={ui.errorText}>{error}</p>
      )}
    </div>
  );
}
