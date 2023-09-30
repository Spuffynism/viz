import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

const title = 'asiuhduashd';

export default defineConfig(() => {
  return {
    server: {
      port: 3000
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), eslint()],
  };
});
