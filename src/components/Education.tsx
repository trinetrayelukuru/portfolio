"use client";
import { EDUCATION } from "../lib/constants";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function EducationNew() {
  return (
    <section id="education" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeader label="Education" title="ACADEMIC" />
        {EDUCATION.map((edu) => (
          <Reveal key={edu.id}>
            <div className="group rounded-xl p-6 sm:p-8 bg-[#0B1713]/60 border border-[#00FF66]/10 hover:border-[#00FF66]/35 hover:shadow-[0_0_28px_-10px_rgba(0,255,102,0.3)] transition-all duration-300 relative overflow-hidden">
              {/* corner accent */}
              <span aria-hidden="true" className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-[#00E5FF]/60 to-transparent" />

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-mono font-bold text-[#F5F7F7]">{edu.institution}</h3>
                  <p className="text-lg text-[#F5F7F7] mt-2">{edu.degree}</p>
                  <p className="text-sm text-[#00E5FF] font-mono mt-1">
                    Specialisation: {edu.specialisation}
                  </p>
                </div>
                <span className="px-3 py-1 rounded font-mono text-xs bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                  {edu.duration}
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-lg border border-[#00FF66]/20 bg-[#030507]/50 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                    CGPA
                  </div>
                  <div className="font-mono text-3xl font-bold text-[#00FF66] mt-1">
                    {edu.cgpa}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#030507]/50 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                    Focus
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {edu.focus.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded text-xs text-[#D7DEDE] bg-white/[0.04] border border-white/10"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
