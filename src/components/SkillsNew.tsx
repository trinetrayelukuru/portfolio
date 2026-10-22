"use client";

import { useMemo, useState } from "react";
import { SKILL_GROUPS, type SkillGroup } from "../lib/constants";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

type Filter = "all" | SkillGroup["id"];

const TRACKS = [
  {
    label: "Academics",
    description: "Degree, grades, and coursework",
    value: "B.Tech CSE · IoT",
    detail: "VIT Vellore · 7.6 / 10 CGPA",
    accent: "#FBBF24",
  },
  {
    label: "Engineering",
    description: "Things built and shipped",
    value: "AI + full-stack products",
    detail: "Web, local AI, cloud, and IoT",
    accent: "#38BDF8",
  },
  {
    label: "Toolkit",
    description: "Languages, frameworks, and systems",
    value: "7 skill groups",
    detail: "Python · TypeScript · AWS · Figma",
    accent: "#4ADE80",
  },
  {
    label: "Trajectory",
    description: "Where this is heading next",
    value: "Open to software roles",
    detail: "AI applications · product engineering",
    accent: "#A78BFA",
  },
];

/** Small inline SVG so each card has a visual marker without extra assets. */
function GroupIcon({ path, color }: { path: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border"
      style={{
        borderColor: `${color}44`,
        backgroundColor: `${color}14`,
        color,
      }}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </span>
  );
}

export default function SkillsNew() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleGroups = useMemo(
    () => (filter === "all" ? SKILL_GROUPS : SKILL_GROUPS.filter((group) => group.id === filter)),
    [filter]
  );

  const totalSkills = SKILL_GROUPS.reduce((total, group) => total + group.skills.length, 0);
  const filters: { id: Filter; label: string; count: number; accent?: string }[] = [
    { id: "all", label: "All", count: totalSkills, accent: "#00FF66" },
    ...SKILL_GROUPS.map((group) => ({
      id: group.id,
      label: group.label,
      count: group.skills.length,
      accent: group.accent,
    })),
  ];
  const activeLabel = filter === "all" ? "all skill groups" : filters.find((item) => item.id === filter)?.label;

  return (
    <section id="skills" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          label="// ls -la skills/"
          title="SKILLS"
          sub="A terminal-style map of the tools, systems, and ideas I use to turn concepts into working products."
        />

        <Reveal className="mb-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Portfolio tracks">
            {TRACKS.map((track) => (
              <article
                key={track.label}
                className="rounded-lg border border-white/10 bg-[#0B1110]/70 p-4 transition-colors hover:border-white/20"
              >
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: track.accent }}>
                  <span className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: track.accent }} aria-hidden="true" />
                  {track.label}
                </div>
                <p className="font-mono text-[11px] leading-relaxed text-[#7D8B9F]">{track.description}</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <h3 className="text-sm font-medium leading-snug text-[#F5F7F7]">{track.value}</h3>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#7D8B9F]">{track.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-6">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter skills by category">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#7D8B9F]">FILTER</span>
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] ${
                    active
                      ? "border-[#00FF66]/60 bg-[#00FF66]/10 text-[#F5F7F7]"
                      : "border-white/20 text-[#7D8B9F] hover:border-white/35 hover:text-[#F5F7F7]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.accent }} aria-hidden="true" />
                  {item.label}
                  <span className="text-[#7D8B9F]">{item.count}</span>
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {activeLabel}.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.05} y={16} className="h-full">
              <article
                className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B1110]/80 p-5 transition-colors hover:border-white/25"
                style={{ boxShadow: "0 14px 32px -28px rgba(0,0,0,0.9)" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, ${group.accent}, transparent)`, opacity: 0.8 }}
                />

                <div className="mb-4 flex items-start gap-3">
                  <GroupIcon path={group.icon} color={group.accent} />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-[#F5F7F7] sm:text-base">{group.label}</h3>
                    <p className="mt-1 font-mono text-[10px] text-[#7D8B9F]">~/skills/{group.id}/</p>
                  </div>
                </div>

                <ul className="space-y-2" aria-label={`${group.label} skills`}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 font-mono text-xs leading-relaxed text-[#B7BEC8]">
                      <span className="mt-0.5 text-[#00FF66]" aria-hidden="true">›</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-[#7D8B9F]">
                  <span>{group.skills.length} tracked skills</span>
                  <span className="text-[#00FF66]">ACTIVE</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {visibleGroups.length === 0 && (
          <p className="py-8 text-center font-mono text-sm text-[#A7B0B0]">NO SKILLS IN THIS CATEGORY</p>
        )}
      </div>
    </section>
  );
}
