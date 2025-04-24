/**
 * Type definitions for Bootstrap components.
 * This file provides TypeScript type definitions for the Bootstrap library
 * used in the admin dashboard.
 */

export interface ModalInterface {
  show(): void;
  hide(): void;
}

export interface TabInterface {
  show(): void;
}

export interface BootstrapInterface {
  Modal: {
    getInstance(el: Element | null): ModalInterface | null;
    getOrCreateInstance(el: Element | null): ModalInterface;
  };
  Tab: {
    getOrCreateInstance(el: Element | null): TabInterface;
  };
}

// Add global declarations
declare global {
  interface Window {
    bootstrap: BootstrapInterface;
  }
} 