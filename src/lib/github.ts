// ============================================================
// Unified GitHub data layer.
//
//   GitHub API ──► (optional) /api/github server proxy ──► normalizers
//                      │ fallback on static hosts
//                      ▼
//              cached store ──► useGitHub() hooks ──► components
//
// • One fetch per resource for the entire page (shared store).
// • Memory + sessionStorage caching with TTLs (rate-limit friendly).
// • Server proxy path uses GITHUB_TOKEN server-side when configured;
//   the token is never exposed to the client. On static hosts the
//   proxy 404s as HTML and we fall back to the public API directly.
// • Never throws raw errors to the UI — resources resolve to a
//   normalized snapshot with status/error/stale flags.
// ============================================================

import { useEffect, useSyncExternalStore } from "react";
import { PROJECTS, type ProjectCategory } from "./constants";
import {
  GITHUB_USERNAME,
  FEATURED_PROJECTS,
  CATEGORY_OVERRIDES,
  DEMO_LINKS,
  CURATED_REPO_ALIASES,
} from "./github-config";

const API = "https://api.github.com";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface GhProfile {
  login: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  location: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  htmlUrl: string;
}

export interface GhRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
}

export interface GhEvent {
  id: string;
  type: string;
  label: string; // human-readable summary, e.g. "pushed 3 commits to main"
  repo: string;
  createdAt: string;
}

export interface GhLanguageStat {
  name: string;
  bytes: number;
  percent: number;
}

export type GhContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface GhContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: GhContributionLevel;
  color: string;
}

export interface GhContributionWeek {
  contributionDays: GhContributionDay[];
}

export interface GhContributions {
  total: number;
  weeks: GhContributionWeek[];
}

/** Unified project shape for cards + network (GitHub source or static fallback). */
export interface ProjectView {
  id: string;
  name: string;
  fullName: string | null; // "owner/repo" — null for static fallback
  description: string | null;
  language: string | null;
  tech: string[];
  stars: number | null;
  forks: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  url: string;
  demo: string | null;
  featured: boolean;
  category: ProjectCategory;
  archived: boolean;
  fork: boolean;
  recentlyPushed: boolean;
  source: "github" | "static";
}

// ------------------------------------------------------------
// Snapshot store (shared across components)
// ------------------------------------------------------------

export type GhStatus = "loading" | "success" | "error";

export interface GhSnapshot<T> {
  status: GhStatus;
  data: T | null;
  error: string | null;
  stale: boolean; // served from an expired cache after a failed refresh
  fetchedAt: number | null;
}

const EMPTY: GhSnapshot<never> = {
  status: "loading",
  data: null,
  error: null,
  stale: false,
  fetchedAt: null,
};

const snaps = new Map<string, GhSnapshot<unknown>>();
const runners = new Map<string, Promise<unknown>>();
const subs = new Set<() => void>();

function notify() {
  subs.forEach((l) => l());
}

