import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The embedded game runs in a sandboxed iframe (opaque origin), so its files need the same
// CORS header locally that vercel.json sends in production.
const gameHeaders = { 'Access-Control-Allow-Origin': '*' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { headers: gameHeaders },
  preview: { headers: gameHeaders },
})
