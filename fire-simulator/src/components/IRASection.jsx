// components/IRASection.jsx
// Purpose: Dual-mode IRA section.
//   Free: expandable rules cards (Roth eligibility, Traditional rules, contribution limits).
//   Pro: interactive calculator with single unambiguous recommendation.
// Key exports: default IRASection
// Props:
//   isPro          — boolean
//   onUnlockClick  — opens paywall modal
//   currentAge     — number (pre-fills age field)

import React, { useState } from 'react';
import UnlockGate from './UnlockGate.jsx';
import { calculateIRARecommendation } from '../utils/iraCalculator.js';
import { IRA_LIMITS, ROTH_PHASE_OUTS, TRAD_PHASE_OUTS } from '../utils/financialConstants.js';

// ---------------------------------------------------------------------------
// ExpandableCard — collapsible info card for free-tier rules
// ---------------------------------------------------------------------------
function ExpandableCard({ title, badge, badgeColor, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#111111] text-left hover:bg-[#161616] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{title}</span>
          {badge && (
            <span className={`text-2xs px-1.5 py-0.5 rounded font-medium ${badgeColor ?? 'bg-[#2a2a2a] text-gray-400'}`}>
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-[#1e1e1e] bg-[#0d0d0d] space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row helper for the rules cards
// ---------------------------------------------------------------------------
function InfoRow({ label, value, sub }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-[#1e1e1e] last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="text-right">
        <span className="text-xs font-medium text-white tabular">{value}</span>
        {sub && <div className="text-2xs text-gray-600">{sub}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FreeRulesCards — always-visible education cards
// ---------------------------------------------------------------------------
function FreeRulesCards() {
  return (
    <div className="space-y-2">
      {/* Contribution Limits */}
      <ExpandableCard
        title="2025 Contribution Limits"
        badge="IRS Updated"
        badgeColor="bg-green-400/10 text-green-400"
        defaultOpen={true}
      >
        <InfoRow
          label="Under age 50"
          value={`$${IRA_LIMITS.base.toLocaleString()}`}
          sub="Roth or Traditional, or split"
        />
        <InfoRow
          label="Age 50+"
          value={`$${IRA_LIMITS.catchUp.toLocaleString()}`}
          sub={`+$${(IRA_LIMITS.catchUp - IRA_LIMITS.base).toLocaleString()} catch-up`}
        />
        <p className="text-xs text-gray-600 pt-1">
          Limit is shared — you can't contribute $7,000 to Roth AND $7,000 to Traditional.
          You can split the $7,000 any way you choose.
        </p>
      </ExpandableCard>

      {/* Roth IRA Rules */}
      <ExpandableCard title="Roth IRA — Who's Eligible?" badge="Tax-free growth">
        <InfoRow
          label="Single filer — full contribution"
          value={`Under $${ROTH_PHASE_OUTS.single.min.toLocaleString()}`}
        />
        <InfoRow
          label="Single filer — partial contribution"
          value={`$${ROTH_PHASE_OUTS.single.min.toLocaleString()} – $${ROTH_PHASE_OUTS.single.max.toLocaleString()}`}
        />
        <InfoRow
          label="Married filing jointly — full"
          value={`Under $${ROTH_PHASE_OUTS.mfj.min.toLocaleString()}`}
        />
        <InfoRow
          label="Married filing jointly — partial"
          value={`$${ROTH_PHASE_OUTS.mfj.min.toLocaleString()} – $${ROTH_PHASE_OUTS.mfj.max.toLocaleString()}`}
        />
        <p className="text-xs text-gray-600 pt-1">
          Over the limit? <span className="text-amber-400">Backdoor Roth</span> — contribute
          to non-deductible Traditional IRA, then immediately convert to Roth. No income limit.
        </p>
      </ExpandableCard>

      {/* Traditional IRA Deductibility */}
      <ExpandableCard title="Traditional IRA — Is it Deductible?" badge="Depends on income">
        <p className="text-xs text-gray-500 pb-2">
          Always deductible if neither you nor your spouse have a workplace plan (401k, 403b, SEP-IRA, etc.).
          Phase-outs apply if you do:
        </p>
        <InfoRow
          label="Single, has 401k — full deduction"
          value={`Under $${TRAD_PHASE_OUTS.single_has_plan.min.toLocaleString()}`}
        />
        <InfoRow
          label="Single, has 401k — phases out"
          value={`$${TRAD_PHASE_OUTS.single_has_plan.min.toLocaleString()} – $${TRAD_PHASE_OUTS.single_has_plan.max.toLocaleString()}`}
        />
        <InfoRow
          label="MFJ, has 401k — full deduction"
          value={`Under $${TRAD_PHASE_OUTS.mfj_has_plan.min.toLocaleString()}`}
        />
        <InfoRow
          label="MFJ, has 401k — phases out"
          value={`$${TRAD_PHASE_OUTS.mfj_has_plan.min.toLocaleString()} – $${TRAD_PHASE_OUTS.mfj_has_plan.max.toLocaleString()}`}
        />
        <p className="text-xs text-gray-600 pt-1">
          Non-deductible Traditional contributions still grow tax-deferred — just with
          more paperwork (Form 8606). Usually better to do Backdoor Roth instead.
        </p>
      </ExpandableCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProCalculator — gated behind Pro
// ---------------------------------------------------------------------------
const FILING_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'mfj',    label: 'Married Filing Jointly' },
  { value: 'mfs',    label: 'Married Filing Separately' },
];

const RECOMMENDATION_STYLES = {
  Roth:          { color: 'text-green-400', border: 'border-green-400/40', bg: 'bg-green-400/5',  label: 'Roth IRA' },
  Traditional:   { color: 'text-sky-400',   border: 'border-sky-400/40',   bg: 'bg-sky-400/5',    label: 'Traditional IRA' },
  Both:          { color: 'text-amber-400', border: 'border-amber-400/40', bg: 'bg-amber-400/5',  label: 'Both (Split)' },
  BackdoorRoth:  { color: 'text-purple-400',border: 'border-purple-400/40',bg: 'bg-purple-400/5', label: 'Backdoor Roth' },
};

function ProCalculator({ currentAge }) {
  const [form, setForm] = useState({
    grossIncome: 85000,
    filingStatus: 'single',
    age: currentAge ?? 35,
    hasWorkplacePlan: true,
    spouseHasWorkplacePlan: false,
    estimatedRetirementTaxRate: 0.22,
    state: '',
  });
  const [result, setResult] = useState(null);

  const set = (key) => (value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleCalculate = () => {
    const r = calculateIRARecommendation(form);
    setResult(r);
  };

  const style = result ? (RECOMMENDATION_STYLES[result.recommendation] ?? RECOMMENDATION_STYLES.Roth) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Gross income */}
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Gross Annual Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={form.grossIncome}
              onChange={(e) => set('grossIncome')(Number(e.target.value) || 0)}
              min={0} step={1000}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60"
            />
          </div>
        </div>

        {/* Filing status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Filing Status</label>
          <select
            value={form.filingStatus}
            onChange={(e) => set('filingStatus')(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60"
          >
            {FILING_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Your Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => set('age')(Number(e.target.value) || 35)}
            min={18} max={100}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60"
          />
        </div>

        {/* Workplace plan */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            You have a 401k/403b?
          </label>
          <div className="flex gap-2">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set('hasWorkplacePlan')(opt === 'Yes')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  (opt === 'Yes') === form.hasWorkplacePlan
                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-400'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated retirement tax rate */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Est. Retirement Tax Rate
          </label>
          <select
            value={form.estimatedRetirementTaxRate}
            onChange={(e) => set('estimatedRetirementTaxRate')(Number(e.target.value))}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60"
          >
            <option value={0.10}>10% — low spending</option>
            <option value={0.12}>12% — modest spending</option>
            <option value={0.22}>22% — comfortable</option>
            <option value={0.24}>24% — higher income</option>
            <option value={0.32}>32% — affluent</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCalculate}
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black transition-colors"
      >
        Get IRA Recommendation →
      </button>

      {/* Result */}
      {result && style && (
        <div className={`border ${style.border} ${style.bg} rounded-lg p-4 space-y-3`}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Recommended:</span>
            <span className={`text-sm font-bold ${style.color}`}>{style.label}</span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">{result.rationale}</p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="text-center">
              <div className="text-xs font-semibold text-white tabular">
                ${result.maxContribution.toLocaleString()}
              </div>
              <div className="text-2xs text-gray-600">max contribution</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-white tabular">
                {Math.round(result.marginalRate * 100)}%
              </div>
              <div className="text-2xs text-gray-600">marginal rate now</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-white tabular">
                ${result.tradDeductibleAmount.toLocaleString()}
              </div>
              <div className="text-2xs text-gray-600">trad. deductible</div>
            </div>
          </div>

          {result.stateNoTax && (
            <div className="text-2xs text-green-400/70 bg-green-400/5 border border-green-400/20 rounded px-2 py-1">
              No state income tax — Traditional deduction is purely federal here.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// IRASection — main component
// ---------------------------------------------------------------------------
export default function IRASection({ isPro, onUnlockClick, currentAge }) {
  return (
    <section className="border-t border-[#1e1e1e] bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Roth vs. Traditional IRA</h2>
            <span className="text-xs text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
              Pro: calculator
            </span>
          </div>
          <p className="text-sm text-gray-500">
            2025 rules for contribution limits, eligibility, and deductibility — plus a Pro calculator
            that gives you one clear recommendation based on your actual numbers.
          </p>
        </div>

        {/* Free rules cards */}
        <FreeRulesCards />

        {/* Pro calculator */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">IRA Recommendation Calculator</h3>
            <span className="text-2xs text-amber-400 border border-amber-400/30 bg-amber-400/5 px-1.5 py-0.5 rounded">Pro</span>
          </div>
          <UnlockGate isPro={isPro} onUnlockClick={onUnlockClick} featureName="IRA Recommendation Calculator">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <ProCalculator currentAge={currentAge} />
            </div>
          </UnlockGate>
        </div>
      </div>
    </section>
  );
}
