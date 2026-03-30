// components/Nav.jsx
// Purpose: Sticky global navigation bar — logo, nav links, Pro CTA button.
// Key exports: default Nav

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Tools',  href: '/tools' },
  { label: 'Learn',  href: '/learn' },
  { label: 'Blog',   href: '/blog',  disabled: true },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a]'
          : 'bg-[#0a0a0a] border-b border-[#1a1a1a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl" aria-hidden="true">⚡</span>
          <span className="font-bold text-white text-sm tracking-tight">
            Prompting<span className="text-[#f0b429]">Logic</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, disabled }) =>
            disabled ? (
              <span
                key={label}
                className="px-3 py-1.5 text-sm text-gray-600 cursor-not-allowed select-none"
              >
                {label}
                <span className="ml-1 text-2xs text-gray-700 border border-[#2a2a2a] px-1 py-0.5 rounded">
                  soon
                </span>
              </span>
            ) : (
              <Link
                key={label}
                href={href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  pathname === href || pathname?.startsWith(href + '/')
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-gray-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + mobile menu toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/fire"
            className="text-xs font-semibold text-black bg-[#f0b429] hover:bg-[#e5a820] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Try FIRE Simulator
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ label, href, disabled }) =>
            disabled ? (
              <span key={label} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                {label}
                <span className="text-2xs text-gray-700 border border-[#2a2a2a] px-1 py-0.5 rounded">soon</span>
              </span>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#141414] rounded-md"
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
