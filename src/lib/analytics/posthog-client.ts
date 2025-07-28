import posthog from 'posthog-js';
import { PostHogConfig } from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export const posthogConfig: Partial<PostHogConfig> = {
  api_host: POSTHOG_HOST,
  
  // Privacy-first configuration
  autocapture: false, // Disable automatic event capture
  capture_pageview: false, // We'll manually track pageviews
  capture_pageleave: true, // Track how long users stay on pages
  disable_session_recording: true, // No session recording by default
  
  // Performance
  loaded: (posthog) => {
    if (process.env.NODE_ENV === 'development') {
      posthog.debug(false); // Set to true for debugging
    }
  },
  
  // GDPR compliance
  opt_out_capturing_by_default: false,
  respect_dnt: true, // Respect Do Not Track
  secure_cookie: true,
  
  // Feature flags
  bootstrap: {
    featureFlags: {},
  },
  
  // Custom configuration
  sanitize_properties: (properties, event) => {
    // Remove any sensitive data
    const sanitized = { ...properties };
    
    // Remove potential PII
    delete sanitized.email;
    delete sanitized.phone;
    delete sanitized.ip;
    
    return sanitized;
  },
};

let posthogClient: typeof posthog | null = null;

export function initPostHog() {
  if (typeof window === 'undefined') return null;
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not found. Analytics disabled.');
    return null;
  }
  
  if (!posthogClient) {
    posthogClient = posthog.init(POSTHOG_KEY, posthogConfig);
  }
  
  return posthogClient;
}

export function getPostHog() {
  if (typeof window === 'undefined') return null;
  return posthogClient;
}