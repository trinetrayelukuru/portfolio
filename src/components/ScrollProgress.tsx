"use client";

import { motion, useScroll } from "framer-motion";

/** Neon scroll-progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left bg-gradient-to-r from-[#00FF66] via-[#00E5FF] to-[#7C3AED] shadow-[0_0_12px_rgba(0,255,102,0.6)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
