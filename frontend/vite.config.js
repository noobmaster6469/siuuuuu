import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ Allow LAN access from other devices
    port: 5173,
  },
})
