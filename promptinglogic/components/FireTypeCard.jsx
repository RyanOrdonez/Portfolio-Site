// components/FireTypeCard.jsx
// Purpose: Card for a single FIRE subtype (leanFIRE, FIRE, CoastFIRE, etc.)
//   on the /learn page.
// Key exports: default FireTypeCard
// Props: type — object with { id, name, spendRange, portfolioTarget, tagline, description, color }

import Link from 'next/link';

export default function FireTypeCard({ type }) {
  const { id, name, spendRange, portfolioTarget, tagline, description, color, accent } = type;

  return (
    <div
      id={id}
      className="bg-[#111111] border border-[#1a1a1a] hover:border-[#2a2a2a] rounded-xl p-5 space-y-3 transition-colors"
    >
      {/* Name */}
      <div>
        <h3 className={`text-base font-bold ${color}`}>{name}</h3>
        <p className="text-xs text-gray-600 mt-0.5 italic">{tagline}</p>
      </div>

      {/* Spend + target */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0d0d0d] rounded-lg px-3 py-2">
          <div className="text-2xs text-gray-600 uppercase tracking-wide mb-0.5">Annual spend</div>
          <div className={`text-xs font-semibold tabular ${color}`}>{spendRange}</div>
        </div>
        <div className="bg-[#0d0d0d] rounded-lg px-3 py-2">
          <div className="text-2xs text-gray-600 uppercase tracking-wide mb-0.5">Portfolio target</div>
          <div className="text-xs font-semibold text-white tabular">{portfolioTarget}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>

      <Link
        href="/fire"
        className={`inline-flex items-center gap-1 text-xs font-medium ${color} hover:opacity-80 transition-opacity`}
      >
        Calculate my number →
      </Link>
    </div>
  );
}
