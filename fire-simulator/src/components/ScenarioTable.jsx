// components/ScenarioTable.jsx
// Purpose: Side-by-side comparison of up to 5 saved simulation scenarios.
//   Shows success rate, median outcome, and worst-case 10th percentile.
// Key exports: default ScenarioTable
// Props:
//   scenarios   — array of { id, name, inputs, successRate, medianFinalValue, worstP10FinalValue }
//   onRemove(id) — removes a scenario

import React from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters.js';

function SuccessBadge({ rate }) {
  const color = rate >= 0.85
    ? 'text-green-400 bg-green-400/10 border-green-400/30'
    : rate >= 0.70
      ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      : 'text-red-400 bg-red-400/10 border-red-400/30';

  return (
    <span className={`text-xs font-semibold tabular px-2 py-0.5 rounded border ${color}`}>
      {formatPercent(rate, 1)}
    </span>
  );
}

export default function ScenarioTable({ scenarios, onRemove }) {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Scenario Comparison</h3>
          <p className="text-2xs text-gray-500 mt-0.5">
            Save scenarios from above to compare them side-by-side (max 5)
          </p>
        </div>
        {scenarios.length > 0 && (
          <span className="text-2xs text-gray-600">{scenarios.length}/5</span>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-600">No scenarios saved yet.</p>
          <p className="text-2xs text-gray-700 mt-1">Run a simulation and use the "Save Scenario" bar above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-gray-500 py-2 pr-3 font-medium uppercase tracking-wide text-2xs">Scenario</th>
                <th className="text-right text-gray-500 py-2 px-2 font-medium uppercase tracking-wide text-2xs">Success Rate</th>
                <th className="text-right text-gray-500 py-2 px-2 font-medium uppercase tracking-wide text-2xs">Median Final</th>
                <th className="text-right text-gray-500 py-2 px-2 font-medium uppercase tracking-wide text-2xs">10th %ile</th>
                <th className="text-right text-gray-500 py-2 pl-2 font-medium uppercase tracking-wide text-2xs">Portfolio</th>
                <th className="w-6" />
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`border-b border-[#1e1e1e] ${idx % 2 === 0 ? '' : 'bg-[#0f0f0f]'}`}
                >
                  <td className="py-2.5 pr-3">
                    <div className="text-white font-medium">{s.name}</div>
                    <div className="text-2xs text-gray-600 mt-0.5">
                      {s.inputs ? `${Math.round((s.inputs.stockAllocation ?? 0.8) * 100)}/${100 - Math.round((s.inputs.stockAllocation ?? 0.8) * 100)} · ${s.inputs.retirementYears}yr` : ''}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <SuccessBadge rate={s.successRate} />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="text-white tabular">
                      {s.medianFinalValue > 0 ? formatCurrency(s.medianFinalValue) : <span className="text-red-400">Depleted</span>}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={`tabular ${s.worstP10FinalValue > 0 ? 'text-sky-300' : 'text-red-400'}`}>
                      {s.worstP10FinalValue > 0 ? formatCurrency(s.worstP10FinalValue) : 'Depleted'}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <span className="text-gray-400 tabular">
                      {s.inputs ? formatCurrency(s.inputs.portfolioValue) : '—'}
                    </span>
                  </td>
                  <td className="py-2.5 pl-1">
                    <button
                      onClick={() => onRemove(s.id)}
                      className="text-gray-700 hover:text-red-400 transition-colors p-0.5"
                      title="Remove scenario"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
