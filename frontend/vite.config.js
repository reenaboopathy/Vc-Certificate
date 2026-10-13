import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: process.env.VITE_API_PROXY || 'http://localhost:5000', changeOrigin: true }
    }
  }
})