// app/blog/page.jsx
// Purpose: /blog — blog index. Infrastructure is ready for MDX posts;
//   currently shows a coming-soon state with planned post topics.
// Key exports: metadata, default BlogPage

import Link from 'next/link';

export const metadata = {
  title: 'Blog — Methodology, FIRE Investing & AI Prompting',
  description:
    'Deep dives on retirement math, FIRE methodology, and AI prompting techniques. Written by a data scientist with no products to sell.',
  openGraph: {
    title: 'Blog | PromptingLogic',
    url: 'https://promptinglogic.com/blog',
  },
};

const PLANNED_POSTS = [
  {
    slug: 'why-zero-social-security',
    title: 'Why I built a retirement calculator that assumes Social Security is zero',
    tag: 'Methodology',
    description:
      'The SSA\'s own 2024 Trustees Report says the trust fund depletes around 2033. Here\'s why that\'s the right baseline assumption, and what it means for your FIRE number.',
  },
  {
    slug: 'sequence-of-returns-explained',
    title: 'The sequence of returns problem explained with actual numbers',
    tag: 'Education',
    description:
      'Two portfolios, identical 30-year average returns, completely different outcomes. Here\'s the math that most retirement calculators hide from you.',
  },
  {
    slug: 'roth-vs-traditional-decision-tree',
    title: 'Roth vs. Traditional: the decision tree that works for most people',
    tag: 'Tax strategy',
    description:
      'Skip the hand-wavy advice. Here\'s the actual comparison: current marginal rate vs. expected retirement rate, with examples at $60k, $100k, and $180k income.',
  },
  {
    slug: 'monte-carlo-vs-historical',
    title: 'Monte Carlo vs. historical backtesting — which one should you trust?',
    tag: 'Methodology',
    description:
      'Historical backtesting uses real returns but has only ~90 independent 30-year periods. Monte Carlo generates thousands of synthetic paths. Both have failure modes worth understanding.',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#f0b429] uppercase tracking-widest">Blog</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          The math behind the tools
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Methodology posts, FIRE fundamentals, and AI prompting techniques.
          Written for people who want to understand the reasoning, not just the output.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="flex items-center gap-3 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#f0b429] animate-pulse" />
        <p className="text-xs text-gray-400">
          First posts publishing soon. Subscribe below to get notified.
        </p>
      </div>

      {/* Planned posts */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Coming up
        </div>
        {PLANNED_POSTS.map(({ slug, title, tag, description }) => (
          <div
            key={slug}
            className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 space-y-2 opacity-60"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xs font-medium text-[#f0b429]/70 border border-[#f0b429]/20 bg-[#f0b429]/5 px-2 py-0.5 rounded-full">
                {tag}
              </span>
              <span className="text-2xs text-gray-700">Coming soon</span>
            </div>
            <h2 className="text-sm font-semibold text-white leading-snug">{title}</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Subscribe CTA */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl px-6 py-6 space-y-3">
        <h3 className="text-sm font-bold text-white">Get notified when posts publish</h3>
        <p className="text-xs text-gray-500">
          No spam — just new posts, tool launches, and methodology notes.
        </p>
        <Link
          href="/#waitlist"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0b429] hover:text-[#e5a820] transition-colors"
        >
          Subscribe on the homepage →
        </Link>
      </div>
    </div>
  );
}
