import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function rewriteToEntryHtml() {
  return {
    name: 'rewrite-to-entry-html',
    configureServer(server) {
      // Runs BEFORE Vite's internal middleware
      server.middlewares.use((req, res, next) => {
        // Rewrite root and index.html to receptionist.html
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/receptionist.html'
        }
        next()
      })

      // Return the custom HTML for SPA client-side routes (runs AFTER Vite)
      return () => {
        server.middlewares.use((req, res, next) => {
          if (
            req.headers.accept?.includes('text/html') &&
            !req.url.startsWith('/@') &&
            !req.url.startsWith('/src') &&
            !req.url.startsWith('/node_modules') &&
            !req.url.includes('.')
          ) {
            req.url = '/receptionist.html'
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
    port: 5174,
  },
  build: {
    rollupOptions: {
      input: 'receptionist.html',
    },
  },
})
