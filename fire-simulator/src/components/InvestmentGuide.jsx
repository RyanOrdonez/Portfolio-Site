// components/InvestmentGuide.jsx
// Purpose: Left sidebar — tabbed guide to modern investing approaches.
//   Each tab is a compact info card: what it is, FIRE relevance, typical costs.
// Key exports: default InvestmentGuide

import React, { useState } from 'react';

const TABS = [
  {
    id: '401k',
    label: '401(k)',
    icon: '🏢',
    title: '401(k) / 403(b)',
    subtitle: 'Employer retirement plan',
    body: 'Pre-tax contributions lower your taxable income now. Employer match is free money — always contribute enough to get the full match first. 2025 limit: $23,500 ($31,000 if 50+).',
    fireNote: 'Backdoor to early access: 72(t) SEPP or Roth conversion ladder after leaving employer.',
    metric: '$23,500',
    metricLabel: '2025 limit',
    color: '#60a5fa',
  },
  {
    id: 'ira',
    label: 'IRA',
    icon: '📋',
    title: 'Roth & Traditional IRA',
    subtitle: 'Individual retirement account',
    body: 'Roth: pay tax now, withdrawals tax-free. Traditional: deduct now, pay tax later. 2025 limit: $7,000 ($8,000 if 50+). Income limits apply to Roth — use Backdoor Roth if over.',
    fireNote: 'Roth contributions (not earnings) can be withdrawn penalty-free anytime — useful FIRE bridge before 59½.',
    metric: '$7,000',
    metricLabel: '2025 limit',
    color: '#f0b429',
  },
  {
    id: 'index',
    label: 'Index Funds',
    icon: '📈',
    title: 'Index Funds & ETFs',
    subtitle: 'Passive, low-cost investing',
    body: 'Track a market index (S&P 500, total market, bonds) at near-zero cost. VTI (total US), VXUS (intl), BND (bonds) cover the Bogleheads three-fund portfolio. Expense ratios: 0.03–0.07%.',
    fireNote: 'The bedrock of FIRE portfolios. Low costs compound significantly over 20–30 years — a 1% fee difference costs ~28% of ending wealth.',
    metric: '0.03%',
    metricLabel: 'VTI expense ratio',
    color: '#4ade80',
  },
  {
    id: 'bonds',
    label: 'Bonds',
    icon: '🔒',
    title: 'Bonds',
    subtitle: 'Fixed income & stability',
    body: 'Treasuries, I-Bonds, TIPS, corporate, municipal. Role in portfolio: reduce volatility, provide a buffer to sell in downturns without touching stocks. BND or AGG for broad exposure.',
    fireNote: 'I-Bonds (up to $10k/yr) offer inflation protection with no loss risk — good for the cash portion of your FIRE buffer.',
    metric: '2–5%',
    metricLabel: 'typical real yield',
    color: '#a78bfa',
  },
  {
    id: 'acorns',
    label: 'Acorns',
    icon: '🌰',
    title: 'Acorns — Round-Up Investing',
    subtitle: 'Micro-investing via spare change',
    body: 'Rounds up debit card purchases and invests the difference into diversified ETF portfolios. Costs $3–$5/month. Automated rebalancing. Low barrier to entry.',
    fireNote: 'Good for absolute beginners building the habit. But $3/mo on a $200 portfolio = 18% fee. Migrate to a real brokerage once you hit $1,000+.',
    metric: '$3/mo',
    metricLabel: 'base fee',
    color: '#fb923c',
  },
  {
    id: 'robo',
    label: 'Robo Advisors',
    icon: '🤖',
    title: 'Robo-Advisors',
    subtitle: 'SoFi, Betterment, Wealthfront',
    body: 'Automated portfolio management: builds an ETF portfolio based on your risk tolerance, auto-rebalances, and some offer tax-loss harvesting. Fees: 0–0.25% annually.',
    fireNote: 'SoFi Invest charges 0% — hard to beat. Betterment/Wealthfront at 0.25% is reasonable for hands-off investors. Tax-loss harvesting can add 0.5–1% annually in taxable accounts.',
    metric: '0–0.25%',
    metricLabel: 'annual fee',
    color: '#34d399',
  },
  {
    id: 'fractional',
    label: 'Fractional',
    icon: '🍕',
    title: 'Fractional Shares',
    subtitle: 'Robinhood, Fidelity, Schwab',
    body: 'Buy a slice of a stock for as little as $1. Democratizes access to high-priced stocks (Amazon, Google). Fidelity and Schwab offer fractional shares at $0 commission. Robinhood: $0 but PFOF revenue model.',
    fireNote: 'Best used for DRIP (dividend reinvestment) or index fund dollar-cost averaging. Not a strategy on its own — the underlying portfolio construction matters more.',
    metric: '$1',
    metricLabel: 'minimum buy',
    color: '#f472b6',
  },
  {
    id: 'hsa',
    label: 'HSA',
    icon: '🏥',
    title: 'HSA — Health Savings Account',
    subtitle: 'Triple tax advantage',
    body: 'Contribute pre-tax, grow tax-free, withdraw tax-free for medical expenses. After 65, withdraw for any reason (taxed like Traditional IRA). 2025 limits: $4,300 individual / $8,550 family.',
    fireNote: 'The stealth retirement account. Max it, invest it in index funds, pay medical bills out-of-pocket now, reimburse yourself tax-free later. Requires a High Deductible Health Plan (HDHP).',
    metric: '$4,300',
    metricLabel: '2025 individual limit',
    color: '#22d3ee',
  },
];

export default function InvestmentGuide() {
  const [activeId, setActiveId] = useState('401k');
  const tab = TABS.find(t => t.id === activeId) ?? TABS[0];

  return (
    <aside className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-4 border-b border-[#3a3a3e]">
        <h2 className="text-xs font-bold text-[#e0e0e4] uppercase tracking-widest">
          Investing Guides
        </h2>
        <p className="text-2xs text-[#808088] mt-0.5">Tap any topic</p>
      </div>

      {/* Tab list */}
      <div className="flex flex-col gap-0.5 p-2 border-b border-[#3a3a3e]">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
              t.id === activeId
                ? 'bg-[#3a3a3e] text-white font-medium'
                : 'text-[#909098] hover:text-[#c8c8d0] hover:bg-[#2e2e32]'
            }`}
          >
            <span className="text-sm w-5 text-center flex-shrink-0" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Title */}
        <div>
          <div className="text-sm font-bold text-[#e8e8ec]">{tab.title}</div>
          <div className="text-2xs mt-0.5" style={{ color: tab.color }}>{tab.subtitle}</div>
        </div>

        {/* Metric */}
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ background: `${tab.color}15`, border: `1px solid ${tab.color}30` }}
        >
          <div className="text-xl font-black tabular" style={{ color: tab.color }}>
            {tab.metric}
          </div>
          <div className="text-2xs text-[#909098]">{tab.metricLabel}</div>
        </div>

        {/* Body */}
        <p className="text-xs text-[#b0b0b8] leading-relaxed">{tab.body}</p>

        {/* FIRE relevance */}
        <div className="rounded-lg border border-[#f0b429]/25 bg-[#f0b429]/5 px-3 py-2.5 space-y-0.5">
          <div className="text-2xs font-bold text-[#f0b429] uppercase tracking-wide">🔥 FIRE angle</div>
          <p className="text-xs text-[#c8b870] leading-relaxed">{tab.fireNote}</p>
        </div>
      </div>
    </aside>
  );
}
