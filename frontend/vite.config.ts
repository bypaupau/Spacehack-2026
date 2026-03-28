import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to FastAPI backend (Phase 2 — activo)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        timeout: 3000,          // ← máx 3s antes de error (evita el cuelgue de 25min)
        proxyTimeout: 3000,
      },
    },
  },
})
