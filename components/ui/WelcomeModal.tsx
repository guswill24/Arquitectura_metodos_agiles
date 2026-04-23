"use client";

import { useState } from "react";
import Image from "next/image";

export function WelcomeModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col items-center overflow-hidden"
        style={{ width: 420, maxWidth: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen */}
        <div className="w-full bg-slate-50 flex items-center justify-center px-10 pt-10 pb-6">
          <Image
            src="/entrada.png"
            alt="UX Lab – IHC"
            width={320}
            height={320}
            className="object-contain"
            priority
          />
        </div>

        {/* Texto */}
        <div
          className="w-full flex flex-col items-center gap-1 px-8 py-6"
          style={{ borderTop: "1px solid #EBEBEB", background: "#FAFAFA" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#777" }}>
            IHC · Interacción Humano-Computador
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: "#1A1A1A" }}>
            Gustavo Sánchez Rodríguez
          </p>
          <p className="text-sm font-medium" style={{ color: "#F97316" }}>
            Tutor
          </p>

          {/* Botón */}
          <button
            onClick={() => setOpen(false)}
            className="mt-5 px-8 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "#1A1A1A" }}
          >
            Ingresar al laboratorio
          </button>
        </div>
      </div>
    </div>
  );
}
