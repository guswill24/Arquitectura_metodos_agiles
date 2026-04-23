"use client";

import { useStore } from "@/lib/store";
import { UX_LEVELS } from "@/lib/config/ux-levels";

function formatTime(ms: number | null): string {
  if (!ms) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ResultsDashboard() {
  const { sessionHistory, issues, improvements, uxLevel } = useStore();

  const currentLevel = UX_LEVELS[uxLevel];
  const totalIssues = issues.length;
  const totalImprovements = improvements.length;

  // Comparativa entre primera y última sesión
  const first = sessionHistory[0];
  const last = sessionHistory[sessionHistory.length - 1];

  const timeImproved =
    first && last && first.timeToComplete && last.timeToComplete
      ? first.timeToComplete - last.timeToComplete
      : null;

  const errorsImproved =
    first && last ? first.errorCount - last.errorCount : null;

  // Mensaje final por nivel
  const getMessage = () => {
    if (uxLevel >= 4) {
      return "Transformaste una mala experiencia en una buena UX. Eso es exactamente lo que hace un UX Designer en la vida real.";
    }
    if (uxLevel === 3) {
      return "Alcanzaste un nivel aceptable. Hay margen para mejorar accesibilidad y microinteracciones.";
    }
    return "Sigue explorando niveles superiores para mejorar la experiencia del usuario.";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Dashboard de Resultados</h2>
        <p className="text-sm text-gray-500">
          Métricas acumuladas de tu sesión de aprendizaje.
        </p>
      </div>

      {/* Estado actual */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{uxLevel}</p>
          <p className="text-xs text-gray-500 mt-1">Nivel UX actual</p>
          <p className="text-xs font-medium text-gray-700">{currentLevel.name}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{totalIssues}</p>
          <p className="text-xs text-gray-500 mt-1">Problemas detectados</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{totalImprovements}</p>
          <p className="text-xs text-gray-500 mt-1">Mejoras aplicadas</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{sessionHistory.length}</p>
          <p className="text-xs text-gray-500 mt-1">Sesiones completadas</p>
        </div>
      </div>

      {/* Comparativa antes/después */}
      {sessionHistory.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Comparativa Antes vs Ahora</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Primera sesión (Nivel {first.levelId})</p>
              <p className="font-semibold text-gray-800">
                Tiempo: {formatTime(first.timeToComplete)}
              </p>
              <p className="font-semibold text-gray-800">
                Errores: {first.errorCount}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Última sesión (Nivel {last.levelId})</p>
              <p className="font-semibold text-gray-800">
                Tiempo: {formatTime(last.timeToComplete)}
              </p>
              <p className="font-semibold text-gray-800">
                Errores: {last.errorCount}
              </p>
            </div>
          </div>

          {timeImproved !== null && timeImproved > 0 && (
            <p className="text-xs text-green-600 mt-3 font-medium">
              Redujiste el tiempo de completado en {formatTime(timeImproved)}
            </p>
          )}
          {errorsImproved !== null && errorsImproved > 0 && (
            <p className="text-xs text-green-600 font-medium">
              Cometiste {errorsImproved} error(es) menos en la última sesión
            </p>
          )}
        </div>
      )}

      {/* Historial de sesiones */}
      {sessionHistory.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Historial de sesiones</p>
          <div className="flex flex-col gap-2">
            {sessionHistory.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-3 text-sm">
                <span className="text-gray-500">Sesión {i + 1} — Nivel {s.levelId}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-blue-600">{formatTime(s.timeToComplete)}</span>
                  <span className="text-orange-500">{s.errorCount} errores</span>
                  <span className="text-gray-400">{s.clickCount} clics</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje final por sesión */}
      {sessionHistory.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium">{getMessage()}</p>
        </div>
      )}

      {sessionHistory.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
          Completa al menos una sesión en el simulador para ver métricas.
        </div>
      )}

      {/* Bloque promocional Maestría UNAD */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Formación avanzada</p>
        <h3 className="text-base font-bold mb-2">Maestría en Diseño de Experiencia de Usuario</h3>
        <p className="text-sm text-blue-100 mb-4">
          Profundiza tus habilidades en investigación, diseño centrado en el usuario y evaluación de usabilidad con el respaldo académico de la UNAD.
        </p>
        <a
          href="https://maestriadisenoux.wixsite.com/mdux"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Conoce el programa →
        </a>
      </div>
    </div>
  );
}
