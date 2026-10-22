<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design & animation skills (project instruction)

Two agent skills are installed in this repo at `.agents/skills/` and are loaded
with the `skill` tool by name: `ui-ux-pro-max` and `motion`.

**When to use them:**

- **`ui-ux-pro-max`** — use for all design work: design research, visual
  hierarchy, typography, colour palettes, spacing, responsive layouts, and UX /
  accessibility review. Query it with its bundled search script, e.g.
  `python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>`
  or `--design-system` / `--stack nextjs` (use `python`, not `python3`, on this
  Windows machine).
- **`motion`** — use for React animation guidance: animations, transitions,
  scroll effects, and interaction design. Its `best-practices/` content is fully
  offline. The Motion MCP servers are **not** configured in this project, so for
  docs lookup fall back to https://motion.dev/docs/react and the skill's local
  files instead of claiming MCP search works.

**Rules when working in this portfolio:**

1. Respect existing conventions and dependencies: `framer-motion` (imports from
   `framer-motion`), `three`, Tailwind CSS v4, Next.js 16, TypeScript, and the
   existing component structure in `src/components/`. Do **not** migrate
   `framer-motion` imports to `motion/react`, do **not** add duplicate
   animation libraries, and preserve the Three.js particle background and
   kinetic typography.
2. Consider reduced motion (`prefers-reduced-motion`), accessibility, and
   performance (avoid layout-thrashing animations; prefer transforms and
   opacity) for every animation or UI change.
3. Do not rewrite working components for style's sake — make the smallest
   change that satisfies the request.
4. Run design/animation guidance through these skills first, then apply it
   within the constraints above.
