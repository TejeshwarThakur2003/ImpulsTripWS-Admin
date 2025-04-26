#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the .env file path
const envPath = path.join(__dirname, '.env');
const exampleEnvPath = path.join(__dirname, '.env.example');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  // If .env doesn't exist but .env.example exists, copy it
  if (fs.existsSync(exampleEnvPath)) {
    console.log('No .env file found. Creating from .env.example...');
    fs.copyFileSync(exampleEnvPath, envPath);
    console.log('.env file created successfully. Please update it with your environment values.');
  } else {
    // Create default .env if neither exists
    console.log('No .env.example found. Creating default .env...');
    const defaultEnv = `PUBLIC_WEBSITE_URL=http://localhost:8082
PORT=8082
PUBLIC_API_URL=http://localhost:8001
PUBLIC_FASTAPI_URL=http://localhost:8000
PUBLIC_API_TIMEOUT=30000
PUBLIC_AUTH_TOKEN_NAME=adminToken
PUBLIC_USER_DATA_NAME=adminUserData
PUBLIC_COOKIE_SECURE=false
PUBLIC_COOKIE_SAME_SITE=lax
NODE_ENV=development`;

    fs.writeFileSync(envPath, defaultEnv);
    console.log('Default .env file created. Please update it with your environment values.');
  }
} else {
  console.log('.env file already exists.');
} 