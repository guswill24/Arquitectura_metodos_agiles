"use client";

import { useState } from "react";
import { useStore, type IssueType } from "@/lib/store";

const ISSUE_TYPES: { value: IssueType; label: string; color: string }[] = [
  { value: "usabilidad", label: "Usabilidad", color: "bg-orange-100 text-orange-800" },
  { value: "accesibilidad", label: "Accesibilidad", color: "bg-purple-100 text-purple-800" },
  { value: "ux", label: "UX", color: "bg-blue-100 text-blue-800" },
  { value: "ihc", label: "IHC", color: "bg-green-100 text-green-800" },
];


export function IssuePanel() {
  const { issues, addIssue, removeIssue } = useStore();
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<IssueType>("usabilidad");
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!desc.trim()) {
      setError("Describe el problema antes de guardar");
      return;
    }
    setError("");
    addIssue({ description: desc.trim(), type, severity });
    setDesc("");
    setSeverity(3);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Panel de Análisis</h2>
        <p className="text-sm text-gray-500">
          Identifica y clasifica los problemas de IHC que encuentras en el simulador.
        </p>
      </div>

      {/* Formulario de nuevo issue */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">
          Descripción del problema
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-400"
          rows={3}
          placeholder="Ej: Los colores del botón tienen bajo contraste y no se pueden leer"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tipo</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-400"
              value={type}
              onChange={(e) => setType(e.target.value as IssueType)}
            >
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Severidad ({severity}/5)
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full mt-2"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Guardar problema
        </button>
      </div>

      {/* Lista de issues */}
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">
          Problemas detectados ({issues.length})
        </p>
        {issues.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
            Aún no has registrado problemas. <br />
            Interactúa con el simulador y anota lo que observas.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {issues.map((issue) => {
              const typeInfo = ISSUE_TYPES.find((t) => t.value === issue.type);
              return (
                <div
                  key={issue.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{issue.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo?.color}`}>
                        {typeInfo?.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        Severidad {issue.severity}/5
                      </span>
                      <span className="text-xs text-gray-400">
                        Nivel {issue.levelDetected}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeIssue(issue.id)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                    aria-label="Eliminar problema"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
