/**
 * Production server for the ImpulsTrip Admin Dashboard
 * This replaces the Python server with a more secure Node.js implementation
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

// Constants
const PORT = process.env.PORT || 8082;
const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../../dist');

// Check if build exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: Build directory not found!');
  console.error('Please run "npm run build" before starting the server');
  process.exit(1);
}

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.PUBLIC_API_URL || "https://api.impulstrip.com"]
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

// Serve static files from the build directory
app.use(express.static(DIST_DIR));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(DIST_DIR, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Admin dashboard running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop...');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
}); 