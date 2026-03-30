// lib/learnContent.js
// Purpose: All 8 education tab bodies as plain JS constants.
//   Content is accurate, plain-English, and written for a financially curious 25-year-old.
//   No placeholder text — these are the real articles.
// Key exports: LEARN_TABS (array), LEARN_TABS_MAP (object keyed by id)

export const LEARN_TABS = [
  {
    id: 'four-percent-rule',
    label: 'The 4% Rule',
    keyTakeaway:
      'The 4% rule is a historical guideline, not a guarantee — it survived 95%+ of 30-year periods in backtesting, but some periods failed.',
    commonMistake:
      'Assuming 4% is safe for 40–50 year retirements. Longer horizons need 3.3–3.5% to maintain similar safety.',
    body: `The 4% rule comes from a 1994 paper by financial planner William Bengen. He studied historical US stock and bond returns going back to 1926 and asked a simple question: what's the highest withdrawal rate that would have survived every 30-year retirement period in the historical record?

His answer was 4.15% — later rounded to 4% and confirmed by the 1998 Trinity Study, which tested the same idea across a range of stock/bond allocations. The rule means this: in your first year of retirement, withdraw 4% of your portfolio. Every year after, adjust that dollar amount for inflation. Don't recalculate each year based on current portfolio value.

For a $1,000,000 portfolio, that's $40,000 in year one. If inflation is 3%, year two is $41,200. And so on. The portfolio doesn't need to survive forever — the original research tested 30-year windows, matching a typical retirement of age 65 to 95.

Across every 30-year period in US history, a 50/50 or 75/25 stock/bond portfolio using the 4% rule had a success rate above 95%. The failure periods clustered around the late 1960s, when retirees hit both high inflation and poor equity returns simultaneously — a brutal combination.

There are real limits to this rule. It was derived from US data only — the US had an unusually good 20th century. Applied globally, the safe rate drops to about 3.5%. It assumes a static withdrawal — real retirees spend more in early retirement ("go-go years") and less later. And critically, it was designed for 30 years, not 40 or 50. Early retirees in their 40s using 4% face meaningfully higher failure rates.`,
    ctaText: 'Test your withdrawal rate →',
    ctaHref: '/fire',
  },
  {
    id: 'monte-carlo',
    label: 'Monte Carlo Explained',
    keyTakeaway:
      'A 90% success rate means 10% of simulated retirements ran out of money — not that yours will be fine.',
    commonMistake:
      'Treating a high success rate as a guarantee rather than a probability. 85% success means 1 in 7 simulated retirements failed.',
    body: `A Monte Carlo simulation is a method for modeling uncertainty by running thousands of random scenarios and measuring how often an outcome occurs. In retirement planning, it answers: given realistic randomness in stock and bond returns, how often does your portfolio survive?

A straight-line projection says "stocks return 7% per year" and calculates a clean curve. The problem is that returns don't arrive smoothly. You get +32% one year, -18% the next. That volatility matters enormously — especially in early retirement when you're withdrawing money. Monte Carlo captures that randomness by simulating each year's return as a random draw from a realistic distribution, then running thousands of such simulations.

In this simulator, each of the 10,000 paths represents a plausible retirement. Each year, returns are drawn from a correlated distribution: stock and bond returns are slightly negatively correlated (around -0.05), which is historically accurate. The simulation uses real (inflation-adjusted) returns — so all numbers already account for inflation without requiring a separate adjustment.

The "success rate" is simply the percentage of simulations where the portfolio lasted the full retirement period without hitting zero. An 85% success rate means 8,500 out of 10,000 simulated retirements ended with money remaining. 1,500 ran out.

The fan chart shows percentile bands: the 10th, 25th, 50th (median), 75th, and 90th percentiles. At any given year, 10% of simulations are below the bottom band and 10% are above the top. The wide spread is the honest picture — your actual outcome will be somewhere in that range, determined by the sequence of returns you actually experience.`,
    ctaText: 'Run 10,000 simulations →',
    ctaHref: '/fire',
  },
  {
    id: 'sequence-of-returns',
    label: 'Sequence of Returns Risk',
    keyTakeaway:
      'Sequence of returns risk is why people with enough money on paper still run out — the math of early losses while withdrawing is devastating.',
    commonMistake:
      'Looking only at average returns, not the sequence. Two portfolios can have identical 30-year average returns and completely different outcomes depending on when the bad years hit.',
    body: `Sequence of returns risk is the danger that poor investment returns early in retirement permanently damage your portfolio — even if long-run average returns are good. It's one of the most underappreciated risks in retirement planning.

Here's why order matters. Suppose you retire with $1,000,000 and withdraw $40,000 per year. Consider two scenarios with identical 30-year average returns:

Scenario A: Year 1 returns -30%, years 2–30 average +9%.
Scenario B: Years 1–29 average +9%, year 30 returns -30%.

In Scenario A, your $1M drops to $670,000 in year one before you've had time to recover. You then withdraw $40,000 from a battered base. The portfolio never fully catches up, and by year 15–20 it's often depleted. In Scenario B, you've been growing for 29 years before the crash. A -30% hit late in retirement barely matters — you likely have far more than you started with.

The same arithmetic applies to any sequence. Withdrawals during a downturn lock in losses. When the market recovers, it's recovering on a smaller balance. This is called the "dollar-weighted" versus "time-weighted" return problem — a 50% loss requires a 100% gain just to break even, but you're making that gain on a portfolio already diminished by withdrawals.

The window of highest risk is roughly 5 years before and 5 years after retirement — sometimes called the "retirement red zone." A crash in this decade can permanently impair even a well-funded retirement. The standard mitigations are: (1) reducing equity exposure in the years approaching retirement (a glide path), (2) maintaining a cash or short-bond buffer of 1–2 years of expenses so you don't sell stocks in a downturn, and (3) income sources like Social Security or a pension that reduce the portfolio withdrawal regardless of market conditions.`,
    ctaText: 'See sequence risk in your scenario →',
    ctaHref: '/fire',
  },
  {
    id: 'roth-vs-traditional',
    label: 'Roth vs. Traditional IRA',
    keyTakeaway:
      'Under 40 with income under ~$100k? Almost always Roth — you\'re likely in your lowest tax bracket of your career.',
    commonMistake:
      'Defaulting to Traditional because the deduction feels good now, without modeling what retirement distributions will actually be taxed at — which is often higher than expected once RMDs kick in.',
    body: `Both Roth and Traditional IRAs let your money grow tax-deferred inside the account. The difference is when you pay tax: Traditional gives you a deduction now and taxes withdrawals later. Roth gives you no deduction now, but withdrawals in retirement are completely tax-free.

The 2025 contribution limit is $7,000 per year ($8,000 if you're 50 or older). That's a combined limit — you can split between Roth and Traditional, but the total can't exceed $7,000.

Roth IRAs have income limits. Single filers start phasing out at $150,000 AGI and can't contribute directly above $165,000. Married filing jointly phases out from $236,000 to $246,000. Above the limit, you can still use the "Backdoor Roth" strategy: contribute to a non-deductible Traditional IRA, then immediately convert to Roth. No income limit applies to conversions.

Traditional IRA deductibility depends on whether you have a workplace retirement plan (401k, 403b, etc.). If neither you nor your spouse has one, Traditional contributions are always fully deductible regardless of income. If you do have a workplace plan, the deduction phases out at lower income levels.

The decision rule is simple: compare your current marginal tax rate to your expected retirement tax rate. If you expect to pay less tax in retirement (lower income, lower bracket), Traditional wins — you defer at a high rate and pay at a low rate. If you expect to pay more in retirement (more income, higher rates, large RMDs), Roth wins.

Traditional IRAs have Required Minimum Distributions (RMDs) starting at age 73 — you must withdraw a percentage each year whether you want to or not. Roth IRAs have no RMDs. This flexibility is valuable: Roth money can sit and compound indefinitely, and it doesn't push up your taxable income in ways that trigger higher Medicare premiums or Social Security taxation.`,
    ctaText: 'Use the IRA calculator →',
    ctaHref: '/fire',
  },
  {
    id: 'stocks-vs-bonds',
    label: 'Stocks vs. Bonds by Age',
    keyTakeaway:
      'Going all bonds is actually riskier long-term than a balanced portfolio for a 30-year retirement — inflation will quietly erode a fixed-income-heavy portfolio.',
    commonMistake:
      'Following the "age in bonds" rule (e.g., age 45 = 45% bonds). It makes you 10–15% too conservative for most situations and leaves significant long-run return on the table.',
    body: `The classic "age in bonds" rule — hold a percentage of bonds equal to your age — was designed for an era of shorter retirements, higher bond yields, and more predictable Social Security. For a 40-year-old today with a 45+ year investment horizon and uncertain SS income, it's far too conservative.

Modern research supports a higher equity allocation for most people, with a gradual "glide path" toward bonds as you approach and enter retirement. The reason isn't just returns — it's the specific risk profile of each life stage.

In your 20s and 30s, you have two crucial advantages: time and future earning power. A 50% crash in year 3 of investing is painful, but you have 35 more years of compounding and contributions ahead of you. The right move is to maximize equity exposure (90/10 or 85/15) and let the equity premium work.

In your 40s, sequence risk begins to matter. You have fewer years to recover from a major crash before retirement. A 75/25 allocation captures most equity upside while meaningfully reducing variance. This is also when you should start thinking about your "retirement entry point" — you don't want to hit your target number and immediately face a 40% market drop.

In your 50s and into early retirement, protecting the retirement entry point becomes critical. The glide path shifts to 65/35 and eventually 50/50. Bonds serve a specific purpose here: they're not primarily for return — they're a liquidity buffer so you don't have to sell stocks at a loss to fund withdrawals.

In your 70s, 40/60 or even 35/65 is reasonable, but going to 100% bonds or cash is a mistake. A 75-year-old in good health may live another 20+ years. A pure fixed-income portfolio, after inflation, often loses real purchasing power over that horizon. You still need some equity exposure.

Evidence-based allocations by decade: 20s: 90/10, 30s: 85/15, 40s: 75/25, 50s: 65/35, 60s: 50/50, 70s+: 40/60.`,
    ctaText: 'Apply allocation to your simulation →',
    ctaHref: '/fire',
  },
  {
    id: 'social-security',
    label: 'Social Security Planning',
    keyTakeaway:
      'Claiming at 70 vs. 62 can mean 76% more in monthly benefits — but only if you live past the breakeven age, which is roughly 80 for most people.',
    commonMistake:
      'Claiming at 62 for "certainty" without running the breakeven math. For anyone in average health, waiting pays off significantly — especially given the 2033 trust fund projection makes early claiming riskier, not safer.',
    body: `Social Security benefits are calculated based on your 35 highest-earning years, adjusted for wage inflation. The result is your Primary Insurance Amount (PIA) — what you receive if you claim at your Full Retirement Age (FRA), currently 67 for anyone born after 1960.

Claiming age has a dramatic impact on your monthly benefit. Claim at 62 (the earliest allowed) and you receive 70% of your PIA. Claim at 67 (FRA) and you get 100%. Wait until 70 and you receive 124%. That 70% vs. 124% gap is a 76% difference in monthly income for the rest of your life. For someone with a $2,000/month FRA benefit, that's $1,400/month at 62 vs. $2,480/month at 70.

The breakeven analysis determines whether waiting pays off. If you claim at 62 vs. 67, you start getting checks 5 years earlier. But those checks are smaller. The "breakeven age" is when the cumulative lifetime benefits from waiting overtake those from claiming early. For most people, breakeven between 62 and 67 falls around age 78–79. Between 67 and 70, it falls around age 82–83. If you expect to live past those ages — which most people in average health do — waiting tends to produce better lifetime value.

There's also the inflation angle. Social Security benefits are indexed for inflation (COLA). A higher starting benefit means a larger inflation-adjusted base for the rest of your life. The value of this compounding is often underestimated.

The wild card is the 2024 Social Security Trustees Report. It projects the combined trust funds will be depleted around 2033. After that, incoming payroll taxes would cover about 77% of promised benefits — meaning roughly a 23% across-the-board cut unless Congress acts. This isn't speculation; it's the SSA's own projection. Planning with zero or reduced Social Security income is prudent, not pessimistic.`,
    ctaText: 'Model SS scenarios in simulator →',
    ctaHref: '/fire',
  },
  {
    id: 'swr',
    label: 'Safe Withdrawal Rate',
    keyTakeaway:
      'The longer your expected retirement, the lower your safe withdrawal rate needs to be — a 40-year retirement at 4% has meaningfully higher failure rates than a 30-year one.',
    commonMistake:
      'Using 4% for a 40–50 year FIRE retirement without adjusting for the longer time horizon. Early retirees should use 3.3–3.5% as their baseline.',
    body: `Safe withdrawal rate (SWR) is the general concept; 4% is one specific data point within it. The SWR is the maximum percentage of your portfolio you can withdraw annually — inflation-adjusted — without running out of money over a given time horizon, at a given success probability.

That "given time horizon" part is crucial. The 4% rule was derived from 30-year retirements. Extend the horizon and the safe rate drops:

- 30 years: ~4.0% at 95% historical success
- 35 years: ~3.8%
- 40 years: ~3.5%
- 50 years: ~3.3%

These numbers shift based on asset allocation as well. A 100% stock portfolio actually has a slightly higher SWR for very long horizons than a 60/40 portfolio — because bonds reduce long-run returns more than they reduce failure risk for 40+ year windows. However, the volatility of an all-stock portfolio is brutal in early retirement, so the optimal allocation is a balance, not an extreme.

The SWR also depends on your flexibility. A truly rigid withdrawal — same inflation-adjusted dollar amount every year no matter what the market does — is conservative by design. Real retirees adjust. If the market drops 40%, most people cut spending. Dynamic withdrawal strategies (like the "guardrails" approach by Guyton-Klinger) can use a higher initial rate precisely because they build in spending cuts during downturns.

For FIRE planning specifically — if you retire at 45 — you're looking at a 45+ year horizon. The standard 4% rule was not designed for you. The research-backed baseline for early retirement is 3.3–3.5%, which implies a FIRE number of 28–30x annual spending rather than the commonly cited 25x. That's a meaningful difference: at $50,000/year spending, you need $1.65M instead of $1.25M.`,
    ctaText: 'Model your withdrawal rate →',
    ctaHref: '/fire',
  },
  {
    id: 'fire-number',
    label: 'What Is a FIRE Number?',
    keyTakeaway:
      'Your FIRE number is not $1M or $2M — it\'s exactly (your annual spend ÷ your chosen SWR), adjusted for any guaranteed income like Social Security or a pension.',
    commonMistake:
      'Using someone else\'s FIRE number. The number is meaningless without your specific spending level and withdrawal rate. A $1M target for someone spending $60k/year is dangerously underfunded.',
    body: `Your FIRE number is the portfolio size at which your investments generate enough returns to fund your spending indefinitely (or for your intended retirement period). The formula is simple:

FIRE Number = Annual Spending ÷ Safe Withdrawal Rate

At 4% SWR: you need 25x your annual spending.
At 3.5% SWR: you need ~28.6x your annual spending.
At 3.3% SWR: you need ~30x your annual spending.

The multiplier (25x, 28x, 30x) is just the inverse of the SWR. This is sometimes called the "FIRE multiple" or the "portfolio multiple."

Examples at different spending levels:

$30,000/year: $750k (4%) | $857k (3.5%) | $909k (3.3%)
$50,000/year: $1.25M (4%) | $1.43M (3.5%) | $1.52M (3.3%)
$80,000/year: $2.0M (4%) | $2.29M (3.5%) | $2.42M (3.3%)
$120,000/year: $3.0M (4%) | $3.43M (3.5%) | $3.64M (3.3%)

The spending figure is the most important input. A 10% reduction in spending reduces your FIRE number by 10% — but it also means you're saving more each year, so you reach the number faster. Spending is a lever on both sides.

Guaranteed income changes everything. If you expect $24,000/year in Social Security at age 67, your portfolio only needs to cover the gap: if you spend $50,000 and SS covers $24,000, your portfolio needs to generate $26,000. Your FIRE number drops to $650k instead of $1.25M (at 4%). This is why the SS planning component of this simulator matters — the difference between planning with and without Social Security can be $500k–$800k in required portfolio size.

Your FIRE number is also personal to your risk tolerance. Someone comfortable with a 75% success rate can use a higher withdrawal rate — their number is lower. Someone who needs 95%+ certainty uses a lower rate — their number is higher. Neither is wrong; it's a tradeoff between how much you save and how much risk you accept.`,
    ctaText: 'Calculate your FIRE number →',
    ctaHref: '/fire',
  },
];

// Map by id for O(1) lookup
export const LEARN_TABS_MAP = Object.fromEntries(LEARN_TABS.map(t => [t.id, t]));
