import { cacheLife, cacheTag } from "next/cache";
import { GITHUB_USERNAME } from "@/lib/github-config";

const CACHE_SECONDS = 300;
const CACHE_TAG = "github-contributions";

const CONTRIBUTION_LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

type ContributionLevel = (typeof CONTRIBUTION_LEVELS)[number];

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: unknown;
      } | null;
    } | null;
  } | null;
  errors?: { type?: string; message?: string }[];
}

interface ContributionSuccess {
  available: true;
  totalContributions: number;
  total: number;
  weeks: ContributionWeek[];
}

type ContributionErrorCode =
  | "not_configured"
  | "invalid_token"
  | "rate_limited"
  | "upstream_unavailable";

interface ContributionFailure {
  available: false;
  code: ContributionErrorCode;
  retryable: boolean;
  message: string;
}

type CachedContributionResult =
  | ContributionSuccess
  | { available: false; code: Exclude<ContributionErrorCode, "not_configured"> };

class ContributionUpstreamError extends Error {
  constructor(
    public readonly code: Exclude<ContributionErrorCode, "not_configured">,
    public readonly status = 502
  ) {
    super(code);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function isContributionLevel(value: unknown): value is ContributionLevel {
  return typeof value === "string" && CONTRIBUTION_LEVELS.includes(value as ContributionLevel);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function parseCalendar(value: unknown): ContributionCalendar | null {
  if (!isRecord(value)) return null;
  const total = value.totalContributions;
  const weeks = value.weeks;
  if (
    typeof total !== "number" ||
    !Number.isInteger(total) ||
    total < 0 ||
    !Array.isArray(weeks)
  ) {
    return null;
  }

  const normalizedWeeks: ContributionWeek[] = [];
  for (const week of weeks) {
    if (!isRecord(week) || !Array.isArray(week.contributionDays)) return null;
    const contributionDays: ContributionDay[] = [];
    for (const day of week.contributionDays) {
      if (!isRecord(day)) return null;
      const count = day.contributionCount;
      const color = day.color;
      if (
        !isValidDate(day.date) ||
        typeof count !== "number" ||
        !Number.isInteger(count) ||
        count < 0 ||
        !isContributionLevel(day.contributionLevel) ||
        typeof color !== "string" ||
        !/^#[0-9a-f]{6}$/i.test(color)
      ) {
        return null;
      }
      contributionDays.push({
        date: day.date,
        contributionCount: count,
        contributionLevel: day.contributionLevel,
        color,
      });
    }
    normalizedWeeks.push({ contributionDays });
  }

  return { totalContributions: total, weeks: normalizedWeeks };
}

function errorCodeFromGraphQL(
  errors: GitHubGraphQLResponse["errors"]
): Exclude<ContributionErrorCode, "not_configured" | "upstream_unavailable"> | null {
  const text = (errors ?? [])
    .map((error) => `${error.type ?? ""} ${error.message ?? ""}`.toLowerCase())
    .join(" ");

  if (text.includes("unauthorized") || text.includes("bad credentials")) {
    return "invalid_token";
  }
  if (text.includes("rate limit") || text.includes("rate_limited")) {
    return "rate_limited";
  }
  return null;
}

/**
 * The GraphQL request is cached by Next for five minutes. The token is an
 * input to this server-only cache function, never part of its serialised
 * return value or sent to the client.
 */
async function getContributionCalendar(token: string): Promise<CachedContributionResult> {
  "use cache";
  cacheLife({ stale: CACHE_SECONDS, revalidate: CACHE_SECONDS, expire: 1800 });
  cacheTag(CACHE_TAG);

  const query = `
    query ContributionCalendar($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
                color
              }
            }
          }
        }
      }
    }
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "trinetra-portfolio-github-calendar",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.status === 401) {
      throw new ContributionUpstreamError("invalid_token", 502);
    }
    if (response.status === 403 || response.status === 429) {
      throw new ContributionUpstreamError("rate_limited", 429);
    }
    if (!response.ok) {
      throw new ContributionUpstreamError("upstream_unavailable", 502);
    }

    let json: GitHubGraphQLResponse;
    try {
      json = (await response.json()) as GitHubGraphQLResponse;
    } catch {
      throw new ContributionUpstreamError("upstream_unavailable", 502);
    }

    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const code = errorCodeFromGraphQL(json.errors);
      if (code === "invalid_token") {
        throw new ContributionUpstreamError("invalid_token", 502);
      }
      if (code === "rate_limited") {
        throw new ContributionUpstreamError("rate_limited", 429);
      }
      throw new ContributionUpstreamError("upstream_unavailable", 502);
    }

    const calendar = parseCalendar(json.data?.user?.contributionsCollection?.contributionCalendar);
    if (!calendar) {
      throw new ContributionUpstreamError("upstream_unavailable", 502);
    }

    return {
      available: true,
      totalContributions: calendar.totalContributions,
      total: calendar.totalContributions,
      weeks: calendar.weeks,
    };
  } catch (error) {
    return {
      available: false,
      code:
        error instanceof ContributionUpstreamError
          ? error.code
          : "upstream_unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function failure(
  code: ContributionErrorCode,
  status: number,
  message: string,
  retryable: boolean
) {
  const payload: ContributionFailure = { available: false, code, retryable, message };
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token || token === "your_github_token_here") {
    return failure(
      "not_configured",
      503,
      "Contribution data is not configured. Set GITHUB_TOKEN in the server environment and restart Next.js.",
      false
    );
  }

  const payload = await getContributionCalendar(token);
  if (!payload.available) {
    if (payload.code === "invalid_token") {
      return failure(
        "invalid_token",
        502,
        "GitHub rejected GITHUB_TOKEN. Check the server token and try again.",
        false
      );
    }
    if (payload.code === "rate_limited") {
      return failure(
        "rate_limited",
        429,
        "GitHub rate limit reached. Try again later.",
        true
      );
    }
    return failure(
      "upstream_unavailable",
      503,
      "GitHub contribution data is temporarily unavailable. Try again later.",
      true
    );
  }

  return Response.json(payload, {
    status: 200,
    headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=60" },
  });
}
