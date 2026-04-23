"use client";

import { useUIConfig, useUXFeatures } from "@/lib/config/ux-context";
import { TIME_SLOTS } from "@/lib/config/domain-data";

type Props = {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  dateError?: string;
  timeError?: string;
};

export function StepDate({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: Props) {
  const ui = useUIConfig();
  const features = useUXFeatures();

  // Fecha mínima: hoy
  const today = new Date().toISOString().split("T")[0];

  // Nivel 1: inputs sin tipo date
  if (!features.navigationClarity && !features.visualHierarchy) {
    return (
      <div className={ui.card}>
        <label className={ui.label}>Dato</label>
        <input
          className={ui.input}
          placeholder="Fecha"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
        {features.inlineErrors && dateError && (
          <p className={ui.errorText}>{dateError}</p>
        )}
      </div>
    );
  }

  return (
    <div className={ui.card}>
      {features.visualHierarchy && (
        <h2 className={ui.subheading}>
          {features.helpText ? "Elige cuándo quieres tu cita" : "Fecha y hora"}
        </h2>
      )}
      {features.helpText && (
        <p className={ui.description + " mb-3"}>
          Selecciona una fecha disponible y un horario que se ajuste a ti.
        </p>
      )}

      {/* Fecha */}
      <div className="mb-3">
        <label
          htmlFor="date-input"
          className={ui.label}
          aria-label={features.accessibility ? "Selecciona la fecha de tu cita" : undefined}
        >
          {features.helpText ? "Fecha de la cita" : "Fecha"}
        </label>
        <input
          id="date-input"
          type="date"
          min={features.formSimplification ? today : undefined}
          className={ui.input}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          aria-required={features.accessibility ? "true" : undefined}
          aria-describedby={features.accessibility && dateError ? "date-error" : undefined}
          tabIndex={features.keyboardNavigation ? 0 : -1}
        />
        {features.inlineErrors && dateError && (
          <p id="date-error" className={ui.errorText} role={features.accessibility ? "alert" : undefined}>
            {dateError}
          </p>
        )}
        {!features.inlineErrors && dateError && (
          <p className={ui.errorText}>{dateError}</p>
        )}
      </div>

      {/* Horario */}
      {features.formSimplification && (
        <div>
          <label htmlFor="time-select" className={ui.label}>
            {features.helpText ? "Horario disponible" : "Hora"}
          </label>
          <select
            id="time-select"
            className={ui.input + " cursor-pointer"}
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            aria-required={features.accessibility ? "true" : undefined}
            tabIndex={features.keyboardNavigation ? 0 : -1}
          >
            <option value="">
              {features.helpText ? "— Selecciona un horario —" : "Seleccionar"}
            </option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.id} value={slot.id} disabled={!slot.available}>
                {slot.time}
                {features.helpText && !slot.available ? " (Ocupado)" : ""}
              </option>
            ))}
          </select>
          {features.inlineErrors && timeError && (
            <p className={ui.errorText}>{timeError}</p>
          )}
        </div>
      )}

      {/* Nivel 2: solo campo de hora texto */}
      {!features.formSimplification && (
        <div>
          <label className={ui.label}>Hora</label>
          <input
            className={ui.input}
            placeholder="ej: 10:00"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
