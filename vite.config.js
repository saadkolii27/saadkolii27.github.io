import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'import.meta.env.VITE_APPWRITE_PROJECT_ID': JSON.stringify(process.env.VITE_APPWRITE_PROJECT_ID),
    'import.meta.env.VITE_APPWRITE_PROJECT_NAME': JSON.stringify(process.env.VITE_APPWRITE_PROJECT_NAME),
    'import.meta.env.VITE_APPWRITE_ENDPOINT': JSON.stringify(process.env.VITE_APPWRITE_ENDPOINT)
  }
})