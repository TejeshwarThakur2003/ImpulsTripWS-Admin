/**
 * API utilities for the admin dashboard
 */
import { getToken, clearToken } from './auth';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  withCredentials?: boolean;
}

// Extend Window interface to include process
declare global {
  interface Window {
    process?: {
      env?: Record<string, string>;
    };
  }
}

/**
 * Makes an API request with proper error handling and authentication
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
    withCredentials = true
  } = options;

  console.log(`⭐ API Request initiated: ${endpoint}, Method: ${method}`);

  // Force use of a consistent URL - the server is running on port 8000
  const baseUrl = 'http://localhost:8000';
  
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // For debugging - log the URL being requested
  console.log(`API Request to: ${url}, Method: ${method}`);
  
  // Set default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };
  
  // Add authentication token if required
  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      console.error('Authentication required but no token found');
      
      // Only redirect to login in browser context, not during SSR
      if (typeof window !== 'undefined' && window.location) {
        // Check if we're not already on the login page to avoid redirect loops
        if (!window.location.pathname.includes('/login')) {
          console.log('Redirecting to login page');
          window.location.href = '/login';
          // Wait a moment before throwing to allow redirect to happen
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // For SSR, return a properly structured empty response
      if (typeof window === 'undefined') {
        console.log('Returning default data for SSR');
        return createDefaultResponse(endpoint) as T;
      }
      
      throw new Error('Authentication required');
    }
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    console.log('Auth token included in request');
  }
  
  // Set timeout from environment variable
  const timeout = 30000; // 30 seconds timeout
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log('Request headers:', defaultHeaders);
    if (body) console.log('Request body:', body);
    
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: withCredentials ? 'include' : undefined,
      mode: 'cors' // Explicitly specify CORS mode
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${response.status}, ${response.statusText}`);
    
    // Handle non-success responses
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      
      // Special handling for 401 Unauthorized
      if (response.status === 401) {
        console.error('Unauthorized access, token may be invalid or expired');
        
        if (typeof window !== 'undefined') {
          // Clear token to force reauthentication
          clearToken();
          
          if (!window.location.pathname.includes('/login')) {
            console.log('Redirecting to login page after 401 error');
            window.location.href = '/login?error=session_expired';
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
      
      // Try to get error data, but handle cases where we can't parse JSON
      let errorMessage = `API request failed with status ${response.status}`;
      let errorData = null;
      
      try {
        errorData = await response.json();
        console.error('Error response data:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }
      
      throw new Error(errorMessage);
    }
    
    try {
      // Parse response
      const data = await response.json();
      console.log(`API Response received for ${endpoint}:`, data);
      return data as T;
    } catch (e) {
      console.error('Error parsing response JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      console.error(`❌ API request error for ${endpoint}:`, error.message);
      
      if (error.name === 'AbortError') {
        throw new Error(`API request timed out after ${timeout}ms`);
      }
      
      // Special handling for CORS errors
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('Network request failed')) {
        console.error('This appears to be a CORS or network error. Check that backend server is running and CORS is configured correctly.');
        
        // Return a fallback response for better UX
        if (typeof window !== 'undefined' && !endpoint.includes('/auth/login')) {
          console.log('Returning fallback data for failed request');
          return createDefaultResponse(endpoint) as T;
        }
      }
      
      throw error;
    }
    
    throw new Error('Unknown error occurred');
  }
};

/**
 * Creates a default/fallback response structure based on the endpoint type
 */
function createDefaultResponse(endpoint: string): any {
  console.log(`Creating fallback response for endpoint: ${endpoint}`);
  
  // Create a default response that matches the expected type structure
  // This prevents "Cannot read property 'length' of undefined" errors
  if (endpoint.includes('/waitlist')) {
    return {
      users: [],
      total: 0,
      total_pages: 0,
      page: 1,
      limit: 10
    };
  } else if (endpoint.includes('/auth/users') || endpoint.includes('/admin/auth/users')) {
    // Handle both /auth/users and /admin/auth/users endpoints
    console.log('Returning default users response');
    return {
      users: [],
      total: 0,
      total_pages: 0,
      page: 1,
      limit: 10
    };
  } else if (endpoint.includes('/blogs')) {
    return {
      posts: [],
      total: 0,
      total_pages: 0,
      page: 1,
      limit: 10
    };
  } else if (endpoint.includes('/dashboard-stats')) {
    return {
      waitlist_count: 0,
      blog_post_count: 0,
      newsletter_count: 0,
      new_today_count: 0
    };
  } else {
    // Generic empty response
    console.warn(`No specific fallback defined for endpoint: ${endpoint}`);
    return {};
  }
} 