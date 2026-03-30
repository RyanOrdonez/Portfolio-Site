// utils/iraCalculator.js
// Purpose: Pure function IRA recommendation engine — no React imports.
//   Computes Roth vs. Traditional recommendation based on income, filing status,
//   workplace plan status, and estimated retirement tax rate.
// Key exports: calculateIRARecommendation

import {
  IRA_LIMITS,
  ROTH_PHASE_OUTS,
  TRAD_PHASE_OUTS,
  TAX_BRACKETS_2025,
  STANDARD_DEDUCTIONS_2025,
  NO_INCOME_TAX_STATES,
} from './financialConstants.js';

// ---------------------------------------------------------------------------
// getMarginalRate — returns current marginal federal tax rate for given income
// ---------------------------------------------------------------------------
function getMarginalRate(grossIncome, filingStatus) {
  const stdDed = STANDARD_DEDUCTIONS_2025[filingStatus] ?? STANDARD_DEDUCTIONS_2025.single;
  const taxableIncome = Math.max(0, grossIncome - stdDed);
  const brackets = TAX_BRACKETS_2025[filingStatus] ?? TAX_BRACKETS_2025.single;

  for (const band of brackets) {
    if (taxableIncome <= band.upTo) {
      return band.rate;
    }
  }
  return 0.37; // top bracket fallback
}

