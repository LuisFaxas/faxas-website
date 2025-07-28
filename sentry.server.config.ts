// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Server-specific integrations
  integrations: [],

  // Additional server options
  beforeSend(event, hint) {
    // Filter out certain errors
    const error = hint.originalException;
    
    // Don't send events for 404s
    if (event.extra?.statusCode === 404) {
      return null;
    }

    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      // Filter out hot reload errors
      if (error && error instanceof Error && error.message?.includes('ECONNREFUSED')) {
        return null;
      }
    }

    return event;
  },
});