export function subscribeStore(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function getSnapshot<T>(key: string): GhSnapshot<T> {
  return (snaps.get(key) as GhSnapshot<T> | undefined) ?? (EMPTY as GhSnapshot<T>);
}

export function getServerSnapshot<T>(): GhSnapshot<T> {
  return EMPTY as GhSnapshot<T>;
}

function setSnap(key: string, snap: GhSnapshot<unknown>) {
  snaps.set(key, snap);
  notify();
}

// ------------------------------------------------------------
// Cache helpers
// ------------------------------------------------------------

const TTL: Record<string, number> = {
  profile: 5 * 60_000,
  repos: 5 * 60_000,
  activity: 5 * 60_000,
  languages: 15 * 60_000,
  // Keep the browser cache aligned with the server GraphQL revalidation
  // window so newly fetched contribution data can reach the calendar within
  // the same five-minute refresh interval.
  contributions: 5 * 60_000,
  readme: 30 * 60_000,
};

const mem = new Map<string, { data: unknown; ts: number }>();
const jsonRunners = new Map<string, Promise<unknown>>();
const storagePrefix = "gh:v1:";

function ttlFor(kind: string) {
  const base = kind.split(":")[0];
  return TTL[base] ?? 5 * 60_000;
}

function readStorage(key: string): { data: unknown; ts: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storagePrefix + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.ts !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      storagePrefix + key,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {
    /* quota / private mode — memory cache still works */
  }
}

function fresh(entry: { ts: number } | null | undefined, ttl: number) {
  return !!entry && Date.now() - entry.ts < ttl;
}

// ------------------------------------------------------------
// Fetching (server proxy first, public API fallback)
// ------------------------------------------------------------

let serverAvailable = true; // flipped off if the proxy 404s (static host)
let rateLimitedUntil = 0;

async function directFetch(path: string): Promise<Response> {
  return fetch(API + path, {
    headers: { Accept: "application/vnd.github+json" },
    // Next.js: never try to statically cache these
    cache: "no-store",
  });
}

/**
 * Fetch a GitHub REST path. Tries the local /api/github proxy first
 * (lets the server add GITHUB_TOKEN + caching), then falls back to
 * calling api.github.com directly from the client.
 */
export async function ghFetch(path: string): Promise<Response> {
  if (Date.now() < rateLimitedUntil) {
    throw new Error("GITHUB_RATE_LIMITED");
  }

  if (serverAvailable) {
    try {
      const res = await fetch(`/api/github?path=${encodeURIComponent(path)}`, {
        cache: "no-store",
      });
      const ct = res.headers.get("content-type") ?? "";
      if (res.ok) return res;
      // HTML 404 => no API route on this host (static export) → direct
      if (res.status === 404 && ct.includes("text/html")) {
        serverAvailable = false;
      } else if (res.status === 403 || res.status === 429) {
        // server IP rate-limited → use the visitor's own quota instead
      } else if (!ct.includes("text/html")) {
        // genuine GitHub status proxied through (e.g. 404 on a README)
        return res;
      }
    } catch {
      serverAvailable = false; // proxy unreachable → go direct
    }
  }

  const res = await directFetch(path);
  const remaining = Number(res.headers.get("x-ratelimit-remaining"));
  if ((res.status === 403 || res.status === 429) && remaining === 0) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    rateLimitedUntil = reset ? reset * 1000 : Date.now() + 60_000;
    throw new Error("GITHUB_RATE_LIMITED");
  }
  return res;
}

async function getJson<T>(path: string, kind: string): Promise<T> {
  const key = path;
  const ttl = ttlFor(kind);

  const cached = mem.get(key) ?? (readStorage(key) as { data: unknown; ts: number } | null);
  if (fresh(cached, ttl)) return cached!.data as T;

  const existing = jsonRunners.get(key);
  if (existing) return existing as Promise<T>;

  const run = (async () => {
    try {
      const res = await ghFetch(path);
      if (res.status === 404) return null as unknown as T; // legitimate "not found"
      if (!res.ok) throw new Error(`GITHUB_HTTP_${res.status}`);
      const data = (await res.json()) as T;
      mem.set(key, { data, ts: Date.now() });
      writeStorage(key, data);
      return data;
    } catch (err) {
      // Network failure / rate limit → serve stale cache if we have one
      const stale = mem.get(key) ?? readStorage(key);
      if (stale) {
        const e = err as Error;
        throw Object.assign(new Error(e.message || "network"), { staleData: stale.data });
      }
      throw err;
    }
  })();

  jsonRunners.set(key, run);
  try {
    return await run;
  } finally {
    if (jsonRunners.get(key) === run) jsonRunners.delete(key);
  }
}

// ------------------------------------------------------------
// Normalizers
// ------------------------------------------------------------

// ------------------------------------------------------------
// Raw GitHub payload shapes (JSON boundary) + normalizers
// ------------------------------------------------------------

