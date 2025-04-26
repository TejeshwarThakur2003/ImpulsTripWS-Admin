/**
 * Production server for the ImpulsTrip Admin Dashboard
 */
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import SSR handler (will be available after build)
let ssrHandler;
try {
  ssrHandler = (await import('../../dist/server/entry.mjs')).handler;
} catch (error) {
  console.error('SSR handler not found:', error.message);
  process.exit(1);
}

// Constants
const PORT = process.env.PORT || 8082;
const NODE_ENV = process.env.NODE_ENV || 'production';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../../dist');
const CLIENT_DIR = join(DIST_DIR, 'client');

// Check if build exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: Build directory not found!');
  console.error('Please run "npm run build" before starting the server');
  process.exit(1);
}

// Create Express app
const app = express();

// Request logging middleware only in non-production
if (NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.PUBLIC_API_URL || "https://api.impulstrip.com", process.env.PUBLIC_FASTAPI_URL || "http://localhost:8000"]
    }
  },
  frameguard: { action: 'deny' },
  xssFilter: true,
  noSniff: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Compression to improve performance
app.use(compression());

// Serve static files from the client directory with cache control
app.use(express.static(CLIENT_DIR, {
  maxAge: NODE_ENV === 'production' ? '7d' : 0
}));

// Use SSR handler for all routes
app.use(ssrHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Admin dashboard running at http://localhost:${PORT} in ${NODE_ENV} mode`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  process.exit(0);
}); 