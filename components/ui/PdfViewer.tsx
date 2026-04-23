"use client";

import { useState, useEffect, useCallback } from "react";

type PdfViewerProps = {
  src: string;
  title: string;
};

export function PdfViewer({ src, title }: PdfViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const exit = useCallback(() => setFullscreen(false), []);

  /* Cerrar con Escape — WCAG 2.1 SC 1.4.13 / SC 2.1.2 */
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") exit(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, exit]);

  const toolbar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "#0C0E1A",
        borderBottom: "1px solid #1E2440",
        flexShrink: 0,
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#94A3B8",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        📄 {title}
      </span>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {/* Abrir en nueva pestaña */}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir "${title}" en nueva pestaña`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            minHeight: 40,
            borderRadius: 8,
            background: "#1E2440",
            color: "#94A3B8",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid #252B45",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#252B45";
            e.currentTarget.style.color = "#E2E8F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1E2440";
            e.currentTarget.style.color = "#94A3B8";
          }}
        >
          ↗ Nueva pestaña
        </a>

        {/* Pantalla completa */}
        <button
          onClick={() => setFullscreen((v) => !v)}
          aria-label={
            fullscreen
              ? "Salir de pantalla completa (tecla Escape)"
              : `Ver "${title}" en pantalla completa`
          }
          aria-pressed={fullscreen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            minHeight: 40,
            borderRadius: 8,
            background: fullscreen ? "#00B4D8" : "#1E2440",
            color: fullscreen ? "#fff" : "#94A3B8",
            fontSize: 13,
            fontWeight: 600,
            border: fullscreen ? "1px solid #0090AC" : "1px solid #252B45",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = fullscreen ? "#0090AC" : "#252B45";
            if (!fullscreen) e.currentTarget.style.color = "#E2E8F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = fullscreen ? "#00B4D8" : "#1E2440";
            if (!fullscreen) e.currentTarget.style.color = "#94A3B8";
          }}
        >
          {fullscreen ? "⛶ Salir" : "⛶ Pantalla completa"}
        </button>
      </div>
    </div>
  );

  /* Vista pantalla completa — overlay fijo sobre toda la pantalla */
  if (fullscreen) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          background: "#09090F",
        }}
      >
        {toolbar}
        <iframe
          src={src}
          title={title}
          style={{ flex: 1, width: "100%", border: "none", minHeight: 0 }}
        />
      </div>
    );
  }

  /* Vista embebida normal */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {toolbar}
      <iframe
        src={src}
        title={title}
        style={{ flex: 1, width: "100%", border: "none", minHeight: 0 }}
        loading="lazy"
      />
    </div>
  );
}
