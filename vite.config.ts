import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['orbit-icon.svg', 'orbit-icon-maskable.svg', 'apple-touch-icon.svg'],
      manifest: {
        name: 'Orbit - Personal Life Manager',
        short_name: 'Orbit',
        description: 'Minimal personal life manager for subscriptions, habits, goals, and renewals',
        theme_color: '#131313',
        background_color: '#131313',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'orbit-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'orbit-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'orbit-icon-maskable.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable any',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          icons: ['lucide-react'],
          state: ['zustand'],
        },
      },
    },
  },
})
