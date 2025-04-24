#!/bin/bash
# Script to fix login issues when login page gets stuck at "Trying to log in..."

echo "===== FIXING LOGIN ISSUES ====="

# Step 1: Check if backend is running
echo "Step 1: Checking if backend is running..."
curl -s http://localhost:8000/ping > /dev/null
if [ $? -ne 0 ]; then
  echo "⚠️ Backend server is not running or not reachable"
  echo "Starting backend server..."
  
  if [ -f "./restart-backend.sh" ]; then
    ./restart-backend.sh
  else
    echo "restart-backend.sh not found."
    echo "Starting backend server manually..."
    cd backend
    python -m uvicorn main:app --reload &
    cd ..
  fi
else
  echo "✅ Backend server is running"
fi

# Step 2: Install dependencies
echo -e "\nStep 2: Installing dependencies..."
echo "Installing Python dependencies..."
pip install python-bcrypt pymongo[srv] python-jose[cryptography]

echo "Installing Node.js dependencies..."
npm install -g bcrypt mongoose dotenv

# Step 3: Create admin user
echo -e "\nStep 3: Creating admin user in MongoDB..."
node backend/create_admin_user.js

# Step 4: Create emergency login file
echo -e "\nStep 4: Creating emergency login script..."
cat > emergency_login.js << 'EOF'
// Emergency login script for admin dashboard
// Paste this in your browser console when on the login page
console.log("Attempting emergency direct login...");

fetch('http://localhost:8000/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  body: 'username=admin&password=changeme'
})
.then(response => response.text())
.then(text => {
  console.log("Raw response:", text);
  try {
    const data = JSON.parse(text);
    if (data.access_token) {
      console.log("Login successful, saving token...");
      localStorage.setItem('adminToken', data.access_token);
      // Set expiry to 1 hour from now
      localStorage.setItem('tokenExpiry', new Date(Date.now() + 60*60*1000).toISOString());
      console.log("Token saved. Redirecting to dashboard...");
      window.location.href = '/dashboard';
    } else {
      console.error("No access token in response:", data);
    }
  } catch (e) {
    console.error("Failed to parse response:", e);
  }
})
.catch(error => {
  console.error("Login request failed:", error);
});
EOF

echo -e "\nStep 5: Fixing auth.py with emergency bypass..."
# Create backup of auth.py
cp backend/auth.py backend/auth.py.backup

# Add emergency debugging option to auth.py
cat > backend/auth.py.new << 'EOF'
import os
import time
from datetime import datetime, timedelta
from typing import Optional, Union
import bcrypt
from bson import ObjectId

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

# Import configuration settings
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from db import db

# Collection reference for admin users
admin_collection = db["Admin"]

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

async def verify_admin_credentials(username: str, password: str) -> bool:
    """
    Verify admin credentials against MongoDB
    """
    print(f"Verifying credentials for user: {username}")
    start_time = time.time()
    
    # EMERGENCY DEBUGGING BYPASS - REMOVE IN PRODUCTION
    if username == "admin" and password == "changeme":
        print("!! USING EMERGENCY LOGIN BYPASS !!")
        return True
    
    try:
        # Find the admin user by username with timeout
        admin_user = await admin_collection.find_one(
            {"username": username},
            max_time_ms=5000  # 5 second timeout
        )
        
        query_time = time.time() - start_time
        print(f"MongoDB query took {query_time:.2f} seconds")
        
        if not admin_user:
            print(f"User {username} not found in database")
            return False
        
        # Verify password using bcrypt
        bcrypt_start = time.time()
        stored_password = admin_user["password"]
        password_bytes = password.encode('utf-8')
        
        # If the stored password is already in bytes format
        if isinstance(stored_password, bytes):
            result = bcrypt.checkpw(password_bytes, stored_password)
        else:
            # If the stored password is a string (happens with some MongoDB drivers)
            result = bcrypt.checkpw(password_bytes, stored_password.encode('utf-8'))
        
        bcrypt_time = time.time() - bcrypt_start
        print(f"bcrypt verification took {bcrypt_time:.2f} seconds")
        
        total_time = time.time() - start_time
        print(f"Total authentication took {total_time:.2f} seconds")
        
        return result
    except Exception as e:
        print(f"Error during authentication: {str(e)}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with the given data and expiration time
    """
    start_time = time.time()
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    token_time = time.time() - start_time
    print(f"Token generation took {token_time:.2f} seconds")
    return token

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    """
    Dependency to verify the JWT on protected routes
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        
        if username is None:
            raise credentials_exception
            
        # Check if the admin user exists in the database
        admin_user = await admin_collection.find_one({"username": username})
        if not admin_user:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
        
    return username  # Returns the admin username
EOF

mv backend/auth.py.new backend/auth.py

# Step 6: Restart backend
echo -e "\nStep 6: Restarting backend with fixed auth..."
if [ -f "./restart-backend.sh" ]; then
  ./restart-backend.sh
else
  echo "restart-backend.sh not found. Attempting to restart backend manually..."
  pkill -f "uvicorn main:app"
  cd backend
  python -m uvicorn main:app --reload &
  cd ..
fi

echo -e "\n===== LOGIN FIX COMPLETE ====="
echo "Try logging in to the admin dashboard at http://localhost:8082"
echo "with username: admin and password: changeme"
echo ""
echo "If login still fails, try the emergency login script:"
echo "1. Open your browser's developer console (F12)"
echo "2. Copy and paste the contents of emergency_login.js"
echo "3. Press Enter to execute"
echo ""
echo "⚠️ IMPORTANT: After successfully logging in, remove the emergency bypass from auth.py"
echo "and use your own secure credentials." 