/**
 * Authentication utilities for the admin dashboard
 */

/**
 * Check if the user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
  const token = localStorage.getItem(tokenName);
  return !!token;
};

/**
 * Store the auth token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
  localStorage.setItem(tokenName, token);
  
  // Also store token expiry time (token usually expires in 1 day)
  const expiryTime = new Date();
  expiryTime.setDate(expiryTime.getDate() + 1); // Add 1 day
  localStorage.setItem('tokenExpiry', expiryTime.toISOString());
  
  console.log('Authentication token stored successfully');
};

/**
 * Clear the auth token from localStorage (logout)
 */
export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log('Clearing authentication token');
  const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
  localStorage.removeItem(tokenName);
  localStorage.removeItem('tokenExpiry');
  
  // Also clear user data
  const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
  localStorage.removeItem(userDataName);
};

/**
 * Gets the current auth token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const tokenName = import.meta.env.PUBLIC_AUTH_TOKEN_NAME || 'adminToken';
  const token = localStorage.getItem(tokenName);
  
  // Check if token has expired
  const expiryTimeStr = localStorage.getItem('tokenExpiry');
  if (token && expiryTimeStr) {
    const expiryTime = new Date(expiryTimeStr);
    const now = new Date();
    
    if (now > expiryTime) {
      console.log('Token has expired, clearing authentication');
      clearToken();
      return null;
    }
  }
  
  return token;
};

/**
 * Store user data in localStorage
 */
export const setUserData = (userData: any): void => {
  if (typeof window === 'undefined') return;
  
  const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
  localStorage.setItem(userDataName, JSON.stringify(userData));
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): any => {
  if (typeof window === 'undefined') return null;
  
  const userDataName = import.meta.env.PUBLIC_USER_DATA_NAME || 'adminUserData';
  const userDataStr = localStorage.getItem(userDataName);
  
  if (!userDataStr) return null;
  
  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
}; 