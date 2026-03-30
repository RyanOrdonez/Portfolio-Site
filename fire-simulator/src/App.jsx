// App.jsx — root component
// Manages all simulation state, SS scenario, contributions, allocation override.
// 4-column layout: InvestmentGuide | InputForm | ResultsPanel | SidebarPanel

import React, { useState, useCallback, useEffect, useRef } from 'react';
import InputForm from './components/InputForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ProUnlockModal from './components/ProUnlockModal.jsx';
import HeroSection from './components/HeroSection.jsx';
import SidebarPanel from './components/SidebarPanel.jsx';
import TransparencyStrip from './components/TransparencyStrip.jsx';
import AllocationGuide from './components/AllocationGuide.jsx';
import IRASection from './components/IRASection.jsx';
import InvestmentGuide from './components/InvestmentGuide.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import { isUnlocked, setUnlocked } from './utils/unlockKey.js';
import { DEFAULT_RETIREMENT_YEARS, DEFAULT_STOCK_ALLOCATION } from './constants.js';
import { SS_MULTIPLIERS, SS_AGE_ADJUSTMENTS } from './utils/financialConstants.js';

const DEFAULT_INPUTS = {
  portfolioValue: 500000,
  annualSpending: 40000,
  currentAge: 35,
  retirementAge: 60,
  alreadyRetired: false,
  stockAllocation: DEFAULT_STOCK_ALLOCATION,
  retirementYears: DEFAULT_RETIREMENT_YEARS,
};

