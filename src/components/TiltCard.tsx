"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  intensity?: number;
}

/**
 * 3D tilt card: perspective rotation follows the cursor, with a radial
 * spotlight highlight tracking the pointer. Falls back to a plain card
 * on touch devices.
 */
export default function TiltCard({ children, className, intensity = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 3D tilt is pointer-driven transform motion outside framer-motion's
  // pipeline — disabled under prefers-reduced-motion (same media query).
  const reduce = useReducedMotion();

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      if (reduce) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * intensity * 2;
      const ry = (px - 0.5) * intensity * 2;
      el.style.setProperty("--spot-x", `${px * 100}%`);
      el.style.setProperty("--spot-y", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [intensity, reduce]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "group relative rounded-xl overflow-hidden transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Cursor-tracking spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,255,102,0.10), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}
