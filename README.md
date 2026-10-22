This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## GitHub contribution calendar

The contribution heatmap is loaded server-side from GitHub GraphQL for
`trinetrayelukuru`. Copy `.env.example` to `.env.local` (without overwriting
any existing `.env.local`) and set:

```bash
GITHUB_TOKEN=your_github_token_here
```

`GITHUB_TOKEN` is intentionally server-only. Do not use a `NEXT_PUBLIC_`
prefix, hard-code a token, or commit `.env.local`. Use the smallest read-only
token GitHub accepts for public profile/contribution data; private repository
access is not required by this portfolio. Restart `npm run dev` after changing
the environment.

The server endpoint is `GET /api/github/contributions`. It queries
`contributionsCollection.contributionCalendar` and caches the upstream result
for five minutes. Missing or invalid configuration is returned as an explicit
error instead of an empty or fabricated calendar.

## Checks

```bash
npx tsc --noEmit
npm run build
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
