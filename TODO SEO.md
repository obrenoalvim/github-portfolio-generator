# TODO SEO

> Last updated: 2026-07-04

## Pending Changes

### GitHub API rate limit will silently degrade per-user SEO metadata at scale
- **Source:** README.md (project's own note) + https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api — unauthenticated REST calls are capped at 60 requests/hour per IP.
- **What:** `app/[username]/layout.tsx`'s `generateMetadata` calls `https://api.github.com/users/${uname}` unauthenticated. Once crawlers (Googlebot, GPTBot, ClaudeBot, PerplexityBot — all explicitly allowed in `robots.ts`) start requesting many different `/[username]` pages from the same server IP, the 60 req/hour cap will be hit and `fetchGitHubUser` will return `null`, silently falling back to the generic `${uname} | Portfólio` / `Portfólio de ${uname} no GitHub` metadata (loses bio, avatar OG image, canonical structured data) for every page crawled after the limit — exactly when it matters most (bulk indexing).
- **Where:** `app/[username]/layout.tsx:16-26` (`fetchGitHubUser`), same pattern duplicated in `app/[username]/page.tsx:104` (client-side fetch, separate limit bucket but same root cause).
- **Why:** Keeps rich per-user Open Graph/Twitter/JSON-LD metadata intact under real crawl load instead of degrading to boilerplate.
- **Risk:** Requires adding a `GITHUB_TOKEN` (classic PAT, no scopes needed for public read) as an env var and passing `Authorization: Bearer ${token}` on the fetch — a config/env change, and the token must be kept server-side only. Raises rate limit to 5,000/hour.
- **Effort:** Low-Medium (add env var + one header; decide whether to also move the client-side fetch in `page.tsx` behind a server route to use the same token).

### Design a real Open Graph image (text + branding)
- **Source:** https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- **What:** `app/opengraph-image.png` / `app/icon.png` / `app/apple-icon.png` are auto-generated placeholders (blue→purple gradient, abstract "profile card" mark). No wordmark/tagline text.
- **Where:** `app/opengraph-image.png`
- **Why:** A version with "GitHub Portfolio Generator" text plus the tagline would convert better on shared links.
- **Risk:** None — visual-only swap.
- **Effort:** Medium (real design pass, not a scripted placeholder).

### Reconsider mixing AI-training bots with AI-search/citation bots in robots.ts
- **Source:** https://nohacks.co/blog/ai-user-agents-landscape-2026 — 2026 guidance splits crawlers into "training" (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) vs. "retrieval/citation" (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and recommends deciding on each independently.
- **What:** `app/robots.ts` currently allows both categories identically.
- **Where:** `app/robots.ts:9-20`
- **Why:** Purely a site-owner policy decision (does Breno want GitHub-derived portfolio content used for model training, or just cited in AI answers?) — not a bug.
- **Risk:** None technically; a values/policy call, not applying without explicit direction.
- **Effort:** Low (a few `disallow` entries) if the owner decides to split them.

## Applied
- Fixed Next.js 15 breaking change in `app/[username]/layout.tsx`: `params` must be awaited as a `Promise`.
- Added `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`.
- Added `public/humans.txt`; fixed broken placeholder link in `public/llms.txt`.
- Added `BreadcrumbList` JSON-LD to `app/[username]/layout.tsx`.
- Fixed `NEXT_PUBLIC_SITE_URL` fallback (was `localhost:3000`) to the confirmed live deploy `https://githubportifoliogenerator.vercel.app` in `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/[username]/layout.tsx`.
- Added `/octocat` example page to `app/sitemap.ts`.
- Switched the avatar `<img>` in `app/[username]/page.tsx` to `next/image` (LCP element) with `priority` and `next.config.js` `remotePatterns` for `avatars.githubusercontent.com`.
- Changed root wrapper `<div>` to `<main>` landmark in `app/page.tsx` and `app/[username]/page.tsx`.
