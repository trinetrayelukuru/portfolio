"use client";

import type { ReactNode } from "react";
import { useGitHub, refresh, relativeTime, type GhEvent } from "../lib/github";
import Reveal from "./Reveal";
import { GhError, GhSkeleton } from "./DataStates";

// Monospace typographic glyphs for most events; stroke-style inline SVGs for
// the two that previously used colour emoji (comment bubble, release tag).
// All markers are decorative — the repo + event label beside them carry the
// accessible name.
const TYPE_ICONS: Record<string, ReactNode> = {
  PushEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
  ),
  CreateEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
  ),
  DeleteEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 12h14" /></svg>
  ),
  PullRequestEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  IssuesEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
  ),
  IssueCommentEvent: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      />
    </svg>
  ),
  ReleaseEvent: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"
      />
    </svg>
  ),
  ForkEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  WatchEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
  ),
  PublicEvent: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
  ),
};

function iconFor(type: string) {
  return TYPE_ICONS[type] ?? (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
  );
}

/**
 * Recent public GitHub activity (events API — last 90 days only).
 * When GitHub returns an empty list we say so instead of inventing data.
 */
export default function GitHubActivity() {
  const activity = useGitHub<GhEvent[]>("activity");

  if (activity.status === "loading" && !activity.data) {
    return <GhSkeleton rows={5} label="LOADING ACTIVITY…" />;
  }

  if (activity.status === "error" && !activity.data) {
    return (
      <GhError
        message="Activity feed is unavailable."
        hint="GitHub only exposes the last 90 days of public events."
        onRetry={() => refresh("activity")}
      />
    );
  }

  const events = activity.data ?? [];

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#030507]/60 p-5 text-center">
        <p className="font-mono text-sm text-[#A7B0B0]">NO PUBLIC ACTIVITY IN THE LAST 90 DAYS</p>
        <p className="text-xs text-[#A7B0B0] mt-1.5">
          GitHub&apos;s public events API only returns recent events — older activity
          is not exposed without account access.
        </p>
      </div>
    );
  }

  return (
    <Reveal>
      <ol className="space-y-2.5" aria-label="Recent GitHub activity">
        {events.slice(0, 8).map((e) => (
          <li
            key={e.id}
            className="flex items-start gap-3 px-3.5 py-2.5 rounded-lg bg-[#0B1713]/60 border border-white/10 hover:border-[#00FF66]/30 transition-colors"
          >
            <span
              className="font-mono text-[#00FF66] text-xs mt-0.5 w-4 text-center shrink-0"
              aria-hidden="true"
            >
              {iconFor(e.type)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-[#F5F7F7] truncate">
                <span className="text-[#00E5FF] font-mono">{e.repo}</span>{" "}
                <span className="text-[#A7B0B0]">{e.label}</span>
              </p>
              <p className="text-[11px] font-mono text-[#A7B0B0]">
                {relativeTime(e.createdAt)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
