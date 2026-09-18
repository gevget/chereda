# Chereda investor demo

Chereda connects a visual event project to every professional who contributed to it. This local investor demo has one Viewer role, a PRO discovery catalog, connected profiles, projects, collections, ratings, and locally saved contact requests. All names, companies, prices, projects and reviews are fictional.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, CSS variables, Roboto Flex Variable, Phosphor Icons, pnpm, Vitest and Playwright. Versions are locked in `pnpm-lock.yaml`.

## Run

```text
pnpm install
pnpm dev
```

Open `http://127.0.0.1:3000`. Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`.

## Structure

- `app/` — App Router entry, layout and system states.
- `components/navigation`, `components/cards`, `components/pages` — app shell and screens.
- `data/seed.ts`, `data/catalog.ts`, `types/domain.ts` — typed local domain and taxonomy.
- `public/media/manifest.json` — local demo media provenance.
- `tests/` — data invariants and browser scenarios.
- `docs/` — source audit, decisions, QA and walkthrough.

## Demo routes

`/` redirects to `/feed?tab=for-you`. Other routes: `/feed`, `/search`, `/pro`, `/pro/[categorySlug]`, `/profiles/[profileSlug]`, `/projects/[projectSlug]`, `/ratings`, `/collections`, `/collections/[collectionSlug]`, `/me`, `/notifications`, `/settings`, `/about`, `/demo`.

Reset Viewer state in `/demo` or `/settings`. Saves, reactions, city, theme and notification read state live in localStorage. Contact requests are stored under `chereda-requests` and are never sent.

## Limitations and media

Current media are unique local abstract SVG demo compositions, not stock photographs or actual professional portfolios. The manifest marks them as `local-generated`; `docs/MEDIA_TODO.md` gives the shot list and approved sources for a future licensed replacement. No backend, booking, payment, or real messaging is connected. The demo runs without external media calls after installation.
