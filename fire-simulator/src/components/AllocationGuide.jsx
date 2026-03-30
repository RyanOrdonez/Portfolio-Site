// components/AllocationGuide.jsx
// Purpose: Interactive allocation guide with 6 age brackets and expandable rationale.
//   Free feature. "Apply to simulator" button updates the main allocation slider via callback.
// Key exports: default AllocationGuide
// Props:
//   currentAge        — number — highlights the matching bracket
//   onApply(pct)      — called with integer stock % (e.g. 85) when user clicks Apply

import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// Allocation brackets
// Stock %: based on Bogleheads three-fund / lifecycle investing principles
// ---------------------------------------------------------------------------
const BRACKETS = [
  {
    label: "20s",
    ageMin: 20, ageMax: 29,
    stockPct: 90,
    headline: "Maximum growth phase — time is your biggest asset.",
    rationale: [
      "You have 35–45 years for compounding to work. A bad year in your 20s recovers fully.",
      "With 90% stocks, you capture the equity premium at its highest possible scale.",
      "Target-date 2060+ funds typically hold 90–95% equities for this bracket.",
    ],
    caution: null,
  },
  {
    label: "30s",
    ageMin: 30, ageMax: 39,
    stockPct: 85,
    headline: "Still in aggressive accumulation — slight diversification begins.",
    rationale: [
      "A 5% bond allocation adds modest stability without meaningfully reducing long-run returns.",
      "Sequence-of-returns risk is still low with 25–35 years to retirement.",
      "Most low-cost lifecycle funds (Vanguard, Fidelity) hold 85–90% equities in your 30s.",
    ],
    caution: null,
  },
  {
    label: "40s",
    ageMin: 40, ageMax: 49,
    stockPct: 75,
    headline: "Mid-accumulation — real sequence risk starts appearing.",
    rationale: [
      "With ~15–25 years to retirement, a major crash now has real impact on your final balance.",
      "A 75/25 portfolio captured 95%+ of equity upside historically while cutting drawdowns significantly.",
      "The Bengen Trinity Study found 75% stocks optimal for 30-year retirement periods.",
    ],
    caution: null,
  },
  {
    label: "50s",
    ageMin: 50, ageMax: 59,
    stockPct: 65,
    headline: "Pre-retirement glide path — protect against the worst decade timing.",
    rationale: [
      "The 10 years before retirement are the highest sequence-of-returns risk window.",
      "Retiring into a crash with 90% stocks can permanently impair your portfolio.",
      "65/35 allows continued growth while reducing the variance of your retirement entry point.",
    ],
    caution: "Don't overreact to headlines — staying too conservative in your 50s is a bigger risk than being too aggressive.",
  },
  {
    label: "60s",
    ageMin: 60, ageMax: 69,
    stockPct: 50,
    headline: "Transition to income — balance growth against depletion risk.",
    rationale: [
      "Early retirement years are when sequence risk bites hardest. A 50/50 split gives breathing room.",
      "Bonds now serve as a 'buffer' — sell bonds when stocks are down, let equities recover.",
      "Most retirees need portfolios to last 25–30 years, so zero stocks isn't safe either.",
    ],
    caution: "Consider a bucket strategy: 1–2 years expenses in cash, bonds for years 3–10, rest in stocks.",
  },
  {
    label: "70s+",
    ageMin: 70, ageMax: 120,
    stockPct: 40,
    headline: "Preservation mode — but maintain inflation hedge.",
    rationale: [
      "You still need returns above inflation — 100% bonds can slowly deplete a 20-year horizon.",
      "A 40% stock allocation provides an inflation hedge without high volatility.",
      "Research (Pfau/Kitces) suggests a 'rising equity glidepath' in retirement can improve outcomes.",
    ],
    caution: "If you have significant pension or Social Security income, you can afford more equity exposure.",
  },
];

