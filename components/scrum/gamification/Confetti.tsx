"use client";

import { useEffect, useState } from "react";

const COLORS = ["#00B4D8","#7C3AED","#10B981","#F59E0B","#EF4444","#fff","#E2E8F0"];

interface Particle {
  id: number; color: string;
  tx: number; ty: number; rot: number;
  size: number; delay: number; duration: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tx: (Math.random() - 0.5) * 340,
    ty: -(Math.random() * 260 + 80),
    rot: (Math.random() - 0.5) * 720,
    size: Math.random() * 8 + 6,
    delay: Math.random() * 0.3,
    duration: Math.random() * 0.6 + 1.2,
  }));
}

interface ConfettiProps {
  trigger: boolean;
  count?: number;
}

export function Confetti({ trigger, count = 40 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setParticles(makeParticles(count));
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!visible || particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 20000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.id % 3 === 0 ? "50%" : 2,
            background: p.color,
            top: "50%",
            left: "50%",
            transformOrigin: "center",
            animation: `confetti-fly ${p.duration}s ${p.delay}s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
            ["--tx" as string]: `${p.tx}px`,
            ["--ty" as string]: `${p.ty}px`,
            ["--rot" as string]: `${p.rot}deg`,
            opacity: 1,
          }}
        />
      ))}
    </div>
  );
}
