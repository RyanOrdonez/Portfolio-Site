// tailwind.config.js
// Purpose: Tailwind CSS configuration — dark theme, custom colors, Inter font
// ACCENT COLOR: Currently set to amber (#F59E0B) — awaiting Ryan's confirmation.
// To change accent: update the 'accent' key in theme.extend.colors below.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- App background layers ---
        surface: {
          DEFAULT: '#0a0a0a', // near-black page background
          card: '#111111',    // card surface
          elevated: '#1a1a1a', // elevated elements (modals, tooltips)
          border: '#2a2a2a',  // subtle card borders
        },
        // --- Accent: AWAITING RYAN CONFIRMATION — placeholder amber ---
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          muted: '#92400E',
          faint: '#1c1007',
        },
        // --- Semantic status colors ---
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        // --- Chart band colors (fan chart warm→cool gradient) ---
        chart: {
          p90: '#F97316', // 90th percentile — warm orange
          p75: '#FBBF24', // 75th percentile — amber
          p50: '#A3E635', // median — lime
          p25: '#38BDF8', // 25th percentile — sky blue
          p10: '#818CF8', // 10th percentile — indigo
          zero: '#EF4444', // broke line — red
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Data-dense sizing — slightly tighter than Tailwind defaults
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
};
