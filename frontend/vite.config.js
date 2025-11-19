import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  appType: 'mpa',
  server: {
    port: 5100,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
