// next.config.js
// Purpose: Next.js configuration — webpack alias for fire-simulator components,
//   so /fire page can import them directly without code duplication.

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // @fire-sim/* resolves to the existing fire-simulator/src directory.
    // This lets app/fire/page.jsx import the simulator without copying files.
    config.resolve.alias['@fire-sim'] = path.resolve(
      __dirname,
      '../fire-simulator/src'
    );
    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
