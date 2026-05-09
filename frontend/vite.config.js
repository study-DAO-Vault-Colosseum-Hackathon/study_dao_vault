import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force 'buffer' to resolve to the module we installed
      'buffer': path.resolve(__dirname, './node_modules/buffer'),
    },
  },
  define: {
    // Standard polyfills for browser compatibility
    'global': 'globalThis',
    'process.env': {},
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})