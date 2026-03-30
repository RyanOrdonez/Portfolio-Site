// components/UnlockGate.jsx
// Purpose: Paywall wrapper component. Renders children if user is Pro,
//   otherwise renders a blur overlay with an upgrade CTA.
//   Non-technical users cannot bypass this — the children never render
//   in the DOM when locked (conditional rendering, not just CSS hide).
// Key exports: default UnlockGate
// Props:
//   isPro         — boolean
//   onUnlockClick — opens the ProUnlockModal
//   featureName   — display name for the locked feature (e.g. "Crisis Stress Tests")
//   children      — the Pro feature component to render when unlocked

import React from 'react';
import { GUMROAD_PRODUCT_URL, PRO_PRICE_DISPLAY } from '../constants.js';

export default function UnlockGate({ isPro, onUnlockClick, featureName, children }) {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Blurred preview of the locked content */}
      <div className="blur-paywall select-none pointer-events-none opacity-40 p-4">
        {/* Placeholder skeleton that suggests what's behind the gate */}
        <div className="space-y-3">
          <div className="h-4 bg-[#2a2a2a] rounded w-2/3" />
          <div className="h-32 bg-[#1a1a1a] rounded" />
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 bg-[#2a2a2a] rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="text-center space-y-3 px-6 max-w-xs">
          <div className="text-2xl">🔒</div>
          <div>
            <h4 className="text-sm font-semibold text-white">{featureName}</h4>
            <p className="text-xs text-gray-400 mt-1">
              Unlock Pro to access {featureName} and all other advanced features.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={onUnlockClick}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Unlock Pro — {PRO_PRICE_DISPLAY}
            </button>
            <a
              href={GUMROAD_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-gray-500 hover:text-amber-400 transition-colors"
            >
              Purchase on Gumroad →
            </a>
          </div>
          <p className="text-2xs text-gray-700">
            One-time purchase · Instant unlock · No subscription
          </p>
        </div>
      </div>
    </div>
  );
}
