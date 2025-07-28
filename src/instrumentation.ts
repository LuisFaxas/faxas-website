import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This runs on the server
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // This runs on the edge runtime
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;