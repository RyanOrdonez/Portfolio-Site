// components/SocialSecurity.jsx
// Purpose: Social Security claiming timing analyzer.
//   Computes NPV breakeven age for claiming at 62 vs 67 (FRA) vs 70.
//   Uses a 3% real discount rate (SS_DISCOUNT_RATE constant).
//   Assumes 8% annual credit for delaying past FRA, and 25% reduction for early at 62.
// Key exports: default SocialSecurity
// Props:
//   currentAge — user's current age (used to show years to each claiming age)

import React, { useState, useMemo } from 'react';
import { SS_DISCOUNT_RATE } from '../constants.js';
import { formatCurrency } from '../utils/formatters.js';

// ---------------------------------------------------------------------------
// computeNPV — present value of a benefit stream starting at claimAge,
//   discounted at `discountRate`, running until `endAge`.
// ---------------------------------------------------------------------------
function computeNPV(annualBenefit, claimAge, endAge, discountRate) {
  let npv = 0;
  for (let age = claimAge; age < endAge; age++) {
    const yearsFromNow = age - claimAge; // relative to claim date
    npv += annualBenefit / Math.pow(1 + discountRate, yearsFromNow);
  }
  return npv;
}

// ---------------------------------------------------------------------------
// computeBreakeven — find the age at which delaying becomes NPV-positive
//   relative to early claiming.
// ---------------------------------------------------------------------------
function computeBreakeven(earlyBenefit, earlyAge, lateBenefit, lateAge, discountRate) {
  // Scan age by age until cumulative NPV of late strategy exceeds early strategy
  // Both measured from age `earlyAge` start
  let earlyTotal = 0;
  let lateTotal = 0;

  for (let age = earlyAge; age <= 100; age++) {
    const yearsFromEarly = age - earlyAge;
    const discountFactor = Math.pow(1 + discountRate, yearsFromEarly);

    // Early claimant has been collecting since earlyAge
    earlyTotal += earlyBenefit / discountFactor;

    // Late claimant starts at lateAge
    if (age >= lateAge) {
      lateTotal += lateBenefit / discountFactor;
    }

    if (lateTotal >= earlyTotal && age >= lateAge) {
      return age; // breakeven age
    }
  }
  return null; // never breaks even (shouldn't happen with realistic inputs)
}

