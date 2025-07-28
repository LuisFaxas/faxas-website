import * as Sentry from '@sentry/nextjs';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: Date;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context);
    }
    
    Sentry.addBreadcrumb({
      category: 'debug',
      message,
      level: 'debug',
      data: context,
    });
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context);
    }
    
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      level: 'info',
      data: context,
    });
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context);
    
    Sentry.captureMessage(message, 'warning');
    Sentry.addBreadcrumb({
      category: 'warning',
      message,
      level: 'warning',
      data: context,
    });
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error, context);
    
    if (error instanceof Error) {
      Sentry.withScope((scope) => {
        scope.setLevel('error');
        scope.setContext('error_context', {
          message,
          ...context,
        });
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureMessage(message, 'error');
    }
  }

  /**
   * Log a critical error that should trigger alerts
   */
  critical(message: string, error: Error, context?: LogContext): void {
    console.error(`[CRITICAL] ${message}`, error, context);
    
    Sentry.withScope((scope) => {
      scope.setLevel('fatal');
      scope.setTag('critical', true);
      scope.setContext('critical_error', {
        message,
        ...context,
      });
      Sentry.captureException(error);
    });
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[EVENT] ${eventName}`, properties);
    }

    Sentry.addBreadcrumb({
      category: 'custom',
      message: eventName,
      level: 'info',
      data: properties,
    });
  }

  /**
   * Start a performance transaction
   */
  startTransaction(name: string, op: string = 'custom'): ReturnType<typeof Sentry.startSpan> {
    return Sentry.startSpan({ name, op }, (span) => span);
  }

  /**
   * Set user context for better error tracking
   */
  setUser(user: { id: string; email?: string; name?: string } | null): void {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      });
    } else {
      Sentry.setUser(null);
    }
  }

  /**
   * Add custom context to all future events
   */
  setContext(key: string, context: LogContext): void {
    Sentry.setContext(key, context);
  }

  /**
   * Add a tag to all future events
   */
  setTag(key: string, value: string | number | boolean): void {
    Sentry.setTag(key, value);
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    // configureScope is deprecated in newer versions
    // This functionality is no longer available
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logCritical = logger.critical.bind(logger);
export const trackEvent = logger.trackEvent.bind(logger);