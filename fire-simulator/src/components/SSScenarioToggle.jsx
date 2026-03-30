// components/SSScenarioToggle.jsx
// Purpose: 3-tab pill switcher for Social Security scenario assumption.
//   No SS — Reduced SS (75% trust fund depletion) — Full SS
//   Free feature. Triggers re-simulation with different SS income offsets.
// Key exports: default SSScenarioToggle
// Props:
//   scenario    — 'none' | 'reduced' | 'full'
//   onChange(s) — called with new scenario id

import React from 'react';

const TABS = [
  {
    id: 'none',
    label: 'No SS',
    description: 'Assume $0 Social Security income — worst-case planning',
    color: 'text-red-400',
    borderActive: 'border-red-400/60',
    bgActive: 'bg-red-400/10',
  },
  {
    id: 'reduced',
    label: 'Reduced SS',
    badge: '75%',
    description: 'SSA projects ~25% cut when trust fund depletes (~2033)',
    color: 'text-amber-400',
    borderActive: 'border-amber-400/60',
    bgActive: 'bg-amber-400/10',
  },
  {
    id: 'full',
    label: 'Full SS',
    badge: '100%',
    description: 'Full projected benefit — optimistic scenario',
    color: 'text-green-400',
    borderActive: 'border-green-400/60',
    bgActive: 'bg-green-400/10',
  },
];

export default function SSScenarioToggle({ scenario, onChange }) {
  const active = TABS.find(t => t.id === scenario) ?? TABS[0];

  return (
    <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#c8c8d0] uppercase tracking-wider">
          Social Security Scenario
        </h3>
        <span className="text-2xs text-[#606068]">Free</span>
      </div>

      {/* Tab pills */}
      <div className="flex gap-1.5 p-1 bg-[#1c1c1e] rounded-lg border border-[#3a3a3e]">
        {TABS.map((tab) => {
          const isActive = tab.id === scenario;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-1.5
                py-1.5 px-2 rounded-md text-xs font-medium
                transition-all duration-150
                ${isActive
                  ? `${tab.bgActive} ${tab.color} border ${tab.borderActive}`
                  : 'text-[#909098] hover:text-[#c8c8d0] border border-transparent hover:bg-[#2a2a2e]'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-2xs opacity-70 ${isActive ? '' : 'hidden sm:inline'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab description */}
      <p className={`text-xs ${active.color} opacity-80`}>
        {active.description}
      </p>
    </div>
  );
}
