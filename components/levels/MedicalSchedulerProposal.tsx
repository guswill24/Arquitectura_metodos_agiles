"use client";

import { useState, useRef, useCallback } from "react";

const SPECIALTIES = [
  { id: "general", name: "Medicina General", icon: "🩺", color: "#0E7C6B", desc: "Consulta general, chequeos y prevención" },
  { id: "cardio", name: "Cardiología", icon: "❤️", color: "#C0392B", desc: "Corazón y sistema circulatorio" },
  { id: "derma", name: "Dermatología", icon: "🧴", color: "#E67E22", desc: "Piel, cabello y uñas" },
  { id: "oftalmo", name: "Oftalmología", icon: "👁️", color: "#2980B9", desc: "Salud visual y ocular" },
  { id: "pediatria", name: "Pediatría", icon: "👶", color: "#8E44AD", desc: "Atención integral infantil" },
  { id: "traumato", name: "Traumatología", icon: "🦴", color: "#16A085", desc: "Huesos, articulaciones y músculos" },
  { id: "neuro", name: "Neurología", icon: "🧠", color: "#2C3E50", desc: "Sistema nervioso y cerebro" },
  { id: "gineco", name: "Ginecología", icon: "🌸", color: "#E91E63", desc: "Salud femenina y reproductiva" },
];

type Specialty = typeof SPECIALTIES[number];

type Doctor = {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  exp: string;
  next: string;
};

const DOCTORS: Record<string, Doctor[]> = {
  general: [
    { id: "d1", name: "Dra. María López", photo: "ML", rating: 4.9, reviews: 234, exp: "15 años", next: "Hoy" },
    { id: "d2", name: "Dr. Carlos Ruiz", photo: "CR", rating: 4.7, reviews: 189, exp: "12 años", next: "Mañana" },
    { id: "d3", name: "Dra. Ana Martínez", photo: "AM", rating: 4.8, reviews: 312, exp: "20 años", next: "Hoy" },
  ],
  cardio: [
    { id: "d4", name: "Dr. Roberto Sánchez", photo: "RS", rating: 4.9, reviews: 456, exp: "22 años", next: "Mañana" },
    { id: "d5", name: "Dra. Laura Gómez", photo: "LG", rating: 4.8, reviews: 278, exp: "18 años", next: "Jue 24" },
  ],
  derma: [
    { id: "d6", name: "Dra. Valentina Torres", photo: "VT", rating: 4.9, reviews: 521, exp: "16 años", next: "Hoy" },
    { id: "d7", name: "Dr. Andrés Mejía", photo: "AM", rating: 4.6, reviews: 198, exp: "10 años", next: "Mañana" },
  ],
  oftalmo: [
    { id: "d8", name: "Dr. Felipe Herrera", photo: "FH", rating: 4.8, reviews: 345, exp: "19 años", next: "Vie 25" },
    { id: "d9", name: "Dra. Camila Ríos", photo: "CR", rating: 4.7, reviews: 267, exp: "14 años", next: "Hoy" },
  ],
  pediatria: [
    { id: "d10", name: "Dra. Sofía Vargas", photo: "SV", rating: 5.0, reviews: 623, exp: "21 años", next: "Hoy" },
    { id: "d11", name: "Dr. Diego Morales", photo: "DM", rating: 4.8, reviews: 412, exp: "17 años", next: "Mañana" },
  ],
  traumato: [
    { id: "d12", name: "Dr. Javier Castillo", photo: "JC", rating: 4.7, reviews: 289, exp: "20 años", next: "Lun 28" },
    { id: "d13", name: "Dra. Paula Reyes", photo: "PR", rating: 4.9, reviews: 367, exp: "15 años", next: "Mañana" },
  ],
  neuro: [
    { id: "d14", name: "Dr. Martín Acosta", photo: "MA", rating: 4.9, reviews: 198, exp: "25 años", next: "Mié 23" },
    { id: "d15", name: "Dra. Isabel Peña", photo: "IP", rating: 4.8, reviews: 234, exp: "18 años", next: "Jue 24" },
  ],
  gineco: [
    { id: "d16", name: "Dra. Carolina Duarte", photo: "CD", rating: 4.9, reviews: 534, exp: "19 años", next: "Hoy" },
    { id: "d17", name: "Dra. Natalia Cruz", photo: "NC", rating: 4.7, reviews: 312, exp: "13 años", next: "Mañana" },
  ],
};

