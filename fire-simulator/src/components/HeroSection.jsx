// components/HeroSection.jsx
// Purpose: Conversion-focused hero above the simulator.
//   Badge pill → H1 → subheadline → four stat pills.
// Key exports: default HeroSection

import React from 'react';

const STATS = [
  { number: '10,000',   label: 'simulation paths' },
  { number: '97 years', label: 'of historical data' },
  { number: '4 crises', label: 'stress tested' },
  { number: 'Free',     label: 'to start' },
];

export default function HeroSection() {
  return (
    <section className="border-b border-[#1e1e1e] bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">

        {/* Badge pill */}
        <div className="inline-flex items-center gap-2 border border-[#2a2a2a] bg-[#111111] rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
          <span className="text-xs text-gray-400 tracking-wide">
            10,000 simulation paths · real inflation-adjusted returns
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
          Will your money{' '}
          <span style={{ color: '#f0b429' }}>outlive you?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          The only free FIRE simulator that stress-tests your portfolio against the actual
          1929 crash, the dot-com bust, and 2008 — not just average market assumptions.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-6 pt-2">
          {STATS.map(({ number, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white tabular">{number}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
