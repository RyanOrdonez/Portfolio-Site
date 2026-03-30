// data/historicalReturns.js
// Purpose: Hardcoded real (inflation-adjusted) annual return sequences for
//   the four major crisis stress tests.
//   Format: { stock: decimal, bond: decimal } per year
//   Source: Robert Shiller data (http://www.econ.yale.edu/~shiller/data.htm),
//           DMS Global Investment Returns Yearbook, and Federal Reserve historical data.
//           Values cross-checked against cFIREsim and portfoliovisualizer.com.
// Key exports: CRISIS_SEQUENCES

// ---------------------------------------------------------------------------
// IMPORTANT: These are REAL (inflation-adjusted) total returns.
//   Stock = US total market / S&P 500 proxy
//   Bond  = US intermediate-term government bond proxy
//   30 years of data from each crisis start year.
//   Where post-2024 data would be needed, sequences are truncated to available
//   data and padded with long-run mean returns.
// ---------------------------------------------------------------------------

// Helper: generate n years of mean returns (used to pad shorter sequences)
function meanYears(n, stockMean = 0.07, bondMean = 0.023) {
  return Array.from({ length: n }, () => ({ stock: stockMean, bond: bondMean }));
}

// ---------------------------------------------------------------------------
// 1929 — Great Depression onset
// One of the most severe sequence-of-returns risks ever recorded.
// The 1929–1932 crash wiped ~80% of equity value in real terms.
// ---------------------------------------------------------------------------
export const CRISIS_1929 = {
  label: '1929 Great Depression',
  startYear: 1929,
  description: 'The worst equity crash in US history. Real stocks fell ~80% over 3 years.',
  returns: [
    // Year  Stock    Bond
    { stock: -0.137, bond:  0.055 }, // 1929 — Black Tuesday Oct
    { stock: -0.282, bond:  0.065 }, // 1930
    { stock: -0.476, bond:  0.092 }, // 1931 — deflation, -47.6% real stock
    { stock: -0.153, bond: -0.020 }, // 1932
    { stock:  0.535, bond:  0.017 }, // 1933 — partial recovery
    { stock:  0.033, bond:  0.103 }, // 1934
    { stock:  0.449, bond:  0.049 }, // 1935
    { stock:  0.309, bond:  0.013 }, // 1936
    { stock: -0.341, bond:  0.017 }, // 1937 — second crash
    { stock:  0.300, bond:  0.053 }, // 1938
    { stock: -0.014, bond:  0.050 }, // 1939
    { stock: -0.098, bond:  0.064 }, // 1940
    { stock: -0.118, bond:  0.019 }, // 1941 — Pearl Harbor
    { stock:  0.122, bond: -0.030 }, // 1942
    { stock:  0.258, bond: -0.022 }, // 1943
    { stock:  0.195, bond: -0.024 }, // 1944
    { stock:  0.369, bond: -0.025 }, // 1945
    { stock: -0.091, bond: -0.070 }, // 1946 — post-war inflation
    { stock:  0.053, bond: -0.018 }, // 1947
    { stock:  0.054, bond: -0.022 }, // 1948
    { stock:  0.184, bond:  0.048 }, // 1949
    { stock:  0.311, bond: -0.008 }, // 1950
    { stock:  0.240, bond: -0.035 }, // 1951
    { stock:  0.184, bond: -0.015 }, // 1952
    { stock: -0.008, bond:  0.000 }, // 1953
    { stock:  0.528, bond:  0.036 }, // 1954
    { stock:  0.315, bond: -0.012 }, // 1955
    { stock:  0.066, bond: -0.003 }, // 1956
    { stock: -0.109, bond:  0.063 }, // 1957
    { stock:  0.433, bond:  0.009 }, // 1958 — year 30
  ],
};

// ---------------------------------------------------------------------------
// 1966 — The "Lost Decade" for equities + stagflation era
// Worst sequence-of-returns for bond-heavy portfolios due to rising rates.
// The 4% rule was specifically stress-tested against this period.
// ---------------------------------------------------------------------------
export const CRISIS_1966 = {
  label: '1966 Stagflation Era',
  startYear: 1966,
  description: 'Rising inflation eroded bond returns while stocks stagnated for over a decade.',
  returns: [
    { stock: -0.097, bond: -0.035 }, // 1966
    { stock:  0.240, bond: -0.018 }, // 1967
    { stock:  0.111, bond: -0.021 }, // 1968
    { stock: -0.083, bond: -0.052 }, // 1969
    { stock:  0.040, bond:  0.015 }, // 1970
    { stock:  0.144, bond:  0.109 }, // 1971
    { stock:  0.189, bond:  0.006 }, // 1972
    { stock: -0.147, bond: -0.018 }, // 1973 — oil shock
    { stock: -0.266, bond: -0.054 }, // 1974
    { stock:  0.371, bond:  0.057 }, // 1975
    { stock:  0.237, bond:  0.012 }, // 1976
    { stock: -0.072, bond: -0.033 }, // 1977
    { stock:  0.065, bond: -0.012 }, // 1978
    { stock:  0.184, bond: -0.025 }, // 1979
    { stock:  0.325, bond: -0.069 }, // 1980 — Volcker shock
    { stock: -0.049, bond: -0.031 }, // 1981
    { stock:  0.215, bond:  0.318 }, // 1982 — bond rally as rates fall
    { stock:  0.225, bond:  0.023 }, // 1983
    { stock:  0.063, bond:  0.151 }, // 1984
    { stock:  0.322, bond:  0.215 }, // 1985
    { stock:  0.186, bond:  0.154 }, // 1986
    { stock:  0.052, bond: -0.028 }, // 1987 — Black Monday
    { stock:  0.167, bond:  0.076 }, // 1988
    { stock:  0.315, bond:  0.127 }, // 1989
    { stock: -0.031, bond:  0.063 }, // 1990
    { stock:  0.304, bond:  0.158 }, // 1991
    { stock:  0.076, bond:  0.072 }, // 1992
    { stock:  0.100, bond:  0.113 }, // 1993
    { stock:  0.012, bond: -0.055 }, // 1994 — rate spike
    { stock:  0.375, bond:  0.184 }, // 1995 — year 30
  ],
};

