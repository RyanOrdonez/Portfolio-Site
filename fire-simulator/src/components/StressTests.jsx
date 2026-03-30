// components/StressTests.jsx
// Purpose: Historical crisis stress test results. Runs the user's exact portfolio
//   through 4 historical sequences (1929, 1966, 2000, 2008) using actual returns.
//   Uses runCrisisSimulation from the engine — deterministic, not Monte Carlo.
// Key exports: default StressTests
// Props:
//   portfolioValue  — number
//   annualSpending  — number
//   stockAllocation — decimal (0.0–1.0)

import React, { useMemo } from 'react';
import { runCrisisSimulation } from '../engine/monteCarlo.js';
import { CRISIS_SEQUENCES } from '../data/historicalReturns.js';
import { formatCurrency, formatPercent } from '../utils/formatters.js';

export default function StressTests({ portfolioValue, annualSpending, stockAllocation }) {
  // Run all 4 crisis simulations — pure compute, no async needed
  const crisisResults = useMemo(() => {
    if (!portfolioValue || !annualSpending) return [];

    return CRISIS_SEQUENCES.map((seq) => {
      const result = runCrisisSimulation({
        portfolioValue,
        annualSpending,
        stockAllocation: stockAllocation ?? 0.8,
        historicalReturns: seq.returns,
      });

      // Compute max drawdown during this sequence
      const peak = Math.max(...result.values);
      const trough = Math.min(...result.values);
      const maxDrawdown = peak > 0 ? (peak - trough) / peak : 0;

      // Final portfolio value
      const finalValue = result.values[result.values.length - 1];
      const finalPct = portfolioValue > 0 ? finalValue / portfolioValue : 0;

      return {
        ...seq,
        ...result,
        maxDrawdown,
        finalValue,
        finalPct,
      };
    });
  }, [portfolioValue, annualSpending, stockAllocation]);

  if (crisisResults.length === 0) return null;

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Historical Crisis Stress Tests</h3>
        <p className="text-2xs text-gray-500 mt-0.5">
          Your exact portfolio run through actual historical return sequences
        </p>
      </div>

      <div className="grid gap-3">
        {crisisResults.map((result) => (
          <div
            key={result.startYear}
            className={`border rounded-lg p-3 ${
              result.survived
                ? 'border-green-400/20 bg-green-400/5'
                : 'border-red-400/20 bg-red-400/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: crisis name + description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${result.survived ? 'text-green-400' : 'text-red-400'}`}>
                    {result.survived ? '✓ Survived' : '✗ Depleted'}
                  </span>
                  <span className="text-xs text-white font-medium">{result.label}</span>
                </div>
                <p className="text-2xs text-gray-500 mt-0.5 leading-relaxed">
                  {result.description}
                </p>
                {!result.survived && (
                  <p className="text-2xs text-red-400 mt-1">
                    Portfolio depleted in year {result.depletedYear}
                  </p>
                )}
              </div>

              {/* Right: key metrics */}
              <div className="flex-shrink-0 text-right space-y-1">
                <div>
                  <div className="text-2xs text-gray-500">Final Value</div>
                  <div className={`text-xs font-medium tabular ${result.survived ? 'text-white' : 'text-red-400'}`}>
                    {result.survived ? formatCurrency(result.finalValue) : '$0'}
                  </div>
                </div>
                <div>
                  <div className="text-2xs text-gray-500">Max Drawdown</div>
                  <div className="text-xs font-medium text-orange-400 tabular">
                    {formatPercent(result.maxDrawdown, 1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar: final / starting portfolio */}
            <div className="mt-2.5">
              <div className="flex justify-between text-2xs text-gray-600 mb-1">
                <span>Portfolio value at end of sequence</span>
                <span>{result.survived ? formatPercent(result.finalPct, 0) + ' of starting' : 'Depleted'}</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.survived ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, result.finalPct * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-2xs text-gray-700">
        Stress tests use actual historical real returns. Withdrawal amount is held constant in today's dollars.
      </p>
    </div>
  );
}
