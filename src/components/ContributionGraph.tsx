"use client";

import { useMemo } from "react";
import { PROFILE } from "../lib/constants";
import {
  refresh,
  useGitHub,
  type GhContributionDay,
  type GhContributionLevel,
  type GhContributionWeek,
  type GhContributions,
} from "../lib/github";

const LEVEL_COLORS: Record<GhContributionLevel, string> = {
  NONE: "rgba(255,255,255,0.05)",
  FIRST_QUARTILE: "#0E3B22",
  SECOND_QUARTILE: "#116B38",
  THIRD_QUARTILE: "#00A34A",
  FOURTH_QUARTILE: "#00FF66",
};

const DAY_LABELS = ["", "MON", "", "WED", "", "FRI", ""];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function monthLabel(week: GhContributionWeek, index: number, weeks: GhContributionWeek[]) {
  const firstDay = week.contributionDays[0];
  if (!firstDay) return "";
  if (index === 0) {
    return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
      new Date(`${firstDay.date}T00:00:00Z`)
    );
  }

  const candidate = week.contributionDays.find(
    (day) => new Date(`${day.date}T00:00:00Z`).getUTCDate() <= 7
  );
  const previous = weeks[index - 1]?.contributionDays[0];
  if (!candidate || !previous) return "";

  const candidateMonth = candidate.date.slice(0, 7);
  const previousMonth = previous.date.slice(0, 7);
  return candidateMonth !== previousMonth
    ? new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
        new Date(`${candidate.date}T00:00:00Z`)
      )
    : "";
}

function daysFromWeeks(weeks: GhContributionWeek[]) {
  return weeks.flatMap((week) => week.contributionDays);
}

function currentStreak(days: GhContributionDay[]) {
  const byDate = new Map(days.map((day) => [day.date, day.contributionCount]));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const key = (date: Date) => date.toISOString().slice(0, 10);

  if ((byDate.get(key(today)) ?? 0) === 0) today.setUTCDate(today.getUTCDate() - 1);

  let streak = 0;
  while ((byDate.get(key(today)) ?? 0) > 0) {
    streak += 1;
    today.setUTCDate(today.getUTCDate() - 1);
  }
  return streak;
}

function contributionColor(day: GhContributionDay) {
  // GitHub supplies the exact theme color. Keep the portfolio's dark empty
  // cell for zeroes so the heatmap remains readable on the cyberpunk surface.
  return day.contributionCount > 0 && /^#[0-9a-f]{6}$/i.test(day.color)
    ? day.color
    : LEVEL_COLORS[day.contributionLevel];
}

function EmptyState({
  title,
  message,
  retry,
}: {
  title: string;
  message: string;
  retry?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1713]/50 p-5" role="alert">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">
          Contribution Calendar
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div>
          <p className="font-mono text-sm text-[#F5F7F7]">{title}</p>
          <p className="text-xs text-dim mt-2 max-w-2xl leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {retry && (
            <button
              type="button"
              onClick={() => refresh("contributions")}
              className="rounded-md border border-[#00E5FF]/40 px-3 py-2 font-mono text-[10px] tracking-wider text-[#00E5FF] transition-colors hover:bg-[#00E5FF]/10"
            >
              RETRY
            </button>
          )}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-wider text-[#00FF66] hover:text-[#F5F7F7]"
          >
            VIEW PROFILE ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1713]/50 p-5" role="status" aria-live="polite">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">
          Contribution Calendar · Syncing
        </span>
      </div>
      <p className="font-mono text-xs text-dim">FETCHING CONTRIBUTION DAYS FROM GITHUB GRAPHQL…</p>
    </div>
  );
}

