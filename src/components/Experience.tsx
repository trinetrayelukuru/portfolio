"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EXPERIENCE } from "../lib/constants";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function ExperienceNew() {
  const spineRef = useRef<HTMLDivElement>(null);
  // Spine draws itself as the section scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ["start 0.9", "end 0.55"],
  });
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <SectionHeader label="Timeline" title="WORK HISTORY" />

        <div ref={spineRef} className="relative pl-8">
          {/* static track */}
          <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-px bg-[#00FF66]/15" />
          {/* scroll-drawn progress line */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: scrollYProgress }}
            className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-[#00FF66] via-[#00E5FF] to-[#7C3AED] shadow-[0_0_8px_rgba(0,255,102,0.6)]"
          />
          {/* pulse traveling with scroll progress */}
          <motion.span
            aria-hidden="true"
            style={{ top: dotTop }}
            className="absolute -left-[3.5px] w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"
          />

          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.15} y={16}>
              <div className="relative mb-10 pl-8">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#00FF66] border-2 border-[#030507] shadow-[0_0_10px_#00FF66] fx-anim animate-pulse" />
                <div className="rounded-xl p-6 bg-[#0B1713]/60 border border-[#00FF66]/10 hover:border-[#00FF66]/30 hover:shadow-[0_0_28px_-10px_rgba(0,255,102,0.35)] transition-all duration-300">
                  <div className="flex flex-wrap gap-2 mb-2"><span className="px-3 py-0.5 text-xs font-mono bg-[#00FF66]/10 text-[#00FF66] rounded">{e.duration}</span><span className="text-sm font-mono text-[#F5F7F7]">{e.company}</span></div>
                  <h3 className="text-xl font-mono font-bold text-[#F5F7F7] mb-1">{e.role}</h3>
                  <p className="text-sm text-[#A7B0B0] mb-3">{e.description}</p>
                  <div className="flex flex-wrap gap-2">{e.techStack.map((t: string)=><span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A7B0B0]">{t}</span>)}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
