"use client";

import type { AudioGuide } from "@/lib/hooks/useAudioGuide";

type Props = {
  audio: AudioGuide;
  /** Reproduce la instrucción del paso actual al activar */
  onEnable?: () => void;
  variant?: "default" | "premium";
};

export function AudioToggle({ audio, onEnable, variant = "default" }: Props) {
  if (!audio.supported) return null;

  const handleClick = () => {
    audio.toggle();
    // Si se está activando, reproduce instrucción inmediatamente
    if (!audio.enabled && onEnable) {
      // El toggle es asíncrono — esperamos un tick
      setTimeout(onEnable, 50);
    }
  };

  if (variant === "premium") {
    return (
      <button
        onClick={handleClick}
        aria-pressed={audio.enabled}
        aria-label={audio.enabled ? "Desactivar guía de audio" : "Activar guía de audio"}
        title={audio.enabled ? "Guía de audio activa" : "Activar guía de audio"}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          audio.enabled
            ? "bg-blue-600 text-white shadow-md"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {audio.enabled ? (
          <>
            <SpeakerOnIcon />
            <span className="hidden sm:inline">Audio activo</span>
          </>
        ) : (
          <>
            <SpeakerOffIcon />
            <span className="hidden sm:inline">Guía de audio</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={audio.enabled}
      aria-label={audio.enabled ? "Desactivar guía de audio" : "Activar guía de audio"}
      title={audio.enabled ? "Desactivar audio" : "Activar guía de audio para baja visión"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        audio.enabled
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {audio.enabled ? <SpeakerOnIcon size={14} /> : <SpeakerOffIcon size={14} />}
      <span>{audio.enabled ? "Audio ON" : "Audio"}</span>
    </button>
  );
}

function SpeakerOnIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
