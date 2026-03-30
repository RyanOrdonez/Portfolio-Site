// lib/toolsData.js
// Purpose: Tool card data for the tools grid used on homepage and /tools.
// Key exports: TOOLS

export const TOOLS = [
  {
    id: 'fire-simulator',
    badge: 'Live',
    badgeColor: 'bg-green-400/10 text-green-400 border border-green-400/20',
    title: 'FIRE Retirement Simulator',
    description:
      'Plan your retirement as if Social Security doesn\'t exist. Monte Carlo engine with 10,000 simulation paths, historical crisis stress tests, and Roth/IRA guidance.',
    tags: ['Free tier', 'Pro $19 one-time'],
    cta: 'Try it free →',
    href: '/fire',
    available: true,
  },
  {
    id: 'options-scanner',
    badge: 'Coming Soon',
    badgeColor: 'bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a]',
    title: 'Options & Futures Scanner',
    description:
      'IV rank, unusual flow, Greeks dashboard. Built for active traders who want edge without the Bloomberg terminal price tag.',
    tags: ['Subscription', '$19–$49/mo'],
    cta: 'Join waitlist',
    href: '#waitlist',
    available: false,
  },
  {
    id: '401k-analyzer',
    badge: 'Coming Soon',
    badgeColor: 'bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a]',
    title: '401k / IRA Portfolio Analyzer',
    description:
      'Upload your plan. Find the fee drag. Get a plain-English AI summary of what you\'re actually holding and what it\'s costing you.',
    tags: ['Per report', '$9/report'],
    cta: 'Join waitlist',
    href: '#waitlist',
    available: false,
  },
];
