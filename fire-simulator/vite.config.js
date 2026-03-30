// vite.config.js
// Purpose: Vite build configuration for FIRE Simulator
// Exports: default Vite config

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Vercel picks up the dist/ folder automatically
});
