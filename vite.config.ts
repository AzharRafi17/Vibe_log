import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['express', '@supabase/supabase-js'],
  },

  build: {
    rollupOptions: {
      external: [
        './api/vibes.mjs',
        'express',
        '@supabase/supabase-js'
      ],
    },
  },
});