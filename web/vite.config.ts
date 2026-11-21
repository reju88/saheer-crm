import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // shortcut: GH Pages needs a subpath base; drop GITHUB_PAGES when moving to a root domain
  base: process.env.GITHUB_PAGES === 'true' ? '/saheer-crm/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
