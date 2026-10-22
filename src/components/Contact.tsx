"use client";

import { useState } from "react";
import { PROFILE } from "../lib/constants";
import HUDPanel from "./HUDPanel";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const GITHUB_PATH =
  "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const SOCIALS = [
  {
    name: "EMAIL",
    handle: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      </svg>
    ),
    accent: "#00FF66",
    external: false,
  },
  {
    name: "GITHUB",
    handle: "@trinetrayelukuru",
    href: PROFILE.github,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={GITHUB_PATH} />
      </svg>
    ),
    accent: "#00E5FF",
    external: true,
  },
  {
    name: "LINKEDIN",
    handle: "yelkuru-trinetra",
    href: PROFILE.linkedin,
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={LINKEDIN_PATH} />
      </svg>
    ),
    accent: "#7C3AED",
    external: true,
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard access is optional; the email link remains available. */
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <SectionHeader
          label="Connection"
          title="ESTABLISH CONNECTION"
          sub="Reach out directly through any open channel below."
        />

        <Reveal>
          <HUDPanel label="CHANNELS">
            <div className="grid gap-3 sm:grid-cols-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  {...(social.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-[#0B1713]/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
                  style={{ ["--accent" as string]: social.accent }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: `${social.accent}33`, color: social.accent }}
                    aria-hidden="true"
                  >
                    {social.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-[#A7B0B0]">{social.name}</span>
                    <span className="block truncate text-sm text-[#F5F7F7] group-hover:text-[color:var(--accent)]">
                      {social.handle}
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-xs text-[#A7B0B0]" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-widest text-[#A7B0B0]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" />
                CHANNEL OPEN
              </span>
              <div className="flex items-center gap-3">
                <span>{PROFILE.location}</span>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="rounded border border-[#00E5FF]/35 px-2.5 py-1 text-[#00E5FF] transition-colors hover:bg-[#00E5FF]/10"
                >
                  {copied ? "COPIED" : "COPY EMAIL"}
                </button>
              </div>
            </div>
          </HUDPanel>
        </Reveal>
      </div>
    </section>
  );
}
