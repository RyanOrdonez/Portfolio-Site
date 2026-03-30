// components/EmailCapture.jsx
// Purpose: Email capture form — POSTs to /api/subscribe.
//   Used on the homepage and potentially other pages.
// Key exports: default EmailCapture

'use client';

import { useState } from 'react';

export default function EmailCapture({ headline, subtext, className = '' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'You\'re in. We\'ll be in touch.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {headline && (
        <h3 className="text-base font-bold text-white">{headline}</h3>
      )}
      {subtext && (
        <p className="text-sm text-gray-500">{subtext}</p>
      )}

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f0b429]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-[#f0b429] hover:bg-[#e5a820] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? '…' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-400">{message}</p>
      )}

      <p className="text-2xs text-gray-700">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