// ---------------------------------------------------------------------------
// calculateIRARecommendation
//
// Arguments (inputs object):
//   grossIncome                 — annual gross income (pre-tax, pre-deduction)
//   filingStatus                — 'single' | 'mfj' | 'mfs'
//   age                         — current age (for catch-up contribution eligibility)
//   hasWorkplacePlan            — boolean (has 401k/403b/etc.)
//   spouseHasWorkplacePlan      — boolean (only relevant for MFJ)
//   estimatedRetirementTaxRate  — decimal 0.0–0.5, expected tax rate on Traditional withdrawals
//   state                       — string, e.g. 'Texas' (optional, used for state tax note)
//
// Returns:
//   {
//     recommendation,           — 'Roth' | 'Traditional' | 'Both' | 'BackdoorRoth'
//     rationale,                — human-readable explanation string
//     rothContribution,         — max Roth contribution allowed (0 if income too high)
//     tradDeductibleAmount,     — how much of Traditional contribution is deductible
//     maxContribution,          — total IRA contribution limit this year
//     marginalRate,             — current marginal federal tax rate (decimal)
//     backdoorRothEligible,     — boolean: income too high for direct Roth, but backdoor works
//     stateNoTax,               — boolean: state has no income tax (shifts toward Traditional)
//   }
// ---------------------------------------------------------------------------
export function calculateIRARecommendation({
  grossIncome = 0,
  filingStatus = 'single',
  age = 35,
  hasWorkplacePlan = false,
  spouseHasWorkplacePlan = false,
  estimatedRetirementTaxRate = 0.22,
  state = '',
}) {
  const fs = ['single', 'mfj', 'mfs'].includes(filingStatus) ? filingStatus : 'single';

  // Contribution limit
  const maxContribution = age >= 50 ? IRA_LIMITS.catchUp : IRA_LIMITS.base;

  // --- Roth eligibility ---
  const rothKey = fs === 'mfj' ? 'mfj' : fs === 'mfs' ? 'mfs' : 'single';
  const rothRange = ROTH_PHASE_OUTS[rothKey];
  let rothContribution = 0;

  if (grossIncome <= rothRange.min) {
    rothContribution = maxContribution;
  } else if (grossIncome < rothRange.max) {
    const phaseRatio = 1 - (grossIncome - rothRange.min) / (rothRange.max - rothRange.min);
    // IRS: round to nearest $10, minimum $200 before phasing to $0
    const raw = maxContribution * phaseRatio;
    rothContribution = raw >= 200 ? Math.max(0, Math.ceil(raw / 10) * 10) : 0;
  }
  // else: 0 (over limit)

  const backdoorRothEligible = rothContribution === 0 && grossIncome > rothRange.max;

  // --- Traditional deductibility ---
  let tradDeductibleAmount = 0;

  if (!hasWorkplacePlan && !spouseHasWorkplacePlan) {
    // Always fully deductible if neither spouse has a workplace plan
    tradDeductibleAmount = maxContribution;
  } else {
    let phaseOutRange = null;

    if (hasWorkplacePlan) {
      phaseOutRange = fs === 'mfj' ? TRAD_PHASE_OUTS.mfj_has_plan : TRAD_PHASE_OUTS.single_has_plan;
    } else if (spouseHasWorkplacePlan && fs === 'mfj') {
      // No personal plan but spouse has one (MFJ only — special rule)
      phaseOutRange = TRAD_PHASE_OUTS.mfj_spouse_plan;
    }

    if (phaseOutRange) {
      if (grossIncome <= phaseOutRange.min) {
        tradDeductibleAmount = maxContribution;
      } else if (grossIncome < phaseOutRange.max) {
        const ratio = 1 - (grossIncome - phaseOutRange.min) / (phaseOutRange.max - phaseOutRange.min);
        const raw = maxContribution * ratio;
        tradDeductibleAmount = raw >= 200 ? Math.max(0, Math.ceil(raw / 10) * 10) : 0;
      }
      // else: 0 — not deductible
    }
    // If no applicable phase-out range was found (shouldn't happen), stays 0
  }

  // --- Current marginal tax rate ---
  const marginalRate = getMarginalRate(grossIncome, fs);

  // --- State income tax note ---
  const stateNoTax = NO_INCOME_TAX_STATES.has(state);

  // --- Recommendation logic ---
  let recommendation;
  let rationale;

  const marginalPct = Math.round(marginalRate * 100);
  const retirePct = Math.round(estimatedRetirementTaxRate * 100);

  if (rothContribution === 0 && backdoorRothEligible) {
    // High earner — can't do direct Roth, Traditional non-deductible, backdoor is the move
    recommendation = 'BackdoorRoth';
    rationale = `Your income ($${grossIncome.toLocaleString()}) exceeds the Roth IRA limit. You can't contribute directly, but you're eligible for a Backdoor Roth: contribute to a non-deductible Traditional IRA, then convert to Roth immediately. No income tax on the conversion if you have no existing pre-tax IRA funds (watch the pro-rata rule).`;
  } else if (tradDeductibleAmount === 0 && rothContribution > 0) {
    // Traditional isn't deductible, Roth is available — easy Roth win
    recommendation = 'Roth';
    rationale = `Traditional IRA deduction is phased out at your income level — contributing there gets you no tax break today. Roth lets your money grow tax-free and comes out tax-free in retirement. Clear Roth win.`;
  } else if (tradDeductibleAmount > 0 && rothContribution > 0) {
    // Both options available — compare rates
    if (marginalRate > estimatedRetirementTaxRate) {
      // Save more tax by deducting now
      if (tradDeductibleAmount < maxContribution) {
        recommendation = 'Both';
        rationale = `Partially deductible Traditional IRA ($${tradDeductibleAmount.toLocaleString()} deductible of $${maxContribution.toLocaleString()}) plus Roth for the remaining $${(maxContribution - tradDeductibleAmount).toLocaleString()}. Deducting now saves ${marginalPct}% tax; you expect ${retirePct}% in retirement. Take the deduction where you can.`;
      } else {
        recommendation = 'Traditional';
        rationale = `Deduct now at ${marginalPct}% federal and pay ${retirePct}% in retirement — you keep the ${marginalPct - retirePct}% spread.${stateNoTax ? ' With no state income tax, Traditional grows even more favorably.' : ''} If your retirement spending is significantly lower than your current income, Traditional wins.`;
      }
    } else if (marginalRate < estimatedRetirementTaxRate) {
      recommendation = 'Roth';
      rationale = `Pay ${marginalPct}% tax now vs. an estimated ${retirePct}% in retirement. Better to pay the lower rate today and let it grow tax-free. Roth also has no Required Minimum Distributions — useful flexibility in retirement.`;
    } else {
      // Equal rates — Roth wins on flexibility
      recommendation = 'Roth';
      rationale = `Current and estimated retirement tax rates are equal (both ~${marginalPct}%). In a tie, Roth wins: tax-free withdrawals, no RMDs, and your retirement tax rate estimate could be wrong — Roth protects against that.`;
    }
  } else if (tradDeductibleAmount > 0 && rothContribution === 0) {
    // Over Roth limit but Traditional is deductible — Traditional or backdoor
    recommendation = 'Traditional';
    rationale = `You're over the Roth income limit, so your option is deductible Traditional IRA ($${tradDeductibleAmount.toLocaleString()} deductible). Deducting at ${marginalPct}% now and paying ${retirePct}% on withdrawals later gives you a net benefit of ${marginalPct - retirePct}% — as long as that estimate holds.`;
  } else {
    // Neither is particularly advantageous — non-deductible Traditional or backdoor Roth
    recommendation = 'BackdoorRoth';
    rationale = `At your income level, a Roth contribution isn't directly available and Traditional contributions aren't deductible. A Backdoor Roth (non-deductible Traditional → immediate Roth conversion) is your best path to tax-advantaged growth.`;
  }

  return {
    recommendation,
    rationale,
    rothContribution,
    tradDeductibleAmount,
    maxContribution,
    marginalRate,
    backdoorRothEligible,
    stateNoTax,
  };
}
