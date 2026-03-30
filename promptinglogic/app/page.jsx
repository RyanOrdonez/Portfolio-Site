// app/page.jsx
// Purpose: Homepage — hero, tools grid, learn teaser, about section,
//   blog placeholder, email capture. Full conversion-optimized landing page.
// Key exports: metadata, default HomePage

import Link from 'next/link';
import ToolCard from '../components/ToolCard.jsx';
import EmailCapture from '../components/EmailCapture.jsx';
import { TOOLS } from '../lib/toolsData.js';

export const metadata = {
  title: 'PromptingLogic — Finance Tools Built on Honest Math',
  description:
    'Monte Carlo retirement simulator, IRA calculator, and plain-English FIRE investing guides. Free to start. No account required. Built by a data scientist.',
  openGraph: {
    title: 'PromptingLogic — Finance Tools Built on Honest Math',
    description: 'No jargon. No Wall Street assumptions. Data-driven retirement tools for people who want to understand their money.',
    url: 'https://promptinglogic.com',
  },
};

// ---------------------------------------------------------------------------
// SectionLabel — consistent section heading pattern
// ---------------------------------------------------------------------------
function SectionLabel({ label, title, description }) {
  return (
    <div className="space-y-2 mb-8">
      {label && (
        <div className="text-xs font-semibold text-[#f0b429] uppercase tracking-widest">
          {label}
        </div>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="max-w-3xl space-y-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#111111] border border-[#2a2a2a] rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">FIRE Simulator is live — free to try</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          Finance tools built on{' '}
          <span className="text-[#f0b429]">honest math.</span>
          <br />
          Prompting tutorials for the AI age.
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
          No jargon. No Wall Street assumptions. Data-driven tools for people who want
          to understand their money and use AI intelligently.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/fire"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f0b429] hover:bg-[#e5a820] text-black font-bold rounded-xl transition-colors text-sm"
          >
            Try the FIRE Simulator →
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#2a2a2a] hover:border-[#3a3a3a] text-gray-300 hover:text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Learn the basics
          </Link>
        </div>

        {/* Trust line */}
        <p className="text-xs text-gray-600">
          Free to start · No account required · Built by a data scientist (MS, CU Boulder)
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ToolsSection
// ---------------------------------------------------------------------------
function ToolsSection() {
  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1a1a1a]">
      <SectionLabel
        label="Tools"
        title="Built for people who want real answers"
        description="Each tool is documented, assumption-transparent, and free to start. No advisor paywall."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// LearnTeaser
// ---------------------------------------------------------------------------
const LEARN_PILLS = [
  { label: 'What is FIRE?', href: '/learn#fire-number' },
  { label: 'Roth vs. Traditional', href: '/learn#roth-vs-traditional' },
  { label: 'Stocks vs. Bonds by Age', href: '/learn#stocks-vs-bonds' },
  { label: 'The 4% Rule', href: '/learn#four-percent-rule' },
  { label: 'Monte Carlo Explained', href: '/learn#monte-carlo' },
];

function LearnTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1a1a1a]">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <SectionLabel
            label="Learn"
            title="Understand your money before you invest it"
            description="From FIRE fundamentals to Roth vs. Traditional IRA — plain-English guides with no hidden agenda."
          />
          <div className="flex flex-wrap gap-2">
            {LEARN_PILLS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs px-3 py-1.5 rounded-full bg-[#111111] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0b429] hover:text-[#e5a820] transition-colors"
          >
            Explore all topics →
          </Link>
        </div>

        {/* Stats card */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            At a glance
          </div>
          {[
            { num: '8', label: 'in-depth guides', color: 'text-[#f0b429]' },
            { num: '6', label: 'FIRE subtypes explained', color: 'text-green-400' },
            { num: '0', label: 'products to sell you', color: 'text-gray-400' },
          ].map(({ num, label, color }) => (
            <div key={label} className="flex items-baseline gap-3">
              <span className={`text-3xl font-black tabular ${color}`}>{num}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AboutSection
// ---------------------------------------------------------------------------
function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1a1a1a]">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="space-y-5">
          <SectionLabel label="About" title="Why PromptingLogic?" />
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              Most financial tools are built by institutions with something to sell you.
              PromptingLogic is built by a data scientist who got tired of retirement
              calculators that assumed everything would go fine.
            </p>
            <p>
              Background: MS in Data Science from CU Boulder. Two decades in high-stakes
              operational roles before pivoting to data science and software. I build tools
              I wish existed — starting with the retirement calculator that defaults to zero
              Social Security, because the SSA's own 2024 report projects the trust fund
              runs out around 2033.
            </p>
            <p>
              Every tool ships with documented methodology, open assumptions, and no
              financial advisor paywall. The math is explained, not hidden.
            </p>
          </div>
          <a
            href="#tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0b429] hover:text-[#e5a820] transition-colors"
          >
            See the tools →
          </a>
        </div>

        {/* Credential card */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Background
          </div>
          {[
            { icon: '🎓', label: 'MS Data Science', sub: 'University of Colorado Boulder' },
            { icon: '🛠️', label: 'Full-stack builder', sub: 'React · Python · SQL · Next.js' },
            { icon: '📊', label: 'Tools built for myself first', sub: 'Starting with the FIRE simulator' },
            { icon: '🔥', label: 'FIRE practitioner', sub: 'Runs all the scenarios on my own portfolio' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-gray-600">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BlogTeaser — infrastructure placeholder
// ---------------------------------------------------------------------------
function BlogTeaser() {
  const PLACEHOLDER_POSTS = [
    {
      title: 'Why I built a retirement calculator that assumes Social Security is zero',
      date: 'Coming soon',
      tag: 'Methodology',
    },
    {
      title: 'The sequence of returns problem explained with actual numbers',
      date: 'Coming soon',
      tag: 'Education',
    },
    {
      title: 'Roth vs. Traditional: the decision tree that works for most people',
      date: 'Coming soon',
      tag: 'Tax strategy',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1a1a1a]">
      <SectionLabel
        label="Blog"
        title="From the blog"
        description="Methodology posts, investing fundamentals, and AI prompting guides."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLACEHOLDER_POSTS.map(({ title, date, tag }) => (
          <div
            key={title}
            className="relative bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 space-y-3 overflow-hidden"
          >
            {/* Coming soon overlay */}
            <div className="absolute inset-0 bg-[#111111]/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
              <span className="text-xs text-gray-600 border border-[#2a2a2a] px-3 py-1 rounded-full bg-[#0a0a0a]">
                Coming soon
              </span>
            </div>
            <div className="text-2xs font-medium text-[#f0b429]/70 uppercase tracking-wider">{tag}</div>
            <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
            <div className="text-2xs text-gray-600">{date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// EmailSection
// ---------------------------------------------------------------------------
function EmailSection() {
  return (
    <section
      id="waitlist"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1a1a1a]"
    >
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl px-6 sm:px-10 py-10">
        <div className="max-w-md">
          <EmailCapture
            headline="Stay in the loop"
            subtext="New tools, methodology posts, and prompting tutorials. No spam."
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HomePage
// ---------------------------------------------------------------------------
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsSection />
      <LearnTeaser />
      <AboutSection />
      <BlogTeaser />
      <EmailSection />
    </>
  );
}
