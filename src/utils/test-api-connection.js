/**
 * API Connection Test Script
 * 
 * This script tests connections to both backend APIs.
 * Run with: node --experimental-modules src/utils/test-api-connection.js
 */

// Use CommonJS require for node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testApiConnections() {
  console.log('🔍 Testing API Connections');
  
  // Hardcode the URLs for testing
  const publicApiUrl = 'http://localhost:8000';
  const fastApiUrl = 'http://localhost:8000';
  
  console.log('Environment Settings:');
  console.log(`- Express API URL: ${publicApiUrl}`);
  console.log(`- FastAPI URL: ${fastApiUrl}`);
  
  // Test Express API
  console.log('\n📡 Testing Express API Connection...');
  try {
    const expressResponse = await fetch(`${publicApiUrl}/ping`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (expressResponse.ok) {
      console.log('✅ Express API connection successful!');
      try {
        const data = await expressResponse.json();
        console.log('Response:', data);
      } catch (e) {
        console.log('Response received but not JSON format');
      }
    } else {
      console.error(`❌ Express API connection failed: ${expressResponse.status} ${expressResponse.statusText}`);
    }
  } catch (error) {
    console.error('❌ Express API request failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('The Express server is not running or not accepting connections on port 8001');
    }
  }
  
  // Test FastAPI
  console.log('\n📡 Testing FastAPI Connection...');
  try {
    const fastApiResponse = await fetch(`${fastApiUrl}/ping`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (fastApiResponse.ok) {
      console.log('✅ FastAPI connection successful!');
      try {
        const data = await fastApiResponse.json();
        console.log('Response:', data);
      } catch (e) {
        console.log('Response received but not JSON format');
      }
    } else {
      console.error(`❌ FastAPI connection failed: ${fastApiResponse.status} ${fastApiResponse.statusText}`);
    }
  } catch (error) {
    console.error('❌ FastAPI request failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('The FastAPI server is not running or not accepting connections on port 8000');
    }
  }
  
  // Login test
  console.log('\n📡 Testing Admin Login API...');
  try {
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const loginResponse = await fetch(`${publicApiUrl}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    if (loginResponse.ok) {
      console.log('✅ Login API connection successful!');
      try {
        const data = await loginResponse.json();
        console.log('Login test succeeded, token received');
      } catch (e) {
        console.log('Response received but not JSON format');
      }
    } else {
      console.error(`❌ Login API connection failed: ${loginResponse.status} ${loginResponse.statusText}`);
      try {
        const error = await loginResponse.json();
        console.log('Error response:', error);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
  } catch (error) {
    console.error('❌ Login API request failed:', error.message);
  }
}

// Run the tests
testApiConnections(); 