# FIRE Simulator

> Stress-test your retirement plan with 10,000 Monte Carlo simulations and real historical crisis backtests &mdash; all in your browser, in under half a second.

**Live demo:** _coming soon (Vercel)_
**Author:** Ryan Ordonez &middot; [Portfolio](https://ryanordonez.github.io/Portfolio-Site/)

---

## What It Does

FIRE Simulator is a browser-based retirement calculator designed around the same methodology professional planners use, but rebuilt for FIRE (Financial Independence, Retire Early) practitioners who want to understand how robust their plan actually is.

You enter your current portfolio, annual spending, stock/bond allocation, and age. The engine then:

1. Runs **10,000 Monte Carlo simulations** with correlated stock and bond returns drawn from historical return distributions
2. Backtests your plan against **four real historical crisis sequences**: the 1929 Great Depression, 1966 stagflation, 2000 dot-com bust, and 2008 financial crisis
3. Reports your **success probability**, median and percentile trajectories, worst-case drawdown, and depletion year (if any)
4. Visualizes the result as a fan chart showing the 5th, 25th, 50th, 75th, and 95th percentile portfolio paths across your entire retirement horizon

Every simulation uses **real (inflation-adjusted) returns**, so the spending input represents constant purchasing power &mdash; the model correctly answers "can I maintain my lifestyle?" rather than "can I maintain my nominal dollar amount?"

---

## Methodology

The engine uses published academic methodology, not black-box assumptions. Show-your-work mode is the default.

### Return Generation

Annual returns for stocks and bonds are sampled from correlated normal distributions using the Box-Muller transform and Cholesky decomposition:

```
z0, z1 ~ iid N(0,1)                              [Box-Muller transform]
stockReturn    = mu_s + sigma_s * z0
bondReturn     = mu_b + sigma_b * (rho*z0 + sqrt(1 - rho^2) * z1)   [Cholesky]
portfolioReturn = stockReturn * w_s + bondReturn * (1 - w_s)
```

- `mu_s`, `sigma_s` &mdash; real US equity return (6.8%) and standard deviation (18.1%), sourced from the Dimson/Marsh/Staunton (DMS) global investment returns yearbook
- `mu_b`, `sigma_b` &mdash; real US bond return (2.3%) and standard deviation (7.9%), also DMS
- `rho = -0.05` &mdash; stock/bond correlation over the 1900-2023 window
- `w_s` &mdash; user-chosen stock allocation

### Withdrawal Model

Withdrawals follow the **withdraw-first-then-grow** convention established by the Trinity Study (Bengen, 1994; Cooley, Hubbard, and Walz, 1998):

```
portfolio_0 = initialPortfolio
For year t = 1 ... T:
  portfolio_t = (portfolio_{t-1} - annualSpending) * (1 + r_t)
  if portfolio_t <= 0: mark depleted at year t
successRate = (simulations not depleted) / totalSimulations
```

This matches cFIREsim and other established FIRE backtesting tools. It's slightly more conservative than end-of-year withdrawal, which is the intended behavior for retirement planning.

### Historical Crisis Backtests

In addition to Monte Carlo, the Pro tier replays four specific 30-year sequences taken from actual market history:

| Start Year | Crisis | Worst-Case Drawdown | Recovery Year |
|-----------|--------|---------------------|---------------|
| 1929 | Great Depression | -83% | 1945 |
| 1966 | Stagflation | -55% | 1982 |
| 2000 | Dot-com Bust | -47% | 2013 |
| 2008 | Financial Crisis | -51% | 2013 |

Data is sourced from Shiller's long-running US market dataset and cross-checked against DMS. This tests whether your plan would have survived the actual worst-case scenarios on record, not just simulated ones.

---

## Feature List

### Free Tier
- Monte Carlo simulation (10,000 paths, 2-asset portfolio)
- Success rate gauge and plain-English label
- Fan chart with 5 percentile bands (blurred past year 15)
- Basic stats: depletion year, worst-case trajectory

### Pro Tier
- Full fan chart (no paywall overlay)
- Historical crisis backtests (1929, 1966, 2000, 2008)
- Scenario save and side-by-side comparison (up to 5)
- Social Security timing analyzer (62 vs 67 vs 70, NPV and breakeven)
- Roth conversion optimizer (fill-to-22%-bracket heuristic, 2024 brackets)
- PDF export (planned)

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast iteration, no SSR needed for a pure client app |
| Styling | Tailwind CSS 3 | Utility-first, trivially themeable, zero runtime cost |
| Charts | Recharts 2.12 | Lower complexity than D3 for fan charts with tooltips |
| State | `useState` + `useContext` | No Redux &mdash; MVP scope doesn't justify it |
| Engine | Plain JavaScript in a Web Worker-ready module | 300K random draws in under 500ms on a MacBook Air |
| Persistence | `localStorage` | Saved scenarios and Pro unlock key, no server required |
| Deployment | Vercel | Static SPA rewrites, free SSL, zero config |

All simulation runs client-side. No data leaves the browser. No backend, no telemetry, no analytics.

---

## Architecture

```
fire-simulator/
|-- index.html
|-- package.json
|-- vite.config.js
|-- tailwind.config.js
|-- postcss.config.js
|-- public/
|   `-- favicon.svg
`-- src/
    |-- main.jsx                  # Entry point
    |-- App.jsx                   # Root component, state management
    |-- index.css                 # Tailwind imports, global styles
    |-- constants.js              # Financial constants with citations
    |-- components/
    |   |-- InputForm.jsx         # Portfolio / spending / allocation inputs
    |   |-- ResultsPanel.jsx      # Orchestrates result components
    |   |-- SuccessRate.jsx       # Arc gauge + label
    |   |-- FanChart.jsx          # Recharts percentile fan chart
    |   |-- StressTests.jsx       # Pro: historical crisis backtests
    |   |-- ScenarioTable.jsx     # Pro: side-by-side comparison
    |   |-- SocialSecurity.jsx    # Pro: SS timing NPV analysis
    |   |-- RothOptimizer.jsx     # Pro: Roth conversion ladder heuristic
    |   |-- UnlockGate.jsx        # Paywall wrapper
    |   `-- ProUnlockModal.jsx    # Gumroad key entry
    |-- engine/
    |   `-- monteCarlo.js         # Simulation core, Box-Muller, Cholesky
    |-- data/
    |   `-- historicalReturns.js  # 1929 / 1966 / 2000 / 2008 sequences
    |-- hooks/
    |   `-- useSimulation.js      # Async engine wrapper, stale-run protection
    `-- utils/
        |-- formatters.js         # Currency, percent, age formatters
        `-- unlockKey.js          # Gumroad key validation, localStorage
```

---

## Performance

| Operation | Duration | Notes |
|-----------|----------|-------|
| Single Monte Carlo run (10K x 30 years) | ~350ms | MacBook Air M2, Chrome 125 |
| Single crisis backtest | ~15ms | Deterministic, no RNG |
| All 4 crisis backtests | ~60ms | Sequential, could parallelize |
| Fan chart render (Recharts) | ~80ms | Dominated by SVG rendering |
| Total time: input change -> result visible | ~500ms | Includes debounce + React reconciliation |

The engine is designed to be stable at 10,000 simulations (&plusmn;0.5% at 95% CI). Increasing to 100,000 is straightforward but produces diminishing returns given the inherent uncertainty in future market behavior.

---

## Running Locally

```bash
git clone https://github.com/RyanOrdonez/FIRE-Simulator.git
cd FIRE-Simulator
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. Vite hot-reloads on every save.

### Production Build

```bash
npm run build
npm run preview
```

Output goes to `dist/` &mdash; a fully static bundle (~600 KB gzipped, dominated by Recharts and React). Deploy anywhere that serves static files.

---

## Data Sources and Citations

- **Equity/bond return distributions:** Dimson, Marsh, Staunton &mdash; *Global Investment Returns Yearbook 2024* (Credit Suisse)
- **Historical crisis sequences:** Robert Shiller, *Irrational Exuberance* online data (Yale), cross-checked against DMS
- **Tax brackets / Roth conversion logic:** IRS 2024 published brackets
- **Trinity Study:** Cooley, T.W., Hubbard, C.M., & Walz, D.T. (1998). "Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable." *AAII Journal*.

All constants are centralized in `src/constants.js` with inline source comments. Replacing them with updated data takes one edit.

---

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Simulation count | 10,000 | Stable to &plusmn;0.5% at 95% CI; runs in under 500ms |
| Withdrawal timing | Start-of-year | Trinity Study convention, slightly more conservative |
| Returns | Real (inflation-adjusted) | Spending input stays in constant purchasing power |
| Correlated returns | Cholesky decomposition (2-variable) | Correct for 2-asset stock/bond portfolios |
| State management | `useState` + `useContext` | MVP scope; Redux is over-engineering |
| Chart library | Recharts | Cleaner API than D3 for fan charts with React |
| Paywall implementation | React tree gating, not CSS blur | Non-bypassable &mdash; Pro components never render for free users |

---

## Roadmap

- [ ] Deploy to Vercel with custom domain
- [ ] PDF export (jsPDF + html2canvas) for printable reports
- [ ] CSV download of simulation results
- [ ] International diversification (add global equity as third asset class)
- [ ] Variable spending model (Guyton-Klinger guardrails)
- [ ] Tax-aware withdrawal sequencing (taxable &rarr; tax-deferred &rarr; Roth)
- [ ] Mobile-responsive polish

---

## License

MIT. See `LICENSE` for details.

Built by [Ryan Ordonez](https://ryanordonez.github.io/Portfolio-Site/) &mdash; Data Scientist, M.S. Data Science (CU Boulder).
