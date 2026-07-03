# TODO SEO

> Last updated: 2026-07-03

## Pending Changes

### Avatar (LCP element on every portfolio page) uses unoptimized `<img>`
- **Source:** https://nextjs.org/docs/app/api-reference/components/image + https://www.patterns.dev/react/nextjs-vitals/ — Core Web Vitals (LCP) are a Google ranking factor, and the avatar is the largest above-the-fold image on every `/[username]` page.
- **What:** `app/[username]/page.tsx:195-199` renders `user.avatar_url` (from `avatars.githubusercontent.com`) as a plain `<img>`. Switching to `next/image` gets automatic responsive `srcset`, lazy-loading avoidance via `priority` on this likely-LCP element, and format negotiation (AVIF/WebP).
- **Where:** `app/[username]/page.tsx` (the `<img src={user.avatar_url} .../>` block) + `next.config.js` needs:
  ```js
  images: { remotePatterns: [{ protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/u/**' }] }
  ```
- **Why:** Better LCP score → better Core Web Vitals → indirect ranking benefit, plus real page-load improvement for every generated portfolio.
- **Risk:** `next/image` requires a known/allowlisted remote host (config change) and changes rendering behavior (fixed dimensions, wrapper element) — worth a visual check after switching, especially since `avatar_url` also gets used as the OG/Twitter image for the profile pages (that one should stay a plain URL, only the on-page `<img>` needs to change).
- **Effort:** Low.

### GitHub API rate limit will silently degrade per-user SEO metadata at scale
- **Source:** README.md (project's own note) + https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api — unauthenticated REST calls are capped at 60 requests/hour per IP.
- **What:** `app/[username]/layout.tsx`'s `generateMetadata` calls `https://api.github.com/users/${uname}` unauthenticated. Once crawlers (Googlebot, GPTBot, ClaudeBot, PerplexityBot — all explicitly allowed in `robots.ts`) start requesting many different `/[username]` pages from the same server IP, the 60 req/hour cap will be hit and `fetchGitHubUser` will return `null`, silently falling back to the generic `${uname} | Portfólio` / `Portfólio de ${uname} no GitHub` metadata (loses bio, avatar OG image, canonical structured data) for every page crawled after the limit — exactly when it matters most (bulk indexing).
- **Where:** `app/[username]/layout.tsx:16-26` (`fetchGitHubUser`), same pattern duplicated in `app/[username]/page.tsx:104` (client-side fetch, separate limit bucket but same root cause).
- **Why:** Keeps rich per-user Open Graph/Twitter/JSON-LD metadata intact under real crawl load instead of degrading to boilerplate.
- **Risk:** Requires adding a `GITHUB_TOKEN` (classclassic PAT, no scopes needed for public read) as an env var and passing `Authorization: Bearer ${token}` on the fetch — a config/env change, and the token must be kept server-side only (already is, since this runs in `generateMetadata`/layout, not the client fetch in `page.tsx` which *cannot* safely hold a token). Raises rate limit to 5,000/hour.
- **Effort:** Low-Medium (add env var + one header; decide whether to also move the client-side fetch in `page.tsx` behind a server route to use the same token).

### Sitemap only lists the homepage
- **Source:** https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps — Next's own guidance is sitemaps should include all real content routes.
- **What:** `app/sitemap.ts` returns only `/`. Since `/[username]` pages are generated on-demand for arbitrary GitHub usernames (unbounded set, no local list of "which usernames have been generated"), the sitemap can't enumerate them the normal way.
- **Where:** `app/sitemap.ts`
- **Why:** Low priority — this is expected/correct for a generator tool (there's no canonical list of pages to enumerate), but including the example page already referenced in the UI/README (`/octocat`) would give crawlers at least one concrete portfolio page to index and follow patterns from.
- **Risk:** None if added — it's a real, working page. Judgment call on whether it's worth the one extra sitemap entry.
- **Effort:** Low.

### Design a real Open Graph image (text + branding)
- **Source:** https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- **What:** `app/opengraph-image.png` / `app/icon.png` / `app/apple-icon.png` were auto-generated this pass (blue→purple gradient matching the site's hero gradient, abstract "profile card" mark) purely to fix the previous total absence of a favicon or social preview image. No wordmark/tagline text.
- **Where:** `app/opengraph-image.png`
- **Why:** A version with "GitHub Portfolio Generator" text plus the tagline would convert better on shared links.
- **Risk:** None — visual-only swap.
- **Effort:** Medium (real design pass, not a scripted placeholder).

### Reconsider mixing AI-training bots with AI-search/citation bots in robots.ts
- **Source:** https://nohacks.co/blog/ai-user-agents-landscape-2026 — 2026 guidance splits crawlers into "training" (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) vs. "retrieval/citation" (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and recommends deciding on each independently — e.g. allow citation bots so the site gets referenced in AI answers, while optionally blocking training-only bots if you don't want the data used to train foundation models.
- **What:** `app/robots.ts` currently allows both categories identically (`GPTBot`, `ClaudeBot`, `Google-Extended`, `anthropic-ai` alongside `OAI-SearchBot`).
- **Where:** `app/robots.ts:9-20`
- **Why:** Purely a site-owner policy decision (does Breno want GitHub-derived portfolio content used for model training, or just cited in AI answers?) — not a bug, current setup is a legitimate deliberate choice already, consistent with the same pattern in diffViewer/spotiPaper.
- **Risk:** None technically; this is a values/policy call, not a correctness issue. Not changing without explicit direction since it means selectively disallowing some currently-allowed bots.
- **Effort:** Low (a few `disallow` entries) if the owner decides to split them.

### Pages use `<div>` instead of a `<main>` landmark
- **Source:** https://dev.to/mikevarenek/technical-seo-for-developers-a-25-point-checklist-2b3b (2026) — semantic landmarks (`<main>`, proper heading levels) affect how reliably crawlers/AI parsers identify primary content vs chrome.
- **What:** `app/page.tsx:22` and `app/[username]/page.tsx:188` both wrap the whole page in a plain `<div className="min-h-screen ...">` rather than `<main>`. Heading structure itself is already good (`<h1>`/`<h2>` used correctly).
- **Where:** `app/page.tsx` line 22, `app/[username]/page.tsx` line 188 (root wrapper divs).
- **Why:** Clearer landmark for crawlers/screen readers on what's primary content vs decoration; minor but standard technical-SEO/accessibility win.
- **Risk:** Changing the root element tag can affect existing CSS selectors or test snapshots targeting that div — low risk here since styling is via className, not tag-based selectors, but it's still "modifying existing HTML structure," which this skill's own rules mark as a change to verify rather than auto-apply.
- **Effort:** Low.

## Applied this cycle (for reference)
- Fixed Next.js 15 breaking change in `app/[username]/layout.tsx`: `params` must be awaited as a `Promise` (was still typed as a plain object from the Next 14 API) — this was failing `next build`'s type check outright, meaning the app could not currently ship to production at all. Unrelated to SEO directly, but nothing else in this file matters if the build never ships.
- Added `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` (Next file-convention, auto-wired into `<head>`, verified via build + rendered HTML).
- Added `public/humans.txt`.
- Fixed broken placeholder link in `public/llms.txt` ("Source code: https://github.com" → full repo URL).
- Added `BreadcrumbList` JSON-LD to `app/[username]/layout.tsx` (Home → user) for richer search snippets — pure addition, verified via clean rebuild.
