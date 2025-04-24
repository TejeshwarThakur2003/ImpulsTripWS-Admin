/**
 * Main entry point for the admin dashboard
 * This file is imported by Astro and other components
 */

// Import global styles
import './styles/global.css';

// Initialize application
export const init = () => {
  // This function is called when the application starts
  console.log('Admin Dashboard initialized');

  // Check environment variables
  if (import.meta.env.DEV) {
    console.log('Running in development mode');
  } else {
    console.log('Running in production mode');
  }
};

// Call init when the module is loaded directly
if (typeof window !== 'undefined') {
  // Only run in browser context
  window.addEventListener('DOMContentLoaded', () => {
    init();
  });
} 