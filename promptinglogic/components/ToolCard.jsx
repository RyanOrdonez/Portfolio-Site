// components/ToolCard.jsx
// Purpose: Reusable product card for the tools grid on homepage and /tools.
// Key exports: default ToolCard
// Props: tool — object from lib/toolsData.js

import Link from 'next/link';

export default function ToolCard({ tool }) {
  const { badge, badgeColor, title, description, tags, cta, href, available } = tool;

  const inner = (
    <div
      className={`group relative bg-[#111111] border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 h-full ${
        available
          ? 'border-[#2a2a2a] hover:border-[#f0b429]/40 cursor-pointer'
          : 'border-[#1a1a1a] opacity-70'
      }`}
    >
      {/* Badge */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
        {available && (
          <svg
            className="w-4 h-4 text-gray-700 group-hover:text-[#f0b429] transition-colors mt-0.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className={`text-sm font-semibold ${available ? 'text-white' : 'text-gray-500'}`}>
          {title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-2xs px-2 py-0.5 rounded-full bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`text-xs font-medium ${
          available
            ? 'text-[#f0b429] group-hover:text-[#e5a820]'
            : 'text-gray-600 cursor-default'
        } transition-colors`}
      >
        {cta}
      </div>
    </div>
  );

  if (available && href.startsWith('/')) {
    return <Link href={href} className="block h-full">{inner}</Link>;
  }
  if (available && href.startsWith('#')) {
    return <a href={href} className="block h-full">{inner}</a>;
  }
  return <div className="h-full">{inner}</div>;
}