export default function App() {
  const { results, isRunning, error, run, lastInputs } = useSimulation();

  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [isPro, setIsPro] = useState(isUnlocked());
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [scenarios, setScenarios] = useState([]);

  const [ssScenario, setSsScenario] = useState('none');
  const [ssMonthlyBenefit, setSsMonthlyBenefit] = useState(2000);
  const [ssClaimingAge, setSsClaimingAge] = useState(67);

  const [annualContribution, setAnnualContribution] = useState(0);
  const [contributionYears, setContributionYears] = useState(0);

  const [allocationOverride, setAllocationOverride] = useState(null);

  const resultsRef = useRef(null);
  const lastFormInputsRef = useRef(null);

  const computeSimInputs = useCallback((formInputs, scenario, monthlyBenefit, claimingAge, contribution, contribYrs) => {
    const retirementStartAge = formInputs.alreadyRetired
      ? formInputs.currentAge
      : (formInputs.retirementAge ?? formInputs.currentAge);

    const ssAnnualIncome = scenario === 'none' ? 0
      : (monthlyBenefit ?? 0) * 12
        * (SS_MULTIPLIERS[scenario] ?? 1.0)
        * (SS_AGE_ADJUSTMENTS[claimingAge] ?? 1.0);

    const ssStartYear = scenario === 'none'
      ? Infinity
      : Math.max(0, (claimingAge ?? 67) - retirementStartAge);

    return {
      portfolioValue:    formInputs.portfolioValue,
      annualSpending:    formInputs.annualSpending,
      stockAllocation:   formInputs.stockAllocation,
      retirementYears:   formInputs.retirementYears,
      ssAnnualIncome,
      ssStartYear,
      annualContribution: contribution ?? 0,
      contributionYears:  contribYrs ?? 0,
    };
  }, []);

  const handleRun = useCallback((formInputs) => {
    setInputs(formInputs);
    lastFormInputsRef.current = formInputs;
    run(computeSimInputs(formInputs, ssScenario, ssMonthlyBenefit, ssClaimingAge, annualContribution, contributionYears));
  }, [run, computeSimInputs, ssScenario, ssMonthlyBenefit, ssClaimingAge, annualContribution, contributionYears]);

  useEffect(() => {
    if (lastFormInputsRef.current) {
      run(computeSimInputs(lastFormInputsRef.current, ssScenario, ssMonthlyBenefit, ssClaimingAge, annualContribution, contributionYears));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ssScenario, ssMonthlyBenefit, ssClaimingAge, annualContribution, contributionYears]);

  const handleUnlockSuccess = useCallback(() => {
    setUnlocked(true);
    setIsPro(true);
    setShowUnlockModal(false);
  }, []);

  const handleSaveScenario = useCallback((name) => {
    if (!results) return;
    setScenarios(prev => [...prev.slice(-4), {
      id: Date.now(), name,
      inputs: lastInputs,
      successRate: results.successRate,
      medianFinalValue: results.medianFinalValue,
      worstP10FinalValue: results.worstP10FinalValue,
    }]);
  }, [results, lastInputs]);

  const handleRemoveScenario = useCallback((id) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleSsChange = useCallback(({ ssMonthlyBenefit: mb, ssClaimingAge: ca }) => {
    if (mb !== undefined) setSsMonthlyBenefit(mb);
    if (ca !== undefined) setSsClaimingAge(ca);
  }, []);

  const handleAllocationApply = useCallback((pct) => {
    setAllocationOverride(pct);
    setTimeout(() => setAllocationOverride(null), 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-[#e0e0e4]">

      <header className="border-b border-[#3a3a3e] bg-[#232325] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🔥</span>
            <div>
              <h1 className="text-sm font-semibold text-white leading-tight tracking-tight">
                FIRE Retirement Simulator
              </h1>
              <p className="text-2xs text-[#808088] leading-tight">promptinglogic.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="text-xs font-medium text-[#f0b429] border border-[#f0b429]/30 bg-[#f0b429]/10 px-2.5 py-1 rounded-full">
                Pro Unlocked
              </span>
            ) : (
              <button
                onClick={() => setShowUnlockModal(true)}
                className="text-xs font-semibold text-black bg-[#f0b429] hover:bg-[#e5a820] px-3 py-1.5 rounded-full transition-colors"
              >
                Unlock Pro — $19
              </button>
            )}
          </div>
        </div>
      </header>

      <HeroSection />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-5 items-start">

          <aside className="hidden xl:flex flex-col w-52 flex-shrink-0 bg-[#232325] border border-[#3a3a3e] rounded-xl overflow-hidden sticky top-20 max-h-[calc(100vh-6rem)]">
            <InvestmentGuide />
          </aside>

          <div className="w-full sm:w-80 xl:w-88 flex-shrink-0">
            <InputForm
              initialValues={DEFAULT_INPUTS}
              onRun={handleRun}
              isRunning={isRunning}
              allocationOverride={allocationOverride}
              ssScenario={ssScenario}
              ssMonthlyBenefit={ssMonthlyBenefit}
              ssClaimingAge={ssClaimingAge}
              onSsChange={handleSsChange}
              annualContribution={annualContribution}
              contributionYears={contributionYears}
              onContributionChange={({ annualContribution: ac, contributionYears: cy }) => {
                if (ac !== undefined) setAnnualContribution(ac);
                if (cy !== undefined) setContributionYears(cy);
              }}
            />
          </div>

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

          <SidebarPanel
            isPro={isPro}
            onUnlockClick={() => setShowUnlockModal(true)}
          />
        </div>
      </main>

      <AllocationGuide
        currentAge={inputs?.currentAge}
        onApply={handleAllocationApply}
      />
      <IRASection
        isPro={isPro}
        onUnlockClick={() => setShowUnlockModal(true)}
        currentAge={inputs?.currentAge}
      />
      <TransparencyStrip />

      <footer className="border-t border-[#3a3a3e] mt-12 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 text-center space-y-1">
          <p className="text-xs text-[#606068]">
            FIRE Retirement Simulator — Monte Carlo projections are for educational purposes only.
            Not financial advice. Real (inflation-adjusted) returns used throughout.
          </p>
          <p className="text-xs text-[#484850]">© 2025 promptinglogic.com</p>
        </div>
      </footer>

      {showUnlockModal && (
        <ProUnlockModal
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowUnlockModal(false)}
        />
      )}
    </div>
  );
}
