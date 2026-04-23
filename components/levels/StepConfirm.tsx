"use client";

import { useUIConfig, useUXFeatures } from "@/lib/config/ux-context";
import { SPECIALTIES, DOCTORS, TIME_SLOTS } from "@/lib/config/domain-data";

type Props = {
  specialty: string;
  doctor: string;
  date: string;
  time: string;
};

export function StepConfirm({ specialty, doctor, date, time }: Props) {
  const ui = useUIConfig();
  const features = useUXFeatures();

  const specialtyName = SPECIALTIES.find((s) => s.id === specialty)?.name ?? specialty;
  const doctorName = DOCTORS.find((d) => d.id === doctor)?.name ?? doctor;
  const timeName = TIME_SLOTS.find((t) => t.id === time)?.time ?? time;

  // Nivel 1: solo muestra raw data sin estructura
  if (!features.visualHierarchy) {
    return (
      <div className={ui.card}>
        <p className={ui.label}>Resumen</p>
        <p className={ui.description}>{specialty} / {doctor} / {date}</p>
      </div>
    );
  }

  return (
    <div className={ui.card}>
      {features.visualHierarchy && (
        <h2 className={ui.subheading}>
          {features.helpText
            ? "Revisa los detalles antes de confirmar"
            : "Confirmación"}
        </h2>
      )}
      {features.helpText && (
        <p className={ui.description + " mb-4"}>
          Una vez confirmada, recibirás un recordatorio. Puedes reprogramar con al menos 24h de anticipación.
        </p>
      )}

      <div className={`grid grid-cols-1 gap-3 ${features.formSimplification ? "mt-4" : "mt-2"}`}>
        <div className="flex justify-between items-center border-b pb-2">
          <span className={ui.label + " mb-0"}>Especialidad</span>
          <span className={ui.description + " font-medium"}>{specialtyName}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className={ui.label + " mb-0"}>Médico</span>
          <span className={ui.description + " font-medium"}>{doctorName}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className={ui.label + " mb-0"}>Fecha</span>
          <span className={ui.description + " font-medium"}>{date || "No seleccionada"}</span>
        </div>
        {features.formSimplification && (
          <div className="flex justify-between items-center">
            <span className={ui.label + " mb-0"}>Horario</span>
            <span className={ui.description + " font-medium"}>{timeName || "No seleccionado"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
