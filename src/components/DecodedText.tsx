"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface DecodedTextProps {
  text: string;
  /** Delay before the decode starts (ms). */
  delay?: number;
  /** Scramble steps per character. */
  speed?: number;
  className?: string;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]{}=+*^?#";

/**
 * Terminal-style decode: characters scramble through random glyphs and
 * lock in left-to-right. Runs once on mount; static text under
 * prefers-reduced-motion.
 */
export default function DecodedText({ text, delay = 300, speed = 28, className }: DecodedTextProps) {
  const reduce = useReducedMotion();
  // Start with the real text so the heading is present in the server-rendered
  // HTML (and remains readable if JavaScript never runs). The client effect
  // then replaces it with the scramble animation.
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const total = text.length * 2 + 8;

    const tick = () => {
      frame += 1;
      const locked = Math.floor((frame / total) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
        } else if (i < locked) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (frame < total) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    timeout = setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [text, delay, speed, reduce]);

  // Reduced motion (and no-JS) render the real text.
  const shown = reduce ? text : display || text;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
