// app/fire/page.jsx
// Purpose: /fire route — renders the FIRE Retirement Simulator.
//   Uses dynamic import with ssr:false because the simulator uses browser APIs
//   (localStorage, requestAnimationFrame, Web Workers-compat patterns).
//   The root layout's Nav/Footer are suppressed here — the simulator has its own.
// Key exports: metadata, default FirePage

import dynamic from 'next/dynamic';

export const metadata = {
  title: 'FIRE Retirement Simulator — Monte Carlo Retirement Planning',
  description:
    'Stress-test your retirement with 10,000 Monte Carlo simulation paths. Models Social Security scenarios, historical crises, and Roth/IRA optimization. Free to start.',
  openGraph: {
    title: 'FIRE Retirement Simulator | PromptingLogic',
    description:
      '10,000 simulation paths. SS scenario toggle. Historical crisis stress tests. Free tier + $19 Pro.',
    url: 'https://promptinglogic.com/fire',
  },
};

// Load the simulator client-side only — it uses localStorage and browser APIs.
const FireSimulatorApp = dynamic(
  () => import('../../components/FireSimulatorApp.jsx'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-3">
          <svg
            className="animate-spin h-8 w-8 text-[#f0b429] mx-auto opacity-80"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-gray-500">Loading simulator…</p>
        </div>
      </div>
    ),
  }
);

export default function FirePage() {
  return <FireSimulatorApp />;
}
