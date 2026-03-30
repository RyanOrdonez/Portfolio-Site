// components/ResultsPanel.jsx
// Purpose: Right-panel results area. Shows placeholder chart before first run.
// Key exports: default ResultsPanel

import React, { useState } from 'react';
import SuccessRate from './SuccessRate.jsx';
import FanChart from './FanChart.jsx';
import UnlockGate from './UnlockGate.jsx';
import StressTests from './StressTests.jsx';
import ScenarioTable from './ScenarioTable.jsx';
import SocialSecurity from './SocialSecurity.jsx';
import RothOptimizer from './RothOptimizer.jsx';
import SSScenarioToggle from './SSScenarioToggle.jsx';
import ExportPanel from './ExportPanel.jsx';
import { formatCurrency } from '../utils/formatters.js';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg px-3 py-2.5">
      <div className="text-2xs text-[#909098] uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-sm font-semibold tabular ${color ?? 'text-[#e8e8ec]'}`}>{value}</div>
      {sub && <div className="text-2xs text-[#606068] mt-0.5">{sub}</div>}
    </div>
  );
}

function PlaceholderState() {
  const lines = [
    { y: '22%', color: '#F97316' },
    { y: '38%', color: '#FBBF24' },
    { y: '52%', color: '#A3E635', width: 2.5 },
    { y: '65%', color: '#38BDF8' },
    { y: '76%', color: '#818CF8' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-5">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 text-center w-[160px]">
            <svg viewBox="0 0 140 100" className="w-full max-w-[160px] mx-auto opacity-20">
              <path
                d="M 16.3 85.4 A 54 54 0 1 1 123.7 85.4"
                fill="none"
                stroke="#3a3a3e"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-1 text-4xl font-bold text-[#3a3a3e] tabular">—%</div>
            <div className="text-xs text-[#505058] mt-1 uppercase tracking-wide">Success Rate</div>
          </div>
          <div className="flex-1 space-y-3 pt-4">
            <p className="text-sm text-[#909098] leading-relaxed">
              Your Monte Carlo results will appear here after you run the simulation.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-amber-400 font-medium bg-amber-400/8 border border-amber-400/20 rounded-lg px-3 py-2">
              <span>←</span>
              <span>Enter your numbers and click Run Simulation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#e8e8ec]">Portfolio Projection</h3>
            <p className="text-2xs text-[#606068] mt-0.5">Real (inflation-adjusted) · percentile bands</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-2xs text-[#505058]">
            {[
              { color: '#F97316', label: '90th' },
              { color: '#FBBF24', label: '75th' },
              { color: '#A3E635', label: '50th' },
              { color: '#38BDF8', label: '25th' },
              { color: '#818CF8', label: '10th' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden" style={{ height: 280 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 240"
            preserveAspectRatio="none"
            className="opacity-15"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0" y1={i * 60}
                x2="600" y2={i * 60}
                stroke="#3a3a3e"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}
            {lines.map(({ y, color, width = 1.5 }) => {
              const py = parseFloat(y) / 100 * 240;
              return (
                <line
                  key={y}
                  x1="0" y1={py}
                  x2="600" y2={py}
                  stroke={color}
                  strokeWidth={width}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#232325]/75 backdrop-blur-[2px]">
            <div className="text-center space-y-3 max-w-xs px-4">
              <div className="text-3xl">🔥</div>
              <h3 className="text-base font-semibold text-[#e8e8ec]">See your FIRE projection</h3>
              <p className="text-xs text-[#909098] leading-relaxed">
                Run the simulation with your portfolio, spending, and retirement goals to see 10,000 Monte Carlo paths.
              </p>
              <p className="text-xs text-[#f0b429] font-medium">← Fill in your inputs on the left</p>
            </div>
          </div>
        </div>

        <p className="text-2xs text-[#505058] mt-2">
          Showing placeholder — run the simulation to see real percentile trajectories.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 opacity-30">
        {['Median Final Portfolio', '10th Percentile', 'Portfolio', 'Annual Spend'].map(label => (
          <div key={label} className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg px-3 py-2.5">
            <div className="text-2xs text-[#909098] uppercase tracking-wide mb-1">{label}</div>
            <div className="text-sm font-semibold text-[#3a3a3e] tabular">—</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
      <svg className="animate-spin h-8 w-8 text-amber-400 opacity-80" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <div>
        <p className="text-sm text-[#b0b0b8]">Running 10,000 simulations…</p>
        <p className="text-xs text-[#606068] mt-1">This takes about 200–500ms</p>
      </div>
    </div>
  );
}

function SaveScenarioBar({ onSave, isPro }) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setSaved(true);
    setName('');
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isPro) return null;

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="Name this scenario…"
        className="flex-1 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ec] placeholder-[#505058] focus:outline-none focus:border-amber-400/40"
      />
      <button
        onClick={handleSave}
        disabled={!name.trim() || saved}
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400/20 transition-colors disabled:opacity-40"
      >
        {saved ? 'Saved ✓' : 'Save Scenario'}
      </button>
    </div>
  );
}

export default function ResultsPanel({
  results,
  inputs,
  isRunning,
  error,
  isPro,
  onUnlockClick,
  scenarios,
  onSaveScenario,
  onRemoveScenario,
  ssScenario,
  onSsScenarioChange,
  resultsRef,
}) {
  if (isRunning) return <LoadingState />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="space-y-4">
        {onSsScenarioChange && (
          <SSScenarioToggle
            scenario={ssScenario ?? 'none'}
            onChange={onSsScenarioChange}
          />
        )}
        <PlaceholderState />
      </div>
    );
  }

  const { successRate, simCount, trajectories, medianFinalValue, worstP10FinalValue } = results;
  const retirementYears = inputs?.retirementYears ?? 30;

  return (
    <div className="space-y-4">
      {onSsScenarioChange && (
        <SSScenarioToggle
          scenario={ssScenario ?? 'none'}
          onChange={onSsScenarioChange}
        />
      )}

      <SuccessRate
        successRate={successRate}
        simCount={simCount}
        inputs={inputs}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Median Final Portfolio"
          value={medianFinalValue > 0 ? formatCurrency(medianFinalValue) : 'Depleted'}
          sub={`at year ${retirementYears}`}
          color={medianFinalValue > 0 ? 'text-[#e8e8ec]' : 'text-red-400'}
        />
        <StatCard
          label="10th Percentile"
          value={worstP10FinalValue > 0 ? formatCurrency(worstP10FinalValue) : 'Depleted'}
          sub="worst 10% outcome"
          color={worstP10FinalValue > 0 ? 'text-sky-300' : 'text-red-400'}
        />
        <StatCard
          label="Portfolio"
          value={formatCurrency(inputs?.portfolioValue)}
          sub="starting value"
        />
        <StatCard
          label="Annual Spend"
          value={formatCurrency(inputs?.annualSpending)}
          sub={`${inputs?.stockAllocation != null ? Math.round(inputs.stockAllocation * 100) : '?'}/${100 - (inputs?.stockAllocation != null ? Math.round(inputs.stockAllocation * 100) : 0)} allocation`}
        />
      </div>

      <FanChart
        trajectories={trajectories}
        retirementYears={retirementYears}
        isPro={isPro}
        onUnlockClick={onUnlockClick}
        currentAge={inputs?.alreadyRetired ? inputs.currentAge : inputs?.retirementAge}
      />

      <SaveScenarioBar onSave={onSaveScenario} isPro={isPro} />

      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Scenario Comparison">
        <ScenarioTable scenarios={scenarios} onRemove={onRemoveScenario} />
      </UnlockGate>

      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Historical Crisis Stress Tests">
        <StressTests
          portfolioValue={inputs?.portfolioValue}
          annualSpending={inputs?.annualSpending}
          stockAllocation={inputs?.stockAllocation}
        />
      </UnlockGate>

      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Social Security Timing Analyzer">
        <SocialSecurity currentAge={inputs?.currentAge} />
      </UnlockGate>

      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Roth Conversion Optimizer">
        <RothOptimizer />
      </UnlockGate>

      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="PDF & CSV Export">
        <ExportPanel results={results} inputs={inputs} resultsRef={resultsRef} />
      </UnlockGate>
    </div>
  );
}
