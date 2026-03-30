// engine/monteCarlo.js
// Purpose: Pure JavaScript Monte Carlo retirement simulation engine.
//   No React dependencies — fully testable in isolation.
//   Runs 10,000 simulations, returns percentile trajectories + success rate.
// Key exports: runSimulation, computePercentileTrajectories

import {
  STOCK_PARAMS,
  BOND_PARAMS,
  STOCK_BOND_CORRELATION,
  SIM_COUNT,
  PERCENTILE_BANDS,
} from '../constants.js';

// ---------------------------------------------------------------------------
// Box-Muller transform — generate two independent standard normal samples
// from two uniform random numbers in (0, 1).
// Returns [z0, z1] where each is N(0,1).
// ---------------------------------------------------------------------------
function boxMuller() {
  // Avoid exactly 0 to prevent log(0) = -Infinity
  const u1 = Math.random() || 1e-10;
  const u2 = Math.random() || 1e-10;
  const mag = Math.sqrt(-2.0 * Math.log(u1));
  const z0 = mag * Math.cos(2.0 * Math.PI * u2);
  const z1 = mag * Math.sin(2.0 * Math.PI * u2);
  return [z0, z1];
}

// ---------------------------------------------------------------------------
// Generate correlated annual returns for stocks and bonds.
//
// Method: Cholesky decomposition for 2-variable case.
//   Given correlation ρ:
//     stockReturn = meanS + stdS * z0
//     bondReturn  = meanB + stdB * (ρ * z0 + √(1-ρ²) * z1)
//
// This correctly models the -0.05 stock/bond correlation.
// Both z0 and z1 are independent N(0,1).
// ---------------------------------------------------------------------------
function generateCorrelatedReturns(stockMean, stockStd, bondMean, bondStd, rho) {
  const [z0, z1] = boxMuller();

  // Cholesky factor for bond: ρ*z0 + sqrt(1-ρ²)*z1
  const bondZ = rho * z0 + Math.sqrt(1 - rho * rho) * z1;

  const stockReturn = stockMean + stockStd * z0;
  const bondReturn  = bondMean  + bondStd  * bondZ;

  return { stockReturn, bondReturn };
}

// ---------------------------------------------------------------------------
// Blend stock + bond returns given allocation (0.0 = all bonds, 1.0 = all stocks)
// ---------------------------------------------------------------------------
function blendedReturn(stockReturn, bondReturn, stockAllocation) {
  return stockReturn * stockAllocation + bondReturn * (1 - stockAllocation);
}

// ---------------------------------------------------------------------------
// Run a single simulation path.
//
// Arguments:
//   initialPortfolio  — starting portfolio value in today's dollars
//   annualSpending    — real annual withdrawal (today's dollars, inflation-adjusted)
//   years             — number of years to simulate
//   stockAllocation   — fraction in stocks (0–1)
//   ssAnnualIncome    — annual Social Security income in today's dollars (default 0)
//   ssStartYear       — retirement-relative year when SS income begins (default Infinity)
//   annualContribution— real annual amount added to portfolio each year (default 0)
//                       Applied at the START of each year before returns.
//                       Models ongoing savings during partial retirement or
//                       a contribution period before full retirement.
//   contributionYears — how many years from year 1 contributions are made (default 0)
//                       e.g. 5 means you add money for the first 5 years of simulation
//
// Returns:
//   { values: Float64Array(years+1), depletedYear: number|null }
// ---------------------------------------------------------------------------
function runSinglePath(
  initialPortfolio, annualSpending, years, stockAllocation,
  ssAnnualIncome = 0, ssStartYear = Infinity,
  annualContribution = 0, contributionYears = 0,
) {
  const values = new Float64Array(years + 1);
  values[0] = initialPortfolio;

  let portfolio = initialPortfolio;
  let depletedYear = null;

  for (let year = 1; year <= years; year++) {
    // 0. Add contribution if still in contribution phase (before any withdrawal)
    if (annualContribution > 0 && year <= contributionYears) {
      portfolio += annualContribution;
    }

    // 1. Withdraw at start of year (Bengen / SWR convention: withdraw first, then grow)
    //    SS income offsets the withdrawal — portfolio only covers the gap.
    const ssIncome = year >= ssStartYear ? ssAnnualIncome : 0;
    const effectiveWithdrawal = Math.max(0, annualSpending - ssIncome);
    portfolio -= effectiveWithdrawal;

    if (portfolio <= 0) {
      // Portfolio depleted before returns are applied
      depletedYear = depletedYear ?? year;
      values[year] = 0;
      // Fill remaining years with 0
      for (let r = year + 1; r <= years; r++) values[r] = 0;
      break;
    }

    // 2. Apply random returns for this year
    const { stockReturn, bondReturn } = generateCorrelatedReturns(
      STOCK_PARAMS.meanReal,
      STOCK_PARAMS.stdDev,
      BOND_PARAMS.meanReal,
      BOND_PARAMS.stdDev,
      STOCK_BOND_CORRELATION
    );

    const ret = blendedReturn(stockReturn, bondReturn, stockAllocation);
    portfolio = portfolio * (1 + ret);

    // Floor at 0 — can't have negative portfolio in this model
    if (portfolio < 0) {
      portfolio = 0;
      depletedYear = depletedYear ?? year;
    }

    values[year] = portfolio;
  }

  return { values, depletedYear };
}

