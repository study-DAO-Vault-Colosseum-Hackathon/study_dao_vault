import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'buffer': 'buffer',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    define: {
      'global': 'globalThis',
      'process.env': env,
    },
    server: {
      host: true,
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
        '/socket.io': {
          target: env.VITE_SOCKET_TARGET || 'http://localhost:3000',
          ws: true,
        },
      },
      watch: {
        usePolling: true,
      },
    },
    optimizeDeps: {
      include: ['buffer'],
    },
  }
})
