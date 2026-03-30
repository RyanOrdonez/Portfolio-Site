// components/Footer.jsx
// Purpose: Global site footer — tagline, links, attribution, copyright.
// Key exports: default Footer

import Link from 'next/link';

const TOOL_LINKS = [
  { label: 'FIRE Simulator', href: '/fire' },
  { label: 'Options Scanner', href: '/tools' },
  { label: '401k Analyzer', href: '/tools' },
];

const LEARN_LINKS = [
  { label: 'The 4% Rule', href: '/learn#four-percent-rule' },
  { label: 'Monte Carlo', href: '/learn#monte-carlo' },
  { label: 'Roth vs. Traditional', href: '/learn#roth-vs-traditional' },
  { label: 'Your FIRE Number', href: '/learn#fire-number' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">⚡</span>
              <span className="font-bold text-white text-sm">
                Prompting<span className="text-[#f0b429]">Logic</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-[200px]">
              Finance tools built on honest math. No jargon, no hidden agenda.
            </p>
            <p className="text-xs text-gray-700">
              Built by a data scientist (MS, CU Boulder)
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</h4>
            <ul className="space-y-2">
              {TOOL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Learn</h4>
            <ul className="space-y-2">
              {LEARN_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/RyanOrdonez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://ryanordonez.gumroad.com/l/fire-sim-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#f0b429]/70 hover:text-[#f0b429] transition-colors"
                >
                  Unlock Pro — $19
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} PromptingLogic · promptinglogic.com
          </p>
          <p className="text-xs text-gray-700 text-center">
            Monte Carlo projections are for educational purposes only and do not constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
