// app/tools/page.jsx
// Purpose: /tools — full tools listing page (mirrors the homepage tools section).
// Key exports: metadata, default ToolsPage

import ToolCard from '../../components/ToolCard.jsx';
import { TOOLS } from '../../lib/toolsData.js';

export const metadata = {
  title: 'Tools — Finance Tools Built on Honest Math',
  description:
    'All PromptingLogic tools: FIRE Retirement Simulator, Options Scanner (coming soon), 401k Analyzer (coming soon). Free to start.',
  openGraph: {
    title: 'Tools | PromptingLogic',
    url: 'https://promptinglogic.com/tools',
  },
};

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#f0b429] uppercase tracking-widest">Tools</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Built for people who want real answers
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Each tool ships with documented methodology, open assumptions, and no financial
          advisor paywall.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
