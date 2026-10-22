"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGitHub, ensure, refresh, type GhLanguageStat } from "../lib/github";
import Reveal from "./Reveal";
import { GhError, GhSkeleton } from "./DataStates";

const LANG_COLORS: Record<string, string> = {
  Python: "#00FF66",
  JavaScript: "#F59E0B",
  TypeScript: "#3B82F6",
  HTML: "#EC4899",
  CSS: "#00E5FF",
  Java: "#F97316",
  "C++": "#A78BFA",
  C: "#64748B",
  Rust: "#FB923C",
  Go: "#22D3EE",
  Shell: "#10B981",
  Other: "#A7B0B0",
};

function colorFor(name: string) {
  return LANG_COLORS[name] ?? "#7C3AED";
}

/**
 * Language distribution by code bytes across public repositories.
 * Fetch is gated on scroll-into-view to spare the GitHub rate limit.
 */
export default function LanguageBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [gate, setGate] = useState(false);

  // First visibility → allow the fetch (gates the GitHub rate limit)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGate(true);
          ensure("languages").catch(() => undefined);
          io.disconnect();
        }
      },
      { rootMargin: "500px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const snap = useGitHub<GhLanguageStat[]>("languages", gate);

  return (
    <div ref={ref}>
      {snap.status === "loading" && !snap.data && <GhSkeleton rows={4} label="MEASURING CODE…" />}

      {snap.status === "error" && !snap.data && (
        <GhError
          message="Language statistics are unavailable."
          hint="Computed from GitHub's /languages endpoint across public repositories."
          onRetry={() => refresh("languages")}
        />
      )}

      {snap.data && snap.data.length === 0 && (
        <p className="font-mono text-sm text-[#A7B0B0]">
          No detectable code language data in public repositories.
        </p>
      )}

      {snap.data && snap.data.length > 0 && (
        <Reveal>
          <div className="space-y-3" aria-label="Language distribution by code bytes">
            {snap.data.map((l, i) => (
              <div key={l.name}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-xs text-[#F5F7F7] flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: colorFor(l.name) }}
                    />
                    {l.name}
                  </span>
                  <span className="font-mono text-[11px] text-[#A7B0B0]">
                    {l.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.percent}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: colorFor(l.name),
                      boxShadow: `0 0 10px ${colorFor(l.name)}66`,
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="text-[10px] font-mono text-dim pt-1">
              BY CODE BYTES · SUMMED ACROSS PUBLIC REPOSITORIES
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
