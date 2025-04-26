/**
 * Authentication utilities for the admin dashboard
 */
import { AUTH_CONFIG } from './config';

// Helper to check if we're in browser context
const isBrowser = typeof window !== 'undefined';

/**
 * Check if the user is currently authenticated with a valid token
 */
export const isAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    const token = getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Store the auth token in localStorage and set cookie
 */
export const setToken = (token: string): void => {
  if (!isBrowser) return;
  
  try {
    const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
    localStorage.setItem(tokenName, token);
    
    // Store expiry time
    const expiryTime = new Date();
    const expiryMs = AUTH_CONFIG.tokenExpiration || 43200000; // Default 12 hours
    expiryTime.setTime(expiryTime.getTime() + expiryMs);
    localStorage.setItem('tokenExpiry', expiryTime.toISOString());
    
    // Set cookie for server-side auth
    const maxAge = Math.floor(expiryMs / 1000);
    const secure = AUTH_CONFIG.secureCookies ? '; Secure' : '';
    const sameSite = AUTH_CONFIG.secureCookies ? 'Strict' : 'Lax';
    
    document.cookie = `${tokenName}=${token}; path=/; max-age=${maxAge}; SameSite=${sameSite}${secure}`;
    
    console.log('Authentication token stored successfully');
  } catch (error) {
    console.error('Error storing authentication token:', error);
  }
};

/**
 * Clear all authentication data (logout)
 */
export const clearToken = (): void => {
  if (!isBrowser) return;
  
  try {
    console.log('Clearing authentication token');
    const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
    
    // Clear localStorage items
    localStorage.removeItem(tokenName);
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('loginAttempts');
    
    // Clear all user data
    const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
    localStorage.removeItem(userDataName);
    
    // Clear the cookie with all possible configurations to ensure it's removed
    document.cookie = `${tokenName}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${tokenName}=; path=/; max-age=0; SameSite=Strict`;
    document.cookie = `${tokenName}=; path=/; max-age=0; SameSite=Lax; Secure`;
    document.cookie = `${tokenName}=; path=/; max-age=0; SameSite=Strict; Secure`;
    document.cookie = `${tokenName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Gets the current auth token with validation
 */
export const getToken = (): string | null => {
  if (!isBrowser) return null;
  
  try {
    const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
    let token = localStorage.getItem(tokenName);
    
    // BUGFIX: Check sessionStorage as backup source if not in localStorage
    if (!token && typeof sessionStorage !== 'undefined') {
      const backupToken = sessionStorage.getItem('adminTokenBackup');
      if (backupToken) {
        console.log('Retrieved token from sessionStorage backup');
        // Save it back to localStorage for future use
        localStorage.setItem(tokenName, backupToken);
        token = backupToken;
      }
    }
    
    // If no token is found
    if (!token) {
      console.log('No authentication token found in localStorage or sessionStorage');
      return null;
    }
    
    // Check token format (basic validation)
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)) {
      console.warn('Token appears to be in invalid format');
      clearToken();
      return null;
    }
    
    // Check if token has expired
    const expiryTimeStr = localStorage.getItem('tokenExpiry');
    if (!expiryTimeStr) {
      console.log('No token expiry time found, treating as invalid');
      clearToken();
      return null;
    }
    
    try {
      const expiryTime = new Date(expiryTimeStr);
      const now = new Date();
      
      if (now > expiryTime) {
        console.log('Token has expired, clearing authentication');
        clearToken();
        return null;
      }
      
      // BUGFIX: Additional validation to detect corrupt tokens
      try {
        // Try to decode the token (at least the header part) to verify it's a valid JWT
        const [headerBase64] = token.split('.');
        if (headerBase64) {
          const headerString = atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/'));
          const header = JSON.parse(headerString);
          
          // Check if it has the expected JWT header fields
          if (!header.alg) {
            console.warn('Token header missing algorithm field, likely invalid');
            clearToken();
            return null;
          }
        }
      } catch (decodeError) {
        console.warn('Error decoding token header, token may be corrupt:', decodeError);
        clearToken();
        return null;
      }
      
      // Calculate time left before expiry
      const timeLeft = Math.floor((expiryTime.getTime() - now.getTime()) / 1000 / 60);
      
      // If token is about to expire soon (in the next 5 minutes), log warning
      if (timeLeft < 5) {
        console.warn(`Token expires very soon (${timeLeft} minutes left)`);
      } else {
        console.log(`Token is valid, expires in ${timeLeft} minutes`);
      }
      
      return token;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      clearToken();
      return null;
    }
  } catch (error) {
    console.error('Error getting authentication token:', error);
    return null;
  }
};

/**
 * Store user data in localStorage
 */
export const setUserData = (userData: any): void => {
  if (!isBrowser) return;
  
  try {
    const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
    localStorage.setItem(userDataName, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): any => {
  if (!isBrowser) return null;
  
  try {
    const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
    const userDataStr = localStorage.getItem(userDataName);
    
    if (!userDataStr) return null;
    
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
}; 