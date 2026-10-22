"use client";

import { MotionConfig } from "framer-motion";

/**
 * Single source of motion-preference truth for framer-motion animations.
 * `reducedMotion="user"` disables transform/layout animations (slides, scales,
 * parallax-style entrances) when the OS reports prefers-reduced-motion, while
 * preserving opacity and colour transitions so fades still communicate state.
 *
 * Pointer-driven effects that bypass framer-motion (Three.js field, magnetic
 * buttons, tilt cards, kinetic text) opt out via framer-motion's own
 * `useReducedMotion()` hook — the same underlying media query, no duplication.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
