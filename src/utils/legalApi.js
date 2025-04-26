/**
 * Legal Document API utilities for admin dashboard
 */
import { API_CONFIG } from './config';
import { getToken } from './auth';

/**
 * Get the base URL for legal API requests
 */
function getLegalApiBaseUrl() {
  return API_CONFIG.fastApiUrl || 'http://localhost:8000';
}

/**
 * Make a direct API request to the legal document endpoints
 */
async function makeLegalApiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    token = getToken(),
  } = options;

  // Construct the complete URL
  const baseUrl = getLegalApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Construct fetch options
    const fetchOptions = {
      method,
      headers,
      credentials: 'include',
      mode: 'cors',
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        success: response.ok,
        status: response.status,
        data: data,
        error: response.ok ? null : (data.error || 'Unknown error')
      };
    } else {
      const text = await response.text();
      return {
        success: response.ok,
        status: response.status,
        data: text,
        error: response.ok ? null : 'Invalid response format'
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message || 'Network error'
    };
  }
}

/**
 * Legal document API functions
 */
export const legalApi = {
  // Get legal document
  getDocument: async (docType, token = getToken()) => {
    return await makeLegalApiRequest(`/api/legal/${docType}`, { token });
  },
  
  // Update legal document
  updateDocument: async (docType, data, token = getToken()) => {
    return await makeLegalApiRequest(`/api/legal/${docType}`, {
      method: 'PUT',
      body: data,
      token
    });
  }
};

export default legalApi; 