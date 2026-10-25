"use client";

import { EDUCATION, PROFILE } from "../lib/constants";
import HUDPanel from "./HUDPanel";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import HalftoneReveal from "./HalftoneReveal";
import LogoLoop from "./LogoLoop";
import {
  SiArduino,
  SiCplusplus,
  SiDocker,
  SiFigma,
  SiGithub,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSolidity,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const CONTACT_LINKS = [
  { label: "GITHUB", href: PROFILE.github, accent: "#00FF66", external: true },
  { label: "LINKEDIN", href: PROFILE.linkedin, accent: "#00E5FF", external: true },
  { label: "EMAIL", href: `mailto:${PROFILE.email}`, accent: "#7C3AED", external: false },
];

export default function AboutNew() {
  const education = EDUCATION[0];

  return (
    <section id="about" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          label="Profile"
          title="ABOUT ME"
          sub="Computer Science (IoT) graduate from VIT Vellore building AI applications, web products and interfaces."
        />

        <Reveal className="mb-10" y={14}>
          <div className="flex h-[250px] items-center justify-center overflow-hidden px-2 sm:h-[300px] sm:px-5">
            <LogoLoop
              logos={[
                { node: <SiPython />, title: "Python", hoverColor: "#FFD43B" },
                { node: <SiReact />, title: "React", hoverColor: "#61DAFB" },
                { node: <SiNextdotjs />, title: "Next.js", hoverColor: "#F5F7F7" },
                { node: <SiTypescript />, title: "TypeScript", hoverColor: "#3178C6" },
                { node: <SiTailwindcss />, title: "Tailwind", hoverColor: "#38BDF8" },
                { node: <SiNodedotjs />, title: "Node.js", hoverColor: "#68A063" },
                { node: <SiFigma />, title: "Figma", hoverColor: "#F24E1E" },
                { node: <SiArduino />, title: "Arduino", hoverColor: "#00979D" },
                { node: <SiJavascript />, title: "JavaScript", hoverColor: "#F7DF1E" },
                { node: <SiGithub />, title: "GitHub", hoverColor: "#F5F7F7" },
                { node: <SiDocker />, title: "Docker", hoverColor: "#2496ED" },
                { node: <SiSolidity />, title: "Solidity", hoverColor: "#A6A6A6" },
                { node: <SiCplusplus />, title: "C++", hoverColor: "#659AD2" },
              ]}
              speed={80}
              direction="left"
              logoHeight={44}
              gap={56}
              hoverSpeed={0}
              scaleOnHover
              layout="orbit"
              bend={0.6}
              focus={0.45}
              tiltX={-4}
              tiltY={-48}
              labels="hover"
              fadeOut
              intro
              ariaLabel="Technology toolkit orbit"
            />
          </div>
        </Reveal>

        {/* Identity banner */}
        <Reveal className="mb-10" y={16}>
          <div className="relative overflow-hidden rounded-2xl border border-[#00FF66]/20 bg-[#05070A]">
            <div
              className="relative aspect-[16/7] w-full sm:aspect-[16/6]"
              role="img"
              aria-label={`${PROFILE.fullName} — profile photo revealed through a halftone print effect`}
            >
              <HalftoneReveal
                src="/profile-current.jpeg"
                fit="cover"
                mode="duotone"
                shape="dot"
                cellSize={5}
                angle={45}
                inkColor="#00FF66"
                accentColor="#39FF88"
                paperColor="#030507"
                contrast={1.15}
                revealRadius={150}
                softness={0.7}
                linger={1}
                className="absolute inset-0"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030507] via-[#030507]/55 to-transparent"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 fx-bg-scanlines opacity-20" />
              <div className="pointer-events-none absolute right-4 top-4 rounded border border-[#00E5FF]/35 bg-[#030507]/70 px-2 py-1 font-mono text-[9px] tracking-[0.18em] text-[#00E5FF]">
                MOVE TO REVEAL
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="font-mono text-[11px] tracking-[0.3em] text-[#00E5FF] uppercase">
                  {PROFILE.title}
                </div>
                <div className="mt-1 text-2xl font-light text-[#F5F7F7] sm:text-3xl">
                  {PROFILE.fullName}
                </div>
                <div className="mt-1 font-mono text-[11px] tracking-widest text-[#A7B0B0] uppercase">
                  {PROFILE.location} · Early-career developer
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
          {/* Narrative */}
          <div className="space-y-5">
            {PROFILE.aboutParagraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.06} y={14}>
                <p className="text-base leading-relaxed text-[#C3CBCB] sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.18} y={14}>
              <div className="rounded-xl border border-[#00FF66]/15 bg-[#0B1713]/60 p-5">
                <div className="mb-3 font-mono text-[10px] tracking-[0.2em] text-[#00E5FF] uppercase">
                  Focus areas
                </div>
                <ul className="flex flex-wrap gap-2">
                  {PROFILE.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-md border border-[#00FF66]/25 bg-[#00FF66]/[0.07] px-2.5 py-1 text-xs text-[#00FF66] sm:text-sm"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.24} y={14}>
              <div className="flex flex-wrap gap-3">
                {CONTACT_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs transition-colors hover:bg-white/[0.06]"
                    style={{ borderColor: `${link.accent}55`, color: link.accent }}
                  >
                    {link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Education + quick facts */}
          <div className="space-y-6">
            {education && (
              <Reveal delay={0.1} y={14}>
                <HUDPanel label="EDUCATION">
                  <h3 className="text-lg font-mono font-bold text-[#F5F7F7]">
                    {education.institution}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#C3CBCB]">
                    {education.degree}
                  </p>
                  <dl className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                        Specialisation
                      </dt>
                      <dd className="text-right text-sm text-[#00E5FF]">
                        {education.specialisation}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                        Duration
                      </dt>
                      <dd className="text-right text-sm text-[#F5F7F7]">
                        {education.duration}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                        CGPA
                      </dt>
                      <dd className="text-right font-mono text-lg font-bold text-[#00FF66]">
                        {education.cgpa}
                      </dd>
                    </div>
                  </dl>
                </HUDPanel>
              </Reveal>
            )}

            <Reveal delay={0.16} y={14}>
              <HUDPanel label="AT A GLANCE">
                <dl className="space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                      Based in
                    </dt>
                    <dd className="text-right text-sm text-[#F5F7F7]">{PROFILE.location}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                      Stage
                    </dt>
                    <dd className="text-right text-sm text-[#F5F7F7]">
                      Early career · open to opportunities
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[#A7B0B0]">
                      Building
                    </dt>
                    <dd className="text-right text-sm text-[#F5F7F7]">
                      AI apps · full-stack web · IoT
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-[#A7B0B0]">
                  Hackathons and designathons: participated, including a 12th-place finish in a
                  UI/UX-focused designathon. Recognised as “Best Fresher” for an AI summariser
                  project during academic evaluation.
                </p>
              </HUDPanel>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