interface RawUser {
  login?: string;
  name?: string | null;
  bio?: string | null;
  blog?: string | null;
  location?: string | null;
  avatar_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  html_url?: string;
}

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string | null;
  language?: string | null;
  topics?: string[];
  stargazers_count?: number;
  forks_count?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  html_url?: string;
  homepage?: string | null;
  fork?: boolean;
  archived?: boolean;
  private?: boolean;
}

interface RawEvent {
  id?: string | number;
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: Record<string, unknown>;
}

const asStr = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const asNum = (v: unknown, fallback = 0) => (typeof v === "number" ? v : fallback);
const asObj = (v: unknown): Record<string, unknown> | undefined =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : undefined;

function normalizeProfile(p: RawUser): GhProfile {
  return {
    login: p.login ?? GITHUB_USERNAME,
    name: p.name ?? null,
    bio: p.bio ?? null,
    blog: p.blog || null,
    location: p.location ?? null,
    avatarUrl: p.avatar_url ?? "",
    publicRepos: p.public_repos ?? 0,
    followers: p.followers ?? 0,
    following: p.following ?? 0,
    createdAt: p.created_at ?? "",
    htmlUrl: p.html_url ?? `https://github.com/${GITHUB_USERNAME}`,
  };
}

function normalizeRepo(r: RawRepo): GhRepo {
  return {
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? null,
    language: r.language ?? null,
    topics: Array.isArray(r.topics) ? r.topics : [],
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
    pushedAt: r.pushed_at ?? r.updated_at ?? "",
    url: r.html_url || `https://github.com/${r.full_name}`,
    homepage: (r.homepage || "").trim() || null,
    fork: !!r.fork,
    archived: !!r.archived,
  };
}

