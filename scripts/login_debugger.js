// Login Debugger Script
// Copy and paste this into your browser console when you're on the login page
// and seeing the "Trying to log in..." message

(async function() {
  console.clear();
  console.log("===== LOGIN DEBUGGER =====");
  
  // 1. Check if server is reachable
  console.log("1. Checking if backend server is reachable...");
  try {
    const pingStart = Date.now();
    const pingResponse = await fetch('http://localhost:8000/ping', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });
    
    if (pingResponse.ok) {
      const pingData = await pingResponse.json();
      console.log(`✅ Server is reachable (${Date.now() - pingStart}ms)`, pingData);
    } else {
      console.error(`❌ Server returned error: ${pingResponse.status} ${pingResponse.statusText}`);
    }
  } catch (error) {
    console.error("❌ Backend server is not reachable:", error.message);
    console.log("SOLUTION: Make sure your backend server is running on port 8000");
    console.log("You can start it with: ./restart-backend.sh");
  }
  
  // 2. Check login request manually
  console.log("\n2. Attempting a direct login request...");
  
  // Get input values from the form
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  if (!usernameInput || !passwordInput) {
    console.error("❌ Cannot find username or password inputs on page");
    return;
  }
  
  const username = usernameInput.value || 'admin';
  const password = passwordInput.value || 'changeme';
  
  console.log(`Using credentials: ${username} / ${password.replace(/./g, '*')}`);
  
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    console.log("Sending direct login request...");
    const loginStart = Date.now();
    
    const response = await fetch('http://localhost:8000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: formData,
      mode: 'cors'
    });
    
    console.log(`Response received in ${Date.now() - loginStart}ms`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const rawText = await response.text();
    console.log(`Raw response: ${rawText}`);
    
    try {
      const data = JSON.parse(rawText);
      console.log("Parsed response:", data);
      
      if (data.access_token) {
        console.log("✅ Login successful! Token received");
        console.log("SOLUTION: Your login credentials work, but there may be an issue with the login form.");
      } else {
        console.error("❌ No access token in response");
      }
    } catch (parseError) {
      console.error("❌ Could not parse response as JSON:", parseError.message);
    }
  } catch (error) {
    console.error("❌ Login request failed:", error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log("SOLUTION: This could be a CORS issue. Make sure your backend has CORS enabled for your frontend origin.");
    }
  }
  
  // 3. Check for login UI issues
  console.log("\n3. Checking UI for form and alert elements...");
  
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');
  
  if (!loginForm) {
    console.error("❌ Login form element not found on page");
  } else {
    console.log("✅ Login form found", loginForm);
  }
  
  if (!loginAlert) {
    console.error("❌ Alert element not found on page");
    console.log("SOLUTION: The alert element might be missing, which is where errors are displayed");
  } else {
    console.log("✅ Alert element found:", loginAlert);
    console.log("Alert content:", loginAlert.textContent);
    console.log("Alert classes:", loginAlert.className);
    
    // Force show any hidden alerts
    if (loginAlert.classList.contains('d-none')) {
      console.log("Alert is hidden (has d-none class). Showing it for testing...");
      loginAlert.classList.remove('d-none');
      loginAlert.classList.add('alert-danger');
      loginAlert.textContent = "TEST - This is a test error message. If you can see this in the UI, the alert system works.";
    }
  }
  
  // 4. Check for console errors
  console.log("\n4. Looking for console errors...");
  if (window.consoleErrors && window.consoleErrors.length > 0) {
    console.log("Found console errors:", window.consoleErrors);
  } else {
    console.log("No console errors captured. Adding listener for future errors...");
    
    // Set up error listener
    window.consoleErrors = [];
    const oldErrorFunc = console.error;
    console.error = function() {
      window.consoleErrors.push(Array.from(arguments).join(' '));
      oldErrorFunc.apply(console, arguments);
    };
  }
  
  console.log("\n===== DIAGNOSTIC SUGGESTIONS =====");
  console.log("1. Clear your browser cache and cookies");
  console.log("2. Run the optimize_login.sh script: ./optimize_login.sh");
  console.log("3. Check that the backend server is running");
  console.log("4. Check MongoDB connection in backend/config.py");
  console.log("5. Try the following commands in the backend directory:");
  console.log("   pip install python-bcrypt pymongo[srv] python-jose[cryptography]");
  console.log("   npm install bcrypt mongoose dotenv");
  
  console.log("\nTry this direct login command:");
  console.log(`
  fetch('http://localhost:8000/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Origin': '${window.location.origin}'
    },
    body: 'username=admin&password=changeme',
    mode: 'cors'
  })
  .then(r => r.text())
  .then(text => console.log(text))
  .catch(e => console.error(e));
  `);
})(); 