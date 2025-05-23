import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_WEBSITE_URL || 'https://admin.impulstrip.com',
  base: '/',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8082,
    host: true
  },
  outDir: './dist',
  build: {
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    ssr: {
      noExternal: ['@fontsource/*']
    },
    build: {
      sourcemap: process.env.NODE_ENV !== 'production',
      minify: process.env.NODE_ENV === 'production',
      cssMinify: process.env.NODE_ENV === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            bootstrap: ['bootstrap'],
            fontawesome: ['@fortawesome/fontawesome-free']
          }
        }
      }
    }
  },
  // Add security headers
  headers: {
    '/*': [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      }
    ]
  }
}); 