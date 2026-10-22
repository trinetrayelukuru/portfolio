"use client";
import { useEffect, useState } from "react";
import { PROFILE, SOCIAL_LINKS } from "../lib/constants";

function useClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const time = useClock();

  return (
    <footer className="relative py-10 border-t border-white/10 bg-black/20" role="contentinfo">
      {/* animated top accent */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px border-flow" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-sm text-dim text-center sm:text-left">
          <span className="font-medium text-white/70">{PROFILE.displayName}</span>
          {" — "}
          <span>AI Engineer • Full-Stack Developer • IoT</span>
        </div>

        {/* socials */}
        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#A7B0B0] hover:text-[#00FF66] hover:border-[#00FF66]/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#A7B0B0] hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.email.url}
            aria-label="Email"
            className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-[#A7B0B0] hover:text-[#00FF66] hover:border-[#00FF66]/50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
              />
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-5 text-xs text-dim">
          {/* Live IST clock (renders after mount to avoid hydration mismatch) */}
          <span className="font-mono text-[11px] text-dim tracking-wider" suppressHydrationWarning>
            VELLORE {time ?? "--:--:--"} IST
          </span>
          <span>© 2026 {PROFILE.fullName}</span>
          <a
            href="#home"
            className="px-2.5 py-1 rounded border border-white/15 text-[#A7B0B0] hover:text-[#00FF66] hover:border-[#00FF66]/50 transition-colors font-mono"
          >
            ↑ TOP
          </a>
        </div>
      </div>
    </footer>
  );
}
