// components/SidebarPanel.jsx
// Purpose: Right sidebar with three stacked conversion cards:
//   A — Pro unlock CTA  B — vs. alternatives comparison  C — community quotes
// Key exports: default SidebarPanel
// Props:
//   isPro         — boolean (hides unlock card if already Pro)
//   onUnlockClick — opens ProUnlockModal

import React from 'react';
import { GUMROAD_PRODUCT_URL } from '../constants.js';

// ---------------------------------------------------------------------------
// Card A — Pro unlock
// ---------------------------------------------------------------------------
const PRO_FEATURES = [
  {
    name: 'Full 30-year fan chart',
    desc: 'See every percentile band, no blur',
  },
  {
    name: 'Historical crisis stress tests',
    desc: '1929, 1966, 2000 & 2008 sequences',
  },
  {
    name: '5-scenario comparison table',
    desc: 'Side-by-side with any inputs',
  },
  {
    name: 'Social Security timing tool',
    desc: 'Breakeven analysis: 62 vs 67 vs 70',
  },
  {
    name: 'Roth conversion optimizer',
    desc: 'Fill-the-bracket annual strategy',
  },
  {
    name: 'PDF & CSV export',
    desc: 'Save and share your full report',
  },
];

function ProCard({ onUnlockClick }) {
  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: '#0f1a0f', border: '1px solid #1d3a1d' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Pro Unlock</span>
        <span className="text-xs font-medium tabular" style={{ color: '#f0b429' }}>
          $19 one-time
        </span>
      </div>

      {/* Feature rows */}
      <div className="space-y-2.5">
        {PRO_FEATURES.map(({ name, desc }) => (
          <div key={name} className="flex items-start gap-2.5">
            {/* Green check circle */}
            <svg
              className="flex-shrink-0 mt-0.5"
              width="15" height="15" viewBox="0 0 15 15" fill="none"
            >
              <circle cx="7.5" cy="7.5" r="7.5" fill="#166534" />
              <path
                d="M4.5 7.5L6.5 9.5L10.5 5.5"
                stroke="#4ade80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-gray-200">{name}</span>
              <span className="text-xs text-gray-500"> — {desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        onClick={onUnlockClick}
        className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
        style={{ background: '#f0b429', color: '#000' }}
        onMouseEnter={e => e.currentTarget.style.background = '#d4a017'}
        onMouseLeave={e => e.currentTarget.style.background = '#f0b429'}
      >
        Unlock Pro — $19
      </button>

      {/* Fine print */}
      <p className="text-center text-2xs text-gray-600">
        One-time purchase · No subscription · Instant access
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card B — vs. alternatives comparison table
// ---------------------------------------------------------------------------
const COMPARISON_ROWS = [
  { feature: 'Simulation paths',  others: '1,000',        ours: '10,000'    },
  { feature: 'Crisis stress tests', others: '—',          ours: '4 crises'  },
  { feature: 'Returns used',      others: 'Nominal',      ours: 'Real'      },
  { feature: 'SS timing tool',    others: '—',            ours: 'Included'  },
  { feature: 'Roth optimizer',    others: '—',            ours: 'Included'  },
  { feature: 'Cost',              others: 'Free / $9/mo', ours: '$19 once'  },
];

function ComparisonCard() {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white">vs. free alternatives</h3>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#2a2a2a]">
            <th className="text-left text-gray-600 py-1.5 pr-2 font-medium">Feature</th>
            <th className="text-center text-gray-600 py-1.5 px-2 font-medium">Others</th>
            <th className="text-center py-1.5 pl-2 font-medium" style={{ color: '#4ade80' }}>
              This tool
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map(({ feature, others, ours }, i) => (
            <tr
              key={feature}
              className={`border-b border-[#1a1a1a] ${i % 2 === 1 ? 'bg-[#0d0d0d]' : ''}`}
            >
              <td className="py-2 pr-2 text-gray-400">{feature}</td>
              <td className="py-2 px-2 text-center text-gray-600 tabular">{others}</td>
              <td className="py-2 pl-2 text-center font-medium tabular" style={{ color: '#4ade80' }}>
                {ours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card C — community quotes
// ---------------------------------------------------------------------------
const QUOTES = [
  {
    text: 'Finally a simulator that actually runs the 1929 sequence. The 4% rule looks very different when you see it.',
    source: 'r/financialindependence',
  },
  {
    text: 'The SS timing breakeven alone is worth $19. Saved me hours of spreadsheet work.',
    source: 'r/Bogleheads',
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#f0b429">
          <path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.5 3.5 9l.5-2.9-2-2 2.7-.5z" />
        </svg>
      ))}
    </div>
  );
}

function QuotesCard() {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white">From the community</h3>

      <div className="space-y-4">
        {QUOTES.map(({ text, source }) => (
          <div key={source} className="space-y-2">
            <StarRow />
            <p className="text-xs text-gray-400 italic leading-relaxed">"{text}"</p>
            <p className="text-2xs text-gray-600">— {source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SidebarPanel — main export
// ---------------------------------------------------------------------------
export default function SidebarPanel({ isPro, onUnlockClick }) {
  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 space-y-4">
      {!isPro && <ProCard onUnlockClick={onUnlockClick} />}
      <ComparisonCard />
      <QuotesCard />
    </aside>
  );
}
