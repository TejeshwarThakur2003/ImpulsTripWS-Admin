#!/usr/bin/env node

import fetch from 'node-fetch';

async function testAdminLogin() {
  console.log('Testing admin login API...');
  
  // Test credentials - make sure these match what's in the database
  const credentials = {
    username: 'master_admin',
    password: 'impulstrip2025'
  };
  
  // Construct the URL as it would be in the dashboard
  const baseUrl = process.env.PUBLIC_API_URL || 'http://localhost:8001';
  const endpoint = '/admin/auth/login';
  const url = `${baseUrl}${endpoint}`;
  
  console.log(`Sending request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Log response headers
    console.log('\nResponse headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Parse response body
    const data = await response.json();
    console.log('\nResponse body:');
    console.log(JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
      
      // If we got a token, test the validate endpoint
      if (data.access_token) {
        console.log('\nTesting token validation...');
        const validateUrl = `${baseUrl}/admin/auth/validate-token`;
        
        const validateResponse = await fetch(validateUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        
        console.log(`Validation status: ${validateResponse.status}`);
        
        const validateData = await validateResponse.json();
        console.log(JSON.stringify(validateData, null, 2));
      }
    } else {
      console.log('\n❌ Login failed!');
    }
  } catch (error) {
    console.error('Error during API test:', error);
  }
}

// Format for comparing with frontend code
function formatFrontendCode() {
  console.log('\nFrontend code should look like:');
  console.log(`
import { apiRequest } from "../utils/api";

// In your login handler:
try {
  const data = await apiRequest<{ access_token: string }>(
    "/admin/auth/login",
    {
      method: "POST",
      body: { username, password },
      requiresAuth: false
    }
  );
  
  // Use data.access_token
  setAuth(data.access_token, username);
  window.location.href = "/dashboard";
} catch (error) {
  // Handle error
}
  `);
}

// Run the test
testAdminLogin().then(() => {
  formatFrontendCode();
}); 