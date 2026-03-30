# promptinglogic.com — Build Progress

**Last updated:** 2026-03-30 (initial build)
**Overall status:** v1.0 Complete — Ready to deploy

---

## Completed

- [x] `package.json` — Next.js 14, React 18, Tailwind v3, Recharts, jsPDF, html2canvas, Supabase
- [x] `next.config.js` — webpack alias `@fire-sim → ../fire-simulator/src`; allows /fire to import simulator components without duplication
- [x] `tailwind.config.js` — matches fire-simulator design system; includes fire-simulator/src in content paths so all simulator classes compile
- [x] `app/globals.css` — dark theme base styles, scrollbar, tabular class
- [x] `app/layout.jsx` — root layout: Nav + Footer + metadata + OG tags
- [x] `app/page.jsx` — homepage: Hero, Tools grid, Learn teaser, About, Blog teaser, Email capture
- [x] `app/fire/page.jsx` — /fire route: dynamic import of FireSimulatorApp (ssr:false, full simulator)
- [x] `app/learn/page.jsx` — FIRE letter display, 6 FIRE subtype cards, 8-tab education content
- [x] `app/tools/page.jsx` — tools listing (reuses ToolCard)
- [x] `app/blog/page.jsx` — blog index with 4 planned posts preview (coming soon state)
- [x] `app/blog/[slug]/page.jsx` — individual post route (redirects to /blog until posts exist)
- [x] `app/api/subscribe/route.js` — email capture POST: Supabase integration, graceful fallback without env vars
- [x] `components/Nav.jsx` — sticky nav with scroll blur, mobile dropdown, active route highlighting
- [x] `components/Footer.jsx` — links grid, brand, attribution, copyright
- [x] `components/ToolCard.jsx` — product card for live/coming-soon tools
- [x] `components/FireTypeCard.jsx` — FIRE subtype card (name, spend range, target, description)
- [x] `components/FireLetterDisplay.jsx` — hero F-I-R-E letter breakdown (large amber letters)
- [x] `components/EmailCapture.jsx` — client-side email form with Supabase API call
- [x] `components/LearnTabs.jsx` — 8-tab education content panel with key takeaway + common mistake callouts
- [x] `components/FireSimulatorApp.jsx` — 'use client' wrapper importing the simulator via @fire-sim alias
- [x] `lib/toolsData.js` — tool card data (3 tools, live/coming-soon state)
- [x] `lib/learnContent.js` — all 8 tab bodies (4% rule, Monte Carlo, SOR risk, Roth/Trad, stocks/bonds, SS, SWR, FIRE number)
- [x] `vercel.json` — security headers
- [x] Production build verified — `npm run build` succeeds, all 9 routes generated

---

## URL Architecture (permanent)

```
promptinglogic.com/          → homepage
promptinglogic.com/fire      → FIRE simulator (permanent — never moves)
promptinglogic.com/learn     → education hub
promptinglogic.com/tools     → tools listing
promptinglogic.com/blog      → blog index
promptinglogic.com/blog/[slug] → individual posts
```

---

## Deploy Checklist (Vercel)

- [ ] Create new Vercel project pointing to `promptinglogic/` subdirectory
- [ ] Set Root Directory to `promptinglogic` in Vercel settings
- [ ] Add env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [ ] Create Supabase `subscribers` table (SQL in api/subscribe/route.js header)
- [ ] Confirm `promptinglogic.com` domain points to this project (or update DNS)
- [ ] Smoke-test all routes after deploy

---

## Up Next

- [ ] Write and publish first blog post
- [ ] Add Plausible analytics script to layout.jsx
- [ ] Create Supabase project and subscribers table
- [ ] A/B test hero headline
- [ ] Reddit launch posts (r/financialindependence, r/Bogleheads)
