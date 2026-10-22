"use client";
import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  words: string[];
  label?: string;
  speed?: number;
}

export default function KineticText({
  words,
  label = "",
  speed = 3.2,
}: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  // Auto-cycling words is transform motion — hold on the first word under
  // prefers-reduced-motion (all words stay listed and readable).
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % words.length);
    }, speed * 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [words, speed, reduce]);

  return (
    <div className="relative overflow-hidden" aria-label={label || "Kinetic typography"}>
      {label && (
        <div className="mb-6 text-[11px] font-mono uppercase tracking-[0.2em] text-[#00E5FF]/70">
          {label}
        </div>
      )}
      <div className="flex flex-col items-start gap-1 select-none">
        {words.map((w, i) => {
          const dist = (i - idx + words.length) % words.length;
          const isActive = dist === 0;
          const offset = Math.abs(dist <= words.length / 2 ? dist : dist - words.length);
          const opacity = isActive ? 1 : Math.max(0.15, 0.55 - offset * 0.12);
          const scale = isActive ? 1 : Math.max(0.78, 1 - offset * 0.06);
          const blur = isActive ? 0 : Math.min(4, offset * 1.2);
          const y = isActive ? 0 : (dist < words.length / 2 ? -offset * 10 : offset * 10);

          return (
            <div
              key={`${w}-${i}`}
              className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-baseline gap-3"
              style={{
                opacity,
                transform: `translateY(${y}px) scale(${scale})`,
                filter: blur > 0 ? `blur(${blur}px)` : "none",
                willChange: "transform, opacity, filter",
              }}
            >
              {isActive && <span className="text-[#00FF66] text-base leading-none mr-1">→</span>}
              <span
                className="font-light tracking-tight leading-none"
                style={{
                  fontSize: isActive ? "2.25rem" : "1.35rem",
                  color: isActive ? "#F5F7F7" : "rgba(245,247,247,0.25)",
                  textShadow: isActive ? "0 0 40px rgba(0,255,102,0.25)" : "none",
                }}
              >
                {w}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
