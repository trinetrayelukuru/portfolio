// ============================================================
// Server-side GitHub REST proxy.
// 
// • GITHUB_TOKEN (optional, env var, server-only) is attached here —
//   it never reaches the client bundle.
// • Allowlisted path prefixes prevent this route from being abused
//   as an open proxy.
// • The upstream request opts into Next.js server-side caching with a
//   five-minute revalidation window, so repeated renders and visitors do
//   not spend GitHub rate limit. Only successful (200) responses are
//   stored, so failures and 404s are never cached.
// • GitHub's own status codes are passed through, which lets the client
//   data layer treat a missing README as "not found" and surface rate
//   limits correctly.
// • On static hosts this route doesn't exist; the client data layer
//   detects that and calls api.github.com directly.
// ============================================================

import { GITHUB_USERNAME } from "@/lib/github-config";

const REVALIDATE_SECONDS = 300;

const ALLOWED_PREFIXES = [
  `/users/${GITHUB_USERNAME}`,
  `/users/${GITHUB_USERNAME}/repos`,
  `/users/${GITHUB_USERNAME}/events`,
  `/repos/${GITHUB_USERNAME}/`,
  `/api/github/contributions`,
];

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";

  if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
    return Response.json({ error: "path not allowed" }, { status: 403 });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "trinetra-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    // Handle contributions endpoint specifically
    if (path.startsWith(`/api/github/contributions`)) {
      const res = await fetch(`https://api.github.com${path.replace(`/api/github/contributions`, "")}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
      });

      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        body = { error: "invalid upstream payload" };
      }

      if (!res.ok) {
        return Response.json(body, {
          status: res.status,
          headers: { "Cache-Control": "no-store" },
        });
      }

      return Response.json(body, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }

    const res = await fetch(`https://api.github.com${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    });

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = { error: "invalid upstream payload" };
    }

    if (!res.ok) {
      return Response.json(body, {
        status: res.status,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return Response.json(body, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return Response.json(
      { error: "upstream unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}