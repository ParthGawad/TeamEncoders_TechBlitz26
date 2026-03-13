import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function rewriteToEntryHtml() {
  return {
    name: 'rewrite-to-entry-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/patient.html'
        }
        next()
      })

      return () => {
        server.middlewares.use((req, res, next) => {
          if (
            req.headers.accept?.includes('text/html') &&
            !req.url.startsWith('/@') &&
            !req.url.startsWith('/src') &&
            !req.url.startsWith('/node_modules') &&
            !req.url.includes('.')
          ) {
            req.url = '/patient.html'
          }
          next()
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), rewriteToEntryHtml()],
  server: {
    port: 5176,
  },
  build: {
    rollupOptions: {
      input: 'patient.html',
    },
  },
})
