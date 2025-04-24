# Running the ImpulsTrip Admin Dashboard

This document provides instructions for running the admin dashboard in development and production modes.

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

## Development Mode

1. **Install dependencies**

   ```bash
   cd admin-dashboard
   npm install
   ```

2. **Verify environment variables**

   The `.env` file should already be created with development settings. If not, create it with:

   ```
   PUBLIC_WEBSITE_URL=http://localhost:8082
   PORT=8082
   PUBLIC_API_URL=http://localhost:8001/api
   PUBLIC_API_TIMEOUT=30000
   PUBLIC_AUTH_TOKEN_NAME=adminToken
   PUBLIC_AUTH_USERNAME_NAME=adminUsername
   PUBLIC_COOKIE_SECURE=false
   PUBLIC_COOKIE_SAME_SITE=lax
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   This will start the Astro development server on port 8082.

4. **Access the dashboard**

   Open your browser and navigate to:
   
   ```
   http://localhost:8082
   ```

   You will be automatically redirected to the login page. 
   
   For testing, you can use:
   - Username: admin
   - Password: admin123

## Production Mode

1. **Build the application**

   ```bash
   npm run build
   ```

   This will create optimized production files in the `dist` directory.

2. **Start the production server**

   ```bash
   npm start
   ```

   Or manually:

   ```bash
   node server.js
   ```

   The server will start on port 8082 (or the port specified in your environment variables).

## Troubleshooting

If you encounter issues:

1. **Clear node_modules and reinstall**

   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Check backend API connection**

   Make sure your backend API server is running on the correct port (default: 8001).
   
   The dashboard expects the API to be available at `http://localhost:8001/api`.

3. **Verify environment variables**

   Ensure your `.env` file exists and has the correct values.

4. **Clear browser cache and storage**

   If authentication issues occur, clear your browser's local storage:
   
   ```javascript
   // In browser console
   localStorage.clear()
   ```

## Security Notes

For production deployment:

1. Set `PUBLIC_COOKIE_SECURE=true` in your production `.env` file
2. Use HTTPS for all connections
3. Set a proper domain for `PUBLIC_WEBSITE_URL`
4. Make sure the API endpoint is secured with HTTPS 