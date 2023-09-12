import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './product-manager-privateKey.key',
      cert: './product-manager.crt'
    }
  },
  plugins: [react()]
})
