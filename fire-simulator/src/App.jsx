// App.jsx
// Purpose: Root application component. Manages top-level state:
//   - simulation inputs and results
//   - Pro unlock state
//   - saved scenarios list
// Key exports: default App

import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ProUnlockModal from './components/ProUnlockModal.jsx';
import HeroSection from './components/HeroSection.jsx';
import SidebarPanel from './components/SidebarPanel.jsx';
import TransparencyStrip from './components/TransparencyStrip.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import { isUnlocked, setUnlocked } from './utils/unlockKey.js';
import { DEFAULT_RETIREMENT_YEARS, DEFAULT_STOCK_ALLOCATION } from './constants.js';

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

  // Handle form submission
  const handleRun = useCallback((formInputs) => {
    setInputs(formInputs);
    run({
      portfolioValue: formInputs.portfolioValue,
      annualSpending: formInputs.annualSpending,
      stockAllocation: formInputs.stockAllocation,
      retirementYears: formInputs.retirementYears,
    });
  }, [run]);

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
            />
          </aside>

          {/* Center column: results */}
          <div className="flex-1 min-w-0">
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
            />
          </div>

          {/* Right column: conversion sidebar */}
          <SidebarPanel
            isPro={isPro}
            onUnlockClick={() => setShowUnlockModal(true)}
          />
        </div>
      </main>

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
