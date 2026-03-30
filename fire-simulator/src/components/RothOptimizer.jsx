// components/RothOptimizer.jsx
// Purpose: Roth conversion optimizer — fill-to-bracket heuristic.
//   Calculates how much to convert from traditional IRA each year to fill
//   the top of the 22% bracket without spilling into 24%.
//   Simple bracket-fill approach, not a full tax engine.
// Key exports: default RothOptimizer

import React, { useState, useMemo } from 'react';
import {
  STANDARD_DEDUCTION_SINGLE,
  STANDARD_DEDUCTION_MFJ,
  BRACKET_22_TOP_SINGLE,
  BRACKET_22_TOP_MFJ,
} from '../constants.js';
import { formatCurrency } from '../utils/formatters.js';

// 2024 bracket tops — taxable income (above standard deduction)
const BRACKETS = {
  single: {
    standardDeduction: STANDARD_DEDUCTION_SINGLE,
    bracket22Top: BRACKET_22_TOP_SINGLE,
  },
  mfj: {
    standardDeduction: STANDARD_DEDUCTION_MFJ,
    bracket22Top: BRACKET_22_TOP_MFJ,
  },
};

// Current bracket boundaries (taxable income)
const BRACKET_TOPS = {
  single: [
    { rate: '10%', top: 11600  },
    { rate: '12%', top: 47150  },
    { rate: '22%', top: 100525 },
    { rate: '24%', top: 191950 },
  ],
  mfj: [
    { rate: '10%', top: 23200  },
    { rate: '12%', top: 94300  },
    { rate: '22%', top: 201050 },
    { rate: '24%', top: 383900 },
  ],
};

