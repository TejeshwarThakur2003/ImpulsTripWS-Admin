#!/bin/bash
# Script to install required packages for MongoDB admin authentication

echo "Installing required Python packages for backend..."
cd backend
pip install python-jose[cryptography] bcrypt

echo "Installing required Node.js packages for admin user creation..."
npm install -g bcrypt mongoose dotenv

echo "All dependencies installed!"
echo "To create an admin user, run:"
echo "node backend/create_admin_user.js" 