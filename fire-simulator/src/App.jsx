// App.jsx
// Purpose: Root application component. Manages top-level state:
//   - simulation inputs and results
//   - Pro unlock state
//   - saved scenarios list
// Key exports: default App

import React, { useState, useCallback, useEffect, useRef } from 'react';
import InputForm from './components/InputForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ProUnlockModal from './components/ProUnlockModal.jsx';
import HeroSection from './components/HeroSection.jsx';
import SidebarPanel from './components/SidebarPanel.jsx';
import TransparencyStrip from './components/TransparencyStrip.jsx';
import AllocationGuide from './components/AllocationGuide.jsx';
import IRASection from './components/IRASection.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import { isUnlocked, setUnlocked } from './utils/unlockKey.js';
import { DEFAULT_RETIREMENT_YEARS, DEFAULT_STOCK_ALLOCATION } from './constants.js';
import { SS_MULTIPLIERS, SS_AGE_ADJUSTMENTS } from './utils/financialConstants.js';

// Default form inputs — displayed on first load so the app never shows blank state
const DEFAULT_INPUTS = {
  portfolioValue: 1000000,
  annualSpending: 40000,
  currentAge: 55,
  retirementAge: 60,
  alreadyRetired: false,
  stockAllocation: DEFAULT_STOCK_ALLOCATION,
  retirementYears: DEFAULT_RETIREMENT_YEARS,
};

