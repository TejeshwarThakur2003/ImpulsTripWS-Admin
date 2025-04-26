/**
 * Application Configuration
 * 
 * This file contains centralized configuration for the application,
 * making it easier to change settings across the entire app.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Determine environment
const isProd = import.meta.env.PROD || import.meta.env.PUBLIC_ENV === 'production';

// API Configuration
export const API_CONFIG = {
  // Base URLs from environment variables with production defaults
  expressApiUrl: import.meta.env.PUBLIC_API_URL || (isProd 
    ? 'https://api.impulstrip.com' 
    : 'http://localhost:8001'),
    
  fastApiUrl: import.meta.env.PUBLIC_FASTAPI_URL || (isProd 
    ? 'https://api.impulstrip.com' 
    : 'http://localhost:8000'),
  
  // API path mapping - Which server to use for which endpoint type
  endpointServers: {
    // MongoDB data comes from Express server on port 8001
    contacts: 'express',    // Use Express for contact messages
    waitlist: 'express',    // Use Express for waitlist
    dashboard: 'express',   // Use Express for dashboard stats
    
    // FastAPI handles these
    blog: 'fastapi',        // Use FastAPI for blog
    legal: 'fastapi'        // Use FastAPI for legal docs
  },
  
  // API path pattern - different servers might use different patterns:
  // - No prefix: '/contacts'
  // - Admin prefix: '/admin/contacts'
  // - API prefix: '/api/contacts'
  // - API admin prefix: '/api/admin/contacts'
  // 
  // Change this to match your server's route pattern
  apiPrefix: import.meta.env.PUBLIC_API_PREFIX || '/admin', // Prefix for Express endpoints
  
  // Legal documents routes (FastAPI service)
  legalRoutes: {
    privacy_policy: '/api/legal/privacy_policy',
    terms_conditions: '/api/legal/terms_conditions' 
  },
  
  // Default request options
  defaultOptions: {
    withCredentials: true, // Enable credentials for better CORS support
    timeout: parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '30000'), // 30 seconds
    retryCount: parseInt(import.meta.env.PUBLIC_API_RETRY_COUNT || '2'),
    retryDelay: parseInt(import.meta.env.PUBLIC_API_RETRY_DELAY || '1000')
  }
};

// Authentication Configuration
export const AUTH_CONFIG = {
  // Local storage key for auth token
  tokenKey: import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken',
  
  // Token expiration time (in milliseconds)
  tokenExpiration: parseInt(import.meta.env.PUBLIC_TOKEN_EXPIRATION || '43200') * 1000, // Default 12 hours
  
  // Auth redirect paths
  loginPath: '/login',
  dashboardPath: '/dashboard',
  unauthorizedPath: '/login?error=session_expired',
  
  // Security settings
  secureCookies: isProd || (isBrowser && window.location.protocol === 'https:'),
  maxLoginAttempts: parseInt(import.meta.env.PUBLIC_MAX_LOGIN_ATTEMPTS || '5'),
  loginCooldownPeriod: parseInt(import.meta.env.PUBLIC_LOGIN_COOLDOWN_MS || '30000') // 30 seconds
};

// Feature Flags
export const FEATURES = {
  enableBlog: import.meta.env.PUBLIC_FEATURE_BLOG !== 'false',
  enableWaitlist: import.meta.env.PUBLIC_FEATURE_WAITLIST !== 'false', 
  enableNewsletter: import.meta.env.PUBLIC_FEATURE_NEWSLETTER !== 'false',
  enableAnalytics: import.meta.env.PUBLIC_FEATURE_ANALYTICS !== 'false',
  enableContactMessages: import.meta.env.PUBLIC_FEATURE_CONTACTS !== 'false'
}; 