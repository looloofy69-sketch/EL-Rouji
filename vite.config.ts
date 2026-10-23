import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const ciBuild = process.env.EL_ROUJI_CI_BUILD === '1';

export default defineConfig({
  plugins: [react()],
  base: './',
  ...(ciBuild
    ? {
        resolve: {
          alias: {
            // Use a non-production shim to validate bundling outside AppDeploy.
            '@appdeploy/client': fileURLToPath(new URL('./ci/appdeploy-client-shim.ts', import.meta.url)),
          },
        },
      }
    : {}),
  build: {
    outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist',
    sourcemap: process.env.APPDEPLOY_VITE_SOURCEMAP === 'hidden' ? 'hidden' : false,
    rollupOptions: { maxParallelFileOps: 128 },
  },
});
