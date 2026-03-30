// components/SidebarPanel.jsx
// Purpose: Compact right sidebar — Pro unlock CTA + comparison table.
// Key exports: default SidebarPanel
// Props:
//   isPro         — boolean
//   onUnlockClick — opens ProUnlockModal

import React from 'react';

// ---------------------------------------------------------------------------
// ProCard — compact unlock CTA
// ---------------------------------------------------------------------------
const PRO_FEATURES = [
  'Full 30-year fan chart',
  'Historical crisis stress tests',
  '5-scenario comparison table',
  'Social Security timing tool',
  'Roth conversion optimizer',
  'PDF & CSV export',
];

function ProCard({ onUnlockClick }) {
  return (
    <div className="rounded-xl p-3.5 space-y-3" style={{ background: '#1a2a1a', border: '1px solid #2a3a2a' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#e8e8ec]">Pro Unlock</span>
        <span className="text-xs font-medium tabular text-[#f0b429]">$19 once</span>
      </div>

      <ul className="space-y-1.5">
        {PRO_FEATURES.map((name) => (
          <li key={name} className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
              <circle cx="6.5" cy="6.5" r="6.5" fill="#14532d" />
              <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-2xs text-[#b0b0b8]">{name}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onUnlockClick}
        className="w-full py-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] bg-[#f0b429] hover:bg-[#d4a017] text-black"
      >
        Unlock Pro — $19
      </button>

      <p className="text-center text-2xs text-[#606068]">
        One-time · No subscription
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComparisonCard — compact version
// ---------------------------------------------------------------------------
const COMPARISON_ROWS = [
  { feature: 'Sim paths',        others: '1,000',        ours: '10,000'   },
  { feature: 'Crisis tests',     others: '—',            ours: '4 crises' },
  { feature: 'Returns',          others: 'Nominal',      ours: 'Real'     },
  { feature: 'SS tool',          others: '—',            ours: '✓'        },
  { feature: 'Roth optimizer',   others: '—',            ours: '✓'        },
  { feature: 'Cost',             others: 'Free/$9/mo',   ours: '$19 once' },
];

function ComparisonCard() {
  return (
    <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-3.5 space-y-2.5">
      <h3 className="text-xs font-semibold text-[#e8e8ec]">vs. free alternatives</h3>

      <table className="w-full text-2xs border-collapse">
        <thead>
          <tr className="border-b border-[#3a3a3e]">
            <th className="text-left text-[#606068] py-1.5 pr-2 font-medium">Feature</th>
            <th className="text-center text-[#606068] py-1.5 px-1 font-medium">Others</th>
            <th className="text-center py-1.5 pl-1 font-medium text-[#4ade80]">This</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map(({ feature, others, ours }, i) => (
            <tr
              key={feature}
              className={`border-b border-[#2e2e32] ${i % 2 === 1 ? 'bg-[#1e1e20]' : ''}`}
            >
              <td className="py-1.5 pr-2 text-[#909098]">{feature}</td>
              <td className="py-1.5 px-1 text-center text-[#606068] tabular">{others}</td>
              <td className="py-1.5 pl-1 text-center font-medium tabular text-[#4ade80]">{ours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SidebarPanel — main export
// ---------------------------------------------------------------------------
export default function SidebarPanel({ isPro, onUnlockClick }) {
  return (
    <aside className="hidden lg:flex flex-col w-44 xl:w-52 flex-shrink-0 gap-4">
      {!isPro && <ProCard onUnlockClick={onUnlockClick} />}
      <ComparisonCard />
    </aside>
  );
}
