// components/TransparencyStrip.jsx
// Purpose: Full-width bottom section showing methodology, data sources, and trust signals.
//   Builds credibility with the financially literate FIRE audience.
// Key exports: default TransparencyStrip

import React from 'react';

// ---------------------------------------------------------------------------
// Column component — reusable card for each of the three columns
// ---------------------------------------------------------------------------
function Column({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-[#909098] uppercase tracking-widest">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TransparencyStrip
// ---------------------------------------------------------------------------
export default function TransparencyStrip() {
  return (
    <section className="bg-[#1c1c1e] border-t border-[#3a3a3e] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1 — How the math works */}
          <Column title="How the math works">
            <ul className="space-y-1.5 text-xs text-[#909098]">
              {[
                'Real stock returns: mean 7.0%, std dev 17.0%',
                'Real bond returns: mean 2.3%, std dev 8.0%',
                'Stock/bond correlation: −0.05',
                '10,000 correlated random-normal paths',
                'Box-Muller transform + Cholesky decomposition',
                'Withdraw-first convention (Trinity Study methodology)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#505058] mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Column>

          {/* Column 2 — Data sources */}
          <Column title="Data sources">
            <ul className="space-y-1.5 text-xs text-[#909098]">
              {[
                'Shiller CAPE data — US equities 1871–2023',
                'Ibbotson SBBI — US bond returns series',
                'Historical crisis sequences hand-verified',
                'SS calculations per SSA.gov methodology',
                'Roth brackets per IRS Rev. Proc. 2023-34',
                'Cross-checked against cFIREsim & portfoliovisualizer',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#505058] mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Column>

          {/* Column 3 — Trust signals */}
          <Column title="Trust signals">
            {/* Pill badges */}
            <div className="flex flex-wrap gap-2">
              {[
                'No account needed',
                'No data stored',
                'Runs in your browser',
              ].map(badge => (
                <span
                  key={badge}
                  className="text-xs border border-[#3a3a3e] text-[#b0b0b8] px-2.5 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
            {/* Dot list */}
            <ul className="space-y-1.5 text-xs text-[#909098] mt-2">
              <li className="flex items-start gap-2">
                <span style={{ color: '#4ade80' }} className="mt-0.5">•</span>
                <span>Built by a data scientist (MS, CU Boulder)</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#4ade80' }} className="mt-0.5">•</span>
                <span>Open methodology — all assumptions documented above</span>
              </li>
            </ul>
          </Column>

        </div>
      </div>
    </section>
  );
}
