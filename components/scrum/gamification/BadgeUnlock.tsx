"use client";

import { useEffect, useRef, useState } from "react";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";
import { Confetti } from "./Confetti";

export function BadgeUnlock() {
  const { pendingBadge, clearBadge } = useScrumStore();
  const { play } = useSoundEffects();
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pendingBadge) return;
    setConfettiTrigger(false);
    const t = setTimeout(() => {
      setConfettiTrigger(true);
      play("badge");
      btnRef.current?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, [pendingBadge, play]);

  if (!pendingBadge) return null;

  return (
    <>
      <Confetti trigger={confettiTrigger} count={50} />

      {/* Overlay oscuro */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="badge-title"
        aria-describedby="badge-desc"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 15000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          padding: 24,
        }}
        onClick={clearBadge}
      >
        {/* Tarjeta */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(145deg,#0F1120,#131626)",
            border: "1px solid rgba(0,180,216,0.35)",
            borderRadius: 24,
            padding: "44px 48px",
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,180,216,0.12)",
            animation: "badge-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          {/* Etiqueta */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#00B4D8",
              marginBottom: 20,
            }}
          >
            ✨ ¡Insignia desbloqueada!
          </p>

          {/* Ícono de la insignia */}
          <div
            aria-hidden="true"
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              margin: "0 auto 22px",
              background: "linear-gradient(135deg,rgba(0,180,216,0.2),rgba(124,58,237,0.2))",
              border: "2px solid rgba(0,180,216,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              boxShadow: "0 0 40px rgba(0,180,216,0.25)",
            }}
          >
            {pendingBadge.icon}
          </div>

          {/* Nombre */}
          <h2
            id="badge-title"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 24,
              fontWeight: 800,
              background: "linear-gradient(135deg,#00B4D8,#7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 10,
            }}
          >
            {pendingBadge.name}
          </h2>

          {/* Descripción */}
          <p
            id="badge-desc"
            style={{
              fontSize: 15,
              color: "#94A3B8",
              lineHeight: 1.7,
              marginBottom: 30,
            }}
          >
            {pendingBadge.desc}
          </p>

          {/* Botón confirmar */}
          <button
            ref={btnRef}
            onClick={clearBadge}
            style={{
              background: "linear-gradient(135deg,#00B4D8,#7C3AED)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              padding: "13px 36px",
              minHeight: 48,
              cursor: "pointer",
              width: "100%",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            ¡Genial! Continuar →
          </button>
        </div>
      </div>
    </>
  );
}
