import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' ensures assets are loaded relatively, 
  // which works for GitHub Pages regardless of the repo name.
  base: './', 
});