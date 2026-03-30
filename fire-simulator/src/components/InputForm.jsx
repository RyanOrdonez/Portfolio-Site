// components/InputForm.jsx
// Purpose: Left-panel input form for all simulation parameters.
// Key exports: default InputForm

import React, { useState, useCallback, useEffect } from 'react';

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-[#c8c8d0] uppercase tracking-wider">
          {label}
        </label>
        {hint && <span className="text-2xs text-[#606068]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix, min, max, step, placeholder }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606068] text-sm pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`
          w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg
          text-sm text-[#e8e8ec] placeholder-[#505058]
          focus:outline-none focus:border-[#f0b429]/50 focus:ring-1 focus:ring-[#f0b429]/15
          transition-colors tabular
          ${prefix ? 'pl-7 pr-3' : 'px-3'} py-2
        `}
      />
    </div>
  );
}

function AllocationSlider({ stockPct, onChange }) {
  const bondPct = 100 - stockPct;
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={stockPct}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-gradient-to-r from-sky-500 to-amber-400
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-xs tabular">
        <span className="text-amber-400 font-medium">{stockPct}% Stocks</span>
        <span className="text-sky-400 font-medium">{bondPct}% Bonds</span>
      </div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-[#3a3a3e]" />
      <span className="text-2xs text-[#606068] uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-[#3a3a3e]" />
    </div>
  );
}

export default function InputForm({
  initialValues,
  onRun,
  isRunning,
  allocationOverride,
  ssScenario,
  ssMonthlyBenefit,
  ssClaimingAge,
  onSsChange,
  annualContribution,
  contributionYears,
  onContributionChange,
}) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    if (allocationOverride != null) {
      setForm(prev => ({ ...prev, stockAllocation: allocationOverride }));
    }
  }, [allocationOverride]);

  const set = useCallback((key) => (value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onRun({
      ...form,
      stockAllocation: form.stockAllocation / 100,
      retirementYears: form.retirementYears,
      ssMonthlyBenefit: ssMonthlyBenefit ?? 0,
      ssClaimingAge: ssClaimingAge ?? 67,
    });
  }, [form, onRun, ssMonthlyBenefit, ssClaimingAge]);

  const wdRate = form.portfolioValue > 0
    ? ((form.annualSpending / form.portfolioValue) * 100).toFixed(2)
    : null;

  const yearsToRetirement = form.alreadyRetired
    ? 0
    : Math.max(0, form.retirementAge - form.currentAge);

  return (
    <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-4 space-y-4 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#e8e8ec]">Simulation Inputs</h2>
        {wdRate && (
          <span className={`text-xs font-mono tabular px-2 py-0.5 rounded ${
            Number(wdRate) <= 4
              ? 'text-green-400 bg-green-400/10'
              : Number(wdRate) <= 5
                ? 'text-yellow-400 bg-yellow-400/10'
                : 'text-red-400 bg-red-400/10'
          }`}>
            SWR: {wdRate}%
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SectionDivider label="Portfolio" />

        <Field label="Current Portfolio Value">
          <NumberInput
            value={form.portfolioValue}
            onChange={set('portfolioValue')}
            prefix="$"
            min={0}
            step={10000}
            placeholder="500,000"
          />
        </Field>

        <Field label="Annual Spending in Retirement" hint="today's dollars">
          <NumberInput
            value={form.annualSpending}
            onChange={set('annualSpending')}
            prefix="$"
            min={0}
            step={1000}
            placeholder="40,000"
          />
        </Field>

        <SectionDivider label="Timeline" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#c8c8d0] uppercase tracking-wider">
            Already Retired?
          </span>
          <button
            type="button"
            onClick={() => set('alreadyRetired')(!form.alreadyRetired)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              form.alreadyRetired ? 'bg-amber-400' : 'bg-[#3a3a3e]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                form.alreadyRetired ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <Field label="Current Age">
          <NumberInput
            value={form.currentAge}
            onChange={set('currentAge')}
            min={18}
            max={100}
            step={1}
            placeholder="35"
          />
        </Field>

        {!form.alreadyRetired && (
          <Field
            label="Expected Retirement Age"
            hint={yearsToRetirement > 0 ? `${yearsToRetirement} yrs away` : 'Now'}
          >
            <NumberInput
              value={form.retirementAge}
              onChange={set('retirementAge')}
              min={form.currentAge}
              max={100}
              step={1}
              placeholder="60"
            />
          </Field>
        )}

        <Field label="Retirement Duration" hint="years to simulate">
          <NumberInput
            value={form.retirementYears}
            onChange={set('retirementYears')}
            min={5}
            max={60}
            step={1}
            placeholder="30"
          />
        </Field>

        <SectionDivider label="Allocation" />

        <Field label="Asset Allocation">
          <AllocationSlider
            stockPct={form.stockAllocation}
            onChange={set('stockAllocation')}
          />
        </Field>

        <SectionDivider label="Contributions" />

        <Field label="Annual Contribution" hint="optional">
          <NumberInput
            value={annualContribution ?? 0}
            onChange={(v) => onContributionChange?.({ annualContribution: v })}
            prefix="$"
            min={0}
            step={500}
            placeholder="0"
          />
        </Field>

        <Field
          label="Years Contributing"
          hint={annualContribution > 0 ? `adds $${((annualContribution ?? 0) * (contributionYears ?? 0)).toLocaleString()}` : 'from year 1'}
        >
          <NumberInput
            value={contributionYears ?? 0}
            onChange={(v) => onContributionChange?.({ contributionYears: v })}
            min={0}
            max={form.retirementYears ?? 30}
            step={1}
            placeholder="0"
          />
        </Field>

        {ssScenario && ssScenario !== 'none' && (
          <>
            <SectionDivider label="Social Security" />

            <Field label="Monthly SS Benefit at FRA" hint="from SSA estimate">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606068] text-sm pointer-events-none">$</span>
                <input
                  type="number"
                  value={ssMonthlyBenefit ?? ''}
                  onChange={(e) => onSsChange({ ssMonthlyBenefit: Number(e.target.value) || 0, ssClaimingAge })}
                  min={0}
                  step={100}
                  placeholder="2,000"
                  className="w-full bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg pl-7 pr-3 py-2 text-sm text-[#e8e8ec] placeholder-[#505058] focus:outline-none focus:border-[#f0b429]/50 tabular"
                />
              </div>
            </Field>

            <Field label="Claiming Age">
              <div className="grid grid-cols-3 gap-1.5">
                {[62, 67, 70].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => onSsChange({ ssMonthlyBenefit, ssClaimingAge: age })}
                    className={`py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      ssClaimingAge === age
                        ? 'border-amber-400/60 bg-amber-400/10 text-amber-400'
                        : 'border-[#3a3a3e] bg-[#2a2a2e] text-[#909098] hover:text-[#c8c8d0]'
                    }`}
                  >
                    Age {age}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-2xs text-[#505058] mt-1 px-0.5">
                <span>70% of FRA</span>
                <span>Full</span>
                <span>124% of FRA</span>
              </div>
            </Field>
          </>
        )}

        <button
          type="submit"
          disabled={isRunning}
          className={`
            w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all mt-2
            ${isRunning
              ? 'bg-amber-400/30 text-amber-300/60 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-black cursor-pointer active:scale-[0.98]'
            }
          `}
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running 10,000 simulations…
            </span>
          ) : (
            'Run Simulation →'
          )}
        </button>

        <p className="text-2xs text-[#606068] text-center">
          Real (inflation-adjusted) returns · 10,000 paths
        </p>
      </form>
    </div>
  );
}
