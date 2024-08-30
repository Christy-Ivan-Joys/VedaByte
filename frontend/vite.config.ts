import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log(process.env.NODE_ENV,'this isthe env pro')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://vedabyte.christyivanjoys.live'
          : 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
