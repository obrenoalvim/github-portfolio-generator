# LinkedIn auto-detect via GitHub social_accounts

## Problem
LinkedIn has no public API for pulling arbitrary profile data (experience,
skills, etc.) without partner approval, and scraping violates its ToS. The
only reliable, official signal available is the LinkedIn URL a user already
added to their GitHub profile's "Social accounts" settings.

## Solution
In `app/[username]/page.tsx`, alongside the existing optional `config`
fetch, fetch `GET https://api.github.com/users/${uname}/social_accounts`
(public, unauthenticated GitHub REST endpoint). Find the entry where
`provider === 'linkedin'` and use its `url`.

Resolve a single `linkedinUrl` before render:
```ts
const linkedinUrl = config?.social?.linkedin
  ? `https://linkedin.com/in/${config.social.linkedin}`
  : autoDetectedLinkedinUrl;
```
Manual `portfolio.json` config always wins; GitHub's social_accounts is
the fallback. The LinkedIn button in the JSX switches from checking
`config?.social?.linkedin` to checking `linkedinUrl`.

## Error handling
Same silent try/catch pattern as the existing config fetch: the endpoint
is optional, a failure (network error, no linkedin entry) just leaves
`linkedinUrl` undefined and the button doesn't render — identical to
today's behavior when no LinkedIn is configured.

## Out of scope
- No regex fallback scanning bio/blog for linkedin.com links.
- No auto-detection of other social_accounts providers (Twitter/X,
  Mastodon, personal site) — LinkedIn only.

## Verification
Manual: run `npm run dev`, load `/:username` for a GitHub user with
LinkedIn set in Social accounts settings (button should appear/link
correctly) and for one without (no button, no crash).
