// components/FireSimulatorApp.jsx
// Purpose: Client-side wrapper that renders the existing FIRE simulator
//   inside the Next.js app. Imports directly from the fire-simulator/src
//   directory via the @fire-sim webpack alias.
//   This is Option B (merged components) — no iframe, full integration.
// Key exports: default FireSimulatorApp

'use client';

// Import the simulator's root App component.
// The @fire-sim alias is set in next.config.js → ../fire-simulator/src
import SimApp from '@fire-sim/App.jsx';

// Import the simulator's own CSS variables and base styles.
// The simulator relies on Tailwind classes which are compiled by this
// app's tailwind.config.js (fire-simulator/src/** is in the content paths).
export default function FireSimulatorApp() {
  return (
    // Reset min-h-screen so the simulator's own layout fills the page body
    // (the Next.js root layout already provides the outer scroll container)
    <div className="fire-simulator-root">
      <SimApp />
    </div>
  );
}
