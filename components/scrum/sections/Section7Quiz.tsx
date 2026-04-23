"use client";

import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

interface Question {
  id: number; text: string; options: string[]; correct: number; explanation: string;
}

const QUESTIONS: Question[] = [
  { id: 0, text: "¿Cuál es la duración habitual de un sprint en Scrum?",
    options: ["1 a 2 días", "1 a 4 semanas", "2 a 6 meses", "1 año"],
    correct: 1,
    explanation: "Un sprint es una iteración de duración fija de 1 a 4 semanas. La duración se define al inicio y no debe cambiar durante el sprint." },
  { id: 1, text: "¿Cuál es el rol responsable de maximizar el valor del producto?",
    options: ["Scrum Master", "Equipo de Desarrollo", "Product Owner", "Arquitecto"],
    correct: 2,
    explanation: "El Product Owner es el responsable de maximizar el valor del producto y de gestionar y priorizar el Product Backlog." },
  { id: 2, text: "¿Qué enfoque arquitectónico se propone para trabajar con Scrum?",
    options: ["Diseño emergente (sin planear)", "Diseño planeado incremental", "Diseño en cascada completo", "Sin diseño — Scrum no incluye arquitectura"],
    correct: 1,
    explanation: "El diseño planeado incremental es el enfoque propuesto: deliberado antes de implementar y refinado gradualmente sprint a sprint." },
  { id: 3, text: "¿Cuántas personas conforman el Equipo de Desarrollo en Scrum?",
    options: ["1 a 3 personas", "3 a 5 personas", "5 a 9 personas", "10 a 15 personas"],
    correct: 2,
    explanation: "El tamaño óptimo del Equipo de Desarrollo es de 5 a 9 personas. Equipos más pequeños limitan la multifuncionalidad; más grandes dificultan la coordinación." },
  { id: 4, text: "¿Qué es la deuda técnica en el desarrollo de software?",
    options: ["El costo económico del desarrollo", "Las horas extras trabajadas por el equipo", "Las omisiones en diseño para acelerar entregas", "El presupuesto no utilizado del proyecto"],
    correct: 2,
    explanation: "La deuda técnica es la metáfora de la deuda adquirida al omitir diseño para acelerar entregas. Genera costos crecientes en mantenimiento futuro." },
  { id: 5, text: "¿Cuándo se define la arquitectura base en Scrum?",
    options: ["Al finalizar el primer sprint", "Al final del proyecto", "Una sola vez, antes del primer sprint", "En cada sprint durante el refinamiento"],
    correct: 2,
    explanation: "La Ceremonia 4 (Definición de la arquitectura base) es obligatoria y se realiza UNA SOLA VEZ antes del primer sprint." },
  { id: 6, text: "¿Qué mide la velocidad de un equipo Scrum?",
    options: ["La cantidad de reuniones por semana", "Los puntos de historia completados por sprint", "Las horas trabajadas en cada sprint", "El número de miembros del equipo"],
    correct: 1,
    explanation: "La velocidad mide los puntos de historia completados por sprint. Se estabiliza después del tercer sprint y sirve para planear entregas futuras." },
  { id: 7, text: "¿Cuál es la principal función del Scrum Master?",
    options: ["Asignar tareas a los desarrolladores", "Definir los requisitos del producto", "Facilitar el proceso y eliminar impedimentos", "Aprobar el diseño arquitectónico"],
    correct: 2,
    explanation: "El Scrum Master facilita la adopción de Scrum, elimina impedimentos y protege al equipo. NO es un jefe de proyecto ni asigna tareas." },
  { id: 8, text: "¿Cuántos valores tiene el Manifiesto Ágil (2001)?",
    options: ["2 valores", "4 valores", "8 valores", "12 valores"],
    correct: 1,
    explanation: "El Manifiesto Ágil tiene 4 valores fundamentales que priorizan individuos, software funcionando, colaboración y respuesta al cambio." },
  { id: 9, text: "¿Qué artefacto resulta de las ceremonias 1, 2 y 3 del proceso Scrum?",
    options: ["Backlog del sprint", "Plan de proyecto", "Documento de requisitos", "Backlog del proyecto"],
    correct: 3,
    explanation: "Las ceremonias 1 (especificación), 2 (priorización) y 3 (especificación de tareas) producen el Backlog completo del proyecto." },
];