function eventLabel(e: RawEvent): string {
  const p = e.payload ?? {};
  switch (e.type) {
    case "PushEvent": {
      const n = Array.isArray(p.commits)
        ? p.commits.length
        : asNum(p.size, 1) || 1;
      const branch = asStr(p.ref).replace(/^refs\/heads\//, "");
      return `pushed ${n} commit${n === 1 ? "" : "s"}${branch ? ` to ${branch}` : ""}`;
    }
    case "CreateEvent":
      return p.ref_type === "repository"
        ? "created repository"
        : `created ${asStr(p.ref_type, "ref")}${typeof p.ref === "string" ? ` ${p.ref}` : ""}`;
    case "DeleteEvent":
      return `deleted ${asStr(p.ref_type, "ref")}${typeof p.ref === "string" ? ` ${p.ref}` : ""}`;
    case "PullRequestEvent": {
      const num = typeof p.number === "number" ? ` #${p.number}` : "";
      return `${asStr(p.action, "updated")} pull request${num}`;
    }
    case "IssuesEvent": {
      const issue = asObj(p.issue);
      const title = issue && typeof issue.title === "string" ? ` “${issue.title}”` : "";
      return `${asStr(p.action, "updated")} issue${title}`;
    }
    case "IssueCommentEvent":
      return "commented on an issue";
    case "ReleaseEvent": {
      const rel = asObj(p.release);
      const tag = rel && typeof rel.tag_name === "string" ? ` ${rel.tag_name}` : "";
      return `${asStr(p.action, "created")} release${tag}`;
    }
    case "ForkEvent":
      return "forked a repository";
    case "WatchEvent":
      return "starred a repository";
    case "PublicEvent":
      return "made a repository public";
    default:
      return asStr(e.type).replace(/Event$/, "").replace(/([A-Z])/g, " $1").trim().toLowerCase() || "activity";
  }
}

function normalizeEvent(e: RawEvent): GhEvent {
  return {
    id: String(e.id ?? ""),
    type: e.type ?? "Event",
    label: eventLabel(e),
    repo: e.repo?.name ?? "",
    createdAt: e.created_at ?? "",
  };
}

// ------------------------------------------------------------
// Classification (override → topics → keywords → language)
// ------------------------------------------------------------

const TOPIC_HINTS: Record<Exclude<ProjectCategory, "other">, string[]> = {
  ai: ["ai", "ml", "machine-learning", "deep-learning", "llm", "llms", "nlp", "genai", "generative-ai", "rag", "agents", "artificial-intelligence", "neural-network", "data-science"],
  web: ["web", "website", "frontend", "backend", "fullstack", "full-stack", "react", "nextjs", "next-js", "javascript", "typescript", "html", "css", "nodejs", "portfolio", "ui", "ux"],
  cloud: ["cloud", "aws", "azure", "gcp", "serverless", "devops", "docker", "kubernetes", "s3", "ec2"],
  iot: ["iot", "arduino", "esp32", "embedded", "sensors", "raspberry-pi", "hardware", "firmware"],
  systems: ["systems", "operating-systems", "os", "kernel", "compiler", "database", "databases", "low-level", "networking"],
};

const NAME_DESC_HINTS: Record<Exclude<ProjectCategory, "other">, string[]> = {
  ai: ["ai", "llm", "gpt", "assistant", "tutor", "summar", "rag", "agent", "model", "ml ", "neural", "offline-ai"],
  web: ["website", "web app", "portfolio", "frontend", "landing", "react", "next.js", "nextjs", "exchange site", "ui/ux"],
  cloud: ["cloud", "aws", "s3", "ec2", "efs", "storage system", "deploy"],
  iot: ["iot", "arduino", "esp32", "sensor", "embedded", "hardware"],
  systems: ["operating system", "kernel", "compiler", "database", "system software"],
};

const WEB_LANGUAGES = ["HTML", "CSS", "JavaScript", "TypeScript"];

export function classifyRepo(repo: GhRepo): ProjectCategory {
  const override = CATEGORY_OVERRIDES[repo.name];
  if (override) return override;

  const topics = repo.topics.map((t) => t.toLowerCase());
  for (const cat of Object.keys(TOPIC_HINTS) as (keyof typeof TOPIC_HINTS)[]) {
    if (topics.some((t) => TOPIC_HINTS[cat].includes(t))) return cat;
  }

  const haystack = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  for (const cat of Object.keys(NAME_DESC_HINTS) as (keyof typeof NAME_DESC_HINTS)[]) {
    if (NAME_DESC_HINTS[cat].some((k) => haystack.includes(k))) return cat;
  }

  if (repo.language && WEB_LANGUAGES.includes(repo.language)) return "web";
  return "other";
}

function repoKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isFeaturedRepo(name: string): boolean {
  const key = repoKey(name);
  return FEATURED_PROJECTS.some((featured) => repoKey(featured) === key);
}

// ------------------------------------------------------------
// Project views (GitHub → UI, with static fallback)
// ------------------------------------------------------------

const RECENT_MS = 180 * 24 * 60 * 60 * 1000; // 180 days → "recently pushed"

export function toProjectViews(repos: GhRepo[]): ProjectView[] {
  const featuredRank = (name: string) => {
    const i = FEATURED_PROJECTS.findIndex((featured) => repoKey(featured) === repoKey(name));
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...repos]
    .map((r) => ({
      id: String(r.id),
      name: r.name,
      fullName: r.fullName,
      description: r.description,
      language: r.language,
      tech: r.topics.length
        ? r.topics
        : r.language
          ? [r.language]
          : [],
      stars: r.stars,
      forks: r.forks,
      createdAt: r.createdAt || null,
      updatedAt: r.pushedAt || r.updatedAt,
      url: r.url,
      demo:
        r.homepage ||
        DEMO_LINKS[r.name] ||
        null,
       featured: isFeaturedRepo(r.name),
      category: classifyRepo(r),
      archived: r.archived,
      fork: r.fork,
      recentlyPushed: r.pushedAt
        ? Date.now() - Date.parse(r.pushedAt) < RECENT_MS
        : false,
      source: "github" as const,
    }))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.featured && b.featured)
        return featuredRank(a.name) - featuredRank(b.name);
      return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
    });
}

