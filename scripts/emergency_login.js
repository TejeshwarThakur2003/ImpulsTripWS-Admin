// Emergency Login Script for Admin Dashboard
// Run this in your browser console when on the login page

(async function() {
  console.clear();
  console.log("===== EMERGENCY LOGIN SCRIPT =====");
  
  // Step 1: Clear any existing tokens
  console.log("\n1. Clearing existing tokens...");
  localStorage.removeItem('adminToken');
  localStorage.removeItem('tokenExpiry');
  console.log("✅ Tokens cleared");
  
  // Step 2: Perform direct login
  console.log("\n2. Attempting direct login...");
  try {
    const response = await fetch('http://localhost:8000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: 'username=admin&password=changeme'
    });
    
    console.log(`Response status: ${response.status}`);
    const responseText = await response.text();
    console.log(`Raw response: ${responseText}`);
    
    try {
      // Try to parse as JSON
      const data = JSON.parse(responseText);
      
      if (data.access_token) {
        console.log("\n✅ Login successful! Token received");
        
        // Set the token in localStorage
        localStorage.setItem('adminToken', data.access_token);
        
        // Set expiry to 24 hours from now
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        localStorage.setItem('tokenExpiry', expiry.toISOString());
        
        console.log(`Token: ${data.access_token.substring(0, 20)}...`);
        console.log(`Token expiry: ${expiry.toISOString()}`);
        
        // Step 3: Test the token
        console.log("\n3. Testing token with dashboard API...");
        const dashResponse = await fetch('http://localhost:8000/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (dashResponse.ok) {
          const dashData = await dashResponse.json();
          console.log("✅ Dashboard data retrieved successfully:");
          console.log(dashData);
          
          console.log("\n🎉 Authentication fixed! You can now navigate to the dashboard.");
          
          // Offer to redirect
          if (confirm("Login successful! Would you like to go to the dashboard now?")) {
            window.location.replace('/dashboard');
          }
        } else {
          console.error("❌ Dashboard API call failed:", await dashResponse.text());
        }
      } else {
        console.error("❌ No access token in response");
      }
    } catch (e) {
      console.error("❌ Failed to parse response:", e);
    }
  } catch (error) {
    console.error("❌ Login failed:", error);
  }
})();
