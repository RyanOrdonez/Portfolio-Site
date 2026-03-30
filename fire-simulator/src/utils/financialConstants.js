// utils/financialConstants.js
// Purpose: 2025 IRA rules, tax brackets, and SS phase-out ranges.
//   All numbers cited with source and tax year.
//   Used by iraCalculator.js and IRASection.jsx — no React imports here.
// Key exports: IRA_LIMITS, ROTH_PHASE_OUTS, TRAD_PHASE_OUTS, TAX_BRACKETS_2025,
//              STANDARD_DEDUCTIONS_2025, NO_INCOME_TAX_STATES, SS_MULTIPLIERS

// ---------------------------------------------------------------------------
// IRA contribution limits — IRS 2025
// Source: IRS Notice 2024-80
// ---------------------------------------------------------------------------
export const IRA_LIMITS = {
  base: 7000,        // under age 50
  catchUp: 8000,     // age 50+
};

// ---------------------------------------------------------------------------
// Roth IRA income phase-out ranges — 2025
// Source: IRS Notice 2024-80
// ---------------------------------------------------------------------------
export const ROTH_PHASE_OUTS = {
  single:             { min: 150000, max: 165000 },
  mfj:                { min: 236000, max: 246000 },
  mfs:                { min: 0,      max: 10000  }, // married filing separately
};

// ---------------------------------------------------------------------------
// Traditional IRA deductibility phase-outs — 2025
// Applies when taxpayer (or spouse) has a workplace retirement plan (401k, 403b, etc.)
// Source: IRS Notice 2024-80
// ---------------------------------------------------------------------------
export const TRAD_PHASE_OUTS = {
  // Has workplace plan:
  single_has_plan:    { min: 79000,  max: 89000  },
  mfj_has_plan:       { min: 126000, max: 146000 },
  // No plan, but spouse has plan (MFJ only):
  mfj_spouse_plan:    { min: 236000, max: 246000 },
};

// ---------------------------------------------------------------------------
// 2025 Federal income tax brackets — taxable income thresholds
// Source: IRS Rev. Proc. 2024-40
// ---------------------------------------------------------------------------
export const TAX_BRACKETS_2025 = {
  single: [
    { rate: 0.10, upTo: 11925   },
    { rate: 0.12, upTo: 48475   },
    { rate: 0.22, upTo: 103350  },
    { rate: 0.24, upTo: 197300  },
    { rate: 0.32, upTo: 250525  },
    { rate: 0.35, upTo: 626350  },
    { rate: 0.37, upTo: Infinity },
  ],
  mfj: [
    { rate: 0.10, upTo: 23850   },
    { rate: 0.12, upTo: 96950   },
    { rate: 0.22, upTo: 206700  },
    { rate: 0.24, upTo: 394600  },
    { rate: 0.32, upTo: 501050  },
    { rate: 0.35, upTo: 751600  },
    { rate: 0.37, upTo: Infinity },
  ],
  mfs: [
    { rate: 0.10, upTo: 11925   },
    { rate: 0.12, upTo: 48475   },
    { rate: 0.22, upTo: 103350  },
    { rate: 0.24, upTo: 197300  },
    { rate: 0.32, upTo: 250525  },
    { rate: 0.35, upTo: 375800  },
    { rate: 0.37, upTo: Infinity },
  ],
};

// ---------------------------------------------------------------------------
// Standard deductions 2025
// Source: IRS Rev. Proc. 2024-40
// ---------------------------------------------------------------------------
export const STANDARD_DEDUCTIONS_2025 = {
  single: 15000,
  mfj:    30000,
  mfs:    15000,
};

// ---------------------------------------------------------------------------
// States with no personal income tax on retirement income
// (residents pay no state income tax in retirement — shifts math toward Traditional)
// Source: State tax law as of 2025
// ---------------------------------------------------------------------------
export const NO_INCOME_TAX_STATES = new Set([
  'Alaska', 'Florida', 'Nevada', 'New Hampshire', 'South Dakota',
  'Tennessee', 'Texas', 'Washington', 'Wyoming',
]);

// ---------------------------------------------------------------------------
// Social Security scenario multipliers
// Source: SSA OASI Trustees Report 2024 (75% cut projection for trust fund depletion)
// ---------------------------------------------------------------------------
export const SS_MULTIPLIERS = {
  none:    0,
  reduced: 0.75,  // SSA projects ~25% cut upon trust fund depletion ~2033
  full:    1.0,
};

// ---------------------------------------------------------------------------
// SS benefit adjustments by claiming age relative to FRA (age 67 for born ≥1960)
// Source: SSA.gov — "When to Start Receiving Retirement Benefits"
// ---------------------------------------------------------------------------
export const SS_AGE_ADJUSTMENTS = {
  62: 0.70,  // 30% reduction from FRA (born ≥1960 = 5 years early × 6%/yr)
  67: 1.00,  // Full Retirement Age
  70: 1.24,  // +8%/yr × 3 years beyond FRA
};
