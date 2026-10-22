"use client";

import {
  getStaticProjectViews,
  mergeProjectViews,
  refresh,
  relativeTime,
  type GhRepo,
  type ProjectView,
  useGitHub,
} from "../lib/github";
import { CATEGORY_COLORS } from "../lib/constants";
import Reveal from "./Reveal";
import { GhSkeleton } from "./DataStates";

function RepositoryCard({ project, index }: { project: ProjectView; index: number }) {
  const accent = CATEGORY_COLORS[project.category];
  const isStatic = project.source === "static";

  return (
    <article className="rounded-lg border border-white/10 bg-[#030507]/70 p-4 transition-colors hover:border-white/25">
      <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-[#7D8B9F]">
        <span>REPO_{String(index + 1).padStart(2, "0")}</span>
        <span style={{ color: accent }}>{isStatic ? "CURATED" : "LIVE"}</span>
      </div>
      <h3 className="truncate text-sm font-semibold text-[#F5F7F7]">{project.name}</h3>
      <p className="mt-1 min-h-10 text-xs leading-relaxed text-[#7D8B9F]">
        {project.description ?? "No description provided by the repository."}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.language && (
          <span
            className="rounded border px-2 py-0.5 font-mono text-[10px]"
            style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}12` }}
          >
            {project.language}
          </span>
        )}
        {project.tech.slice(0, 2).map((tech) => (
          <span key={tech} className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#A7B0B0]">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 font-mono text-[10px] text-[#7D8B9F]">
        <span>
          {isStatic
            ? "LIVE STATS UNAVAILABLE"
            : `★ ${project.stars ?? 0} · ${relativeTime(project.updatedAt)}`}
        </span>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[#00E5FF] transition-colors hover:text-[#F5F7F7]"
        >
          OPEN ↗
        </a>
      </div>
    </article>
  );
}

/** Compact public repository index for the GitHub activity dashboard. */
export default function GitHubRepositories() {
  const repos = useGitHub<GhRepo[]>("repos");
  const hasLiveRepos = Boolean(repos.data && repos.data.length > 0);
  const live = hasLiveRepos ? mergeProjectViews(repos.data ?? []) : [];
  const projects = (live.length > 0 ? live : getStaticProjectViews())
    .filter((project) => !project.archived)
    .slice(0, 6);
  const fallback = !hasLiveRepos;

  if (repos.status === "loading" && !repos.data) {
    return <GhSkeleton rows={4} label="LOADING REPOSITORIES…" />;
  }

  return (
    <Reveal>
      <div className="h-full rounded-xl border border-white/10 bg-[#0B1713]/50 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF66] fx-anim animate-pulse" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7B0B0]">Public repositories</h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-[#7D8B9F]">
            <span>{fallback ? "CURATED INDEX" : `${projects.length} SHOWN`}</span>
            {repos.status === "error" && (
              <button
                type="button"
                onClick={() => refresh("repos")}
                className="text-[#00E5FF] hover:text-[#F5F7F7]"
              >
                RETRY
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <RepositoryCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