/** Last-resort views built from the portfolio's curated static data (never fabricated numbers — numeric stats are null). */
export function getStaticProjectViews(): ProjectView[] {
  return PROJECTS.map((p) => ({
    id: p.id,
    name: p.title,
    fullName: null,
    description: p.description,
    language: null,
    tech: p.tech,
    stars: null,
    forks: null,
    createdAt: null,
    updatedAt: null,
    url: p.github,
    demo: p.demo ?? null,
    featured: p.featured,
    category: p.category,
    archived: false,
    fork: false,
    recentlyPushed: false,
    source: "static" as const,
  }));
}

/**
 * Keep curated case studies available when their old repository name is no
 * longer public, while omitting a static card when the live API already
 * represents that case study. Live GitHub data always wins for a match.
 */
export function mergeProjectViews(repos: GhRepo[]): ProjectView[] {
  const live = toProjectViews(repos);
  const liveKeys = new Set(live.map((repo) => repoKey(repo.name)));
  const curatedOnly = getStaticProjectViews().filter((project) => {
    const urlName = project.url.split("/").filter(Boolean).pop() ?? project.id;
    const aliases = CURATED_REPO_ALIASES[project.id] ?? [urlName, project.name];
    return !aliases.some((alias) => liveKeys.has(repoKey(alias)));
  });

  return [...live, ...curatedOnly];
}

// ------------------------------------------------------------
// Derived stats (all computed from fetched data)
// ------------------------------------------------------------

export function totalStars(repos: GhRepo[]) {
  return repos.reduce((s, r) => s + r.stars, 0);
}

export function totalForks(repos: GhRepo[]) {
  return repos.reduce((s, r) => s + r.forks, 0);
}

export function repoTopics(repos: GhRepo[], limit = 14): string[] {
  const counts = new Map<string, number>();
  repos.forEach((r) =>
    r.topics.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([t]) => t);
}

export function primaryLanguages(repos: GhRepo[]): string[] {
  const counts = new Map<string, number>();
  repos.forEach((r) => {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);
}

/** Account age in whole months — labelled "active on GitHub", never "Git usage". */
export function activeMonths(createdAt: string): number | null {
  if (!createdAt) return null;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return null;
  const now = new Date();
  let months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  if (now.getDate() < created.getDate()) months -= 1;
  return Math.max(months, 0);
}

export function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  const y = Math.floor(mo / 12);
  return `${y} year${y === 1 ? "" : "s"} ago`;
}

// ------------------------------------------------------------
// Resource loaders
// ------------------------------------------------------------

async function loadProfile(): Promise<GhProfile> {
  return normalizeProfile(await getJson<RawUser>(`/users/${GITHUB_USERNAME}`, "profile"));
}

