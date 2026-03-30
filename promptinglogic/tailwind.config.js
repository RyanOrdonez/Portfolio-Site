/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    // Include the fire-simulator source so Tailwind sees its classes
    '../fire-simulator/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // Matches fire-simulator's text-2xs utility
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
};
