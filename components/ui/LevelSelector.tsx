"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";
import { UX_LEVELS } from "@/lib/config/ux-levels";

const LEVEL_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "#E03131",
  2: "#E8650A",
  3: "#C49A00",
  4: "#1971C2",
  5: "#4D9E25",
};

export function LevelSelector() {
  const { uxLevel } = useStore();
  const current = UX_LEVELS[uxLevel];

  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0"
      style={{
        background: "#1A1A1A",
        borderBottom: "1px solid #333",
        height: "60px",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo_ux_transparente.png"
          alt="UX Lab UNAD"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
        <div className="leading-tight">
          <span className="text-white font-bold text-sm tracking-tight">UX Lab</span>
          <span className="font-bold text-sm tracking-tight" style={{ color: "#F97316" }}> UNAD</span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded ml-1 font-medium"
          style={{ background: "#2D2D2D", color: "#999" }}
        >
          IHC · Interacción Humano-Computador
        </span>
      </div>

      {/* Nivel activo */}
      <div className="flex items-center gap-2">
        <span style={{ color: "#777", fontSize: "12px" }}>Nivel activo:</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: LEVEL_COLORS[uxLevel] + "22",
            color: LEVEL_COLORS[uxLevel],
            border: `1px solid ${LEVEL_COLORS[uxLevel]}44`,
          }}
        >
          N{uxLevel} — {current.name}
        </span>
      </div>
    </header>
  );
}
