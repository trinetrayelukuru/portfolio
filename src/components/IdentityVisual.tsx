"use client";

/**
 * Photo-free identity panel: rotating orbital rings, an orbiting satellite,
 * a flickering neon monogram, drifting tech chips and CRT scanlines.
 */
export default function IdentityVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 border-[#00FF66]/30 shadow-[0_0_60px_-15px_rgba(0,255,102,0.2)] aspect-[4/5] bg-gradient-to-b from-[#05070A] via-[#030507] to-[#07100D]"
      role="img"
      aria-label="Trinetra monogram — AI engineer identity panel"
    >
      {/* faint background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.35) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      {/* radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(0,255,102,0.14), transparent 62%)",
        }}
      />

      {/* orbit system */}
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="monoGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FF66" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        <g transform="translate(200 230)">
          {/* outer dashed ring */}
          <circle r="150" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="6 14" opacity="0.45">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          </circle>
          {/* mid ring, counter-rotating */}
          <circle r="112" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="40 260" opacity="0.8" />
          <circle r="112" fill="none" stroke="#00FF66" strokeWidth="0.75" strokeDasharray="2 10" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="35s" repeatCount="indefinite" />
          </circle>
          {/* inner ring */}
          <circle r="78" fill="rgba(3,5,7,0.6)" stroke="#00FF66" strokeWidth="1.5" opacity="0.7" />
          <circle r="70" fill="none" stroke="#7C3AED" strokeWidth="0.75" strokeDasharray="3 9" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
          </circle>

          {/* orbiting satellite */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite" />
            <circle cx="0" cy="-150" r="5" fill="#00E5FF" filter="url(#monoGlow)" />
            <circle cx="0" cy="-150" r="10" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
          </g>
          {/* second satellite, opposite + slower */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="180" to="540" dur="22s" repeatCount="indefinite" />
            <circle cx="0" cy="-112" r="3.5" fill="#7C3AED" filter="url(#monoGlow)" />
          </g>

          {/* monogram */}
          <g className="animate-flicker fx-anim" filter="url(#monoGlow)">
            <text
              textAnchor="middle"
              y="18"
              fontSize="96"
              fontWeight="700"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2"
              className="font-mono"
            >
              T
            </text>
          </g>
          <text textAnchor="middle" y="64" fontSize="13" letterSpacing="7" fill="#F5F7F7" className="font-mono">
            TRINETRA
          </text>
          <text textAnchor="middle" y="86" fontSize="9" letterSpacing="4" fill="#A7B0B0" className="font-mono">
            AI ENGINEER
          </text>
        </g>
      </svg>

      {/* drifting tech chips */}
      <span className="absolute top-[14%] left-[8%] px-2 py-1 rounded bg-[#030507]/80 border border-[#00FF66]/30 text-[10px] font-mono text-[#00FF66] fx-anim animate-letter-drift">
        LLMs
      </span>
      <span className="absolute top-[24%] right-[7%] px-2 py-1 rounded bg-[#030507]/80 border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] fx-anim animate-letter-drift" style={{ animationDelay: "1.8s" }}>
        IoT
      </span>
      <span className="absolute bottom-[16%] left-[10%] px-2 py-1 rounded bg-[#030507]/80 border border-[#7C3AED]/40 text-[10px] font-mono text-[#A78BFA] fx-anim animate-letter-drift" style={{ animationDelay: "3.4s" }}>
        AGENTS
      </span>
      <span className="absolute bottom-[26%] right-[9%] px-2 py-1 rounded bg-[#030507]/80 border border-[#3B82F6]/40 text-[10px] font-mono text-[#60A5FA] fx-anim animate-letter-drift" style={{ animationDelay: "2.6s" }}>
        NEXT.JS
      </span>

      {/* CRT scanlines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* corner accents */}
      <span aria-hidden="true" className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#00FF66]/70" />
      <span aria-hidden="true" className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#00E5FF]/70" />
      <span aria-hidden="true" className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#00E5FF]/70" />
      <span aria-hidden="true" className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#00FF66]/70" />

      {/* status strip */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 bg-[#030507]/85 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
        <span className="text-[#00FF66] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" />
          OPERATOR ONLINE
        </span>
        <span className="text-[#A7B0B0] tracking-widest">ID // TNS-01</span>
      </div>
    </div>
  );
}
