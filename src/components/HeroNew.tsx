"use client";
import { useMemo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  useGitHub,
  activeMonths,
  totalStars,
  type GhProfile,
  type GhRepo,
} from "../lib/github";
import { PROFILE } from "../lib/constants";
import CyberGrid from "./CyberGrid";
import SystemStatus from "./SystemStatus";
import DecodedText from "./DecodedText";
import CountUp from "./CountUp";
import ProjectNetwork from "./ProjectNetwork";
import MagneticButton from "./MagneticButton";
import KineticText from "./KineticText";

export default function HeroNew() {
  const { scrollY } = useScroll();
  // Scroll parallax is transform motion MotionConfig can't see (it's driven by
  // a MotionValue, not an animation) — honour prefers-reduced-motion by
  // pinning the grid to 0 while keeping the rest of the hero intact.
  const reduce = useReducedMotion();
  const gridY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 220]);

  const profile = useGitHub<GhProfile>("profile");
  const repos = useGitHub<GhRepo[]>("repos");

  const loading = profile.status === "loading" && !profile.data && !repos.data;
  const offline =
    profile.status === "error" && repos.status === "error" && !profile.data && !repos.data;

  const stats = useMemo(() => {
    const p = profile.data;
    const r = repos.data;
    const months = p ? activeMonths(p.createdAt) : null;
    const since = p?.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })
      : null;
    return [
      {
        label: "PUBLIC REPOS",
        value: p?.publicRepos ?? r?.length ?? null,
        sub: "live from GitHub",
      },
      {
        label: "FOLLOWERS",
        value: p?.followers ?? null,
        sub: "on GitHub",
      },
      {
        label: "STARS EARNED",
        value: r ? totalStars(r) : null,
        sub: r ? `across ${r.length} repos` : "",
      },
      {
        label: "ACTIVE ON GITHUB",
        value: months,
        sub: months !== null && since ? `months · since ${since}` : "",
      },
    ];
  }, [profile.data, repos.data]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y: gridY }} className="absolute inset-0 will-change-transform">
        <CyberGrid />
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF66]/30 to-transparent" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[#00E5FF]/[0.06] to-transparent fx-anim animate-scan-sweep"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-20 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Identity + live stats */}
          <div>
            <div className="hero-in flex flex-wrap items-center gap-4" style={{ animationDelay: "0.05s" }}>
              <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#00FF66]/40 bg-[#0B1713]">
                <Image
                   src="/profile-current.jpeg"
                  alt={`${PROFILE.fullName} — profile photo`}
                  fill
                  sizes="48px"
                  priority
                  className="object-cover object-center"
                />
              </span>
              <SystemStatus />
            </div>

            <div
              className="hero-in mt-5 mb-2 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.14s" }}
            >
              <span className="text-[#00E5FF] font-mono text-sm tracking-[0.3em] uppercase">
                AI / SOFTWARE DEVELOPER
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#00FF66]/30 bg-[#00FF66]/[0.07] font-mono text-[10px] text-[#00FF66] tracking-wider">
                <span
                  className={`w-1.5 h-1.5 rounded-full fx-anim animate-pulse ${
                    offline ? "bg-[#F59E0B]" : "bg-[#00FF66]"
                  }`}
                />
                {offline ? "GITHUB OFFLINE" : loading ? "SYNCING…" : "LIVE GITHUB DATA"}
              </span>
            </div>

            <h1
              className="hero-in font-mono text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.85] tracking-tighter text-[#F5F7F7] mb-2"
              style={{ animationDelay: "0.22s" }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F7] via-[#00FF66] to-[#00E5FF]">
                <DecodedText text="YELUKURU" delay={400} />
              </span>
              <span className="block text-[#F5F7F7]">
                <DecodedText text="TRINETRA" delay={900} />
              </span>
              <span className="block text-[#A7B0B0] text-3xl sm:text-5xl lg:text-6xl font-light tracking-normal mt-2">
                NAGA SAI
              </span>
            </h1>

            {/* Rotating role / interest line */}
            <div className="hero-in mt-6 mb-6" style={{ animationDelay: "0.3s" }}>
              <KineticText
                label="01 / FOCUS"
                words={PROFILE.roles}
                speed={3.2}
              />
            </div>

            <p
              className="hero-in text-base sm:text-lg text-[#A7B0B0] font-light leading-relaxed max-w-xl mb-8"
              style={{ animationDelay: "0.38s" }}
            >
              {PROFILE.heroSubtitle} I build with{" "}
              <span className="text-[#00FF66]">AI and LLMs</span>,{" "}
              <span className="text-[#00E5FF]">modern web stacks</span>, and{" "}
              <span className="text-[#7C3AED]">connected devices</span>.
            </p>

            <div
              className="hero-in flex flex-wrap gap-3"
              style={{ animationDelay: "0.46s" }}
            >
              <MagneticButton>
                <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono text-sm bg-[#00FF66]/10 border border-[#00FF66]/60 text-[#00FF66] hover:bg-[#00FF66]/20 hover:shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all">PROJECTS</a>
              </MagneticButton>
              <MagneticButton>
                <a href="https://github.com/trinetrayelukuru" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono text-sm bg-[#00E5FF]/10 border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GITHUB
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono text-sm border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all">CONTACT</a>
              </MagneticButton>
            </div>

            {/* Live GitHub stat counters */}
            <div
              className="hero-in mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl"
              style={{ animationDelay: "0.56s" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="group">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-[#F5F7F7] group-hover:text-[#00FF66] transition-colors">
                    {s.value !== null ? (
                      <CountUp to={s.value} />
                    ) : loading ? (
                      <span className="text-dim">··</span>
                    ) : (
                      <span className="text-dim">—</span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] mt-1">
                    {s.label}
                  </div>
                  {s.sub && <div className="text-[10px] text-[#A7B0B0] truncate">{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live GitHub project map */}
          <div
            className="hero-in relative flex justify-center"
            style={{ animationDelay: "0.3s" }}
          >
            <ProjectNetwork />
          </div>
        </div>

        <div
          className="hero-in hidden lg:flex items-center gap-3 mt-14 font-mono text-[10px] tracking-[0.3em] text-[#A7B0B0]"
          style={{ animationDelay: "0.9s" }}
        >
          <span className="w-px h-8 bg-gradient-to-b from-[#00FF66]/60 to-transparent fx-anim animate-pulse" />
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
