# CORS Configuration Guide

This guide will help you fix CORS (Cross-Origin Resource Sharing) issues on your API server.

## The Problem

You're seeing the following error:
> CORS requests are not sent to CORS resources with origin wildcards

This happens because:
1. Your server is using a wildcard `Access-Control-Allow-Origin: *`
2. Your client is sending credentials (cookies, auth headers, etc.)

According to CORS security policies, these two are incompatible. When credentials are included, the server must specify the exact origin, not a wildcard.

## How to Fix the Server-Side Configuration

### For Express.js

If your API server uses Express.js with the cors middleware:

```javascript
// Incorrect - using wildcard with credentials
app.use(cors({
  origin: '*',
  credentials: true
}));

// Correct - use exact origin(s)
app.use(cors({
  origin: 'http://localhost:4321', // Replace with your admin dashboard URL
  credentials: true
}));

// If you have multiple origins:
app.use(cors({
  origin: ['http://localhost:4321', 'https://yourdomain.com'],
  credentials: true
}));

// Or dynamically determine origin:
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:4321', 'https://yourdomain.com'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### For Other Frameworks

If you're using another framework or manually setting headers:

```javascript
// Set these headers in your response:
res.header('Access-Control-Allow-Origin', 'http://localhost:4321'); // Your exact origin
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
```

## Testing Your CORS Configuration

You can use the `cors-check.js` script we provided to test if your CORS configuration is correctly set up. Run it in your browser console while on your admin dashboard.

## Alternative Client-Side Fix

If you can't modify the server, you could update the client to not send credentials:

```javascript
// In your apiRequest function in admin-dashboard/src/utils/api.ts
const response = await fetch(url, {
  // ...other options
  credentials: 'omit', // Don't send credentials
  mode: 'cors'
});
```

However, this will prevent cookies and auth headers from being sent, which might break authentication if you're using cookies or HTTP-only tokens.

## When to Use Different Credential Options

- `credentials: 'omit'` - Never send credentials
- `credentials: 'same-origin'` - Only send credentials when the URL is on the same origin
- `credentials: 'include'` - Always send credentials, even for cross-origin requests

For most API calls that need authentication, using 'include' with proper server-side CORS configuration is the right choice. 