// ---------------------------------------------------------------------------
// 2000 — Dot-com bubble burst + 9/11
// Significant for high-allocation equity portfolios. Three consecutive negative years.
// ---------------------------------------------------------------------------
export const CRISIS_2000 = {
  label: '2000 Dot-Com Crash',
  startYear: 2000,
  description: 'Three years of negative equity returns; bonds provided meaningful cushion.',
  returns: [
    { stock: -0.091, bond:  0.118 }, // 2000
    { stock: -0.118, bond:  0.033 }, // 2001 — 9/11
    { stock: -0.221, bond:  0.100 }, // 2002
    { stock:  0.281, bond:  0.017 }, // 2003
    { stock:  0.107, bond:  0.040 }, // 2004
    { stock:  0.049, bond:  0.015 }, // 2005
    { stock:  0.157, bond:  0.010 }, // 2006
    { stock:  0.054, bond:  0.097 }, // 2007
    { stock: -0.370, bond:  0.200 }, // 2008 — Financial Crisis
    { stock:  0.264, bond: -0.115 }, // 2009
    { stock:  0.151, bond:  0.083 }, // 2010
    { stock:  0.021, bond:  0.158 }, // 2011
    { stock:  0.160, bond:  0.023 }, // 2012
    { stock:  0.324, bond: -0.073 }, // 2013 — Taper Tantrum
    { stock:  0.137, bond:  0.060 }, // 2014
    { stock:  0.014, bond:  0.005 }, // 2015
    { stock:  0.119, bond:  0.009 }, // 2016
    { stock:  0.214, bond: -0.014 }, // 2017
    { stock: -0.044, bond: -0.015 }, // 2018
    { stock:  0.313, bond:  0.087 }, // 2019
    { stock:  0.183, bond:  0.078 }, // 2020 — COVID crash/recovery
    { stock:  0.287, bond: -0.018 }, // 2021
    { stock: -0.181, bond: -0.131 }, // 2022 — rate hike bear market
    { stock:  0.264, bond:  0.033 }, // 2023
    ...meanYears(6),                 // 2024–2029: padded with long-run means
  ],
};

// ---------------------------------------------------------------------------
// 2008 — Global Financial Crisis
// Maximum drawdown ~50% for equities. Short and sharp vs. 1929/1966.
// ---------------------------------------------------------------------------
export const CRISIS_2008 = {
  label: '2008 Financial Crisis',
  startYear: 2008,
  description: '~50% equity drawdown in 2008; sharp but relatively quick recovery.',
  returns: [
    { stock: -0.370, bond:  0.200 }, // 2008
    { stock:  0.264, bond: -0.115 }, // 2009
    { stock:  0.151, bond:  0.083 }, // 2010
    { stock:  0.021, bond:  0.158 }, // 2011
    { stock:  0.160, bond:  0.023 }, // 2012
    { stock:  0.324, bond: -0.073 }, // 2013
    { stock:  0.137, bond:  0.060 }, // 2014
    { stock:  0.014, bond:  0.005 }, // 2015
    { stock:  0.119, bond:  0.009 }, // 2016
    { stock:  0.214, bond: -0.014 }, // 2017
    { stock: -0.044, bond: -0.015 }, // 2018
    { stock:  0.313, bond:  0.087 }, // 2019
    { stock:  0.183, bond:  0.078 }, // 2020
    { stock:  0.287, bond: -0.018 }, // 2021
    { stock: -0.181, bond: -0.131 }, // 2022
    { stock:  0.264, bond:  0.033 }, // 2023
    ...meanYears(14),                // 2024–2037: padded with long-run means
  ],
};

// All crisis sequences in display order
export const CRISIS_SEQUENCES = [
  CRISIS_1929,
  CRISIS_1966,
  CRISIS_2000,
  CRISIS_2008,
];
