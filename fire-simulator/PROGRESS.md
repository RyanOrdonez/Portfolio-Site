# FIRE Simulator — Build Progress

**Last updated:** 2026-03-30 (conversion sections)
**Overall status:** MVP Complete — Live at promptinglogic.com

---

## Completed

- [x] Project scaffold — `fire-simulator/` directory structure, `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `public/favicon.svg`
- [x] `src/constants.js` — all financial constants with source citations (Dimson/Marsh/Staunton, IRS 2024)
- [x] `src/engine/monteCarlo.js` — full Monte Carlo engine: Box-Muller transform, Cholesky correlated returns, 10k sim paths, percentile trajectory computation, `runSimulation` + `runCrisisSimulation` exports
- [x] `src/data/historicalReturns.js` — four crisis sequences (1929, 1966, 2000, 2008) with real return data sourced from Shiller/DMS; 30-year sequences each
- [x] `src/utils/formatters.js` — currency, compact currency, percent, year, age, success rate label + color helpers
- [x] `src/utils/unlockKey.js` — Gumroad key validation, localStorage persistence, `validateKey` / `isUnlocked` / `setUnlocked`
- [x] `src/hooks/useSimulation.js` — React hook wrapping the engine with async defer (spinner-before-CPU), stale-run protection via ref ID

---

## Completed (continued)

- [x] `src/main.jsx` + `src/index.css` — entry point, Tailwind imports, dark scrollbar
- [x] `src/App.jsx` — root component, manages simulation state, Pro unlock state, saved scenarios
- [x] `src/components/InputForm.jsx` — full input form: portfolio, spending, age, allocation slider, SWR preview badge, run button with spinner
- [x] `src/components/SuccessRate.jsx` — SVG arc gauge + large % display + plain-English label + stat cards
- [x] `src/components/FanChart.jsx` — Recharts fan chart with 5 percentile bands, paywall overlay at year 15 for free tier, custom tooltip
- [x] `src/components/UnlockGate.jsx` — paywall wrapper: renders children if Pro, otherwise blur + CTA overlay (non-bypassable for non-technical users — children don't render in DOM)
- [x] `src/components/ProUnlockModal.jsx` — Gumroad key entry modal with validation, success/error states, feature list
- [x] `src/components/ResultsPanel.jsx` — orchestrates all result components, handles empty/loading/error states, scenario save bar
- [x] `src/components/StressTests.jsx` — Pro: 4 crisis backtests (1929/1966/2000/2008), survival outcome, max drawdown, progress bar
- [x] `src/components/ScenarioTable.jsx` — Pro: up to 5 saved scenarios side-by-side comparison table
- [x] `src/components/SocialSecurity.jsx` — Pro: SS timing analyzer, NPV comparison 62/67/70, breakeven age computation
- [x] `src/components/RothOptimizer.jsx` — Pro: fill-to-22%-bracket Roth conversion heuristic, 2024 brackets, single/MFJ
- [x] `vercel.json` — SPA rewrites + security headers
- [x] Production build verified — `npm run build` succeeds, 599KB bundle (expected for Recharts + React)

---

## Up Next

- [x] Deployed to Vercel — live at `promptinglogic.com`
- [x] Gumroad product live — `ryanordonez.gumroad.com/l/fire-sim-pro`
- [x] Unlock key `FIRE-PRO-2025` wired in
- [x] Hostinger DNS configured (A record + CNAME → Vercel)
- [x] Conversion sections added: HeroSection, SidebarPanel (Pro card + comparison + quotes), TransparencyStrip
- [x] All commits attributed to Ryan Ordonez (git env vars set globally)
- [ ] PDF export + CSV download (jsPDF + html2canvas already installed — ready to build)
- [ ] Share on r/financialindependence and r/Bogleheads to drive first customers

---

## Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Return calculation order | Withdraw-first, then grow | Matches original Trinity Study / Bengen methodology; more conservative and accurate |
| Normal random generation | Box-Muller transform | Produces true N(0,1); faster than rejection sampling for 10k×30 = 300k draws |
| Correlated returns | Cholesky decomposition (2-variable) | Correct way to model ρ=-0.05 stock/bond correlation; simple to implement for 2 assets |
| Simulation count | 10,000 | Stable to ±0.5% at 95% CI; runs in <500ms on modern hardware |
| Withdrawal timing | Start-of-year | Trinity Study convention; slightly more conservative than end-of-year |
| Historical data source | Shiller data + DMS yearbook | Industry standard for FIRE backtesting; consistent with cFIREsim |
| State management | useState + useContext | No Redux — MVP scope, no need for global state complexity |
| Chart library | Recharts | Lower complexity than D3 for fan chart; good React integration |
| Key validation | Client-side hardcoded list | V1 requirement; upgrade to server-side in V2 if sharing becomes issue |
| Accent color | **AMBER `#F59E0B` (placeholder)** | Pending Ryan's confirmation — see Questions below |
| Fan chart blur | CSS blur + overlay past year 15 | Non-destructive — data is computed but not shown; no paywall bypass |
| Asset classes | 2-asset (stocks + bonds) | MVP scope; adding REITs/international adds complexity without changing UX |