// ---------------------------------------------------------------------------
// SocialSecurity — main component
// ---------------------------------------------------------------------------
export default function SocialSecurity({ currentAge }) {
  const [benefitAt62, setBenefitAt62] = useState(1500); // monthly at age 62

  const analysis = useMemo(() => {
    if (!benefitAt62 || benefitAt62 <= 0) return null;

    const monthly62 = benefitAt62;
    const annual62  = monthly62 * 12;

    // FRA = 67 (for those born 1960 or later — modern default)
    // Claiming at 62 = 25% reduction from FRA benefit
    // Claiming at 67 = FRA benefit → back-calculate FRA from 62 amount
    // FRA amount: if 62 = 75% of FRA, then FRA = 62 / 0.75
    const annual67 = annual62 / 0.75;

    // Delaying to 70 = +24% beyond FRA (8%/yr × 3 years)
    const annual70 = annual67 * 1.24;

    const LIFE_EXPECTANCY = 85; // conservative for NPV comparison

    // NPV of each strategy from age 62
    const npv62 = computeNPV(annual62, 62, LIFE_EXPECTANCY, SS_DISCOUNT_RATE);
    const npv67 = computeNPV(annual67, 67, LIFE_EXPECTANCY, SS_DISCOUNT_RATE);
    const npv70 = computeNPV(annual70, 70, LIFE_EXPECTANCY, SS_DISCOUNT_RATE);

    // Breakeven ages
    const breakeven67 = computeBreakeven(annual62, 62, annual67, 67, SS_DISCOUNT_RATE);
    const breakeven70 = computeBreakeven(annual62, 62, annual70, 70, SS_DISCOUNT_RATE);

    return {
      annual62, annual67, annual70,
      monthly62, monthly67: annual67 / 12, monthly70: annual70 / 12,
      npv62, npv67, npv70,
      breakeven67, breakeven70,
      yearsTo62:  currentAge ? Math.max(0, 62 - currentAge) : null,
      yearsTo67:  currentAge ? Math.max(0, 67 - currentAge) : null,
      yearsTo70:  currentAge ? Math.max(0, 70 - currentAge) : null,
    };
  }, [benefitAt62, currentAge]);

  // Best NPV strategy
  const bestStrategy = analysis
    ? [
        { label: 'Age 62', npv: analysis.npv62 },
        { label: 'Age 67', npv: analysis.npv67 },
        { label: 'Age 70', npv: analysis.npv70 },
      ].reduce((a, b) => a.npv > b.npv ? a : b)
    : null;

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Social Security Timing Analyzer</h3>
        <p className="text-2xs text-gray-500 mt-0.5">
          NPV comparison of claiming at 62, 67 (FRA), or 70 · 3% real discount rate
        </p>
      </div>

      {/* Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Estimated Monthly Benefit at Age 62
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            value={benefitAt62}
            onChange={(e) => setBenefitAt62(Math.max(0, Number(e.target.value)))}
            min={0}
            step={100}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-7 pr-3 py-2 text-sm text-white tabular focus:outline-none focus:border-amber-400/40"
          />
        </div>
        <p className="text-2xs text-gray-600">
          Find this on your SSA.gov statement ("My Social Security")
        </p>
      </div>

      {analysis && (
        <>
          {/* Comparison table */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                age: 62,
                monthly: analysis.monthly62,
                annual: analysis.annual62,
                npv: analysis.npv62,
                breakeven: null,
                yearsAway: analysis.yearsTo62,
                color: 'border-red-400/30',
                headerColor: 'text-red-400',
                label: 'Early',
              },
              {
                age: 67,
                monthly: analysis.monthly67,
                annual: analysis.annual67,
                npv: analysis.npv67,
                breakeven: analysis.breakeven67,
                yearsAway: analysis.yearsTo67,
                color: 'border-yellow-400/30',
                headerColor: 'text-yellow-400',
                label: 'Full Ret. Age',
              },
              {
                age: 70,
                monthly: analysis.monthly70,
                annual: analysis.annual70,
                npv: analysis.npv70,
                breakeven: analysis.breakeven70,
                yearsAway: analysis.yearsTo70,
                color: 'border-green-400/30',
                headerColor: 'text-green-400',
                label: 'Maximum',
              },
            ].map((row) => (
              <div key={row.age} className={`bg-[#1a1a1a] border ${row.color} rounded-lg p-3 space-y-1.5`}>
                <div className={`text-xs font-semibold ${row.headerColor}`}>Age {row.age}</div>
                <div className="text-2xs text-gray-500">{row.label}</div>
                {row.yearsAway != null && (
                  <div className="text-2xs text-gray-600">
                    {row.yearsAway === 0 ? 'Now' : `in ${row.yearsAway} yrs`}
                  </div>
                )}
                <div className="pt-1 border-t border-[#2a2a2a]">
                  <div className="text-2xs text-gray-500">Monthly</div>
                  <div className="text-xs font-medium text-white tabular">
                    {formatCurrency(row.monthly)}/mo
                  </div>
                </div>
                <div>
                  <div className="text-2xs text-gray-500">NPV to age 85</div>
                  <div className="text-xs font-medium text-white tabular">
                    {formatCurrency(row.npv)}
                  </div>
                </div>
                {row.breakeven && (
                  <div>
                    <div className="text-2xs text-gray-500">Breakeven vs 62</div>
                    <div className="text-xs text-amber-400 font-medium">Age {row.breakeven}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3">
            <p className="text-xs text-gray-300">
              <span className="text-amber-400 font-semibold">Best NPV strategy: {bestStrategy?.label}</span>
              {' '}— assuming life expectancy of 85 and a 3% real discount rate.
              If you expect to live past age {analysis.breakeven70}, delaying to 70 pays off.
              If health is a concern, earlier claiming may be better.
            </p>
          </div>

          <p className="text-2xs text-gray-700">
            Assumes FRA = 67 (born 1960+). Benefits shown in today's dollars. Not tax advice.
          </p>
        </>
      )}
    </div>
  );
}
