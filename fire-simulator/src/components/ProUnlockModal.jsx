// components/ProUnlockModal.jsx
// Purpose: Modal for entering a Gumroad license key to unlock Pro features.
//   Validates against the hardcoded key list in utils/unlockKey.js.
//   Stores unlock state in localStorage so users don't re-enter on refresh.
// Key exports: default ProUnlockModal
// Props:
//   onSuccess() — called when a valid key is entered
//   onClose()   — called when user dismisses the modal

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { validateKey } from '../utils/unlockKey.js';
import { GUMROAD_PRODUCT_URL, PRO_PRICE_DISPLAY } from '../constants.js';

export default function ProUnlockModal({ onSuccess, onClose }) {
  const [keyInput, setKeyInput] = useState('');
  const [status, setStatus] = useState(null); // { type: 'error'|'success', message: string }
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleValidate = useCallback(() => {
    setIsValidating(true);
    setStatus(null);

    // Small delay so the button feedback is visible
    setTimeout(() => {
      const result = validateKey(keyInput);
      setStatus({ type: result.valid ? 'success' : 'error', message: result.message });
      setIsValidating(false);

      if (result.valid) {
        setTimeout(onSuccess, 800); // brief pause to show success message
      }
    }, 300);
  }, [keyInput, onSuccess]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleValidate();
  }, [handleValidate]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#232325] border border-[#3a3a3e] rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">Unlock Pro Features</h2>
            <p className="text-xs text-[#909098] mt-0.5">Enter your Gumroad license key below</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#606068] hover:text-[#c8c8d0] transition-colors p-1 -mt-1 -mr-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* What you get */}
        <div className="bg-[#2a2a2e] rounded-lg p-3 mb-4 space-y-1.5">
          <p className="text-xs font-medium text-amber-400 mb-2">Pro includes:</p>
          {[
            'Full 30-year fan chart projection',
            'Historical crisis stress tests (1929, 1966, 2000, 2008)',
            'Scenario comparison table (save up to 5)',
            'Social Security timing analyzer',
            'Roth conversion optimizer',
            'PDF export + CSV download',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-[#c8c8d0]">
              <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </div>
          ))}
        </div>

        {/* Key input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#909098] uppercase tracking-wider">
            License Key
          </label>
          <input
            ref={inputRef}
            type="text"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setStatus(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="FIRE-PRO-XXXX-XXXX"
            className={`
              w-full bg-[#2a2a2e] border rounded-lg px-3 py-2.5
              text-sm font-mono text-[#e8e8ec] placeholder-[#505058]
              focus:outline-none transition-colors
              ${status?.type === 'error'
                ? 'border-red-400/60 focus:border-red-400'
                : status?.type === 'success'
                  ? 'border-green-400/60 focus:border-green-400'
                  : 'border-[#3a3a3e] focus:border-amber-400/60'
              }
            `}
          />

          {/* Status message */}
          {status && (
            <p className={`text-xs ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          )}
        </div>

        {/* Validate button */}
        <button
          onClick={handleValidate}
          disabled={isValidating || !keyInput.trim()}
          className={`
            w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all
            ${isValidating || !keyInput.trim()
              ? 'bg-amber-400/30 text-amber-300/60 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-black cursor-pointer'
            }
          `}
        >
          {isValidating ? 'Validating…' : 'Unlock Pro'}
        </button>

        {/* Purchase link */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-[#606068]">Don't have a key yet?</p>
          <a
            href={GUMROAD_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Purchase Pro for {PRO_PRICE_DISPLAY} on Gumroad →
          </a>
        </div>
      </div>
    </div>
  );
}
