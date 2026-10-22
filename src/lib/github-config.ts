// ============================================================
// GitHub integration configuration (public values only —
// never put tokens or secrets in this file)
// ============================================================

import type { ProjectCategory } from "./constants";

/** GitHub username powering the live portfolio. */
export const GITHUB_USERNAME = "trinetrayelukuru";

/**
 * Repos shown as featured (pinned first + ★ badge).
 * Order matters. Listing a repo that doesn't exist is harmless —
 * the card itself is always rendered from live GitHub data.
 */
export const FEATURED_PROJECTS = [
  "Offline-AI-Assistant",
  "cloud-vault",
  "tutor-ai",
  "ranaha-gold",
  "trinetrayelukuru.github.io",
];

/** Repository names that represent an existing curated case study. */
export const CURATED_REPO_ALIASES: Record<string, string[]> = {
  "offline-ai-assistant": ["offline-ai-assistant"],
  "ai-llm-file-summariser": ["ai-llm-file-summariser"],
  tutorai: ["tutorai", "tutor-ai"],
  cloudvault: ["cloudvault", "cloud-vault"],
  "ranaha-gold": ["ranaha-gold-website", "ranaha-gold", "ranahagold"],
  "samsung-inspired": ["samsung-inspired"],
};

/**
 * Manual category assignment — wins over automatic detection.
 * Use for repos whose language/topics don't classify reliably.
 */
export const CATEGORY_OVERRIDES: Record<string, ProjectCategory> = {
  "Offline-AI-Assistant": "ai",
  "cloud-vault": "cloud",
  "tutor-ai": "ai",
  "ranaha-gold": "web",
  ranahagold: "web",
  "trinetrayelukuru.github.io": "web",
  "book-exchange": "web",
  "codechef": "web",
  "trinetrayelukuru": "other", // profile README repo
};

/**
 * Optional per-repo demo links, for repos without a GitHub Pages
 * homepage configured. Keyed by repo name.
 */
export const DEMO_LINKS: Record<string, string> = {};
