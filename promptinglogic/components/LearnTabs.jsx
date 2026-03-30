// components/LearnTabs.jsx
// Purpose: Tabbed education content panel for /learn.
//   Renders all 8 LEARN_TABS with switching, key takeaway + common mistake callouts,
//   and a CTA linking to the relevant simulator feature.
// Key exports: default LearnTabs

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LEARN_TABS } from '../lib/learnContent.js';

export default function LearnTabs({ defaultTab }) {
  const [activeId, setActiveId] = useState(defaultTab ?? LEARN_TABS[0].id);
  const tab = LEARN_TABS.find(t => t.id === activeId) ?? LEARN_TABS[0];

  return (
    <div className="space-y-5">
      {/* Tab strip — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max sm:flex-wrap sm:min-w-0">
          {LEARN_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                t.id === activeId
                  ? 'bg-[#f0b429]/10 text-[#f0b429] border-[#f0b429]/30'
                  : 'bg-[#111111] text-gray-500 border-[#1a1a1a] hover:text-gray-300 hover:border-[#2a2a2a]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content panel */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">

        {/* Tab header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#1a1a1a]">
          <h3 className="text-lg font-bold text-white">{tab.label}</h3>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Body text */}
          <div className="space-y-3">
            {tab.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-gray-400 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Key takeaway callout */}
          <div className="flex gap-3 bg-[#0f1a0f] border border-[#1d3a1d] rounded-lg px-4 py-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-1 h-full min-h-[40px] rounded-full bg-green-400/60" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xs font-bold text-green-400 uppercase tracking-widest">
                Key Takeaway
              </div>
              <p className="text-xs text-green-300/80 leading-relaxed">
                {tab.keyTakeaway}
              </p>
            </div>
          </div>

          {/* Common mistake callout */}
          <div className="flex gap-3 bg-[#1a0a0a] border border-[#3a1a1a] rounded-lg px-4 py-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-1 h-full min-h-[40px] rounded-full bg-red-400/60" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xs font-bold text-red-400 uppercase tracking-widest">
                Common Mistake
              </div>
              <p className="text-xs text-red-300/80 leading-relaxed">
                {tab.commonMistake}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-1">
            <Link
              href={tab.ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0b429] hover:text-[#e5a820] transition-colors"
            >
              {tab.ctaText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
