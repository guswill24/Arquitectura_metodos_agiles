"use client";

import { useStore } from "@/lib/store";
import { UX_LEVELS } from "@/lib/config/ux-levels";

export function Exporter() {
  const { issues, improvements, sessionHistory, uxLevel } = useStore();
  const currentLevel = UX_LEVELS[uxLevel];

  const buildExport = () => {
    const lastSession = sessionHistory[sessionHistory.length - 1];
    const firstSession = sessionHistory[0];

    const summary =
      uxLevel >= 4
        ? "El estudiante alcanzó un nivel de UX bueno/profesional, aplicando mejoras significativas en validación, accesibilidad y experiencia general."
        : uxLevel === 3
        ? "El estudiante alcanzó un nivel aceptable de UX, detectando problemas clave y aplicando mejoras básicas."
        : "El estudiante exploró niveles iniciales de UX, identificando problemas de usabilidad y accesibilidad.";

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        finalLevel: uxLevel,
        levelName: currentLevel.name,
        totalSessions: sessionHistory.length,
      },
      issues: issues.map((i) => ({
        description: i.description,
        type: i.type,
        severity: i.severity,
        levelDetected: i.levelDetected,
      })),
      improvements: improvements.map((i) => ({
        feature: i.feature,
        label: i.label,
      })),
      metrics: {
        firstSession: firstSession
          ? {
              level: firstSession.levelId,
              timeMs: firstSession.timeToComplete,
              errors: firstSession.errorCount,
              clicks: firstSession.clickCount,
            }
          : null,
        lastSession: lastSession
          ? {
              level: lastSession.levelId,
              timeMs: lastSession.timeToComplete,
              errors: lastSession.errorCount,
              clicks: lastSession.clickCount,
            }
          : null,
        sessionHistory: sessionHistory,
      },
      summary,
    };
  };

  const downloadJSON = () => {
    const data = buildExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ux-lab-reporte-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadText = () => {
    const data = buildExport();
    const lines = [
      "===================================",
      "  REPORTE UX LAB – UNAD",
      "===================================",
      "",
      `Fecha: ${new Date(data.metadata.exportDate).toLocaleString("es-CO")}`,
      `Nivel final alcanzado: ${data.metadata.finalLevel} – ${data.metadata.levelName}`,
      `Sesiones completadas: ${data.metadata.totalSessions}`,
      "",
      "--- PROBLEMAS DETECTADOS ---",
      ...data.issues.map(
        (i, idx) =>
          `${idx + 1}. [${i.type.toUpperCase()}] (Severidad ${i.severity}/5) ${i.description} — Detectado en Nivel ${i.levelDetected}`
      ),
      data.issues.length === 0 ? "  (ninguno registrado)" : "",
      "",
      "--- MEJORAS APLICADAS ---",
      ...data.improvements.map((i, idx) => `${idx + 1}. ${i.label} (${i.feature})`),
      data.improvements.length === 0 ? "  (ninguna registrada)" : "",
      "",
      "--- MÉTRICAS ---",
      data.metrics.firstSession
        ? `Primera sesión (N${data.metrics.firstSession.level}): tiempo=${data.metrics.firstSession.timeMs}ms, errores=${data.metrics.firstSession.errors}`
        : "Sin primera sesión registrada",
      data.metrics.lastSession
        ? `Última sesión (N${data.metrics.lastSession.level}): tiempo=${data.metrics.lastSession.timeMs}ms, errores=${data.metrics.lastSession.errors}`
        : "",
      "",
      "--- RESUMEN ---",
      data.summary,
      "",
      "===================================",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ux-lab-reporte-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canExport = issues.length > 0 || sessionHistory.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Exportar Reporte</h2>
        <p className="text-sm text-gray-500">
          Genera el insumo para tu actividad académica.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="text-sm text-gray-700">
          <p><strong>{issues.length}</strong> problemas detectados</p>
          <p><strong>{improvements.length}</strong> mejoras registradas</p>
          <p><strong>{sessionHistory.length}</strong> sesiones completadas</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={downloadJSON}
            disabled={!canExport}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              canExport
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Exportar JSON
          </button>
          <button
            onClick={downloadText}
            disabled={!canExport}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              canExport
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Exportar Texto
          </button>
        </div>

        {!canExport && (
          <p className="text-xs text-gray-400">
            Completa al menos una sesión o registra problemas para poder exportar.
          </p>
        )}
      </div>
    </div>
  );
}
