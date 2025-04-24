/**
 * CORS Configuration Check Script
 * 
 * This script helps to identify CORS configuration issues by making a test request
 * to your API server and examining the response headers.
 * 
 * Usage: 
 * 1. Run this script in the browser console on your admin dashboard
 * 2. Check the console output for CORS configuration information
 */

async function checkCorsConfiguration() {
  console.log('🔍 Checking CORS configuration...');
  
  // The URL to test - should match your API base URL
  const url = 'http://localhost:8000/admin/contacts';
  
  try {
    // First, make a simple preflight check
    console.log('Making OPTIONS preflight request...');
    const preflightResponse = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors'
    });
    
    console.log('📋 PREFLIGHT RESPONSE HEADERS:');
    logResponseHeaders(preflightResponse);
    
    // Now make an actual request
    console.log('\nMaking GET request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      // No credentials to see what headers we get
      credentials: 'omit'
    });
    
    console.log('📋 ACTUAL RESPONSE HEADERS:');
    logResponseHeaders(response);
    
    // Analysis
    analyzeHeaders(preflightResponse, response);
    
  } catch (error) {
    console.error('❌ Error during CORS check:', error);
    console.log(`
      If you see "Failed to fetch" or a network error, this could mean:
      1. Your API server is not running
      2. The URL is incorrect
      3. CORS is completely blocking the request
      
      Check that your API server is running and accessible.
    `);
  }
}

function logResponseHeaders(response) {
  const headers = response.headers;
  
  const corsHeaders = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials',
    'Access-Control-Max-Age',
    'Access-Control-Expose-Headers'
  ];
  
  corsHeaders.forEach(header => {
    const value = headers.get(header);
    console.log(`${header}: ${value || '❌ Not set'}`);
  });
}

function analyzeHeaders(preflightResponse, response) {
  console.log('\n🔍 CORS ANALYSIS:');
  
  const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
  const allowCredentials = response.headers.get('Access-Control-Allow-Credentials');
  
  if (allowOrigin === '*') {
    console.warn('⚠️ WARNING: Access-Control-Allow-Origin is set to wildcard "*"');
    
    if (allowCredentials === 'true') {
      console.error('❌ ERROR: Wildcard "*" origin with credentials is not allowed!');
      console.log(`
        The browser will block requests with credentials when Access-Control-Allow-Origin is "*".
        Your server should be configured to:
        1. Return the specific origin in Access-Control-Allow-Origin (not "*")
        2. Keep Access-Control-Allow-Credentials: true
      `);
    } else {
      console.log('✅ Wildcard origin without credentials can work, but won\'t send cookies or auth headers');
    }
  } else if (allowOrigin) {
    console.log(`✅ Access-Control-Allow-Origin is set to specific origin: ${allowOrigin}`);
    
    if (allowCredentials === 'true') {
      console.log('✅ Access-Control-Allow-Credentials is correctly set to true');
    } else {
      console.log('⚠️ Access-Control-Allow-Credentials is not set to true, credentials won\'t be sent');
    }
  } else {
    console.error('❌ ERROR: Access-Control-Allow-Origin header is missing!');
  }
  
  console.log('\n💡 SOLUTION RECOMMENDATION:');
  console.log(`
    On your API server, ensure you have the following CORS configuration:
    
    // For Express.js
    app.use(cors({
      origin: 'http://localhost:3000', // Replace with your frontend URL
      credentials: true  
    }));
    
    // Or with header settings:
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  `);
}

// Run the check
checkCorsConfiguration(); 