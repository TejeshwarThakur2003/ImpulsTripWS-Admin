/**
 * Application Configuration
 * 
 * This file contains centralized configuration for the application,
 * making it easier to change settings across the entire app.
 */

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests
  baseUrl: 'http://localhost:8000',
  
  // API path pattern - different servers might use different patterns:
  // - No prefix: '/contacts'
  // - Admin prefix: '/admin/contacts'
  // - API prefix: '/api/contacts'
  // - API admin prefix: '/api/admin/contacts'
  // 
  // Change this to match your server's route pattern
  apiPrefix: '/api', // Try different values if endpoints return 404
  
  // Default request options
  defaultOptions: {
    withCredentials: false, // Set to true if your server supports credentials and has proper CORS
    timeout: 30000, // 30 seconds
  }
};

// Authentication Configuration
export const AUTH_CONFIG = {
  // Local storage key for auth token
  tokenKey: 'impulstrip_admin_token',
  
  // Token expiration time (in milliseconds)
  tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours
  
  // Auth redirect paths
  loginPath: '/login',
  dashboardPath: '/dashboard',
  unauthorizedPath: '/login?error=session_expired'
};

// Feature Flags
export const FEATURES = {
  enableBlog: true,
  enableWaitlist: true, 
  enableNewsletter: true,
  enableAnalytics: true,
  enableContactMessages: true
}; 