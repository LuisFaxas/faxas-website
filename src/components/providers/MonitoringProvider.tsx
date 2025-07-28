'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initPerformanceMonitoring, trackPagePerformance } from '@/lib/monitoring/performance';
import { logger } from '@/lib/monitoring/logger';

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize performance monitoring on mount
    initPerformanceMonitoring();
  }, []);

  useEffect(() => {
    // Track page changes
    trackPagePerformance(pathname);
    logger.info('Page view', { pathname });
  }, [pathname]);

  // Set up global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error('Global error handler', event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', event.reason, {
        promise: event.promise,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}