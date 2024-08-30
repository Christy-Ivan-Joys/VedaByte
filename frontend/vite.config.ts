import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode)
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: mode === 'production'
            ? 'https://vedabyte.christyivanjoys.live'
            : 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }
})