export default function App() {
  // --- Simulation state ---
  const { results, isRunning, error, run, lastInputs } = useSimulation();

  // --- Form inputs ---
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  // --- Pro unlock ---
  const [isPro, setIsPro] = useState(isUnlocked());
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // --- Saved scenarios (Pro feature) ---
  const [scenarios, setScenarios] = useState([]);

  // --- SS scenario state ---
  const [ssScenario, setSsScenario] = useState('none');       // 'none' | 'reduced' | 'full'
  const [ssMonthlyBenefit, setSsMonthlyBenefit] = useState(2000); // FRA monthly benefit
  const [ssClaimingAge, setSsClaimingAge] = useState(67);

  // --- Allocation override (from AllocationGuide "Apply" button) ---
  const [allocationOverride, setAllocationOverride] = useState(null);

  // --- Ref to results panel DOM node for PDF export ---
  const resultsRef = useRef(null);

  // Keep a ref to last form inputs so SS scenario changes can trigger re-run
  const lastFormInputsRef = useRef(null);

  // ---------------------------------------------------------------------------
  // computeSimInputs — merges form inputs with current SS state
  // ---------------------------------------------------------------------------
  const computeSimInputs = useCallback((formInputs, scenario, monthlyBenefit, claimingAge) => {
    const retirementStartAge = formInputs.alreadyRetired
      ? formInputs.currentAge
      : (formInputs.retirementAge ?? formInputs.currentAge);

    const ssAnnualIncome = scenario === 'none'
      ? 0
      : (monthlyBenefit ?? 0) * 12
        * (SS_MULTIPLIERS[scenario] ?? 1.0)
        * (SS_AGE_ADJUSTMENTS[claimingAge] ?? 1.0);

    const ssStartYear = Math.max(0, (claimingAge ?? 67) - retirementStartAge);

    return {
      portfolioValue: formInputs.portfolioValue,
      annualSpending: formInputs.annualSpending,
      stockAllocation: formInputs.stockAllocation,
      retirementYears: formInputs.retirementYears,
      ssAnnualIncome,
      ssStartYear: scenario === 'none' ? Infinity : ssStartYear,
    };
  }, []);

  // Handle form submission
  const handleRun = useCallback((formInputs) => {
    setInputs(formInputs);
    lastFormInputsRef.current = formInputs;
    run(computeSimInputs(formInputs, ssScenario, ssMonthlyBenefit, ssClaimingAge));
  }, [run, computeSimInputs, ssScenario, ssMonthlyBenefit, ssClaimingAge]);

  // Auto-rerun when SS scenario changes (only if a simulation has already run)
  useEffect(() => {
    if (lastFormInputsRef.current) {
      run(computeSimInputs(lastFormInputsRef.current, ssScenario, ssMonthlyBenefit, ssClaimingAge));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ssScenario, ssMonthlyBenefit, ssClaimingAge]);

  const handleSsChange = useCallback(({ ssMonthlyBenefit: mb, ssClaimingAge: ca }) => {
    if (mb !== undefined) setSsMonthlyBenefit(mb);
    if (ca !== undefined) setSsClaimingAge(ca);
  }, []);

  const handleAllocationApply = useCallback((pct) => {
    setAllocationOverride(pct);
    // Reset override after InputForm syncs, so next AllocationGuide click re-triggers effect
    setTimeout(() => setAllocationOverride(null), 100);
  }, []);

  // Handle Pro unlock success
  const handleUnlockSuccess = useCallback(() => {
    setUnlocked(true);
    setIsPro(true);
    setShowUnlockModal(false);
  }, []);

  // Save current scenario (Pro)
  const handleSaveScenario = useCallback((name) => {
    if (!results) return;
    const scenario = {
      id: Date.now(),
      name,
      inputs: lastInputs,
      successRate: results.successRate,
      medianFinalValue: results.medianFinalValue,
      worstP10FinalValue: results.worstP10FinalValue,
    };
    setScenarios(prev => [...prev.slice(-4), scenario]); // max 5 scenarios
  }, [results, lastInputs]);

  const handleRemoveScenario = useCallback((id) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🔥</span>
            <div>
              <h1 className="text-base font-semibold text-white leading-tight tracking-tight">
                FIRE Retirement Simulator
              </h1>
              <p className="text-2xs text-gray-500 leading-tight">
                promptinglogic.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="text-xs font-medium text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 rounded-full">
                Pro Unlocked
              </span>
            ) : (
              <button
                onClick={() => setShowUnlockModal(true)}
                className="text-xs font-medium text-amber-400 border border-amber-400/40 hover:border-amber-400 bg-amber-400/5 hover:bg-amber-400/15 px-3 py-1.5 rounded-full transition-all"
              >
                Unlock Pro — $19
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <HeroSection />

      {/* Main layout — inputs | results | sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: inputs */}
          <aside className="lg:w-80 xl:w-96 flex-shrink-0">
            <InputForm
              initialValues={DEFAULT_INPUTS}
              onRun={handleRun}
              isRunning={isRunning}
              allocationOverride={allocationOverride}
              ssScenario={ssScenario}
              ssMonthlyBenefit={ssMonthlyBenefit}
              ssClaimingAge={ssClaimingAge}
              onSsChange={handleSsChange}
            />
          </aside>

          {/* Center column: results */}
          <div className="flex-1 min-w-0" ref={resultsRef}>
            <ResultsPanel
              results={results}
              inputs={lastInputs}
              isRunning={isRunning}
              error={error}
              isPro={isPro}
              onUnlockClick={() => setShowUnlockModal(true)}
              scenarios={scenarios}
              onSaveScenario={handleSaveScenario}
              onRemoveScenario={handleRemoveScenario}
              ssScenario={ssScenario}
              onSsScenarioChange={setSsScenario}
              resultsRef={resultsRef}
            />
          </div>

          {/* Right column: conversion sidebar */}
          <SidebarPanel
            isPro={isPro}
            onUnlockClick={() => setShowUnlockModal(true)}
          />
        </div>
      </main>

      {/* Allocation by Age guide */}
      <AllocationGuide
        currentAge={inputs?.currentAge}
        onApply={handleAllocationApply}
      />

      {/* IRA section */}
      <IRASection
        isPro={isPro}
        onUnlockClick={() => setShowUnlockModal(true)}
        currentAge={inputs?.currentAge}
      />

      {/* Transparency strip */}
      <TransparencyStrip />

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-gray-600">
            FIRE Retirement Simulator — Monte Carlo projections are for educational purposes only and do not constitute financial advice.
            All calculations use real (inflation-adjusted) returns. Past performance does not guarantee future results.
          </p>
          <p className="text-xs text-gray-700 mt-1">
            © 2025 promptinglogic.com
          </p>
        </div>
      </footer>

      {/* Pro unlock modal */}
      {showUnlockModal && (
        <ProUnlockModal
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowUnlockModal(false)}
        />
      )}
    </div>
  );
}
