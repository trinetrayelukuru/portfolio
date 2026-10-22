"use client";

import { useMemo } from "react";
import { useGitHub, activeMonths, type GhContributions, type GhProfile } from "../lib/github";
import Reveal from "./Reveal";
import { GhSkeleton } from "./DataStates";

/**
 * "GitHub Journey" — all values derived from the public profile:
 * • Started = account creation date (labelled as GitHub account age,
 *   NOT exact "Git usage", which public data cannot measure).
 * • Contributions shown only when the server has GITHUB_TOKEN and
 *   the GraphQL calendar is available — otherwise omitted entirely.
 */
export default function GitHubJourney() {
  const profile = useGitHub<GhProfile>("profile");
  const contributions = useGitHub<GhContributions>("contributions");

  const journey = useMemo(() => {
    const p = profile.data;
    if (!p) return null;
    const months = activeMonths(p.createdAt);
    const created = new Date(p.createdAt);
    if (Number.isNaN(created.getTime()) || months === null) return null;
    const yearLabel = created.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
    const activeLabel =
      months < 12
        ? `${months} month${months === 1 ? "" : "s"}`
        : `${Math.floor(months / 12)} yr${Math.floor(months / 12) === 1 ? "" : "s"} ${months % 12} mo`;
    return { since: yearLabel, activeLabel, months, repos: p.publicRepos };
  }, [profile.data]);

  if (profile.status === "loading" && !profile.data) {
    return <GhSkeleton rows={3} label="LOADING JOURNEY…" />;
  }
  if (!journey) {
    return (
      <p className="font-mono text-sm text-[#A7B0B0]">
        Journey data unavailable.
      </p>
    );
  }

  const contribAvailable = contributions.status === "success" && contributions.data !== null;
  const contribTotal = contribAvailable ? contributions.data?.total ?? 0 : null;

  const rows: { label: string; value: string; note?: string }[] = [
    { label: "STARTED", value: journey.since, note: "GitHub account created" },
    {
      label: "ACTIVE FOR",
      value: journey.activeLabel,
      note: "account age — public data cannot measure exact Git usage",
    },
    { label: "REPOSITORIES", value: String(journey.repos), note: "public repos" },
  ];

  if (contribTotal !== null) {
    rows.push({
      label: "CONTRIBUTIONS",
      value: contribTotal.toLocaleString("en-US"),
      note: "last 12 months, contribution calendar",
    });
  }

  return (
    <Reveal>
      <div className="rounded-xl border border-[#00FF66]/20 bg-[#0B1713]/60 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">
            GitHub Journey
          </span>
        </div>
        <dl className="divide-y divide-white/5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
                  {r.label}
                </dt>
                {r.note && (
                  <dd className="text-[10px] text-dim leading-tight mt-0.5 max-w-[220px]">
                    {r.note}
                  </dd>
                )}
              </div>
              <dd className="font-mono text-lg text-[#F5F7F7] shrink-0">{r.value}</dd>
            </div>
          ))}
        </dl>
        {!contribAvailable && (
          <div className="px-4 py-2.5 border-t border-white/10 text-[10px] font-mono text-dim">
            CONTRIBUTIONS/STREAK: NOT SHOWN — requires server GITHUB_TOKEN (GraphQL).
            {/* honest omission rather than a fabricated number */}
          </div>
        )}
      </div>
    </Reveal>
  );
}
