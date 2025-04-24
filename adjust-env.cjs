#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Get the .env file path
const envPath = path.join(__dirname, '.env');

// New content - removing the /api prefix from the API URL
const envContent = `PUBLIC_WEBSITE_URL=http://localhost:8082
PORT=8082
PUBLIC_API_URL=http://localhost:8001
PUBLIC_API_TIMEOUT=30000
PUBLIC_AUTH_TOKEN_NAME=adminToken
PUBLIC_AUTH_USERNAME_NAME=adminUsername
PUBLIC_COOKIE_SECURE=false
PUBLIC_COOKIE_SAME_SITE=lax`;

// Write new content
fs.writeFileSync(envPath, envContent);

console.log('.env file updated successfully with the following content:');
console.log(envContent); 