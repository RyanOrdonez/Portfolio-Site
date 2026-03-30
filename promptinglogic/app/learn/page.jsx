// app/learn/page.jsx
// Purpose: /learn — FIRE education hub.
//   Section A: prominent F-I-R-E letter display + 6 FIRE subtype cards.
//   Section B: 8-tab educational content panel.
// Key exports: metadata, default LearnPage

import Link from 'next/link';
import FireLetterDisplay from '../../components/FireLetterDisplay.jsx';
import FireTypeCard from '../../components/FireTypeCard.jsx';
import LearnTabs from '../../components/LearnTabs.jsx';

export const metadata = {
  title: 'Learn FIRE Investing — Retirement Basics Explained',
  description:
    'Plain-English guides to FIRE investing: the 4% rule, Monte Carlo simulation, sequence of returns risk, Roth vs. Traditional IRA, safe withdrawal rates, and more.',
  openGraph: {
    title: 'Learn FIRE Investing | PromptingLogic',
    description:
      'From the 4% rule to sequence of returns risk — 8 in-depth guides written for people who want to actually understand the math.',
    url: 'https://promptinglogic.com/learn',
  },
};

// ---------------------------------------------------------------------------
// FIRE subtypes data
// ---------------------------------------------------------------------------
const FIRE_TYPES = [
  {
    id: 'leanfire',
    name: 'leanFIRE',
    spendRange: 'Under $40k/yr',
    portfolioTarget: '~$1M',
    tagline: 'For the optimizer who values freedom above comfort.',
    description:
      'Retire on minimal spending through radical frugality and low fixed costs. Often involves geo-arbitrage, paid-off housing, and keeping needs extremely low. Requires the highest mental discipline of any FIRE variant.',
    color: 'text-sky-400',
  },
  {
    id: 'fire',
    name: 'FIRE',
    spendRange: '$40k–$80k/yr',
    portfolioTarget: '$1M–$2M',
    tagline: 'The classic — 4% rule, standard middle-class lifestyle.',
    description:
      'The original Trinity Study target range. Live comfortably without austerity. Most FIRE content assumes this range. Achievable on a solid income with 10–15 years of aggressive saving.',
    color: 'text-[#f0b429]',
  },
  {
    id: 'chubbyfire',
    name: 'ChubbyFIRE',
    spendRange: '$80k–$150k/yr',
    portfolioTarget: '$2M–$4M',
    tagline: 'Comfortable retirement without the fat price tag.',
    description:
      'Travel, nice restaurants, premium healthcare — without the extreme luxury of fatFIRE. Growing fast among dual-income tech couples. Requires careful tax planning as portfolio size creates RMD and tax complexity.',
    color: 'text-orange-400',
  },
  {
    id: 'fatfire',
    name: 'fatFIRE',
    spendRange: '$150k+/yr',
    portfolioTarget: '$4M+',
    tagline: 'Retire wealthy, not just financially independent.',
    description:
      'Maintain a high lifestyle in retirement — private travel, top-tier healthcare, luxury experiences. Typically reached by high earners or entrepreneurs. Tax optimization is critical at this scale.',
    color: 'text-purple-400',
  },
  {
    id: 'coastfire',
    name: 'CoastFIRE',
    spendRange: 'Varies',
    portfolioTarget: 'Invest aggressively early, stop contributing',
    tagline: 'Do the hard work early, then coast to the finish.',
    description:
      'Reach a portfolio size early enough that compounding alone — with no new contributions — will grow it to your FIRE number by traditional retirement age. Once you hit CoastFIRE, your investments work for you while you work for current expenses.',
    color: 'text-teal-400',
  },
  {
    id: 'baristafire',
    name: 'BaristaFIRE',
    spendRange: 'Partially covered by part-time work',
    portfolioTarget: 'Smaller than full FIRE target',
    tagline: 'Semi-retire and let the portfolio do the heavy lifting.',
    description:
      'Work part-time in a low-stress job that covers basic living expenses (health insurance, groceries, utilities). Your investments grow untouched or are drawn down slowly. More flexibility than full FIRE, less grind than full-time work.',
    color: 'text-green-400',
  },
];

// ---------------------------------------------------------------------------
// LearnPage
// ---------------------------------------------------------------------------
export default function LearnPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ------------------------------------------------------------------ */}
      {/* Page header */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="space-y-2 mb-2">
          <div className="text-xs font-semibold text-[#f0b429] uppercase tracking-widest">Learn</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Understand your money before you invest it
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Plain-English guides with no hidden agenda. Written for someone who wants to
            actually understand the math, not just follow a formula.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Section A — F·I·R·E letter display */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-[#1a1a1a]">
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-bold text-white">What does FIRE stand for?</h2>
          <p className="text-sm text-gray-500">
            Four words that redefined what retirement can look like.
          </p>
        </div>
        <FireLetterDisplay />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section A2 — FIRE subtypes */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-[#1a1a1a]">
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-bold text-white">What type of FIRE are you?</h2>
          <p className="text-sm text-gray-500">
            Six flavors of financial independence — from bare-minimum lean to fully fat.
            Click any card to deep-link, then use the simulator to run your numbers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIRE_TYPES.map(type => (
            <FireTypeCard key={type.id} type={type} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/fire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f0b429] hover:bg-[#e5a820] text-black font-bold rounded-xl transition-colors text-sm"
          >
            Find your number →
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section B — tabbed education content */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-[#1a1a1a]">
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-bold text-white">The fundamentals, explained</h2>
          <p className="text-sm text-gray-500">
            Eight topics every FIRE practitioner needs to understand.
            Each guide includes a key takeaway and the most common mistake.
          </p>
        </div>
        <LearnTabs />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom CTA */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Ready to run your numbers?</h3>
            <p className="text-sm text-gray-500">
              Put the theory to work. 10,000 simulations. Free to start.
            </p>
          </div>
          <Link
            href="/fire"
            className="flex-shrink-0 px-6 py-3 bg-[#f0b429] hover:bg-[#e5a820] text-black font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Open the Simulator →
          </Link>
        </div>
      </section>

    </div>
  );
}
