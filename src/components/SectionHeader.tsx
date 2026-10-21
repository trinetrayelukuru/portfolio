"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

interface SectionHeaderProps {
  label: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}

/** HUD-style section header: line draws in, title resolves letter-by-letter. */
export default function SectionHeader({ label, title, sub, align = "left" }: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "text-center mb-14" : "mb-12"}>
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-px origin-left bg-gradient-to-r from-[#00FF66] to-transparent"
        />
        <span className="font-mono text-xs text-[#00FF66] uppercase tracking-[0.3em]">
          {label}
        </span>
        {centered && (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-px origin-right bg-gradient-to-l from-[#00FF66] to-transparent"
          />
        )}
      </div>
      <h2 className="text-4xl sm:text-5xl font-mono font-bold text-[#F5F7F7] tracking-tight mt-4">
        <SplitHeading text={title} />
      </h2>
      {sub && (
        <p
          className={`mt-4 text-[#A7B0B0] max-w-2xl text-sm sm:text-base leading-relaxed ${
            centered ? "mx-auto" : ""
          }`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
