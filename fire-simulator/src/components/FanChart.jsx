// components/FanChart.jsx
// Purpose: Recharts fan chart showing percentile portfolio trajectories.
//   Free tier: shows full chart with blur + paywall overlay after year 15.
//   Pro tier: full 30-year unobstructed chart.
// Key exports: default FanChart
// Props:
//   trajectories  — array of { year, p10, p25, p50, p75, p90 }
//   retirementYears — total years in simulation
//   isPro         — boolean, removes blur overlay if true
//   onUnlockClick — callback for "Unlock Pro" button in overlay
//   currentAge    — optional, for age-labeled X axis

import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrencyCompact, formatCurrency, formatYear } from '../utils/formatters.js';
import { GUMROAD_PRODUCT_URL } from '../constants.js';

// Year at which free tier blur begins
const FREE_TIER_BLUR_YEAR = 15;

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------
function ChartTooltip({ active, payload, label, currentAge }) {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  const ageLabel = currentAge ? ` (Age ${currentAge + data.year})` : '';

  return (
    <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg p-3 text-xs shadow-xl">
      <div className="text-[#909098] mb-2 font-medium">
        Year {data.year}{ageLabel}
      </div>
      <div className="space-y-1">
        {[
          { key: 'p90', label: '90th %ile', color: '#F97316' },
          { key: 'p75', label: '75th %ile', color: '#FBBF24' },
          { key: 'p50', label: 'Median',    color: '#A3E635' },
          { key: 'p25', label: '25th %ile', color: '#38BDF8' },
          { key: 'p10', label: '10th %ile', color: '#818CF8' },
        ].map(({ key, label, color }) => (
          data[key] != null && (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[#909098]">{label}</span>
              </span>
              <span className="text-white font-medium tabular">
                {data[key] <= 0 ? 'Depleted' : formatCurrency(data[key])}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// YAxisTick — custom Y axis tick formatting
// ---------------------------------------------------------------------------
function YAxisTick({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="#555" fontSize={10} fontFamily="inherit">
      {formatCurrencyCompact(payload.value)}
    </text>
  );
}

// ---------------------------------------------------------------------------
// XAxisTick — shows "Year N" or age
// ---------------------------------------------------------------------------
function XAxisTick({ x, y, payload, currentAge }) {
  const yr = payload.value;
  const label = currentAge ? `${currentAge + yr}` : `Yr ${yr}`;
  return (
    <text x={x} y={y} dy={12} textAnchor="middle" fill="#555" fontSize={10} fontFamily="inherit">
      {label}
    </text>
  );
}

// ---------------------------------------------------------------------------
// PaywallOverlay — blurs years 15+ with unlock CTA
// ---------------------------------------------------------------------------
function PaywallOverlay({ onUnlockClick, blurWidth }) {
  return (
    <div
      className="absolute top-0 right-0 h-full flex items-center justify-end"
      style={{ width: `${blurWidth}%` }}
    >
      {/* Gradient fade from transparent to opaque */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#232325]/70 to-[#232325]/95 pointer-events-none" />
      {/* CTA */}
      <div className="relative z-10 mr-6 text-center space-y-2">
        <div className="text-xs text-[#909098]">Full 30-year projection</div>
        <button
          onClick={onUnlockClick}
          className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Unlock Pro — $19
        </button>
        <div className="text-2xs text-[#606068]">One-time purchase</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FanChart — main component
// ---------------------------------------------------------------------------
export default function FanChart({ trajectories, retirementYears, isPro, onUnlockClick, currentAge }) {
  if (!trajectories || trajectories.length === 0) return null;

  // Determine which data points to show (free: clip at year 15 for tooltip, but render all)
  // The blur overlay handles visual restriction — data is always computed
  const displayYears = retirementYears ?? 30;

  // Tick interval based on duration
  const tickInterval = displayYears <= 20 ? 5 : 10;
  const xTicks = [];
  for (let y = 0; y <= displayYears; y += tickInterval) {
    xTicks.push(y);
  }
  if (!xTicks.includes(displayYears)) xTicks.push(displayYears);

  // Calculate the pixel-% position of year 15 for the overlay width
  const blurStartPct = isPro ? 0 : Math.max(0, 100 - (FREE_TIER_BLUR_YEAR / displayYears) * 100);

  // Max value for Y axis (90th percentile at final year, with 10% headroom)
  const maxY = Math.max(...trajectories.map(d => d.p90 ?? 0)) * 1.05;

  return (
    <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Portfolio Projection</h3>
          <p className="text-2xs text-[#606068] mt-0.5">
            Real (inflation-adjusted) portfolio value · percentile bands
          </p>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-2xs text-[#909098]">
          {[
            { color: '#F97316', label: '90th' },
            { color: '#FBBF24', label: '75th' },
            { color: '#A3E635', label: '50th' },
            { color: '#38BDF8', label: '25th' },
            { color: '#818CF8', label: '10th' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={trajectories}
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <defs>
              {/* Gradient fills for each band */}
              <linearGradient id="grad90" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="grad75" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="grad50" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A3E635" stopOpacity={0.10} />
                <stop offset="95%" stopColor="#A3E635" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#2e2e32"
              vertical={false}
            />

            <XAxis
              dataKey="year"
              ticks={xTicks}
              tick={<XAxisTick currentAge={currentAge} />}
              axisLine={{ stroke: '#3a3a3e' }}
              tickLine={false}
              interval={0}
            />

            <YAxis
              domain={[0, maxY]}
              tick={<YAxisTick />}
              axisLine={false}
              tickLine={false}
              width={60}
            />

            <Tooltip
              content={<ChartTooltip currentAge={currentAge} />}
              cursor={{ stroke: '#444', strokeWidth: 1, strokeDasharray: '4 2' }}
            />

            {/* $0 reference line */}
            <ReferenceLine
              y={0}
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={false}
            />

            {/* 90th–75th band */}
            <Area
              type="monotone"
              dataKey="p90"
              stroke="#F97316"
              strokeWidth={1.5}
              fill="url(#grad90)"
              dot={false}
              activeDot={{ r: 3, fill: '#F97316' }}
              isAnimationActive={false}
            />

            {/* 75th–50th band */}
            <Area
              type="monotone"
              dataKey="p75"
              stroke="#FBBF24"
              strokeWidth={1.5}
              fill="url(#grad75)"
              dot={false}
              activeDot={{ r: 3, fill: '#FBBF24' }}
              isAnimationActive={false}
            />

            {/* Median line — most prominent */}
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#A3E635"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#A3E635', strokeWidth: 0 }}
              isAnimationActive={false}
            />

            {/* 25th percentile */}
            <Area
              type="monotone"
              dataKey="p25"
              stroke="#38BDF8"
              strokeWidth={1.5}
              fill="transparent"
              dot={false}
              activeDot={{ r: 3, fill: '#38BDF8' }}
              isAnimationActive={false}
            />

            {/* 10th percentile */}
            <Line
              type="monotone"
              dataKey="p10"
              stroke="#818CF8"
              strokeWidth={1}
              strokeDasharray="4 2"
              dot={false}
              activeDot={{ r: 3, fill: '#818CF8' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Free tier paywall overlay — fades in after year 15 */}
        {!isPro && (
          <PaywallOverlay
            onUnlockClick={onUnlockClick}
            blurWidth={blurStartPct}
          />
        )}
      </div>

      {/* Bottom note */}
      <p className="text-2xs text-[#606068]">
        {isPro
          ? `Showing full ${displayYears}-year projection. Shaded bands show 25th–90th percentile outcomes.`
          : `Free tier: full projection visible through year ${FREE_TIER_BLUR_YEAR}. Unlock Pro for complete ${displayYears}-year chart.`
        }
      </p>
    </div>
  );
}
