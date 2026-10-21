"use client";

import { motion } from "framer-motion";

interface SplitHeadingProps {
  text: string;
  className?: string;
  /** Stagger between letters (seconds). */
  stagger?: number;
}

/**
 * Per-letter entrance: letters rise out of blur as the heading scrolls
 * into view (one-shot). Screen readers get the plain text via aria-label.
 */
export default function SplitHeading({ text, className, stagger = 0.022 }: SplitHeadingProps) {
  const letters = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={{ y: "0.3em" }}
          whileInView={{ y: "0em" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
