"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { CATEGORY_COLORS } from "../lib/constants";
import {
  useGitHub,
  toProjectViews,
  getStaticProjectViews,
  refresh,
  relativeTime,
  type ProjectView,
  type GhRepo,
} from "../lib/github";

const MAX_NODES = 24;

interface NetNode {
  x: number;
  y: number;
  idx: number;
}

/** Ring layout: one ring up to 8 nodes, two rings beyond that. */
function layoutNodes(count: number): NetNode[] {
  const nodes: NetNode[] = [];
  if (count <= 8) {
    const r = 150;
    for (let i = 0; i < count; i++) {
      const a = ((-90 + (360 / Math.max(count, 1)) * i) * Math.PI) / 180;
      nodes.push({ x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r, idx: i });
    }
    return nodes;
  }
  const outerCount = Math.ceil(count / 2);
  const innerCount = count - outerCount;
  let outer = 0;
  let inner = 0;
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      const a = ((-90 + (360 / outerCount) * outer) * Math.PI) / 180;
      outer += 1;
      nodes.push({ x: 200 + Math.cos(a) * 168, y: 200 + Math.sin(a) * 168, idx: i });
    } else {
      const a = ((-60 + (360 / Math.max(innerCount, 1)) * inner) * Math.PI) / 180;
      inner += 1;
      nodes.push({ x: 200 + Math.cos(a) * 100, y: 200 + Math.sin(a) * 100, idx: i });
    }
  }
  return nodes;
}

/**
 * Living project map — one node per public GitHub repository.
 * Nodes appear/disagree with GitHub data, react to the cursor, and
 * open a HUD detail card (with README summary) on click.
 */
