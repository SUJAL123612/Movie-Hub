import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Movie-Hub/',

  server: {
    proxy: {
      '/api': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/movies\?endpoint=/, '/'),
      },
    },
  },
})