// ---------------------------------------------------------------------------
// BracketRow — single expandable row
// ---------------------------------------------------------------------------
function BracketRow({ bracket, isCurrent, onApply }) {
  const [open, setOpen] = useState(false);
  const bondPct = 100 - bracket.stockPct;

  return (
    <div className={`border rounded-lg transition-all ${
      isCurrent
        ? 'border-amber-400/40 bg-amber-400/5'
        : 'border-[#2a2a2a] bg-[#111111]'
    }`}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        {/* Age label */}
        <div className="w-10 text-center">
          <div className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : 'text-gray-400'}`}>
            {bracket.label}
          </div>
          {isCurrent && (
            <div className="text-2xs text-amber-400/70 mt-0.5">You</div>
          )}
        </div>

        {/* Allocation bar */}
        <div className="flex-1 space-y-1">
          <div className="flex gap-0 rounded-full overflow-hidden h-2.5">
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${bracket.stockPct}%` }}
            />
            <div
              className="bg-sky-600 transition-all"
              style={{ width: `${bondPct}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs tabular">
            <span className="text-amber-400/80">{bracket.stockPct}% Stocks</span>
            <span className="text-sky-400/80">{bondPct}% Bonds</span>
          </div>
        </div>

        {/* Headline + chevron */}
        <div className="hidden sm:block flex-1 text-xs text-gray-500 truncate mx-2">
          {bracket.headline}
        </div>

        {/* Apply button — visible even when collapsed */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onApply(bracket.stockPct); }}
          className={`text-2xs font-medium px-2.5 py-1 rounded-md border transition-colors flex-shrink-0 ${
            isCurrent
              ? 'border-amber-400/50 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20'
              : 'border-[#3a3a3a] bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-gray-500'
          }`}
        >
          Apply
        </button>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded rationale */}
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-[#2a2a2a] space-y-2">
          <p className="text-xs text-gray-300 font-medium">{bracket.headline}</p>
          <ul className="space-y-1">
            {bracket.rationale.map((point, i) => (
              <li key={i} className="text-xs text-gray-500 flex gap-2">
                <span className="text-amber-400/60 mt-0.5 flex-shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {bracket.caution && (
            <div className="flex gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-2">
              <span className="text-amber-400 text-sm flex-shrink-0">!</span>
              <p className="text-2xs text-gray-500">{bracket.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AllocationGuide — main component
// ---------------------------------------------------------------------------
export default function AllocationGuide({ currentAge, onApply }) {
  const [appliedPct, setAppliedPct] = useState(null);

  const handleApply = (pct) => {
    setAppliedPct(pct);
    onApply(pct);
    setTimeout(() => setAppliedPct(null), 2000);
  };

  return (
    <section className="border-t border-[#1e1e1e] bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Allocation by Age</h2>
            <span className="text-xs text-gray-600 border border-[#2a2a2a] px-2 py-0.5 rounded-full">
              interactive guide
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Evidence-based stock/bond splits by decade. Click any row to see the rationale.
            Hit "Apply" to update the simulator instantly.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 rounded-sm bg-amber-400" />
            <span>Stocks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 rounded-sm bg-sky-600" />
            <span>Bonds</span>
          </div>
          {currentAge && (
            <div className="flex items-center gap-1.5 text-amber-400/70">
              <span className="w-3 h-2 rounded-sm border border-amber-400/50 inline-block" />
              <span>Your bracket</span>
            </div>
          )}
        </div>

        {/* Bracket rows */}
        <div className="space-y-2">
          {BRACKETS.map((bracket) => {
            const isCurrent = currentAge != null
              && currentAge >= bracket.ageMin
              && currentAge <= bracket.ageMax;
            return (
              <BracketRow
                key={bracket.label}
                bracket={bracket}
                isCurrent={isCurrent}
                onApply={handleApply}
              />
            );
          })}
        </div>

        {/* Applied toast */}
        {appliedPct !== null && (
          <div className="text-center text-xs text-green-400 font-medium animate-pulse">
            {appliedPct}% stocks applied to simulator — click "Run Simulation" to update results
          </div>
        )}

        {/* Footnote */}
        <p className="text-2xs text-gray-700 text-center">
          These are general guidelines, not personalized financial advice.
          Your optimal allocation depends on risk tolerance, income stability, and time horizon.
        </p>
      </div>
    </section>
  );
}
