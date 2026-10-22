"use client";

import { useFxLevel, cycleFx } from "../lib/fx";

const LABELS = {
  full: { text: "FX FULL", dot: "bg-[#00FF66]", border: "border-[#00FF66]/50", color: "text-[#00FF66]" },
  subtle: { text: "FX SUBTLE", dot: "bg-[#F59E0B]", border: "border-[#F59E0B]/50", color: "text-[#F59E0B]" },
  off: { text: "FX OFF", dot: "bg-[#A7B0B0]", border: "border-white/25", color: "text-[#A7B0B0]" },
} as const;

/** Cycles visual-effects intensity: full → subtle → off (persisted across visits). */
export default function FxToggle() {
  const level = useFxLevel();
  const style = LABELS[level];

  return (
    <button
      onClick={cycleFx}
      aria-label={`Visual effects: ${level}. Click to change.`}
      title="Toggle visual effects (full / subtle / off)"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${style.border} ${style.color} font-mono text-[10px] tracking-wider hover:bg-white/5 transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} fx-anim animate-pulse`} />
      {style.text}
    </button>
  );
}
