"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIConfig, useUXConfig, useUXFeatures } from "@/lib/config/ux-context";
import { useStore } from "@/lib/store";
import { useAudioGuide, STEP_AUDIO, COMPLETED_AUDIO } from "@/lib/hooks/useAudioGuide";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { StepSpecialty } from "./StepSpecialty";
import { StepDoctor } from "./StepDoctor";
import { StepDate } from "./StepDate";
import { StepConfirm } from "./StepConfirm";

type FormData = {
  specialty: string;
  doctor: string;
  date: string;
  time: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const STEPS = ["Especialidad", "Médico", "Fecha", "Confirmación"];

const STEP_DESCRIPTIONS = [
  "Selecciona la especialidad médica que corresponde a tu necesidad de salud.",
  "Elige el profesional de salud que atenderá tu consulta.",
  "Escoge la fecha y el horario que mejor se adapte a tu disponibilidad.",
  "Verifica los datos de tu cita antes de confirmarla.",
];

// ──────────────────────────────────────────────────────────
// WCAG 2.1 – SkipLink (accesibilidad motriz)
// ──────────────────────────────────────────────────────────
function SkipLink() {
  return (
    <a
      href="#form-main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:font-semibold focus:text-sm"
    >
      Saltar al formulario
    </a>
  );
}

// ──────────────────────────────────────────────────────────
// WCAG 2.1 – StepTracker (soporte cognitivo)
// ──────────────────────────────────────────────────────────
function StepTracker({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <nav aria-label="Progreso del formulario" className="mb-5">
      <ol className="flex items-start justify-between gap-1">
        {steps.map((label, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <li key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isDone
                    ? "bg-green-600 border-green-600 text-white"
                    : isCurrent
                    ? "bg-blue-700 border-blue-700 text-white ring-4 ring-blue-200"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? "✓" : i + 1}
                <span className="sr-only">
                  {isDone ? `${label} – Completado` : isCurrent ? `${label} – Paso actual` : label}
                </span>
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight truncate w-full px-0.5 ${
                  isCurrent ? "text-blue-700" : isDone ? "text-green-700" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ──────────────────────────────────────────────────────────
// WCAG 2.1 – A11yBadge (indicador de modos activos)
// ──────────────────────────────────────────────────────────
function A11yBadge({ wcagContrast, cognitiveSupport, motorSupport }: {
  wcagContrast: boolean; cognitiveSupport: boolean; motorSupport: boolean;
}) {
  const active = [
    wcagContrast && "Alto contraste",
    cognitiveSupport && "Soporte cognitivo",
    motorSupport && "Accesibilidad motriz",
  ].filter(Boolean);

  if (active.length === 0) return null;

  return (
    <div
      role="status"
      aria-label="Modos de accesibilidad activos"
      className="bg-blue-700 text-white px-4 py-1.5 flex items-center gap-2 text-xs font-medium"
    >
      <span aria-hidden="true">♿</span>
      <span>WCAG 2.1 activo: {active.join(" · ")}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Shell de nivel 5 – contenedor premium que agrupa el flujo
// ──────────────────────────────────────────────────────────
function PremiumShell({
  step,
  totalSteps,
  audioToggle,
  children,
  wcagContrast = false,
  cognitiveSupport = false,
  motorSupport = false,
}: {
  step: number;
  totalSteps: number;
  audioToggle?: ReactNode;
  children: ReactNode;
  wcagContrast?: boolean;
  cognitiveSupport?: boolean;
  motorSupport?: boolean;
}) {
  const progressPct = ((step + 1) / totalSteps) * 100;

  const outerBg = wcagContrast
    ? "min-h-full flex flex-col items-center justify-center bg-white p-8"
    : "min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200 p-8";

  const headerBg = wcagContrast
    ? "bg-black px-8 py-6 flex items-center justify-between"
    : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 flex items-center justify-between";

  return (
    <div className={outerBg}>
      {motorSupport && <SkipLink />}
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden ${
          wcagContrast ? "border-2 border-gray-900" : "border border-slate-200/60"
        }`}
      >
        {/* Banda de accesibilidad WCAG */}
        <A11yBadge wcagContrast={wcagContrast} cognitiveSupport={cognitiveSupport} motorSupport={motorSupport} />

        {/* Header de marca */}
        <div className={headerBg}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${wcagContrast ? "bg-white" : "bg-white/10"}`}>
              <span className={`text-xl leading-none select-none ${wcagContrast ? "text-black" : "text-white"}`}>✚</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight leading-tight">
                HealthCare+
              </p>
              <p className={`text-xs ${wcagContrast ? "text-gray-300" : "text-slate-400"}`}>Sistema de Citas Médicas</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {!cognitiveSupport && (
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-medium uppercase tracking-widest ${wcagContrast ? "text-gray-300" : "text-slate-400"}`}>
                  Paso {step + 1} de {totalSteps}
                </p>
                <p className="text-white text-sm font-semibold mt-0.5">
                  {STEPS[step]}
                </p>
              </div>
            )}
            {audioToggle}
          </div>
        </div>

        {/* Barra de progreso integrada */}
        <div className={`h-1.5 w-full ${wcagContrast ? "bg-gray-200" : "bg-slate-100"}`}>
          <motion.div
            className={`h-1.5 ${wcagContrast ? "bg-black" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            role="progressbar"
            aria-valuenow={Math.round(progressPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso: paso ${step + 1} de ${totalSteps}`}
          />
        </div>

        {/* Contenido del formulario */}
        <div id="form-main" className="px-8 py-8" tabIndex={-1}>
          {children}
        </div>

        {/* Footer */}
        <div className="px-8 pb-5 pt-0">
          {motorSupport && (
            <p className={`text-xs text-center mb-1 font-medium ${wcagContrast ? "text-gray-700" : "text-slate-500"}`}>
              ⌨ Tab: siguiente campo · Enter: avanzar · Shift+Tab: retroceder
            </p>
          )}
          <p className={`text-xs text-center ${wcagContrast ? "text-gray-400" : "text-slate-300"}`}>
            Atención médica de calidad · UNAD Health System
          </p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────
export function AppointmentFlow() {
  const ui = useUIConfig();
  const features = useUXFeatures();
  const config = useUXConfig();
  const isPremium = config.id === 5;
  const { wcagContrast, cognitiveSupport, motorSupport } = features;

  const { startSession, endSession, incrementError, incrementClick, completed, resetSession } =
    useStore();

  const audio = useAudioGuide();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Narrar instrucción al cambiar de paso
  useEffect(() => {
    if (audio.enabled) {
      audio.speak(STEP_AUDIO[step], { interrupt: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, audio.enabled]);

  // Narrar confirmación al completar
  useEffect(() => {
    if (completed && audio.enabled) {
      audio.speak(COMPLETED_AUDIO, { interrupt: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, audio.enabled]);

  const update = (field: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (features.inlineErrors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    if (!features.validation) return true;
    const newErrors: Errors = {};

    if (step === 0 && !form.specialty) {
      newErrors.specialty = features.inlineErrors
        ? "Selecciona una especialidad para continuar"
        : "Error en formulario";
      incrementError();
    }
    if (step === 1 && !form.doctor) {
      newErrors.doctor = features.inlineErrors
        ? "Debes seleccionar un médico"
        : "Error en formulario";
      incrementError();
    }
    if (step === 2) {
      if (!form.date) {
        newErrors.date = features.inlineErrors
          ? "Selecciona una fecha válida"
          : "Error en formulario";
        incrementError();
      }
      if (features.formSimplification && !form.time) {
        newErrors.time = features.inlineErrors
          ? "Selecciona un horario disponible"
          : "Error en formulario";
        incrementError();
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.keys(newErrors).length > 0;
    if (hasErrors) {
      const errorMessages = Object.values(newErrors).join(". ");
      audio.speak(`Atención. ${errorMessages}`, { interrupt: true, rate: 0.85 });
    }
    return !hasErrors;
  };

  const handleNext = () => {
    incrementClick();
    if (!validate()) return;

    if (features.loadingStates) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (step < STEPS.length - 1) setStep((s) => s + 1);
        else handleSubmit();
      }, 600);
    } else {
      if (step < STEPS.length - 1) setStep((s) => s + 1);
      else handleSubmit();
    }
  };

  const handleBack = () => {
    incrementClick();
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
  };

  const handleSubmit = () => {
    endSession();
  };

  const handleReset = () => {
    resetSession();
    setStep(0);
    setForm({ specialty: "", doctor: "", date: "", time: "" });
    setErrors({});
    startSession();
  };

  const buttonLabel = () => {
    if (isLoading) return features.helpText ? "Procesando…" : "…";
    if (step === STEPS.length - 1) return features.helpText ? "Confirmar cita" : "Enviar";
    return features.helpText ? "Siguiente paso" : "Continuar";
  };

  // ──────────────────────────────────────────
  // NIVEL 1: Todo de una vez, sin pasos
  // ──────────────────────────────────────────
  if (!features.navigationClarity) {
    if (completed) {
      return (
        <div className={ui.container}>
          <div className={ui.successBanner}>
            {features.feedback ? "Cita registrada." : "Enviado"}
          </div>
        </div>
      );
    }

    return (
      <div className={ui.container}>
        <h1 className={ui.heading}>Citas</h1>
        <form
          className={ui.form}
          onSubmit={(e) => {
            e.preventDefault();
            incrementClick();
            if (!features.validation || validate()) handleSubmit();
          }}
        >
          <StepSpecialty value={form.specialty} onChange={update("specialty")} error={errors.specialty} />
          <StepDoctor specialtyId={form.specialty} value={form.doctor} onChange={update("doctor")} error={errors.doctor} />
          <StepDate
            date={form.date}
            time={form.time}
            onDateChange={update("date")}
            onTimeChange={update("time")}
            dateError={errors.date}
            timeError={errors.time}
          />
          {!features.inlineErrors && Object.keys(errors).length > 0 && (
            <p className={ui.errorText}>Error en formulario</p>
          )}
          <button type="submit" className={ui.button}>
            {features.feedback ? "Confirmar cita" : "Enviar"}
          </button>
        </form>
      </div>
    );
  }

  // ── Nodo de audio compartido (niveles 4 y 5) ──
  const audioNode = features.accessibility ? (
    <AudioToggle
      audio={audio}
      variant={isPremium ? "premium" : "default"}
      onEnable={() => audio.speak(STEP_AUDIO[step], { interrupt: true })}
    />
  ) : null;

  // ──────────────────────────────────────────
  // NIVELES 2-5: Flujo por pasos
  // ──────────────────────────────────────────
  if (completed) {
    const successContent = isPremium ? (
      <div className="flex flex-col items-center text-center gap-4 py-4">
        {/* Icono de confirmación */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M6 16L13 23L26 9" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Título */}
        <div>
          <p className="text-xl font-bold text-slate-900 leading-snug">
            ¡Cita confirmada exitosamente!
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Hemos registrado tu solicitud de manera satisfactoria.
          </p>
        </div>

        {/* Detalle */}
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-left">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">
            Próximo paso
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Recibirás una notificación con los detalles de tu cita. Te esperamos puntualmente en nuestra sede.
          </p>
        </div>

        <button
          className={`${ui.button} w-full mt-2 ${motorSupport ? "min-h-[56px]" : ""}`}
          onClick={handleReset}
          tabIndex={features.keyboardNavigation ? 0 : -1}
        >
          Agendar otra cita
        </button>
      </div>
    ) : (
      <>
        <div className={ui.successBanner}>
          {features.feedback
            ? "¡Tu cita ha sido confirmada exitosamente! Te esperamos."
            : "Cita confirmada."}
        </div>
        <button
          className={`${ui.button} mt-4`}
          onClick={handleReset}
          tabIndex={features.keyboardNavigation ? 0 : -1}
        >
          {features.helpText ? "Agendar otra cita" : "Volver"}
        </button>
      </>
    );

    if (isPremium) {
      return (
        <PremiumShell
          step={3}
          totalSteps={STEPS.length}
          audioToggle={audioNode}
          wcagContrast={wcagContrast}
          cognitiveSupport={cognitiveSupport}
          motorSupport={motorSupport}
        >
          {successContent}
        </PremiumShell>
      );
    }

    return <div className={ui.container}>{successContent}</div>;
  }

  const StepWrapper = ({ children }: { children: ReactNode }) => {
    if (features.microinteractions) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      );
    }
    return <div className={ui.transition}>{children}</div>;
  };

  // ── Contenido compartido niveles 2-5 ──
  const formContent = (
    <>
      {/* Encabezado — se oculta en nivel 5 porque lo maneja PremiumShell */}
      {!isPremium && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h1 className={ui.heading}>
              {features.helpText ? "Agenda tu cita médica" : "Sistema de Citas"}
            </h1>
            {features.helpText && (
              <p className={ui.description}>Encuentra tu cita en segundos</p>
            )}
          </div>
          {audioNode}
        </div>
      )}

      {/* Indicador de paso (solo niveles 2-4; nivel 5 usa header del shell) */}
      {features.navigationClarity && !isPremium && (
        <div
          className={ui.stepIndicator}
          aria-label={features.accessibility ? `Paso ${step + 1} de ${STEPS.length}: ${STEPS[step]}` : undefined}
        >
          Paso {step + 1} de {STEPS.length} — {STEPS[step]}
        </div>
      )}

      {/* Barra de progreso nivel 4 (nivel 5 la tiene integrada en PremiumShell) */}
      {features.visualHierarchy && features.microinteractions && !isPremium && (
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}
      {features.visualHierarchy && !features.microinteractions && !isPremium && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      )}

      {/* Tracker cognitivo (nivel 5 con cognitiveSupport) */}
      {isPremium && cognitiveSupport && (
        <StepTracker currentStep={step} steps={STEPS} />
      )}

      {/* Indicador de paso nivel 5 sin cognitiveSupport */}
      {isPremium && !cognitiveSupport && (
        <p className={ui.stepIndicator + " mb-4"}>
          {STEPS[step]}
        </p>
      )}

      {/* Descripción del paso (soporte cognitivo) */}
      {isPremium && cognitiveSupport && (
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {STEP_DESCRIPTIONS[step]}
        </p>
      )}

      {/* Paso activo */}
      <StepWrapper>
        {step === 0 && (
          <StepSpecialty value={form.specialty} onChange={update("specialty")} error={errors.specialty} />
        )}
        {step === 1 && (
          <StepDoctor specialtyId={form.specialty} value={form.doctor} onChange={update("doctor")} error={errors.doctor} />
        )}
        {step === 2 && (
          <StepDate
            date={form.date}
            time={form.time}
            onDateChange={update("date")}
            onTimeChange={update("time")}
            dateError={errors.date}
            timeError={errors.time}
          />
        )}
        {step === 3 && (
          <StepConfirm specialty={form.specialty} doctor={form.doctor} date={form.date} time={form.time} />
        )}
      </StepWrapper>

      {/* Error global nivel 2 */}
      {!features.inlineErrors && Object.keys(errors).length > 0 && (
        <p className={`${ui.errorText} mt-2`}>Error en formulario</p>
      )}

      {/* Navegación */}
      <div className={`flex mt-5 ${motorSupport ? "gap-4" : "gap-2"} ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <button
            onClick={handleBack}
            tabIndex={features.keyboardNavigation ? 0 : -1}
            aria-label={features.accessibility ? "Volver al paso anterior" : undefined}
            className={`
              border-2 border-slate-300 text-slate-700 bg-white
              hover:bg-slate-50 hover:border-slate-400
              font-semibold rounded-xl transition-all duration-200
              ${motorSupport ? "min-h-[56px] min-w-[130px] px-6 text-base" : "px-5 py-2.5 text-sm"}
              ${wcagContrast ? "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 border-slate-700 text-slate-900" : ""}
            `}
          >
            {features.helpText ? "← Anterior" : "Atrás"}
          </button>
        )}
        <button
          className={`${ui.button} ${isLoading ? ui.buttonDisabled : ""} ${
            motorSupport ? "min-h-[56px]" : ""
          } ${wcagContrast ? "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700" : ""}`}
          onClick={handleNext}
          disabled={isLoading}
          tabIndex={features.keyboardNavigation ? 0 : -1}
          aria-label={features.accessibility ? buttonLabel() : undefined}
          aria-busy={features.accessibility && isLoading ? "true" : undefined}
        >
          {buttonLabel()}
        </button>
      </div>


    </>
  );

  // ── Render final ──
  if (isPremium) {
    return (
      <PremiumShell
        step={step}
        totalSteps={STEPS.length}
        audioToggle={audioNode}
        wcagContrast={wcagContrast}
        cognitiveSupport={cognitiveSupport}
        motorSupport={motorSupport}
      >
        {formContent}
      </PremiumShell>
    );
  }

  return <div className={ui.container}>{formContent}</div>;
}