export function Section7Quiz() {
  const {
    studentName, quizAnswers, quizSubmitted,
    setQuizAnswer, submitQuiz, resetQuiz, markComplete, goToSection,
    addXP, unlockBadge, completedSections,
  } = useScrumStore();
  const { play } = useSoundEffects();

  const answeredCount = Object.keys(quizAnswers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function handleSubmit() {
    submitQuiz();
    markComplete(7);
    const sc = QUESTIONS.filter((q) => quizAnswers[q.id] === q.correct).length;
    const p  = Math.round((sc / QUESTIONS.length) * 100);
    if (p === 100) {
      play("complete");
      addXP(150, "¡Evaluación perfecta! 10/10 🎓");
      unlockBadge("scrum_scholar");
    } else if (p >= 80) {
      play("complete");
      addXP(75, `¡Gran resultado! ${sc}/10 en el quiz`);
      unlockBadge("scrum_scholar");
    } else if (p >= 60) {
      play("correct");
      addXP(40, `Evaluación completada: ${sc}/10`);
    } else {
      play("wrong");
      addXP(20, `Evaluación intentada: ${sc}/10`);
    }
    // Campeón Ágil: todas las secciones completadas + quiz ≥ 80 %
    const allDone = [1,2,3,4,5,6].every((n) => completedSections.includes(n));
    if (allDone && p >= 80) unlockBadge("campeon_agil");
  }

  const score = quizSubmitted
    ? QUESTIONS.filter((q) => quizAnswers[q.id] === q.correct).length
    : 0;
  const pct = Math.round((score / QUESTIONS.length) * 100);

  function getScoreMsg() {
    if (pct === 100) return { icon: "🏆", text: "¡Dominas completamente Scrum y la Arquitectura Ágil!", color: "var(--sl-success)" };
    if (pct >= 80)  return { icon: "🎉", text: "¡Excelente! Tienes un sólido conocimiento del tema.", color: "var(--sl-primary)" };
    if (pct >= 60)  return { icon: "👍", text: "Buen trabajo. Repasa las secciones donde fallaste.", color: "var(--sl-warning)" };
    return { icon: "📚", text: "Te recomendamos repasar el contenido antes de intentar de nuevo.", color: "var(--sl-danger)" };
  }

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "44px 36px 72px", width: "100%" }}>

      {/* Encabezado */}
      <header style={{ marginBottom: 36 }}>
        <span
          className="sl-tag"
          style={{ background: "var(--sl-primary-glow)", color: "var(--sl-primary)", marginBottom: 14, display: "inline-flex" }}
        >
          📝 Sección 7
        </span>
        <h1
          style={{
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
            fontSize: 34, fontWeight: 700, color: "var(--sl-text)", marginBottom: 16,
          }}
        >
          Evaluación Final
        </h1>
        <div className="sl-callout" role="note">
          <p style={{ fontSize: 15, color: "var(--sl-text-mid)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--sl-primary)" }}>🎯 Objetivo:</strong>{" "}
            Demostrar comprensión de los conceptos clave de Scrum, arquitectura ágil y
            deuda técnica mediante 10 preguntas de selección múltiple.
          </p>
        </div>
      </header>

      {/* Barra de progreso del quiz */}
      {!quizSubmitted && (
        <div
          role="status"
          aria-live="polite"
          aria-label={`${answeredCount} de ${QUESTIONS.length} preguntas respondidas`}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}
        >
          <div
            role="progressbar"
            aria-valuenow={answeredCount}
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            style={{ flex: 1, height: 8, background: "var(--sl-border)", borderRadius: 4, overflow: "hidden" }}
          >
            <div
              style={{
                height: "100%",
                width: `${(answeredCount / QUESTIONS.length) * 100}%`,
                background: "var(--sl-gradient)", borderRadius: 4, transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 14, color: "var(--sl-text-muted)", flexShrink: 0 }}>
            {answeredCount}/{QUESTIONS.length} respondidas
          </span>
        </div>
      )}

      {/* Panel de resultado */}
      {quizSubmitted && (() => {
        const msg = getScoreMsg();
        return (
          <div
            role="region"
            aria-label="Resultado del quiz"
            style={{
              padding: "32px 36px", borderRadius: 16, marginBottom: 36,
              background: "var(--sl-card)", border: `1px solid ${msg.color}40`, textAlign: "center",
            }}
          >
            <div aria-hidden="true" style={{ fontSize: 52, marginBottom: 14 }}>{msg.icon}</div>
            {studentName && (
              <p style={{ fontSize: 16, color: "var(--sl-text-muted)", marginBottom: 6 }}>
                {studentName},
              </p>
            )}
            <p
              style={{ fontSize: 38, fontWeight: 700, color: msg.color, marginBottom: 10 }}
              aria-label={`Calificación: ${score} de ${QUESTIONS.length} — ${pct} por ciento`}
            >
              {score}/{QUESTIONS.length} — {pct}%
            </p>
            <p style={{ fontSize: 17, color: "var(--sl-text-mid)", lineHeight: 1.7, maxWidth: 460, margin: "0 auto 24px" }}>
              {msg.text}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={resetQuiz} className="sl-btn sl-btn-outline">
                🔄 Reintentar quiz
              </button>
              <button onClick={() => goToSection(1)} className="sl-btn sl-btn-ghost">
                🏠 Volver al inicio
              </button>
            </div>
          </div>
        );
      })()}

      {/* Preguntas */}
      <ol
        aria-label="Preguntas del quiz"
        style={{ display: "flex", flexDirection: "column", gap: 24, paddingLeft: 0, listStyle: "none" }}
      >
        {QUESTIONS.map((q) => {
          const selected = quizAnswers[q.id];
          const isCorrect = quizSubmitted && selected === q.correct;
          const isWrong   = quizSubmitted && selected !== undefined && selected !== q.correct;

          return (
            <li key={q.id}>
              <div
                className="sl-card"
                style={{
                  padding: "24px 28px",
                  borderColor: isCorrect ? "var(--sl-success)" : isWrong ? "var(--sl-danger)" : "var(--sl-border)",
                }}
              >
                {/* Número + texto */}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: isCorrect ? "var(--sl-success-bg)" : isWrong ? "var(--sl-danger-bg)" : "var(--sl-primary-glow)",
                      color: isCorrect ? "var(--sl-success)" : isWrong ? "var(--sl-danger)" : "var(--sl-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700,
                      fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
                    }}
                  >
                    {quizSubmitted ? (isCorrect ? "✓" : "✗") : q.id + 1}
                  </span>
                  <p
                    id={`q-${q.id}-label`}
                    style={{ fontSize: 16, fontWeight: 600, color: "var(--sl-text)", lineHeight: 1.6 }}
                  >
                    {q.text}
                  </p>
                </div>

                {/* Opciones */}
                <div
                  role="radiogroup"
                  aria-labelledby={`q-${q.id}-label`}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {q.options.map((opt, idx) => {
                    const isSel      = selected === idx;
                    const isOptOk    = quizSubmitted && idx === q.correct;
                    const isOptWrong = quizSubmitted && isSel && idx !== q.correct;

                    return (
                      <button
                        key={idx}
                        role="radio"
                        aria-checked={isSel}
                        onClick={() => !quizSubmitted && setQuizAnswer(q.id, idx)}
                        disabled={quizSubmitted}
                        aria-label={`${opt}${isOptOk ? " — respuesta correcta" : isOptWrong ? " — respuesta incorrecta" : ""}`}
                        style={{
                          padding: "13px 18px", borderRadius: 10, minHeight: 48,
                          border: `1.5px solid ${isOptOk ? "var(--sl-success)" : isOptWrong ? "var(--sl-danger)" : isSel ? "var(--sl-primary)" : "var(--sl-border)"}`,
                          background: isOptOk ? "var(--sl-success-bg)" : isOptWrong ? "var(--sl-danger-bg)" : isSel ? "var(--sl-primary-glow)" : "transparent",
                          color: isOptOk ? "var(--sl-success)" : isOptWrong ? "var(--sl-danger)" : isSel ? "var(--sl-primary)" : "var(--sl-text-mid)",
                          textAlign: "left", fontSize: 15,
                          fontFamily: "var(--font-dm), 'DM Sans', sans-serif",
                          fontWeight: isSel || isOptOk ? 600 : 400,
                          cursor: quizSubmitted ? "default" : "pointer",
                          display: "flex", alignItems: "center", gap: 12,
                          transition: "all 0.15s",
                        }}
                      >
                        {/* Indicador circular accesible */}
                        <span
                          aria-hidden="true"
                          style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            border: `2px solid ${isOptOk ? "var(--sl-success)" : isOptWrong ? "var(--sl-danger)" : isSel ? "var(--sl-primary)" : "var(--sl-border-light)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11,
                          }}
                        >
                          {isOptOk ? "✓" : isOptWrong ? "✗" : isSel && !quizSubmitted
                            ? <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--sl-primary)", display: "block" }} />
                            : null}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Retroalimentación — Nielsen H9: ayuda a recuperarse de errores */}
                {quizSubmitted && (
                  <div
                    role="note"
                    aria-live="polite"
                    style={{
                      marginTop: 16, padding: "14px 18px", borderRadius: 10,
                      background: isCorrect ? "var(--sl-success-bg)" : "var(--sl-danger-bg)",
                    }}
                  >
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: isCorrect ? "var(--sl-success)" : "var(--sl-danger)" }}>
                      <strong>{isCorrect ? "✓ Correcto:" : "✗ Incorrecto:"}</strong>{" "}
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Botón enviar */}
      {!quizSubmitted && (
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="sl-btn sl-btn-primary"
            aria-disabled={!allAnswered}
            style={{
              fontSize: 16, padding: "14px 44px",
              opacity: allAnswered ? 1 : 0.45,
              cursor: allAnswered ? "pointer" : "not-allowed",
            }}
          >
            {allAnswered
              ? "📊 Ver resultados"
              : `Responde todas las preguntas (${answeredCount}/${QUESTIONS.length})`}
          </button>
        </div>
      )}

      {/* Navegación */}
      <nav
        aria-label="Navegación entre secciones"
        style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 56, paddingTop: 28, borderTop: "1px solid var(--sl-border)",
        }}
      >
        <button onClick={() => goToSection(6)} className="sl-btn sl-btn-outline"
          aria-label="Ir a la sección anterior: Deuda Técnica"
        >
          ← Anterior
        </button>
        <div />
      </nav>
    </div>
  );
}