export default function ProjectNetwork() {
  const repos = useGitHub<GhRepo[]>("repos");
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const views = useMemo(() => {
    if (repos.data) return toProjectViews(repos.data).slice(0, MAX_NODES);
    if (repos.status === "error") return getStaticProjectViews().slice(0, MAX_NODES);
    return null; // loading
  }, [repos.data, repos.status]);

  const usingStatic = repos.status === "error" && !repos.data;
  const loading = !views;

  const nodes = useMemo(() => layoutNodes(views?.length ?? 0), [views?.length]);

  // If a repository disappears, derive a safe selection for this render rather
  // than mutating state during render or in a synchronous effect.
  const selectedIndex =
    selected !== null && (!views || selected < views.length) ? selected : null;

  // Scroll parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -70]);
  const rotate = useTransform(scrollY, [0, 800], [0, 7]);
  const scale = useTransform(scrollY, [0, 800], [1, 0.94]);

  // Cursor reaction (subtle depth shift of the whole map)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
      my.set(((e.clientY - rect.top) / rect.height - 0.5) * 16);
    },
    [mx, my, reduce]
  );

  const resetCursor = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const toggle = useCallback((i: number) => {
    setSelected((s) => (s === i ? null : i));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const project: ProjectView | null =
    selectedIndex !== null && views ? views[selectedIndex] : null;
  const accent = project ? CATEGORY_COLORS[project.category] : "#00FF66";

  const spokes = useMemo(
    () =>
      nodes.map(
        (n) => `M200 200 L${n.x.toFixed(1)} ${n.y.toFixed(1)}`
      ),
    [nodes]
  );
  const chain = useMemo(
    () =>
      nodes.length > 1
        ? nodes
            .map((n, i) => {
              const next = nodes[(i + 1) % nodes.length];
              return `M${n.x.toFixed(1)} ${n.y.toFixed(1)} L${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
            })
        : [],
    [nodes]
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetCursor}
      className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]"
    >
      {/* HUD corner brackets */}
      <span aria-hidden="true" className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#00FF66]/60" />
      <span aria-hidden="true" className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#00E5FF]/60" />
      <span aria-hidden="true" className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#00E5FF]/60" />
      <span aria-hidden="true" className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#00FF66]/60" />

      {/* Scroll parallax wrapper */}
      <motion.div style={{ y, rotate, scale }} className="w-full h-full will-change-transform">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible"
          role="group"
          aria-label="Interactive project map — one node per public GitHub repository"
        >
          <defs>
            <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00FF66" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>

          {/* cursor-reactive layer */}
          <motion.g style={{ x: springX, y: springY }}>
            <circle cx="200" cy="200" r="64" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 12" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="40s" repeatCount="indefinite" />
            </circle>

            {/* connection chain between nodes */}
            {chain.map((d) => (
              <path key={`ch-${d}`} d={d} stroke="#00E5FF" strokeWidth="0.75" fill="none" opacity="0.15" strokeDasharray="3 6" />
            ))}

            {/* spokes */}
            {spokes.map((d, i) => {
              const active = selectedIndex === i || hovered === i;
              const color = views ? CATEGORY_COLORS[views[i].category] : "#00FF66";
              return (
                <path
                  key={`sp-${d}`}
                  d={d}
                  stroke={active ? color : "#00FF66"}
                  strokeWidth={active ? 2 : 1}
                  fill="none"
                   opacity={active ? 0.9 : selectedIndex === null ? 0.35 : 0.15}
                  style={{ transition: "opacity .3s, stroke-width .3s" }}
                />
              );
            })}

            {/* data packets */}
            {spokes.slice(0, 4).map((d, i) => (
              <circle key={`pkt-${i}`} r="2.5" fill="#F5F7F7" opacity="0.8">
                <animateMotion dur={`${2.6 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} path={d} />
              </circle>
            ))}

            {/* hub */}
            <g>
              <circle cx="200" cy="200" r="40" fill="rgba(3,5,7,0.85)" stroke="url(#hubGrad)" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="40" fill="none" stroke="#00FF66" strokeWidth="6" opacity="0.12" filter="url(#nodeGlow)" />
              <text x="200" y="198" textAnchor="middle" className="font-mono" fontSize="13" fill="#F5F7F7" letterSpacing="2">
                GITHUB
              </text>
              <text x="200" y="216" textAnchor="middle" className="font-mono" fontSize="11" fill="#00FF66" letterSpacing="2">
                {loading ? "SYNC…" : `${String(views?.length ?? 0).padStart(2, "0")} REPOS`}
              </text>
            </g>

            {/* loading placeholder nodes */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => {
                const a = ((-90 + 60 * i) * Math.PI) / 180;
                return (
                  <circle
                    key={`sk-${i}`}
                    cx={200 + Math.cos(a) * 150}
                    cy={200 + Math.sin(a) * 150}
                    r="12"
                    fill="none"
                    stroke="#A7B0B0"
                    strokeWidth="1"
                    opacity="0.3"
                    className="fx-anim animate-pulse"
                  />
                );
              })}

            {/* project nodes — appear/disappear with GitHub data */}
            <AnimatePresence initial={false}>
              {nodes.map((n) => {
                const v = views?.[n.idx];
                if (!v) return null;
                const color = CATEGORY_COLORS[v.category];
                 const isSel = selectedIndex === n.idx;
                const isHov = hovered === n.idx;
                 const dim = selectedIndex !== null && !isSel;
                return (
                  <motion.g
                    key={v.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open project: ${v.name}`}
                    aria-pressed={isSel}
                    className="cursor-pointer outline-none"
                    initial={{ scale: 0.7 }}
                    animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(n.idx * 0.05, 0.5),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    onClick={() => toggle(n.idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(n.idx);
                      }
                    }}
                    onMouseEnter={() => setHovered(n.idx)}
                    onMouseLeave={() => setHovered((h) => (h === n.idx ? null : h))}
                    onFocus={() => setHovered(n.idx)}
                    onBlur={() => setHovered((h) => (h === n.idx ? null : h))}
                  >
                    <g
                      className="animate-node-drift fx-anim"
                      style={{ animationDuration: `${4.5 + (n.idx % 8) * 0.8}s`, animationDelay: `${(n.idx % 8) * 0.5}s` }}
                    >
                      {isSel && (
                        <circle cx={n.x} cy={n.y} r="14" fill="none" stroke={color} strokeWidth="1.5">
                          <animate attributeName="r" values="14;30;14" dur="1.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle cx={n.x} cy={n.y} r={isHov || isSel ? 19 : 15} fill="none" stroke={color} strokeWidth={isHov || isSel ? 2 : 1} opacity={isHov || isSel ? 0.9 : 0.4} style={{ transition: "all .25s" }} />
                      <circle cx={n.x} cy={n.y} r="12" fill={color} filter="url(#nodeGlow)" opacity="0.95">
                        <animate attributeName="r" values="12;13.5;12" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={n.x} cy={n.y} r="6" fill="#030507" />
                      <text x={n.x} y={n.y + 3.5} textAnchor="middle" className="font-mono" fontSize="9" fill={color} fontWeight="700">
                        {String(n.idx + 1).padStart(2, "0")}
                      </text>
                      <circle cx={n.x} cy={n.y} r="26" fill="transparent" />
                    </g>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </motion.g>
        </svg>
      </motion.div>

      {/* hover label */}
      <AnimatePresence>
        {hovered !== null && selectedIndex !== hovered && views && nodes[hovered] && (
          <motion.div
            key={`label-${hovered}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[150%] px-2.5 py-1 rounded bg-[#030507]/95 border border-[#00FF66]/40 whitespace-nowrap max-w-[260px]"
            style={{
              left: `${(nodes[hovered].x / 400) * 100}%`,
              top: `${(nodes[hovered].y / 400) * 100}%`,
            }}
          >
            <span className="font-mono text-[10px] text-[#F5F7F7] truncate block">
              {views[hovered].name}
              <span className="text-[#00FF66] ml-2">CLICK TO OPEN</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* detail card */}
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: "-50%", y: "-44%", scale: 0.95 }}
            animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: "-46%", scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 w-[88%] max-w-[360px] max-h-[88%] overflow-y-auto z-30 rounded-xl bg-[#0B1110]/96 backdrop-blur-md border shadow-[0_0_50px_-12px_rgba(0,255,102,0.35)]"
            style={{ borderColor: `${accent}66` }}
            role="dialog"
            aria-label={`Project details: ${project.name}`}
          >
            <div className="h-px w-full" style={{ backgroundColor: accent }} />
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-[#A7B0B0]">
                  REPO{project.source === "github" ? " // " : " // OFFLINE "}
                  <span style={{ color: accent }}>{project.category.toUpperCase()}</span>
                </span>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close project details"
                  className="w-6 h-6 rounded border border-white/15 text-[#A7B0B0] hover:text-[#F5F7F7] hover:border-white/40 transition-colors text-xs leading-none"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-mono text-lg font-bold text-[#F5F7F7] mb-1.5 break-words">{project.name}</h3>

              {project.description ? (
                <p className="text-[13px] text-[#A7B0B0] leading-relaxed mb-3">{project.description}</p>
              ) : (
                <p className="text-[13px] text-dim italic leading-relaxed mb-3">
                  No description provided by the repository.
                </p>
              )}

              {/* live stats row */}
              {project.source === "github" && (
                <div className="flex items-center gap-4 mb-3 font-mono text-[11px] text-[#A7B0B0] flex-wrap">
                  <span>★ {project.stars}</span>
                  <span>⑂ {project.forks}</span>
                  <span>
                    <span className="text-dim">UPD </span>
                    {relativeTime(project.updatedAt)}
                  </span>
                  {project.createdAt && (
                    <span>
                      <span className="text-dim">CRT </span>
                      {new Date(project.createdAt).toISOString().slice(0, 10)}
                    </span>
                  )}
                  {project.archived && (
                    <span className="text-[#F59E0B]">ARCHIVED</span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.slice(0, 8).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-[#A7B0B0]"
                  >
                    {t.replace(/-/g, " ")}
                  </span>
                ))}
              </div>

              {/* lazy README summary */}
              {project.source === "github" && project.fullName && (
                <ReadmeSummary fullName={project.fullName} />
              )}

              <div className="flex gap-2 mt-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-md font-mono text-xs border transition-all"
                  style={{ color: accent, borderColor: `${accent}66`, backgroundColor: `${accent}14` }}
                >
                  GITHUB ↗
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-md font-mono text-xs bg-white/5 border border-white/15 text-[#F5F7F7] hover:bg-white/10 transition-all"
                  >
                    LIVE DEMO ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* map labels */}
      <div className="absolute -top-2.5 left-8 px-1.5 bg-[#030507] text-[10px] font-mono text-[#00FF66]">
        PROJECT_MAP
      </div>
      <div className="absolute -bottom-2.5 right-8 px-1.5 bg-[#030507] text-[10px] font-mono text-[#00E5FF] flex items-center gap-2">
        {usingStatic && (
          <button
            onClick={() => refresh("repos")}
            className="text-[#F59E0B] hover:underline"
            title="Retry live data"
          >
            OFFLINE · RETRY ↻
          </button>
        )}
        {!usingStatic && "CLICK A NODE"}
      </div>
    </div>
  );
}

/** README summary, fetched only when a card is opened. */
function ReadmeSummary({ fullName }: { fullName: string }) {
  const readme = useGitHub<string | null>(`readme:${fullName}`);

  return (
    <div className="rounded-lg border border-white/10 bg-[#030507]/60 p-3">
      <div className="font-mono text-[9px] tracking-widest text-[#00E5FF]/80 mb-1.5">
        README
      </div>
      {readme.status === "loading" && (
        <div className="space-y-1.5">
          <div className="h-2 rounded bg-white/10 fx-anim animate-pulse w-11/12" />
          <div className="h-2 rounded bg-white/10 fx-anim animate-pulse w-8/12" />
        </div>
      )}
      {readme.status === "success" &&
        (readme.data ? (
          <p className="text-[12px] text-[#A7B0B0] leading-relaxed">{readme.data}</p>
        ) : (
          <p className="text-[12px] text-dim italic">No README found for this repository.</p>
        ))}
      {readme.status === "error" && (
        <p className="text-[12px] text-dim italic">README unavailable.</p>
      )}
    </div>
  );
}
