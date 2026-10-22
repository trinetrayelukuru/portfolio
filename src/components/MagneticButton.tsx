"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
}

/**
 * Magnetic hover: the wrapped element eases toward the cursor while hovered
 * and springs back on leave. No-op on touch devices.
 */
export default function MagneticButton({ children, strength = 0.22 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Cursor-chasing is transform motion outside framer-motion's animation
  // pipeline — skip it under prefers-reduced-motion (same media query).
  const reduce = useReducedMotion();

  const onMove = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      const el = ref.current;
      if (!el) return;
      if (reduce) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [strength, reduce]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform"
      style={{ transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </span>
  );
}
