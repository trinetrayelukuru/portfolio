"use client";

import { PROFILE } from "../lib/constants";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import GitHubStats from "./GitHubStats";
import LanguageBars from "./LanguageBars";
import GitHubActivity from "./GitHubActivity";
import GitHubJourney from "./GitHubJourney";
import ContributionGraph from "./ContributionGraph";
import GitHubRepositories from "./GitHubRepositories";

const TERMINAL_LINES = [
  { prompt: "~/portfolio", cmd: "gh repo list --limit 6", out: "fetched live from api.github.com" },
  { prompt: "~/portfolio", cmd: "gh api users/trinetrayelukuru", out: "profile + stats auto-synced" },
];

/**
 * Live GitHub dashboard — stats, language distribution, activity feed,
 * journey panel, contribution calendar (when server token available),
 * inside the existing terminal-style frame.
 */
export default function GitHub() {
  return (
    <section id="github" className="py-24 lg:py-32">
      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10">
        <SectionHeader
          label="Live data"
          title="GITHUB ACTIVITY"
          align="center"
          sub="Everything in this section is fetched from GitHub's API and refreshes automatically."
        />

        <Reveal className="mb-8">
          <GitHubStats />
        </Reveal>

        <Reveal>
          <div className="relative rounded-2xl overflow-hidden border border-[#00FF66]/25 bg-[#030507]/80 shadow-[0_0_60px_-20px_rgba(0,255,102,0.35)]">
            {/* terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 font-mono text-[10px] text-[#A7B0B0] tracking-widest uppercase">
                github — bash — live
              </span>
            </div>

            <div className="p-6 sm:p-8 font-mono text-sm space-y-3">
              {TERMINAL_LINES.map((line) => (
                <div key={line.cmd}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#00FF66]">{line.prompt}</span>
                    <span className="text-[#A7B0B0]">$</span>
                    <span className="text-[#F5F7F7]">{line.cmd}</span>
                    <span className="inline-block w-2 h-4 bg-[#00FF66]/70 fx-anim animate-pulse" aria-hidden="true" />
                  </div>
                  <div className="text-[#00E5FF]/80 pl-1">{line.out}</div>
                </div>
              ))}

              <div className="pt-4">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-mono text-sm bg-[#00FF66]/10 border border-[#00FF66]/60 text-[#00FF66] hover:bg-[#00FF66]/20 hover:shadow-[0_0_24px_rgba(0,255,102,0.35)] transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  VISIT GITHUB PROFILE →
                </a>
              </div>
            </div>

            <div aria-hidden="true" className="h-px w-full border-flow" />
          </div>
        </Reveal>

        {/* Activity dashboard: the calendar spans the section width */}
        <div className="mt-8">
          <Reveal>
            <div className="w-full"><ContributionGraph /></div>
          </Reveal>
          <div className="w-full"><GitHubRepositories /></div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-white/10 bg-[#0B1713]/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] fx-anim animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">
                  Language Distribution
                </span>
              </div>
              <LanguageBars />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-xl border border-white/10 bg-[#0B1713]/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">
                  Recent Activity
                </span>
              </div>
              <GitHubActivity />
            </div>
          </Reveal>
        </div>

        <div className="mt-6">
          <GitHubJourney />
        </div>
      </div>
    </section>
  );
}
