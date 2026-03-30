// utils/formatters.js
// Purpose: Display formatting utilities for currency, percentages, and years.
//   All format functions are pure — no side effects.
// Key exports: formatCurrency, formatCurrencyCompact, formatPercent, formatYear

// ---------------------------------------------------------------------------
// formatCurrency — full dollar amount with commas, no cents
// Example: 1250000 → "$1,250,000"
// ---------------------------------------------------------------------------
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// ---------------------------------------------------------------------------
// formatCurrencyCompact — abbreviated for chart axis labels
// Example: 1250000 → "$1.25M" | 750000 → "$750K"
// ---------------------------------------------------------------------------
export function formatCurrencyCompact(value) {
  if (value == null || isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// ---------------------------------------------------------------------------
// formatPercent — decimal (0.0–1.0) to display percentage
// Example: 0.7342 → "73.4%"
// ---------------------------------------------------------------------------
export function formatPercent(value, decimals = 1) {
  if (value == null || isNaN(value)) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

// ---------------------------------------------------------------------------
// formatYear — integer year offset to "Year N" label
// Example: 15 → "Year 15"
// ---------------------------------------------------------------------------
export function formatYear(year) {
  if (year === 0) return 'Today';
  return `Year ${year}`;
}

// ---------------------------------------------------------------------------
// formatAge — compute age at a given retirement year offset
// Example: currentAge=55, year=10 → "Age 65"
// ---------------------------------------------------------------------------
export function formatAge(currentAge, yearOffset) {
  if (currentAge == null) return formatYear(yearOffset);
  return `Age ${currentAge + yearOffset}`;
}

// ---------------------------------------------------------------------------
// successRateLabel — plain-English interpretation of success rate
// ---------------------------------------------------------------------------
export function successRateLabel(rate) {
  if (rate == null) return '';
  if (rate >= 0.95) return 'Excellent — your plan is very likely to succeed.';
  if (rate >= 0.85) return 'Good — well within the historically "safe" range.';
  if (rate >= 0.70) return 'Borderline — consider reducing spending or working longer.';
  if (rate >= 0.50) return 'Risky — more than 1-in-2 chance of outliving your money.';
  return 'Danger zone — major adjustments needed before retiring.';
}

// ---------------------------------------------------------------------------
// successRateColor — Tailwind text color class based on success rate
// ---------------------------------------------------------------------------
export function successRateColorClass(rate) {
  if (rate == null) return 'text-gray-400';
  if (rate >= 0.85) return 'text-green-400';
  if (rate >= 0.70) return 'text-yellow-400';
  return 'text-red-400';
}

// ---------------------------------------------------------------------------
// withdrawalRate — compute SWR percentage from portfolio + spending
// Example: 1M portfolio, $40K spend → "4.0%"
// ---------------------------------------------------------------------------
export function withdrawalRate(portfolioValue, annualSpending) {
  if (!portfolioValue || portfolioValue === 0) return null;
  return annualSpending / portfolioValue;
}
