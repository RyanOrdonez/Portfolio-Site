// hooks/useSimulation.js
// Purpose: React hook that wraps the Monte Carlo engine.
//   Handles async execution (setTimeout to unblock the UI thread),
//   loading state, error state, and result caching.
// Key exports: useSimulation

import { useState, useCallback, useRef } from 'react';
import { runSimulation } from '../engine/monteCarlo.js';

// ---------------------------------------------------------------------------
// useSimulation
//
// Returns:
//   {
//     results,      — simulation results object (null before first run)
//     isRunning,    — boolean — show spinner while true
//     error,        — string | null
//     run,          — function(inputs) → void — triggers a new simulation run
//     lastInputs,   — the inputs used for the last completed run
//   }
// ---------------------------------------------------------------------------
export function useSimulation() {
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [lastInputs, setLastInputs] = useState(null);

  // Use a ref to track if a newer run has started while one is in progress
  // Prevents stale results from a slow run overwriting a faster newer run
  const runIdRef = useRef(0);

  const run = useCallback((inputs) => {
    // Increment run ID — any pending run with an older ID will discard its results
    const currentRunId = ++runIdRef.current;

    setIsRunning(true);
    setError(null);

    // Defer to next tick so the spinner renders before the CPU-intensive work starts.
    // 10k simulations takes ~200-500ms on modern hardware — enough to block the UI.
    setTimeout(() => {
      try {
        // inputs may include ssAnnualIncome and ssStartYear — passed through directly
        const simResults = runSimulation(inputs);

        // Only commit results if this is still the latest run
        if (runIdRef.current === currentRunId) {
          setResults(simResults);
          setLastInputs(inputs);
          setIsRunning(false);
        }
      } catch (err) {
        if (runIdRef.current === currentRunId) {
          setError('Simulation failed. Please check your inputs and try again.');
          setIsRunning(false);
        }
      }
    }, 10); // 10ms defer — enough for React to flush the loading state
  }, []);

  return { results, isRunning, error, run, lastInputs };
}
