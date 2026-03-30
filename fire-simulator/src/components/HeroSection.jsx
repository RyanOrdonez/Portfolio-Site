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
            Built for millennials and Gen Z who aren't counting on Social Security
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
          Plan your retirement as if{' '}
          <span style={{ color: '#f0b429' }}>Social Security doesn't exist.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          The SSA projects its trust fund runs out around 2033. If you're under 50, that's during
          your retirement. We built the calculator we wish existed at 25 — honest math, no jargon,
          no government safety net assumed.
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

        {/* Micro-copy below stats */}
        <p className="text-xs text-gray-600 pt-1">
          Less than two lunches. More than a financial advisor would charge for this analysis.
        </p>

      </div>
    </section>
  );
}