/** GitHub contribution calendar backed only by the server GraphQL response. */
export default function ContributionGraph() {
  const calendar = useGitHub<GhContributions>("contributions");
  const data = calendar.data;

  const days = useMemo(() => (data ? daysFromWeeks(data.weeks) : []), [data]);
  const streak = useMemo(() => (days.length ? currentStreak(days) : 0), [days]);
  const max = useMemo(
    () => (days.length ? Math.max(...days.map((day) => day.contributionCount), 1) : 1),
    [days]
  );

  if (calendar.status === "loading" && !data) return <LoadingState />;

  if (calendar.status === "error" && !data) {
    const configured = calendar.error?.toLowerCase().includes("not configured");
    return (
      <EmptyState
        title={configured ? "CONTRIBUTION DATA NOT CONFIGURED" : "CONTRIBUTION DATA UNAVAILABLE"}
        message={
          calendar.error ??
          "GitHub contribution data could not be loaded. Check the server configuration and try again."
        }
        retry={!configured}
      />
    );
  }

  if (!data || data.weeks.length === 0) {
    return (
      <EmptyState
        title="NO CONTRIBUTION DAYS RETURNED"
        message="GitHub returned an empty contribution calendar for this profile. The dashboard will keep the rest of the GitHub data visible."
        retry
      />
    );
  }

  return (
    <section
      className="rounded-xl border border-[#00FF66]/20 bg-[#0B1713]/60 p-5 sm:p-6"
      aria-labelledby="contribution-calendar-title"
    >
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" aria-hidden="true" />
          <h2
            id="contribution-calendar-title"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]"
          >
            Contributions · last 12 months
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px]">
          <span className="text-[#F5F7F7]">{data.total.toLocaleString("en-US")} total</span>
          {streak > 0 && <span className="text-[#00E5FF]">{streak} day streak</span>}
          {calendar.stale && <span className="text-[#F59E0B]">STALE CACHE</span>}
          {calendar.status === "loading" && <span className="text-[#00E5FF]">SYNCING…</span>}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00FF66] hover:text-[#F5F7F7]"
          >
            PROFILE ↗
          </a>
          {calendar.stale && (
            <button
              type="button"
              onClick={() => refresh("contributions")}
              className="text-[#00E5FF] hover:text-[#F5F7F7]"
            >
              RETRY
            </button>
          )}
        </div>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2 w-full"
        aria-label={`Contribution calendar with ${days.length} days and ${data.total.toLocaleString("en-US")} total contributions`}
      >
        <div className="w-9 shrink-0 pt-6 grid grid-rows-7 gap-1" aria-hidden="true">
          {DAY_LABELS.map((label, index) => (
            <span key={index} className="text-[9px] font-mono leading-none text-dim">
              {label}
            </span>
          ))}
        </div>

        <div className="min-w-[720px] flex-1">
          <div
            className="grid gap-x-1"
            style={{ gridTemplateColumns: `repeat(${data.weeks.length}, minmax(10px, 1fr))` }}
            aria-hidden="true"
          >
            {data.weeks.map((week, index) => (
              <span key={week.contributionDays[0]?.date ?? index} className="h-4 truncate text-[10px] font-mono text-dim">
                {monthLabel(week, index, data.weeks)}
              </span>
            ))}
          </div>

          <div
            className="grid gap-x-1 gap-y-1"
            style={{ gridTemplateColumns: `repeat(${data.weeks.length}, minmax(10px, 1fr))` }}
            role="group"
            aria-label="Daily contribution cells"
          >
            {data.weeks.map((week, index) => {
              const byDay = new Map(
                week.contributionDays.map((day) => [
                  new Date(`${day.date}T00:00:00Z`).getUTCDay(),
                  day,
                ])
              );

              return (
                <div
                  key={week.contributionDays[0]?.date ?? index}
                  className="grid grid-rows-7 gap-y-1 min-w-0"
                >
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = byDay.get(dayIndex);
                    if (!day) {
                      return <span key={`empty-${dayIndex}`} className="block w-full aspect-square" aria-hidden="true" />;
                    }

                    const label = `${day.contributionCount.toLocaleString("en-US")} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`;
                    return (
                      <span
                        key={day.date}
                        role="img"
                        aria-label={label}
                        title={label}
                        data-level={day.contributionLevel}
                        className="block w-full aspect-square rounded-[3px] cursor-help outline-offset-2 transition-[filter] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
                        style={{
                          backgroundColor: contributionColor(day),
                          boxShadow:
                            day.contributionCount > 0
                              ? "0 0 7px rgba(0,255,102,0.22)"
                              : "none",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-dim">
        <span>ACTUAL DATES · GITHUB GRAPHQL</span>
        <span className="inline-flex items-center gap-1.5" aria-label="Legend: fewer to more contributions">
          <span>LESS</span>
          {(Object.keys(LEVEL_COLORS) as GhContributionLevel[]).map((level) => (
            <span
              key={level}
              role="img"
              aria-label={level === "NONE" ? "No contributions" : level.replace("_", " ").toLowerCase()}
              className="w-3 h-3 rounded-[3px]"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
          ))}
          <span>MORE</span>
        </span>
        <span>PEAK {max.toLocaleString("en-US")}/DAY</span>
      </div>
    </section>
  );
}
