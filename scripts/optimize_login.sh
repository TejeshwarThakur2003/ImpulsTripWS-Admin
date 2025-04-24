#!/bin/bash
# Script to optimize login performance

echo "===== Optimizing Login Performance ====="

# 1. Install required dependencies
echo "1. Installing required dependencies..."
cd backend
pip install python-jose[cryptography] bcrypt
npm install bcrypt mongoose dotenv
cd ..

# 2. Create/update admin user with optimized settings
echo "2. Creating optimized admin user..."
node backend/create_admin_user.js

# 3. Clear any existing tokens in the admin dashboard
echo "3. Creating a script to clear existing tokens..."
cat > clear_tokens.js << 'EOF'
// Script to clear admin tokens
console.log("Clearing admin authentication tokens...");
localStorage.removeItem('adminToken');
localStorage.removeItem('tokenExpiry');
console.log("Tokens cleared. Please log in again with your credentials.");
EOF

echo "To clear existing tokens in your browser, open the console and paste this code:"
cat clear_tokens.js

# 4. Restart the backend server
echo "4. Restarting backend server..."
if [ -f "./restart-backend.sh" ]; then
  ./restart-backend.sh
else
  echo "restart-backend.sh not found. Please restart your backend server manually."
  echo "You can use: cd backend && python -m uvicorn main:app --reload"
fi

echo "===== Optimization Complete ====="
echo "The login process should now be much faster."
echo "If you still experience slow login times, please check:"
echo "1. Your MongoDB connection string in config.py"
echo "2. Network connectivity to your MongoDB instance"
echo "3. Server resources (CPU, memory)"
echo ""
echo "To test the optimized login, go to your admin dashboard at http://localhost:8082"
echo "and log in with the credentials provided above." 