import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 5100,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