---

## Questions for Ryan

1. **Accent color** — I've used amber `#F59E0B` as a placeholder throughout the UI. This is the most common FIRE-community color (warm, fire-adjacent, wealth-coded). Options:
   - Keep **amber** `#F59E0B` — classic FIRE palette, warm
   - Switch to **cyan** `#06B6D4` — cleaner tech aesthetic
   - Switch to **green** `#10B981` — money-coded, matches success state
   - Something else entirely?
   All accent references are centralized in `tailwind.config.js` under `theme.extend.colors.accent` — one change propagates everywhere.

2. **Gumroad product URL** — currently `#gumroad-link` in `constants.js`. Once you have the product listed on Gumroad, provide the URL and I'll update it.

3. **Real license keys** — `utils/unlockKey.js` currently has `['FIRE-PRO-DEMO-2025']` as placeholder. Provide real Gumroad license keys when ready and I'll add them.

4. **Vercel project name** — for the custom domain setup guide. Will you deploy as a new Vercel project named `fire-simulator` or under your existing Vercel account with a different name?

---

## Hostinger → Vercel Domain Setup

Once you've deployed to Vercel, follow these steps to point `promptinglogic.com` at Vercel:

### Step 1 — Add domain in Vercel
1. Go to your Vercel dashboard → select the fire-simulator project
2. Settings → Domains → Add `promptinglogic.com` and `www.promptinglogic.com`
3. Vercel will show you a **CNAME value** (looks like `cname.vercel-dns.com`) and an **A record IP**

### Step 2 — Update Hostinger DNS
1. Log in to Hostinger → go to **Domains** → `promptinglogic.com` → **DNS / Nameservers**
2. Add/edit the following records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` (Vercel IP — confirm in Vercel dashboard) | 3600 |
| CNAME | www | `cname.vercel-dns.com` | 3600 |

3. If Hostinger is using their own nameservers (not Cloudflare), you edit DNS directly in their panel.
4. DNS propagation takes 10–60 minutes. Vercel auto-issues SSL once it sees the DNS pointing at them.

### Step 3 — Verify
- Visit `https://promptinglogic.com` — should show the FIRE Simulator
- Check `https://www.promptinglogic.com` redirects correctly
- Vercel dashboard → Domains should show a green checkmark

---

## Architecture Notes

### Monte Carlo Math (show your work)

The engine uses **real (inflation-adjusted) returns** throughout. Key equations:

**Correlated return generation (annual):**
```
z0, z1 ~ iid N(0,1)          [Box-Muller]
stockReturn = μ_s + σ_s × z0
bondReturn  = μ_b + σ_b × (ρ×z0 + √(1-ρ²)×z1)   [Cholesky]
portfolioReturn = stockReturn × w_s + bondReturn × (1-w_s)
```

**Year-by-year simulation:**
```
portfolio_0 = initialPortfolio
For year t = 1..T:
  portfolio_t = (portfolio_{t-1} - spending) × (1 + r_t)
  if portfolio_t ≤ 0: depleted at year t
successRate = count(not depleted) / 10000
```

**Why real returns?** Using inflation-adjusted returns means the `spending` input represents constant purchasing power — the model correctly captures "can I maintain my lifestyle?" rather than "can I maintain my nominal dollar amount?"

### File Structure
```
fire-simulator/
├── PROGRESS.md
├── README.md (TODO)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── constants.js          ← financial constants with source citations
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── InputForm.jsx
    │   ├── ResultsPanel.jsx
    │   ├── FanChart.jsx
    │   ├── SuccessRate.jsx
    │   ├── StressTests.jsx       ← Pro
    │   ├── ScenarioTable.jsx     ← Pro
    │   ├── SocialSecurity.jsx    ← Pro
    │   ├── RothOptimizer.jsx     ← Pro
    │   ├── UnlockGate.jsx        ← paywall wrapper
    │   └── ProUnlockModal.jsx    ← key entry modal
    ├── engine/
    │   └── monteCarlo.js
    ├── data/
    │   └── historicalReturns.js
    ├── hooks/
    │   └── useSimulation.js
    └── utils/
        ├── formatters.js
        └── unlockKey.js
```
