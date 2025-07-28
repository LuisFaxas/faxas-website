// This file configures the initialization of Sentry for edge functions
// (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge functions is loaded.
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

  // Additional edge runtime options
  beforeSend(event, hint) {
    // Filter out certain errors
    const error = hint.originalException;
    
    // Don't send events for 404s
    if (event.extra?.statusCode === 404) {
      return null;
    }

    return event;
  },
});