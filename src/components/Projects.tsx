"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_COLORS, type ProjectCategory } from "../lib/constants";
import {
  useGitHub,
  mergeProjectViews,
  getStaticProjectViews,
  refresh,
  relativeTime,
  type GhRepo,
} from "../lib/github";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import { GhSkeleton, GhError } from "./DataStates";

type Filter = "all" | ProjectCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "ai", label: "AI / ML" },
  { id: "web", label: "WEB" },
  { id: "cloud", label: "CLOUD" },
  { id: "iot", label: "IOT" },
  { id: "systems", label: "SYSTEMS" },
  { id: "other", label: "OTHER" },
];

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const repos = useGitHub<GhRepo[]>("repos");
  const views = useMemo(() => {
    if (repos.data) return mergeProjectViews(repos.data);
    if (repos.status === "error") return getStaticProjectViews(); // curated offline fallback
    return null; // loading
  }, [repos.data, repos.status]);

  const usingStatic = repos.status === "error" && !repos.data;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: views?.length ?? 0 };
    views?.forEach((v) => (c[v.category] = (c[v.category] ?? 0) + 1));
    return c;
  }, [views]);

  const visible = useMemo(() => {
    if (!views) return [];
    return views.filter((v) => filter === "all" || v.category === filter);
  }, [views, filter]);

  const totalStars = useMemo(
    () => views?.reduce((s, v) => s + (v.stars ?? 0), 0) ?? 0,
    [views]
  );

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeader
          label="Live from GitHub"
          title="PROJECTS"
          sub="Repository cards are rendered from the GitHub API — new public repositories appear here automatically."
        />

        {/* live counter strip */}
        <Reveal className="mb-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-[#A7B0B0]">
            <span className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full fx-anim animate-pulse ${
                  repos.status === "success"
                    ? repos.stale
                      ? "bg-[#F59E0B]"
                      : "bg-[#00FF66]"
                    : "bg-[#00E5FF]"
                }`}
              />
              {repos.status === "loading"
                ? "SYNCING…"
                : repos.stale
                  ? "CACHED DATA"
                  : usingStatic
                    ? "GITHUB OFFLINE — STATIC VIEW"
                    : "LIVE"}
            </span>
            <span>
              <span className="text-[#F5F7F7] text-sm">{counts.all}</span> repositories
            </span>
            <span>
              <span className="text-[#F5F7F7] text-sm">★ {totalStars}</span> total stars
            </span>
            {repos.status === "success" && !usingStatic && (
              <span className="text-dim">auto-synced · 5 min cache</span>
            )}
          </div>
        </Reveal>

        {repos.status === "error" && !repos.data && (
          <div className="mb-8">
            <GhError
              message="Live GitHub data is unavailable."
              hint="Showing curated offline project data — no numeric stats are displayed for it."
              onRetry={() => refresh("repos")}
            />
          </div>
        )}

        {/* Category filter */}
        {views && (
          <Reveal className="mb-10">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                const n = counts[f.id] ?? 0;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={active}
                    disabled={n === 0 && f.id !== "all"}
                    onClick={() => setFilter(f.id)}
                    className={`relative px-4 py-2 rounded-md font-mono text-xs tracking-wider border transition-all ${
                      active
                        ? "border-[#00FF66]/60 text-[#00FF66] bg-[#00FF66]/10 shadow-[0_0_16px_-4px_rgba(0,255,102,0.4)]"
                        : n === 0
                          ? "border-white/5 text-dim/70 cursor-not-allowed"
                          : "border-white/10 text-[#A7B0B0] hover:border-white/25 hover:text-[#F5F7F7]"
                    }`}
                  >
                    {f.label}
                    <span className="ml-2 opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {!views &&
            Array.from({ length: 3 }).map((_, i) => (
              <GhSkeleton key={i} rows={4} label="FETCHING REPOSITORIES…" />
            ))}
          {views && (
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {views && visible.length === 0 && (
          <div className="text-center py-10 font-mono text-sm text-[#A7B0B0]">
            {views.length === 0
              ? "NO PUBLIC REPOSITORIES FOUND"
              : "NO REPOSITORIES IN THIS CATEGORY"}
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="https://github.com/trinetrayelukuru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-all font-mono text-sm"
          >
            VIEW ALL ON GITHUB →
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#00FF66]/30 text-[#00FF66] hover:bg-[#00FF66]/10 hover:border-[#00FF66]/60 transition-all font-mono text-sm"
          >
            REPOSITORY INDEX →
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: ReturnType<typeof mergeProjectViews>[number];
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const accent = CATEGORY_COLORS[project.category];
  const isStatic = project.source === "static";

  return (
    <motion.div
      layout
      initial={{ y: 24, scale: 0.97 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="h-full bg-[#0B1713]/70 border border-white/10 hover:border-white/20 shadow-[0_0_30px_-15px_rgba(0,255,102,0.3)]">
        {/* accent top bar */}
        <div className="h-px w-full" style={{ backgroundColor: accent, opacity: 0.5 }} />

        <div className="relative p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <span className="font-mono text-[10px] tracking-widest text-[#A7B0B0]">
              REPO_{String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {project.featured && (
                <span
                  className="px-2 py-0.5 text-[10px] font-mono rounded border"
                  style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}14` }}
                >
                  ★ FEATURED
                </span>
              )}
              {project.archived && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/15 text-[#A7B0B0]">
                  ARCHIVED
                </span>
              )}
              {project.fork && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/15 text-[#A7B0B0]">
                  FORK
                </span>
              )}
              {!project.archived && !project.fork && project.recentlyPushed && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                  ● ACTIVE
                </span>
              )}
              {isStatic && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]">
                  STATIC
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00FF66] transition-colors break-words">
            {project.name}
          </h3>

          {project.description ? (
            <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-white/35 italic leading-relaxed mb-4">
              No description provided by the repository.
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.language && (
              <span
                className="px-2 py-0.5 text-xs rounded border"
                style={{
                  color: accent,
                  borderColor: `${accent}44`,
                  backgroundColor: `${accent}12`,
                }}
              >
                {project.language}
              </span>
            )}
            {project.tech.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded bg-white/5 border border-white/10 text-white/70"
              >
                {tech.replace(/-/g, " ")}
              </span>
            ))}
            {project.tech.length === 0 && !project.language && (
              <span className="px-2 py-0.5 text-xs rounded bg-white/5 border border-white/10 text-dim italic">
                no tech metadata
              </span>
            )}
          </div>

          {/* stats row — numeric fields hidden (never faked) for static fallback */}
          <div className="flex items-center gap-4 mt-auto pt-3 border-t border-white/10 font-mono text-[11px] text-[#A7B0B0]">
            {!isStatic && (
              <>
                <span title="Stars">★ {project.stars}</span>
                <span title="Forks">⑂ {project.forks}</span>
                <span title="Last push">
                  <span className="text-dim">UPD </span>
                  {relativeTime(project.updatedAt)}
                </span>
              </>
            )}
            {isStatic && <span className="text-dim">LIVE STATS UNAVAILABLE</span>}
          </div>

          <div className="flex gap-3 pt-3 mt-2">
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3.5 py-1.5 text-xs font-medium rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              View GitHub
            </Link>
            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3.5 py-1.5 text-xs font-medium rounded-md bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
              >
                Live Demo ↗
              </Link>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
