import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'react-dropzone'],
          utils: ['date-fns', 'jspdf']
        }
      }
    }
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['react-dropzone']
  }
});