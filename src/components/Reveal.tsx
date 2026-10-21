"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger, in seconds. */
  delay?: number;
  /** Entry offset in px. */
  y?: number;
  /** Transition length in seconds. */
  duration?: number;
  className?: string;
}

type RevealState = "static" | "play";

/**
 * Content-first entrance wrapper.
 *
 * The server-rendered markup is fully visible: nothing is hidden by inline
 * styles, so the page stays readable with no JavaScript, a failed hydration or
 * a runtime error elsewhere on the page. Only after mounting does the component
 * opt into motion:
 *
 *  • elements already on screen play a one-shot CSS keyframe ("play");
 *  • elements below the fold stay fully visible and opt into the same
 *    transform-only animation when they enter the viewport.
 *
 * Opacity is never used as a gate: cards stay visible after scrolling down and
 * back up, under `prefers-reduced-motion`, and in FX OFF. If the observer or
 * client bundle fails, the server-rendered static state is still readable.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.6,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support or reduced motion → stay in the static (visible) state.
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (onScreen) {
      setState("play");
      return;
    }

    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      setState("play");
      observer?.disconnect();
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );
    observer.observe(el);

    return () => {
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state === "static" ? undefined : state}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-duration": `${duration}s`,
          "--reveal-delay": `${delay}s`,
        } as React.CSSProperties
      }
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