async function loadRepos(): Promise<GhRepo[]> {
  const pages: RawRepo[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const raw = await getJson<RawRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=pushed`,
      "repos"
    );
    if (!Array.isArray(raw)) break;
    pages.push(...raw);
    if (raw.length < 100) break;
  }

  // Deduplicate defensively: pagination or a future cache layer must never
  // produce two cards for the same repository.
  const seen = new Set<string>();
  return pages
    .filter((r) => !r.private)
    .filter((r) => {
      const key = r.id ? String(r.id) : r.full_name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(normalizeRepo)
    .filter((r) => Boolean(r.url))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}

async function loadActivity(): Promise<GhEvent[]> {
  const raw = await getJson<RawEvent[]>(
    `/users/${GITHUB_USERNAME}/events/public?per_page=30`,
    "activity"
  );
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeEvent);
}

async function loadLanguages(): Promise<GhLanguageStat[]> {
  const repos = await loadRepos();
  const results = await Promise.allSettled(
    repos.slice(0, 15).map((r) =>
      getJson<Record<string, number>>(`/repos/${r.fullName}/languages`, "languages")
    )
  );
  const totals = new Map<string, number>();
  let any = false;
  results.forEach((res) => {
    if (res.status !== "fulfilled" || !res.value) return;
    any = true;
    Object.entries(res.value).forEach(([lang, bytes]) => {
      totals.set(lang, (totals.get(lang) ?? 0) + (bytes ?? 0));
    });
  });
  if (!any) throw new Error("GITHUB_LANGUAGES_UNAVAILABLE");

  const grand = [...totals.values()].reduce((s, b) => s + b, 0);
  if (grand === 0) return [];

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 7);
  const rest = sorted.slice(7);
  const stats: GhLanguageStat[] = top.map(([name, bytes]) => ({
    name,
    bytes,
    percent: Math.round((bytes / grand) * 1000) / 10,
  }));
  if (rest.length) {
    const bytes = rest.reduce((s, [, b]) => s + b, 0);
    stats.push({
      name: "Other",
      bytes,
      percent: Math.round((bytes / grand) * 1000) / 10,
    });
  }
  return stats;
}

/**
 * Contribution calendar — ONLY available through the server proxy when
 * GITHUB_TOKEN is configured (GraphQL requires auth). Returns null when
 * unavailable; callers must omit the metric rather than invent one.
 */
async function loadContributions(): Promise<GhContributions> {
  try {
    const res = await fetch("/api/github/contributions", { cache: "no-store" });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      /* handled by the normalized error below */
    }

    const payload = json as {
      available?: unknown;
      total?: unknown;
      totalContributions?: unknown;
      weeks?: unknown;
      message?: unknown;
    } | null;

    if (!res.ok || payload?.available !== true) {
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : "GitHub contribution data is temporarily unavailable. Try again later.";
      throw new Error(`GITHUB_CONTRIBUTIONS:${message}`);
    }

    if (
      !Array.isArray(payload?.weeks) ||
      typeof (payload?.totalContributions ?? payload?.total) !== "number"
    ) {
      throw new Error("GITHUB_CONTRIBUTIONS:GitHub returned an unexpected contribution response.");
    }

    return {
      total: Number(payload?.totalContributions ?? payload?.total),
      weeks: payload?.weeks as GhContributionWeek[],
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("GITHUB_CONTRIBUTIONS:Could not reach the contribution endpoint.");
  }
}

async function loadReadme(key: string): Promise<string | null> {
  const fullName = key.slice("readme:".length);
  const json = await getJson<{ content?: string }>(`/repos/${fullName}/readme`, "readme");
  if (!json?.content) return null;
  const bytes = Uint8Array.from(atob(json.content.replace(/\n/g, "")), (c) =>
    c.charCodeAt(0)
  );
  const text = new TextDecoder().decode(bytes);
  return summarizeMarkdown(text);
}

/** Lightweight README summary: first meaningful prose, markdown stripped. */
export function summarizeMarkdown(md: string, max = 320): string {
  const stripped = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_>|-]/g, " ")
    .replace(/\[(?:.*?)\]\(.*?\)/g, " ");
  const line =
    stripped
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 40 && !/^\W*$/.test(l)) ?? "";
  const clean = line.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

// ------------------------------------------------------------
// Resource registry + hooks
// ------------------------------------------------------------

type Loader = () => Promise<unknown>;

const LOADERS: Record<string, Loader> = {
  profile: loadProfile,
  repos: loadRepos,
  activity: loadActivity,
  languages: loadLanguages,
  contributions: loadContributions,
};
const LOADERS_PREFIX: { prefix: string; loader: (key: string) => Promise<unknown> }[] = [
  { prefix: "readme:", loader: loadReadme },
];

function loaderFor(key: string): Loader | undefined {
  if (LOADERS[key]) return LOADERS[key];
  const hit = LOADERS_PREFIX.find((l) => key.startsWith(l.prefix));
  return hit ? () => hit.loader(key) : undefined;
}

function errorMessage(err: unknown): string {
  const msg = (err as Error)?.message ?? "";
  if (msg.startsWith("GITHUB_CONTRIBUTIONS:")) return msg.slice("GITHUB_CONTRIBUTIONS:".length);
  if (msg === "GITHUB_RATE_LIMITED")
    return "GitHub rate limit reached — data will refresh after the limit resets.";
  if (msg.startsWith("GITHUB_HTTP")) return "GitHub returned an error.";
  if (msg === "GITHUB_LANGUAGES_UNAVAILABLE")
    return "Language statistics are unavailable.";
  return "Could not reach GitHub — check your connection.";
}

/** Ensure a resource is loaded (idempotent; dedupes concurrent callers). */
export function ensure(key: string, force = false): Promise<unknown> {
  const loader = loaderFor(key);
  if (!loader) return Promise.resolve(null);

  const current = snaps.get(key);
  const ttl = ttlFor(key);
  const memHit = mem.get(key);
  const storeHit = readStorage(key);

  if (!force) {
    if (current?.status === "success" && fresh({ ts: current.fetchedAt ?? 0 }, ttl)) {
      return Promise.resolve(current.data);
    }
    if (fresh(memHit, ttl)) {
      setSnap(key, {
        status: "success",
        data: memHit!.data,
        error: null,
        stale: false,
        fetchedAt: memHit!.ts,
      });
      return Promise.resolve(memHit!.data);
    }
    if (storeHit && fresh(storeHit, ttl)) {
      mem.set(key, { data: storeHit.data, ts: storeHit.ts });
      setSnap(key, {
        status: "success",
        data: storeHit.data,
        error: null,
        stale: false,
        fetchedAt: storeHit.ts,
      });
      return Promise.resolve(storeHit.data);
    }
  } else {
    mem.delete(key);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(storagePrefix + key);
      } catch {
        /* ignore */
      }
    }
  }

  if (runners.has(key)) return runners.get(key)!;

  setSnap(key, {
    status: "loading",
    data: current?.data ?? storeHit?.data ?? null,
    error: null,
    stale: false,
    fetchedAt: current?.fetchedAt ?? null,
  });

  const run = loader()
    .then((data) => {
      mem.set(key, { data, ts: Date.now() });
      writeStorage(key, data);
      setSnap(key, {
        status: "success",
        data,
        error: null,
        stale: false,
        fetchedAt: Date.now(),
      });
      return data;
    })
    .catch((err: unknown & { staleData?: unknown }) => {
      const staleData = err?.staleData ?? storeHit?.data ?? mem.get(key)?.data ?? null;
      setSnap(key, {
        status: staleData !== null ? "success" : "error",
        data: staleData,
        error: staleData !== null ? null : errorMessage(err),
        stale: staleData !== null,
        fetchedAt: staleData !== null ? (mem.get(key)?.ts ?? Date.now()) : null,
      });
      if (staleData === null) throw err;
      return staleData;
    })
    .finally(() => {
      runners.delete(key);
    });

  runners.set(key, run);
  return run;
}

/**
 * Subscribe to a GitHub resource.
 * @param key   resource key ("profile" | "repos" | "activity" | "languages" |
 *              "contributions" | "readme:<owner>/<repo>")
 * @param enabled lazy-gating: when false, nothing is fetched yet.
 */
export function useGitHub<T>(key: string, enabled = true): GhSnapshot<T> {
  const snap = useSyncExternalStore(
    subscribeStore,
    () => getSnapshot<T>(key),
    () => getServerSnapshot<T>()
  );

  useEffect(() => {
    if (enabled) ensure(key).catch(() => undefined);
  }, [key, enabled]);

  return snap;
}

/** Force a fresh fetch (retry buttons). */
export function refresh(key: string) {
  ensure(key, true).catch(() => undefined);
}
