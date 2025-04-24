/**
 * API Routes Checker
 * 
 * This script helps diagnose API endpoint issues by making requests to common routes
 * to see which ones are available.
 * 
 * Run this in your browser console to see which API endpoints are available.
 */

async function checkApiEndpoints() {
  const baseUrl = 'http://localhost:8000';
  
  // List of potential routes to test
  const endpoints = [
    // Admin routes variations
    '/admin/waitlist',
    '/waitlist',
    '/api/waitlist',
    '/api/admin/waitlist',
    
    '/admin/blogs',
    '/blogs',
    '/api/blogs',
    '/api/admin/blogs',
    
    '/admin/contacts',
    '/contacts',
    '/api/contacts',
    '/api/admin/contacts',
    
    '/admin/dashboard-stats',
    '/dashboard-stats',
    '/api/dashboard-stats',
    '/api/admin/dashboard-stats',
    
    // Auth routes
    '/admin/auth/users',
    '/auth/users',
    '/api/auth/users',
    '/api/admin/auth/users',
    '/users',
    '/api/users'
  ];
  
  console.log('🔍 Checking API endpoints...');
  console.log('This might take a moment, testing multiple endpoints...');
  
  const results = {
    working: [],
    notFound: [],
    error: []
  };
  
  // Try each endpoint
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const url = `${baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - SUCCESS (${response.status})`);
        results.working.push({
          endpoint,
          status: response.status
        });
      } else if (response.status === 404) {
        console.log(`❌ ${endpoint} - NOT FOUND (404)`);
        results.notFound.push(endpoint);
      } else {
        console.log(`⚠️ ${endpoint} - ERROR (${response.status})`);
        results.error.push({
          endpoint,
          status: response.status
        });
      }
    } catch (err) {
      console.error(`Error testing ${endpoint}:`, err);
      results.error.push({
        endpoint,
        error: err.message
      });
    }
  }
  
  // Summarize findings
  console.log('\n📋 SUMMARY:');
  console.log('Working endpoints:', results.working.length);
  results.working.forEach(item => console.log(`  ✅ ${item.endpoint} (${item.status})`));
  
  console.log('\nNot found endpoints:', results.notFound.length);
  results.notFound.forEach(endpoint => console.log(`  ❌ ${endpoint}`));
  
  console.log('\nEndpoints with errors:', results.error.length);
  results.error.forEach(item => {
    if (item.status) {
      console.log(`  ⚠️ ${item.endpoint} (${item.status})`);
    } else {
      console.log(`  ⚠️ ${item.endpoint} - ${item.error}`);
    }
  });
  
  console.log('\n💡 RECOMMENDATION:');
  if (results.working.length > 0) {
    console.log('Use these working API routes in your frontend code:');
    results.working.forEach(item => console.log(`  - ${item.endpoint}`));
  } else {
    console.log('No working API routes found. Check that your backend server is running correctly');
    console.log('You may need to:');
    console.log('1. Start your API server');
    console.log('2. Check that the API base URL is correct (currently using ' + baseUrl + ')');
    console.log('3. Review your API routes implementation');
  }
}

// Run the check
checkApiEndpoints(); 