// ---------------------------------------------------------------------------
// computePercentileTrajectories
//
// Given all simulation paths, compute percentile trajectories for the fan chart.
//
// Arguments:
//   allPaths      — array of Float64Array (length = SIM_COUNT), each length = years+1
//   years         — retirement duration
//   percentiles   — array of percentile values e.g. [10, 25, 50, 75, 90]
//
// Returns:
//   Array of objects: { year, p10, p25, p50, p75, p90 } for each year 0..years
// ---------------------------------------------------------------------------
function computePercentileTrajectories(allPaths, years, percentiles) {
  const trajectory = [];

  for (let year = 0; year <= years; year++) {
    // Collect all path values at this year, sort ascending
    const yearValues = allPaths.map(path => path[year]);
    yearValues.sort((a, b) => a - b);

    const entry = { year };
    for (const pct of percentiles) {
      // Nearest-rank method for percentile
      const idx = Math.max(0, Math.ceil((pct / 100) * yearValues.length) - 1);
      entry[`p${pct}`] = yearValues[idx];
    }
    trajectory.push(entry);
  }

  return trajectory;
}

// ---------------------------------------------------------------------------
// runSimulation — main entry point
//
// Arguments (inputs object):
//   portfolioValue    — current portfolio in today's dollars
//   annualSpending    — annual real withdrawal
//   stockAllocation   — fraction in stocks (0.0–1.0)
//   retirementYears   — number of years to simulate (default 30)
//   simCount          — override number of simulations (default SIM_COUNT = 10000)
//   ssAnnualIncome    — annual SS income in today's dollars (default 0)
//   ssStartYear       — retirement-relative year SS begins (default Infinity)
//   annualContribution— real annual amount added to portfolio (default 0)
//   contributionYears — years contributions are made (default 0)
//
// Returns:
//   {
//     successRate,          // 0.0–1.0
//     successCount,
//     simCount,
//     trajectories,         // percentile fan chart data [{year, p10...p90}, ...]
//     medianFinalValue,     // median portfolio value at end of simulation
//     worstP10FinalValue,   // 10th percentile final portfolio value
//     depletionYears,       // array of years when each failed sim depleted (for histogram)
//     allPaths,             // Float64Array[] — kept for scenario comparison
//   }
// ---------------------------------------------------------------------------
export function runSimulation({
  portfolioValue,
  annualSpending,
  stockAllocation,
  retirementYears,
  simCount = SIM_COUNT,
  ssAnnualIncome = 0,
  ssStartYear = Infinity,
  annualContribution = 0,
  contributionYears = 0,
}) {
  const portfolio    = Math.max(0, portfolioValue ?? 0);
  const spending     = Math.max(0, annualSpending ?? 0);
  const allocation   = Math.min(1, Math.max(0, stockAllocation ?? 0.8));
  const years        = Math.max(1, Math.min(60, retirementYears ?? 30));
  const n            = Math.max(100, simCount);
  const ssIncome     = Math.max(0, ssAnnualIncome ?? 0);
  const ssStart      = ssStartYear ?? Infinity;
  const contribution = Math.max(0, annualContribution ?? 0);
  const contribYears = Math.max(0, Math.min(years, contributionYears ?? 0));

  const allPaths = [];
  let successCount = 0;
  const depletionYears = [];

  for (let sim = 0; sim < n; sim++) {
    const { values, depletedYear } = runSinglePath(
      portfolio, spending, years, allocation,
      ssIncome, ssStart, contribution, contribYears,
    );
    allPaths.push(values);

    if (depletedYear === null) {
      successCount++;
    } else {
      depletionYears.push(depletedYear);
    }
  }

  const successRate = successCount / n;

  // Percentile trajectories for fan chart
  const trajectories = computePercentileTrajectories(allPaths, years, PERCENTILE_BANDS);

  // Final portfolio values (year `years`) across all paths — for stats
  const finalValues = allPaths.map(p => p[years]);
  finalValues.sort((a, b) => a - b);

  const medianIdx    = Math.floor(finalValues.length * 0.50);
  const p10Idx       = Math.floor(finalValues.length * 0.10);

  return {
    successRate,
    successCount,
    simCount: n,
    trajectories,
    medianFinalValue: finalValues[medianIdx],
    worstP10FinalValue: finalValues[p10Idx],
    depletionYears,
    allPaths, // kept in memory for scenario saves — caller should nullify if not needed
  };
}

// ---------------------------------------------------------------------------
// runCrisisSimulation — deterministic, uses actual historical return sequence
//
// Arguments:
//   portfolioValue    — starting portfolio
//   annualSpending    — real annual withdrawal
//   stockAllocation   — fraction in stocks
//   historicalReturns — array of { stock, bond } real return objects (annual)
//
// Returns:
//   { survived, depletedYear, values, yearsSimulated }
// ---------------------------------------------------------------------------
export function runCrisisSimulation({
  portfolioValue,
  annualSpending,
  stockAllocation,
  historicalReturns,
}) {
  const portfolio_init = Math.max(0, portfolioValue ?? 0);
  const spending       = Math.max(0, annualSpending ?? 0);
  const allocation     = Math.min(1, Math.max(0, stockAllocation ?? 0.8));

  let portfolio   = portfolio_init;
  let depletedYear = null;
  const values    = [portfolio_init];

  for (let year = 0; year < historicalReturns.length; year++) {
    // Withdraw first
    portfolio -= spending;

    if (portfolio <= 0) {
      depletedYear = year + 1; // 1-indexed year
      values.push(0);
      break;
    }

    // Apply historical return
    const { stock, bond } = historicalReturns[year];
    const ret = blendedReturn(stock, bond, allocation);
    portfolio = Math.max(0, portfolio * (1 + ret));

    if (portfolio === 0 && depletedYear === null) {
      depletedYear = year + 1;
    }

    values.push(portfolio);
  }

  return {
    survived: depletedYear === null,
    depletedYear,
    values,
    yearsSimulated: historicalReturns.length,
  };
}