export default function RothOptimizer() {
  const [tradBalance, setTradBalance] = useState(500000);
  const [otherIncome, setOtherIncome] = useState(30000); // pension, SS, etc.
  const [filingStatus, setFilingStatus] = useState('single');
  const [yearsToConvert, setYearsToConvert] = useState(10);

  const analysis = useMemo(() => {
    if (!tradBalance || tradBalance <= 0) return null;

    const config = BRACKETS[filingStatus];
    const brackets = BRACKET_TOPS[filingStatus];

    // Gross income = otherIncome + Roth conversion amount
    // Taxable income = gross income - standard deduction
    // We want to fill taxable income to top of 22% bracket

    const taxableOther = Math.max(0, otherIncome - config.standardDeduction);
    const bracket22Top = config.bracket22Top;

    // How much taxable room do we have in the 22% bracket?
    const taxableHeadroom = Math.max(0, bracket22Top - taxableOther);

    // Gross conversion amount (pre-standard-deduction removal)
    // Conversion is added to gross income, then deduction applies
    // Room in gross income = headroom (already in taxable terms)
    const conversionAmount = Math.min(taxableHeadroom, tradBalance / yearsToConvert);

    if (conversionAmount <= 0) {
      return {
        conversionAmount: 0,
        reason: 'Your other income already fills or exceeds the 22% bracket top.',
        taxableOther,
        bracket22Top,
        taxableHeadroom: 0,
      };
    }

    // Tax on conversion amount — the conversion amount is taxed at the marginal rate(s) it falls into
    // Simplified: find the bracket it starts in based on taxableOther, tax up to bracket22Top
    let taxOnConversion = 0;
    let remaining = conversionAmount;
    let taxableStart = taxableOther;

    for (const bracket of brackets) {
      if (remaining <= 0) break;
      if (taxableStart >= bracket.top) continue;

      const room = bracket.top - taxableStart;
      const chunkTaxed = Math.min(room, remaining);
      const rateNum = parseFloat(bracket.rate) / 100;
      taxOnConversion += chunkTaxed * rateNum;
      remaining -= chunkTaxed;
      taxableStart += chunkTaxed;
    }

    const effectiveRate = conversionAmount > 0 ? taxOnConversion / conversionAmount : 0;
    const totalConversion = conversionAmount * yearsToConvert;

    return {
      conversionAmount,
      taxOnConversion,
      effectiveRate,
      totalConversion,
      taxableOther,
      bracket22Top,
      taxableHeadroom,
      reason: null,
    };
  }, [tradBalance, otherIncome, filingStatus, yearsToConvert]);

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Roth Conversion Optimizer</h3>
        <p className="text-2xs text-gray-500 mt-0.5">
          Fill-to-22%-bracket heuristic · 2024 federal brackets · not tax advice
        </p>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Traditional IRA balance */}
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Trad. IRA / 401k Balance</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={tradBalance}
              onChange={(e) => setTradBalance(Math.max(0, Number(e.target.value)))}
              min={0}
              step={10000}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-7 pr-3 py-2 text-sm text-white tabular focus:outline-none focus:border-amber-400/40"
            />
          </div>
        </div>

        {/* Other income */}
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Other Annual Income</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={otherIncome}
              onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
              min={0}
              step={1000}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-7 pr-3 py-2 text-sm text-white tabular focus:outline-none focus:border-amber-400/40"
            />
          </div>
          <p className="text-2xs text-gray-600">Pension, Social Security, dividends, etc.</p>
        </div>

        {/* Filing status */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Filing Status</label>
          <div className="flex gap-2">
            {[
              { value: 'single', label: 'Single' },
              { value: 'mfj', label: 'Married' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilingStatus(value)}
                className={`flex-1 text-xs py-2 rounded-md border transition-colors ${
                  filingStatus === value
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-[#2a2a2a] text-gray-400 hover:border-[#444]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Years to convert */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Years to Convert</label>
          <input
            type="number"
            value={yearsToConvert}
            onChange={(e) => setYearsToConvert(Math.max(1, Math.min(30, Number(e.target.value))))}
            min={1}
            max={30}
            step={1}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white tabular focus:outline-none focus:border-amber-400/40"
          />
        </div>
      </div>

      {/* Results */}
      {analysis && (
        <>
          {analysis.reason ? (
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
              <p className="text-xs text-yellow-300">{analysis.reason}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Key result */}
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3">
                <p className="text-xs text-gray-300">
                  Convert{' '}
                  <span className="text-amber-400 font-semibold">{formatCurrency(analysis.conversionAmount)}</span>
                  {' '}per year for {yearsToConvert} years to fill the 22% bracket.
                  Estimated tax on each conversion:{' '}
                  <span className="text-white font-medium">{formatCurrency(analysis.taxOnConversion)}</span>
                  {' '}({(analysis.effectiveRate * 100).toFixed(1)}% effective rate).
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                  <div className="text-gray-500 text-2xs uppercase tracking-wide mb-0.5">Annual Convert</div>
                  <div className="text-white tabular font-medium">{formatCurrency(analysis.conversionAmount)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                  <div className="text-gray-500 text-2xs uppercase tracking-wide mb-0.5">Annual Tax Bill</div>
                  <div className="text-white tabular font-medium">{formatCurrency(analysis.taxOnConversion)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                  <div className="text-gray-500 text-2xs uppercase tracking-wide mb-0.5">Total Over {yearsToConvert}yr</div>
                  <div className="text-white tabular font-medium">{formatCurrency(analysis.totalConversion)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-md px-3 py-2">
                  <div className="text-gray-500 text-2xs uppercase tracking-wide mb-0.5">Effective Rate</div>
                  <div className="text-amber-400 tabular font-medium">{(analysis.effectiveRate * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Bracket headroom visual */}
              <div className="space-y-1">
                <div className="flex justify-between text-2xs text-gray-500">
                  <span>22% bracket headroom</span>
                  <span>{formatCurrency(analysis.taxableHeadroom)} available</span>
                </div>
                <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (analysis.conversionAmount / analysis.taxableHeadroom) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-2xs text-gray-600">
                  <span>Converting {formatCurrency(analysis.conversionAmount)}</span>
                  <span>22% top: {formatCurrency(BRACKET_TOPS[filingStatus].find(b => b.rate === '22%')?.top)}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-2xs text-gray-700">
            Uses 2024 federal brackets. State taxes not included. Consult a tax advisor before converting.
            RMD obligations not modeled — convert before RMD age (73) when possible.
          </p>
        </>
      )}
    </div>
  );
}
