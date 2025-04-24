/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WEBSITE_URL: string;
  readonly PORT: string;
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_API_TIMEOUT: string;
  readonly PUBLIC_AUTH_TOKEN_NAME: string;
  readonly PUBLIC_AUTH_USERNAME_NAME: string;
  readonly PUBLIC_COOKIE_SECURE: string;
  readonly PUBLIC_COOKIE_SAME_SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// This correctly defines the Bootstrap interface with Modal and Tab components
interface Bootstrap {
  Modal: {
    getInstance(el: Element | null): { show(): void; hide(): void } | null;
    getOrCreateInstance(el: Element | null): { show(): void; hide(): void };
  };
  Tab: {
    getOrCreateInstance(el: Element | null): { show(): void };
  };
}

// Add bootstrap property to the global Window interface
declare global {
  interface Window {
    bootstrap: Bootstrap;
  }
}

// Set default values for development
if (typeof window !== 'undefined') {
  window.process = window.process || {};
  window.process.env = window.process.env || {};
  window.process.env.PUBLIC_API_URL = window.process.env.PUBLIC_API_URL || 'http://localhost:8001';
  window.process.env.PUBLIC_API_TIMEOUT = window.process.env.PUBLIC_API_TIMEOUT || '30000';
} 