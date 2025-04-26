/**
 * Health check endpoint for the admin dashboard
 * This is used by Docker to check if the service is running
 */
export function get() {
  return {
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString()
    }),
    headers: {
      'content-type': 'application/json'
    }
  };
} 