/**
 * Authentication utilities for the admin dashboard
 * This file is loaded as a module in the browser
 */

/**
 * Check if the user is currently authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

/**
 * Store the auth token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('adminToken', token);
  
  // Also store token expiry time (token usually expires in 1 day)
  const expiryTime = new Date();
  expiryTime.setDate(expiryTime.getDate() + 1); // Add 1 day
  localStorage.setItem('tokenExpiry', expiryTime.toISOString());
  
  // Also set a cookie for server-side auth
  document.cookie = `adminToken=${token}; path=/; max-age=86400; SameSite=Lax`;
};

/**
 * Clear the auth token from localStorage (logout)
 */
export const clearToken = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('tokenExpiry');
  
  // Also clear the cookie
  document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
  
  // Also clear user data
  localStorage.removeItem('adminUserData');
};

/**
 * Gets the current auth token
 */
export const getToken = () => {
  const token = localStorage.getItem('adminToken');
  
  // Check if token has expired
  const expiryTimeStr = localStorage.getItem('tokenExpiry');
  if (token && expiryTimeStr) {
    const expiryTime = new Date(expiryTimeStr);
    const now = new Date();
    
    if (now > expiryTime) {
      clearToken();
      return null;
    }
  }
  
  return token;
}; 