import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '172.25.154.96',
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: process.env.VITE_APP_API_BASE,
        changeOrigin: true
      }
    }
    }
})
