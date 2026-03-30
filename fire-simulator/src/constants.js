// constants.js
// Purpose: All financial constants used across the engine and components.
// Every number here has a source comment. Do not inline magic numbers elsewhere.
// Key exports: STOCK_PARAMS, BOND_PARAMS, CORRELATION, SIM_COUNT, CRISIS_SEQUENCES

// ---------------------------------------------------------------------------
// Return distribution parameters — real (inflation-adjusted) returns
// Source: Dimson, Marsh & Staunton (2023) US data; consistent with cFIREsim
// ---------------------------------------------------------------------------

export const STOCK_PARAMS = {
  // Arithmetic real mean for US stocks (S&P 500 / total market proxy)
  // Using 7.0% real arithmetic mean as specified; geometric is ~5.5% after variance drag
  meanReal: 0.070,
  stdDev: 0.170, // annualized standard deviation of real returns
};

export const BOND_PARAMS = {
  // Arithmetic real mean for US intermediate-term government/blend bonds
  // 2.3% real is consistent with post-war US bond history
  meanReal: 0.023,
  stdDev: 0.080,
};

// Correlation between stock and bond returns (annual, real)
// Slightly negative historically (~-0.05); provides modest diversification benefit
// Source: Ibbotson SBBI data, confirmed by multiple FIRE simulation tools
export const STOCK_BOND_CORRELATION = -0.05;

// Number of Monte Carlo simulation paths
// 10,000 gives stable success-rate estimates to within ~0.5% at 95% confidence
export const SIM_COUNT = 10000;

// Default retirement duration in years if user doesn't specify
export const DEFAULT_RETIREMENT_YEARS = 30;

// Default asset allocation (% stocks)
export const DEFAULT_STOCK_ALLOCATION = 0.80; // 80/20 stocks/bonds

// Success rate thresholds for color-coding
export const SUCCESS_RATE_THRESHOLDS = {
  green: 0.85,  // >= 85% → green — generally considered "safe"
  amber: 0.70,  // 70–84% → amber — borderline
  // below 70% → red — needs plan revision
};

// Social Security discount rate for NPV calculations
// 3% real discount rate is standard for SS timing analysis
export const SS_DISCOUNT_RATE = 0.03;

// Roth conversion — fill-to bracket heuristic
// Standard deduction for 2024 (MFJ) used as a conservative baseline
export const STANDARD_DEDUCTION_SINGLE = 14600;
export const STANDARD_DEDUCTION_MFJ = 29200;

// 2024 Federal income tax brackets — top of 22% bracket (taxable income)
// Source: IRS Rev. Proc. 2023-34
export const BRACKET_22_TOP_SINGLE = 100525;   // single filer taxable income
export const BRACKET_22_TOP_MFJ = 201050;       // married filing jointly

// Paywall — valid license keys (placeholder; replace with real keys from Gumroad)
// The real key list lives in utils/unlockKey.js
export const PRO_PRICE_DISPLAY = '$19';
export const GUMROAD_PRODUCT_URL = 'https://ryanordonez.gumroad.com/l/jessl';

// Fan chart percentile bands to compute and display
export const PERCENTILE_BANDS = [10, 25, 50, 75, 90];