const TIMES_AM = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const TIMES_PM = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_SHORT = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

function hashSlot(dateStr: string, time: string) {
  let h = 0;
  const s = dateStr + time;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return (h >>> 0) % 100;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ color: "#F4B400", fontSize: 13, letterSpacing: 1 }} aria-label={`${rating} de 5 estrellas`}>
      {"★".repeat(full)}{half ? "☆" : ""}
      <span style={{ color: "#94A3B8", marginLeft: 4, fontSize: 12 }}>{rating}</span>
    </span>
  );
}

export function MedicalSchedulerProposal() {
  const [step, setStep] = useState(0);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientNotes, setPatientNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [searchSpec, setSearchSpec] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const goStep = useCallback((s: number, dir = 1) => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setStep(s); setAnimating(false); }, 280);
  }, []);

  const showNotification = (msg: string, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    showNotification("✅ Cita confirmada. Se envió correo de confirmación a " + patientEmail);
    setTimeout(() => {
      setReminderSent(true);
      showNotification("🔔 Recordatorio programado: 24h antes por SMS y correo");
    }, 2500);
  };

  const reset = () => {
    setStep(0); setSpecialty(null); setDoctor(null); setSelectedDate(null);
    setSelectedTime(null); setPatientName(""); setPatientPhone("");
    setPatientEmail(""); setPatientNotes(""); setConfirmed(false);
    setReminderSent(false); setSearchSpec(""); setAnimating(false);
  };

  const specColor = specialty ? (SPECIALTIES.find(s => s.id === specialty) as Specialty)?.color : "#0E7C6B";
  const filteredSpecs = SPECIALTIES.filter(s => s.name.toLowerCase().includes(searchSpec.toLowerCase()));

  const stepLabels = ["Especialidad", "Médico", "Fecha y Hora", "Confirmación"];
  const canNext = [
    !!specialty,
    !!doctor,
    !!selectedDate && !!selectedTime && patientName.length > 2 && patientPhone.length >= 7 && patientEmail.includes("@"),
    true,
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const dateObj = new Date(calYear, calMonth, d);
      const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = dateObj.getDay() === 0;
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === todayStr;
      const disabled = isPast || isWeekend;
      cells.push(
        <button
          key={d}
          disabled={disabled}
          aria-label={`${d} de ${MONTHS[calMonth]} ${calYear}${isToday ? ", hoy" : ""}${disabled ? ", no disponible" : ""}`}
          aria-pressed={isSelected}
          onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
          style={{
            width: 40, height: 40, borderRadius: 12, border: "none",
            background: isSelected ? specColor : isToday ? `${specColor}18` : "transparent",
            color: isSelected ? "#fff" : disabled ? "#CBD5E1" : isToday ? specColor : "#1E293B",
            fontWeight: isSelected || isToday ? 700 : 500,
            fontSize: 14, cursor: disabled ? "default" : "pointer",
            transition: "all 0.2s ease",
            outline: "none", position: "relative",
          }}
        >
          {d}
          {isToday && !isSelected && (
            <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: specColor }} />
          )}
        </button>
      );
    }
    return cells;
  };

  const renderTimeSlots = (slots: string[], label: string) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {slots.map(t => {
          const avail = hashSlot(selectedDate || "", t) > 30;
          const isSel = selectedTime === t;
          return (
            <button
              key={t}
              disabled={!avail}
              aria-label={`${t} ${avail ? "disponible" : "no disponible"}`}
              aria-pressed={isSel}
              onClick={() => setSelectedTime(t)}
              style={{
                padding: "8px 16px", borderRadius: 10,
                border: isSel ? `2px solid ${specColor}` : "1.5px solid #E2E8F0",
                background: isSel ? `${specColor}12` : !avail ? "#F8FAFC" : "#fff",
                color: !avail ? "#CBD5E1" : isSel ? specColor : "#334155",
                fontWeight: isSel ? 700 : 500, fontSize: 14,
                cursor: avail ? "pointer" : "default",
                textDecoration: !avail ? "line-through" : "none",
                transition: "all 0.2s ease",
              }}
            >{t}</button>
          );
        })}
      </div>
    </div>
  );

  const formatDate = (ds: string | null) => {
    if (!ds) return "";
    const [y, m, d] = ds.split("-").map(Number);
    const dt = new Date(y, m-1, d);
    return `${DAYS_SHORT[dt.getDay()]} ${d} de ${MONTHS[m-1]}, ${y}`;
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "linear-gradient(160deg, #F0FDFA 0%, #F8FAFC 40%, #FFF7ED 100%)", padding: "20px 12px", minHeight: "100%" }}>
      {/* Notification Toast */}
      {notification && (
        <div role="alert" aria-live="polite" style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: notification.type === "success" ? "#065F46" : "#1E40AF",
          color: "#fff", padding: "14px 28px", borderRadius: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)", zIndex: 999,
          fontSize: 14, fontWeight: 600, maxWidth: "90%", textAlign: "center",
        }}>{notification.msg}</div>
      )}

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", padding: "10px 22px", borderRadius: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 26 }}>🏥</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#0F172A" }}>MediCitas</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 10, fontWeight: 500 }}>Agenda tu cita en 4 sencillos pasos</p>
        </div>

        {/* Progress Stepper */}
        <nav aria-label="Progreso del agendamiento" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32, padding: "0 8px" }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  aria-current={step === i ? "step" : undefined}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                    background: step > i ? specColor : step === i ? specColor : "#E2E8F0",
                    color: step >= i ? "#fff" : "#94A3B8",
                    transition: "all 0.4s",
                    boxShadow: step === i ? `0 0 0 4px ${specColor}25` : "none",
                  }}
                >
                  {step > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: step >= i ? specColor : "#94A3B8", marginTop: 6, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
              </div>
              {i < 3 && (
                <div style={{ width: 36, height: 2, margin: "0 4px", background: step > i ? specColor : "#E2E8F0", borderRadius: 2, transition: "background 0.4s", marginBottom: 18 }} />
              )}
            </div>
          ))}
        </nav>

        {/* Content Card */}
        <div
          ref={contentRef}
          style={{
            background: "#fff", borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
            padding: "28px 24px", minHeight: 360,
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${direction * 30}px)` : "translateX(0)",
            transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* STEP 0 — Especialidad */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>Selecciona Especialidad</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 18px" }}>Elige el área médica que necesitas</p>
              <div style={{ position: "relative", marginBottom: 18 }}>
                <input
                  type="search"
                  placeholder="Buscar especialidad..."
                  aria-label="Buscar especialidad"
                  value={searchSpec}
                  onChange={e => setSearchSpec(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px 12px 42px",
                    borderRadius: 14, border: "1.5px solid #E2E8F0",
                    fontSize: 14, outline: "none", background: "#F8FAFC",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4 }}>🔍</span>
              </div>
              <div role="radiogroup" aria-label="Especialidades disponibles" style={{ display: "grid", gap: 10 }}>
                {filteredSpecs.map(s => (
                  <button
                    key={s.id}
                    role="radio"
                    aria-checked={specialty === s.id}
                    onClick={() => setSpecialty(s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 16,
                      border: specialty === s.id ? `2px solid ${s.color}` : "1.5px solid #E2E8F0",
                      background: specialty === s.id ? `${s.color}08` : "#fff",
                      cursor: "pointer", textAlign: "left", transition: "all 0.2s ease", outline: "none",
                    }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.desc}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: specialty === s.id ? `6px solid ${s.color}` : "2px solid #CBD5E1", transition: "all 0.2s ease", flexShrink: 0, boxSizing: "border-box" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Médico */}
          {step === 1 && specialty && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>Elige tu Médico</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 18px" }}>
                {SPECIALTIES.find(s => s.id === specialty)?.name} — profesionales disponibles
              </p>
              <div role="radiogroup" aria-label="Médicos disponibles" style={{ display: "grid", gap: 12 }}>
                {(DOCTORS[specialty] || []).map(doc => (
                  <button
                    key={doc.id}
                    role="radio"
                    aria-checked={doctor?.id === doc.id}
                    onClick={() => setDoctor(doc)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px", borderRadius: 18,
                      border: doctor?.id === doc.id ? `2px solid ${specColor}` : "1.5px solid #E2E8F0",
                      background: doctor?.id === doc.id ? `${specColor}06` : "#fff",
                      cursor: "pointer", textAlign: "left", transition: "all 0.25s ease", outline: "none",
                    }}
                  >
                    <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg, ${specColor}20, ${specColor}40)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: specColor, flexShrink: 0 }}>{doc.photo}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{doc.name}</div>
                      <StarRating rating={doc.rating} />
                      <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#64748B" }}>📋 {doc.reviews} reseñas</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}>⏱️ {doc.exp}</span>
                        <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>📅 {doc.next}</span>
                      </div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: doctor?.id === doc.id ? `6px solid ${specColor}` : "2px solid #CBD5E1", transition: "all 0.2s ease", flexShrink: 0, boxSizing: "border-box" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Fecha y Hora + Datos paciente */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>Fecha, Hora y Datos</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 18px" }}>
                Con {doctor?.name} — {SPECIALTIES.find(s => s.id === specialty)?.name}
              </p>

              {/* Calendar */}
              <div style={{ background: "#F8FAFC", borderRadius: 18, padding: 18, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <button
                    aria-label="Mes anterior"
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "#fff", cursor: "pointer", fontSize: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                  >←</button>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }} aria-live="polite">{MONTHS[calMonth]} {calYear}</span>
                  <button
                    aria-label="Mes siguiente"
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "#fff", cursor: "pointer", fontSize: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                  >→</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center", marginBottom: 6 }}>
                  {DAYS_SHORT.map(d => (
                    <div key={d} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", padding: "4px 0", textTransform: "uppercase" }}>{d}</div>
                  ))}
                </div>
                <div role="grid" aria-label="Calendario" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, justifyItems: "center" }}>
                  {renderCalendar()}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Horarios — {formatDate(selectedDate)}</p>
                  {renderTimeSlots(TIMES_AM, "☀️ Mañana")}
                  {renderTimeSlots(TIMES_PM, "🌙 Tarde")}
                </div>
              )}

              {/* Patient Form */}
              {selectedTime && (
                <div style={{ background: "#F8FAFC", borderRadius: 18, padding: 20, border: "1px solid #E2E8F0" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Datos del paciente</p>
                  {([
                    { label: "Nombre completo", val: patientName, set: setPatientName, type: "text", ph: "Ej: Juan Pérez García", auto: "name" },
                    { label: "Teléfono", val: patientPhone, set: setPatientPhone, type: "tel", ph: "+57 300 123 4567", auto: "tel" },
                    { label: "Correo electrónico", val: patientEmail, set: setPatientEmail, type: "email", ph: "correo@ejemplo.com", auto: "email" },
                  ] as const).map((f, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>
                        {f.label} <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type={f.type}
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                        placeholder={f.ph}
                        autoComplete={f.auto}
                        required
                        aria-label={f.label}
                        style={{
                          width: "100%", padding: "11px 14px", borderRadius: 12,
                          border: "1.5px solid #E2E8F0", fontSize: 14,
                          outline: "none", background: "#fff", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>
                      Motivo de consulta <span style={{ color: "#94A3B8", fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <textarea
                      value={patientNotes}
                      onChange={e => setPatientNotes(e.target.value)}
                      placeholder="Describe brevemente tus síntomas o motivo..."
                      aria-label="Motivo de consulta"
                      rows={3}
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 12,
                        border: "1.5px solid #E2E8F0", fontSize: 14,
                        outline: "none", background: "#fff", resize: "vertical", boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Confirmación */}
          {step === 3 && (
            <div>
              {!confirmed ? (
                <>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>Confirma tu Cita</h2>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>Revisa los detalles antes de confirmar</p>
                  <div style={{ background: "#F8FAFC", borderRadius: 18, padding: 20, border: "1px solid #E2E8F0", marginBottom: 18 }}>
                    {([
                      { icon: SPECIALTIES.find(s => s.id === specialty)?.icon, label: "Especialidad", value: SPECIALTIES.find(s => s.id === specialty)?.name },
                      { icon: "👨‍⚕️", label: "Médico", value: doctor?.name },
                      { icon: "📅", label: "Fecha", value: formatDate(selectedDate) },
                      { icon: "🕐", label: "Hora", value: selectedTime + " hrs" },
                      { icon: "👤", label: "Paciente", value: patientName },
                      { icon: "📱", label: "Teléfono", value: patientPhone },
                      { icon: "✉️", label: "Correo", value: patientEmail },
                    ] as const).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 6 ? "1px solid #E2E8F0" : "none" }}>
                        <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                    {patientNotes && (
                      <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Motivo</div>
                        <div style={{ fontSize: 13, color: "#475569" }}>{patientNotes}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ background: `${specColor}08`, borderRadius: 14, padding: "14px 16px", border: `1px solid ${specColor}20`, marginBottom: 18 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: specColor, margin: "0 0 8px" }}>📬 Notificaciones</p>
                    {["Confirmación por correo electrónico", "Recordatorio SMS 24h antes", "Recordatorio correo 24h antes"].map((n, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: specColor, fontSize: 14 }}>✓</span>
                        <span style={{ fontSize: 13, color: "#334155" }}>{n}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${specColor}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 38 }}>✅</div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>¡Cita Confirmada!</h2>
                  <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.6 }}>
                    Tu cita con <strong>{doctor?.name}</strong><br />
                    fue agendada para el <strong>{formatDate(selectedDate)}</strong><br />
                    a las <strong>{selectedTime} hrs</strong>
                  </p>
                  <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 18, border: "1px solid #E2E8F0", textAlign: "left", marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 10px" }}>Estado de notificaciones:</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#059669", fontSize: 16 }}>✅</span>
                      <span style={{ fontSize: 13, color: "#334155" }}>Correo de confirmación enviado a {patientEmail}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {reminderSent ? <span style={{ color: "#059669", fontSize: 16 }}>✅</span> : <span style={{ fontSize: 14 }}>⏳</span>}
                      <span style={{ fontSize: 13, color: "#334155" }}>
                        {reminderSent ? "Recordatorios programados (SMS + correo)" : "Programando recordatorios..."}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: `${specColor}08`, borderRadius: 14, padding: "14px 18px", border: `1px dashed ${specColor}30`, marginBottom: 20 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: specColor, margin: "0 0 6px" }}>📋 Código de cita</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: specColor, margin: 0, letterSpacing: 3, fontFamily: "monospace" }}>
                      MC-{(selectedDate || "").replace(/-/g, "").slice(-4)}-{(selectedTime || "").replace(":", "")}
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    style={{
                      padding: "14px 32px", borderRadius: 14,
                      border: `2px solid ${specColor}`,
                      background: "transparent", color: specColor,
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                    }}
                  >
                    Agendar otra cita
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {(!confirmed || step < 3) && (
          <div style={{ display: "flex", gap: 12, marginTop: 18, padding: "0 4px" }}>
            {step > 0 && (
              <button
                onClick={() => goStep(step - 1, -1)}
                aria-label="Paso anterior"
                style={{
                  flex: 1, padding: "14px 20px", borderRadius: 16,
                  border: "1.5px solid #E2E8F0", background: "#fff",
                  color: "#475569", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                ← Anterior
              </button>
            )}
            <button
              onClick={() => {
                if (step === 3 && !confirmed) handleConfirm();
                else if (step < 3) goStep(step + 1, 1);
              }}
              disabled={!canNext[step]}
              aria-label={step === 3 ? "Confirmar cita" : "Siguiente paso"}
              style={{
                flex: step === 0 ? 1 : 2, padding: "14px 20px", borderRadius: 16, border: "none",
                background: canNext[step] ? specColor : "#E2E8F0",
                color: canNext[step] ? "#fff" : "#94A3B8",
                fontWeight: 700, fontSize: 14,
                cursor: canNext[step] ? "pointer" : "default",
                transition: "all 0.3s ease",
                boxShadow: canNext[step] ? `0 4px 14px ${specColor}30` : "none",
              }}
            >
              {step === 3 ? "✓ Confirmar Cita" : "Siguiente →"}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, padding: "16px 0", borderTop: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {["WCAG 2.1 AA", "ISO 9241-210", "Nielsen Heuristics"].map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>{tag}</span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Propuesta MediCitas — Agendamiento accesible e inclusivo</p>
        </div>
      </div>

      <style>{`
        button:focus-visible { outline: 3px solid #0E7C6B; outline-offset: 2px; }
        input:focus-visible, textarea:focus-visible { outline: 3px solid #0E7C6B; outline-offset: 1px; }
      `}</style>
    </div>
  );
}
