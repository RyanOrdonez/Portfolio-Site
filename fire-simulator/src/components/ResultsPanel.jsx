// components/ResultsPanel.jsx
// Purpose: Right-panel results area. Orchestrates all result components:
//   SuccessRate, FanChart, StressTests, ScenarioTable, SocialSecurity,
//   RothOptimizer. Handles empty/loading/error states.
// Key exports: default ResultsPanel
// Props:
//   results          — simulation results object (null if not yet run)
//   inputs           — inputs used for last run
//   isRunning        — boolean
//   error            — string | null
//   isPro            — boolean
//   onUnlockClick    — opens paywall modal
//   scenarios        — saved scenarios array
//   onSaveScenario   — saves current scenario
//   onRemoveScenario — removes a saved scenario

import React, { useState } from 'react';
import SuccessRate from './SuccessRate.jsx';
import FanChart from './FanChart.jsx';
import UnlockGate from './UnlockGate.jsx';
import StressTests from './StressTests.jsx';
import ScenarioTable from './ScenarioTable.jsx';
import SocialSecurity from './SocialSecurity.jsx';
import RothOptimizer from './RothOptimizer.jsx';
import { formatCurrency } from '../utils/formatters.js';

// ---------------------------------------------------------------------------
// StatCard — compact metric display
// ---------------------------------------------------------------------------
function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5">
      <div className="text-2xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-sm font-semibold tabular ${color ?? 'text-white'}`}>{value}</div>
      {sub && <div className="text-2xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState — shown before first simulation run
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
      <div className="text-5xl opacity-30">📊</div>
      <div>
        <h3 className="text-sm font-medium text-gray-400">No simulation run yet</h3>
        <p className="text-xs text-gray-600 mt-1">
          Fill in your inputs on the left and click "Run Simulation →"
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoadingState — shown while simulation executes
// ---------------------------------------------------------------------------
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
      <svg className="animate-spin h-8 w-8 text-amber-400 opacity-80" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <div>
        <p className="text-sm text-gray-400">Running 10,000 simulations…</p>
        <p className="text-xs text-gray-600 mt-1">This takes about 200–500ms</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SaveScenarioBar — lets Pro users name and save the current run
// ---------------------------------------------------------------------------
function SaveScenarioBar({ onSave, isPro, onUnlockClick }) {
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
        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/40"
      />
      <button
        onClick={handleSave}
        disabled={!name.trim() || saved}
        className="text-xs font-medium px-3 py-1.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400/20 transition-colors disabled:opacity-40"
      >
        {saved ? 'Saved ✓' : 'Save Scenario'}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResultsPanel — main component
// ---------------------------------------------------------------------------
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
}) {
  if (isRunning) return <LoadingState />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }
  if (!results) return <EmptyState />;

  const { successRate, simCount, trajectories, medianFinalValue, worstP10FinalValue } = results;
  const retirementYears = inputs?.retirementYears ?? 30;

  return (
    <div className="space-y-4">
      {/* Success rate — top hero */}
      <SuccessRate
        successRate={successRate}
        simCount={simCount}
        inputs={inputs}
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Median Final Portfolio"
          value={medianFinalValue > 0 ? formatCurrency(medianFinalValue) : 'Depleted'}
          sub={`at year ${retirementYears}`}
          color={medianFinalValue > 0 ? 'text-white' : 'text-red-400'}
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

      {/* Fan chart */}
      <FanChart
        trajectories={trajectories}
        retirementYears={retirementYears}
        isPro={isPro}
        onUnlockClick={onUnlockClick}
        currentAge={inputs?.alreadyRetired ? inputs.currentAge : inputs?.retirementAge}
      />

      {/* Save scenario bar (Pro only) */}
      <SaveScenarioBar
        onSave={onSaveScenario}
        isPro={isPro}
        onUnlockClick={onUnlockClick}
      />

      {/* --- Pro features --- */}

      {/* Scenario comparison table */}
      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Scenario Comparison">
        <ScenarioTable
          scenarios={scenarios}
          onRemove={onRemoveScenario}
        />
      </UnlockGate>

      {/* Historical crisis stress tests */}
      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Historical Crisis Stress Tests">
        <StressTests
          portfolioValue={inputs?.portfolioValue}
          annualSpending={inputs?.annualSpending}
          stockAllocation={inputs?.stockAllocation}
        />
      </UnlockGate>

      {/* Social Security timing */}
      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Social Security Timing Analyzer">
        <SocialSecurity currentAge={inputs?.currentAge} />
      </UnlockGate>

      {/* Roth conversion optimizer */}
      <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="Roth Conversion Optimizer">
        <RothOptimizer />
      </UnlockGate>
    </div>
  );
}
