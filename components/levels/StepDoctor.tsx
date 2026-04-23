"use client";

import { useUIConfig, useUXFeatures } from "@/lib/config/ux-context";
import { getDoctorsBySpecialty } from "@/lib/config/domain-data";

type Props = {
  specialtyId: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export function StepDoctor({ specialtyId, value, onChange, error }: Props) {
  const ui = useUIConfig();
  const features = useUXFeatures();

  const doctors = specialtyId ? getDoctorsBySpecialty(specialtyId) : [];

  // Nivel 1: input libre sin sentido
  if (!features.navigationClarity && !features.visualHierarchy) {
    return (
      <div className={ui.card}>
        <label className={ui.label}>Dato</label>
        <input
          className={ui.input}
          placeholder="Doctor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {features.inlineErrors && error && (
          <p className={ui.errorText}>{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={ui.card}>
      {features.visualHierarchy && (
        <h2 className={ui.subheading}>
          {features.helpText ? "Selecciona el médico disponible" : "Médico"}
        </h2>
      )}
      {features.helpText && (
        <p className={ui.description + " mb-2"}>
          Los médicos marcados como no disponibles no pueden ser seleccionados.
        </p>
      )}

      <label
        htmlFor="doctor-select"
        className={ui.label}
        aria-label={features.accessibility ? "Selecciona un médico disponible" : undefined}
      >
        {features.helpText ? "Médico asignado" : "Doctor"}
      </label>

      <select
        id="doctor-select"
        className={ui.input + " cursor-pointer"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={features.accessibility ? "true" : undefined}
        aria-describedby={features.accessibility && error ? "doctor-error" : undefined}
        tabIndex={features.keyboardNavigation ? 0 : -1}
        disabled={doctors.length === 0}
      >
        <option value="">
          {doctors.length === 0
            ? "Primero selecciona una especialidad"
            : features.helpText
            ? "— Selecciona un médico —"
            : "Seleccionar"}
        </option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id} disabled={!d.available}>
            {d.name}
            {features.helpText && !d.available ? " (No disponible)" : ""}
          </option>
        ))}
      </select>

      {features.inlineErrors && error && (
        <p
          id="doctor-error"
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
