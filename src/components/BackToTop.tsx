"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "framer-motion";

/** Floating back-to-top button that appears after scrolling down, with a scroll-percent ring. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  // Instant jump instead of smooth scroll under prefers-reduced-motion.
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-full flex items-center justify-center bg-[#030507]/90 border border-[#00FF66]/40 text-[#00FF66] hover:border-[#00FF66] hover:shadow-[0_0_20px_rgba(0,255,102,0.35)] transition-shadow backdrop-blur-sm"
        >
          {/* progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <span className="font-mono text-lg leading-none relative">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
