// components/SuccessRate.jsx
// Purpose: Large, prominent success rate display with color-coded gauge and plain-English label.
// Key exports: default SuccessRate
// Props:
//   successRate  — number 0.0–1.0
//   simCount     — number of simulations run (for credibility display)

import React from 'react';
import { formatPercent, successRateLabel, withdrawalRate } from '../utils/formatters.js';
import { formatCurrency } from '../utils/formatters.js';

// ---------------------------------------------------------------------------
// ArcGauge — SVG arc gauge showing success rate visually
// Inspired by the Bloomberg terminal semicircular gauges
// ---------------------------------------------------------------------------
function ArcGauge({ rate }) {
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const startAngle = -210; // degrees — left end of arc
  const endAngle   =  30;  // degrees — right end of arc
  const totalArc   = endAngle - startAngle; // 240 degrees

  // Convert degrees to radians
  const toRad = (deg) => (deg * Math.PI) / 180;

  // Arc endpoint from center + radius + angle
  const arcPoint = (angleDeg) => ({
    x: cx + radius * Math.cos(toRad(angleDeg)),
    y: cy + radius * Math.sin(toRad(angleDeg)),
  });

  const start = arcPoint(startAngle);
  const end   = arcPoint(endAngle);

  // Background track path
  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;

  // Filled portion
  const fillAngle = startAngle + totalArc * Math.min(1, Math.max(0, rate));
  const fillEnd   = arcPoint(fillAngle);
  const largeArc  = fillAngle - startAngle > 180 ? 1 : 0;
  const fillPath  = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  // Color based on rate
  const color = rate >= 0.85 ? '#10B981' : rate >= 0.70 ? '#F59E0B' : '#EF4444';

  return (
    <svg viewBox="0 0 140 100" className="w-full max-w-[180px] mx-auto">
      {/* Background track */}
      <path
        d={trackPath}
        fill="none"
        stroke="#3a3a3e"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      {rate > 0 && (
        <path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
      {/* Zone markers: 70% and 85% */}
      {[0.70, 0.85].map((threshold) => {
        const markerAngle = startAngle + totalArc * threshold;
        const inner = {
          x: cx + (radius - 8) * Math.cos(toRad(markerAngle)),
          y: cy + (radius - 8) * Math.sin(toRad(markerAngle)),
        };
        const outer = {
          x: cx + (radius + 8) * Math.cos(toRad(markerAngle)),
          y: cy + (radius + 8) * Math.sin(toRad(markerAngle)),
        };
        return (
          <line
            key={threshold}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke="#444"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SuccessRate — main component
// ---------------------------------------------------------------------------
export default function SuccessRate({ successRate, simCount, inputs }) {
  if (successRate == null) return null;

  const label = successRateLabel(successRate);
  const color = successRate >= 0.85
    ? 'text-green-400'
    : successRate >= 0.70
      ? 'text-yellow-400'
      : 'text-red-400';

  const bgColor = successRate >= 0.85
    ? 'bg-green-400/5 border-green-400/20'
    : successRate >= 0.70
      ? 'bg-yellow-400/5 border-yellow-400/20'
      : 'bg-red-400/5 border-red-400/20';

  // Safe withdrawal rate from inputs
  const swr = inputs
    ? withdrawalRate(inputs.portfolioValue, inputs.annualSpending)
    : null;

  return (
    <div className={`bg-[#232325] border rounded-xl p-5 ${bgColor}`}>
      <div className="flex items-start gap-5">
        {/* Arc gauge + big number */}
        <div className="flex-shrink-0 text-center w-[180px]">
          <ArcGauge rate={successRate} />
          <div className="mt-1">
            <div className={`text-4xl font-bold tabular leading-none ${color}`}>
              {formatPercent(successRate, 1)}
            </div>
            <div className="text-xs text-[#909098] mt-1 uppercase tracking-wide">
              Success Rate
            </div>
          </div>
        </div>

        {/* Right: label + stats */}
        <div className="flex-1 space-y-3 pt-2">
          <p className="text-sm text-[#c8c8d0] leading-relaxed">{label}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#2a2a2e] rounded-md px-3 py-2">
              <div className="text-[#909098] uppercase tracking-wide text-2xs mb-0.5">Simulations</div>
              <div className="text-white tabular font-medium">
                {simCount?.toLocaleString() ?? '—'}
              </div>
            </div>
            {swr != null && (
              <div className="bg-[#2a2a2e] rounded-md px-3 py-2">
                <div className="text-[#909098] uppercase tracking-wide text-2xs mb-0.5">Withdrawal Rate</div>
                <div className={`tabular font-medium ${
                  swr <= 0.04 ? 'text-green-400' : swr <= 0.05 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {formatPercent(swr, 2)}
                </div>
              </div>
            )}
          </div>

          {/* Zone legend */}
          <div className="flex gap-3 text-2xs text-[#909098]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              ≥85% safe
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              70–84% borderline
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              &lt;70% risky
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
