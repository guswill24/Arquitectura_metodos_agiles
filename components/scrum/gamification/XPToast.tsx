"use client";

import { useEffect, useRef } from "react";
import { useScrumStore } from "@/lib/store/scrum-store";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

export function XPToast() {
  const { pendingXPToast, clearXPToast } = useScrumStore();
  const { play } = useSoundEffects();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pendingXPToast) return;
    play("xp");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(clearXPToast, 2800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pendingXPToast, clearXPToast, play]);

  if (!pendingXPToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`+${pendingXPToast.amount} XP: ${pendingXPToast.reason}`}
      key={pendingXPToast.id}
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 20px",
        borderRadius: 14,
        background: "linear-gradient(135deg,#0F1120,#131626)",
        border: "1px solid rgba(0,180,216,0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,216,0.2)",
        animation: "xp-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        minWidth: 220,
      }}
    >
      {/* Icono XP */}
      <div
        aria-hidden="true"
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: "linear-gradient(135deg,#00B4D8,#7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 900,
          color: "#fff",
          flexShrink: 0,
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        XP
      </div>

      <div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            background: "linear-gradient(135deg,#00B4D8,#7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "'Space Grotesk',sans-serif",
            lineHeight: 1,
          }}
        >
          +{pendingXPToast.amount} XP
        </p>
        <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}>
          {pendingXPToast.reason}
        </p>
      </div>
    </div>
  );
}
