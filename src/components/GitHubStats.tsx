"use client";

import { useMemo } from "react";
import {
  useGitHub,
  refresh,
  totalStars,
  totalForks,
  activeMonths,
  type GhProfile,
  type GhRepo,
} from "../lib/github";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import { GhError, GhSkeleton } from "./DataStates";

/** Compact live statistics: repos, followers, following, stars, languages. */
export default function GitHubStats() {
  const profile = useGitHub<GhProfile>("profile");
  const repos = useGitHub<GhRepo[]>("repos");

  const stats = useMemo(() => {
    const p = profile.data;
    const r = repos.data;
    if (!p && !r) return null;
    const months = p ? activeMonths(p.createdAt) : null;
    return [
      {
        label: "PUBLIC REPOS",
        value: p?.publicRepos ?? r?.length ?? 0,
        sub: "auto-synced",
      },
      {
        label: "FOLLOWERS",
        value: p?.followers ?? 0,
        sub: "on GitHub",
      },
      {
        label: "FOLLOWING",
        value: p?.following ?? 0,
        sub: "on GitHub",
      },
      {
        label: "STARS EARNED",
        value: r ? totalStars(r) : 0,
        sub: r ? `across ${r.length} repos` : "",
      },
      {
        label: "FORKS",
        value: r ? totalForks(r) : 0,
        sub: "received",
      },
      {
        label: "ACTIVE ON GITHUB",
        value: months ?? 0,
        suffix: "",
        sub: months !== null && months < 12 ? "months" : months !== null ? "months · account age" : "",
      },
    ];
  }, [profile.data, repos.data]);

  const failed = profile.status === "error" && repos.status === "error";

  if (failed) {
    return (
      <GhError
        message="GitHub statistics are unavailable right now."
        onRetry={() => {
          refresh("profile");
          refresh("repos");
        }}
      />
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GhSkeleton key={i} rows={2} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.05} y={14}>
          <div className="rounded-xl border border-white/10 bg-[#0B1713]/60 p-4 hover:border-[#00FF66]/30 transition-colors group">
            <div className="font-mono text-2xl font-bold text-[#F5F7F7] group-hover:text-[#00FF66] transition-colors">
              <CountUp to={s.value} />
            </div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#00E5FF] mt-1">
              {s.label}
            </div>
            {s.sub && <div className="text-[10px] text-dim mt-0.5 truncate">{s.sub}</div>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
