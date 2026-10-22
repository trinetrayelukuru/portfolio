"use client";
import { ACHIEVEMENTS } from "../lib/constants";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const CATEGORY_STYLES: Record<string, string> = {
  Academic: "bg-[#00FF66]/10 border-[#00FF66]/30 text-[#00FF66]",
  Events: "bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#A78BFA]",
};

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeader
          label="Log"
          title="RECOGNITION & MILESTONES"
          sub="Awards and participations logged across academics and events."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((achievement, idx) => (
            <Reveal key={achievement.id} delay={idx * 0.08} className="h-full">
              <div className="group h-full rounded-xl p-6 bg-[#0B1713]/60 border border-[#00FF66]/10 hover:border-[#00FF66]/35 hover:-translate-y-1 hover:shadow-[0_0_28px_-10px_rgba(0,255,102,0.3)] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full border ${
                      CATEGORY_STYLES[achievement.category] ??
                      "bg-white/5 border-white/10 text-[#A7B0B0]"
                    }`}
                  >
                    {achievement.category}
                  </span>
                  <span className="font-mono text-[10px] text-dim">
                    LOG_{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base font-mono font-semibold text-[#F5F7F7] mb-2 group-hover:text-[#00FF66] transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-sm text-[#A7B0B0] leading-relaxed">
                  {achievement.description.trim()}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
