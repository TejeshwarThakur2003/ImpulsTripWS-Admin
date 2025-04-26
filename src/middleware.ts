import { defineMiddleware } from 'astro/middleware';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = defineMiddleware(async (context, next) => {
  // Skip middleware for login page to avoid redirect loops
  if (context.url.pathname.includes('/login')) {
    return next();
  }
  
  // Check for the server-side cookie
  const tokenCookie = context.cookies.get("adminToken")?.value;
  
  // If no cookie, redirect to login
  if (!tokenCookie) {
    return context.redirect('/login');
  }
  
  // Otherwise continue to the requested page
  return next();
}); 