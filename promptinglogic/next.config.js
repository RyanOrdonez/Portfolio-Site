// next.config.js
// Purpose: Next.js configuration — webpack alias for fire-simulator components,
//   so /fire page can import them directly without code duplication.

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // @fire-sim/* resolves to the existing fire-simulator/src directory.
    config.resolve.alias['@fire-sim'] = path.resolve(
      __dirname,
      '../fire-simulator/src'
    );

    // When webpack processes files from ../fire-simulator/src/, it resolves
    // bare module imports (html2canvas, jspdf, recharts, etc.) relative to that
    // directory — but those packages only exist in promptinglogic/node_modules/.
    // Prepending this project's node_modules ensures they resolve correctly.
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];

    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
