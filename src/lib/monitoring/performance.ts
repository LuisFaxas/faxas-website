import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

export interface PerformanceMetrics {
  ttfb: number; // Time to First Byte
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  loadTime: number;
}

/**
 * Track page performance metrics
 */
export function trackPagePerformance(pageName: string): void {
  if (typeof window === 'undefined') return;

  // Use Performance Observer API
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          const metrics = {
            ttfb: navEntry.responseStart - navEntry.requestStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            totalDuration: navEntry.loadEventEnd - navEntry.fetchStart,
          };

          logger.info(`Page Performance: ${pageName}`, metrics);
          
          // Send metrics as context
          Sentry.setContext('performance_metrics', {
            ttfb: metrics.ttfb,
            dom_content_loaded: metrics.domContentLoaded,
            page_load: metrics.totalDuration,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  } catch (error) {
    logger.warn('Performance Observer not supported', { error });
  }
}

/**
 * Track Web Vitals
 */
export function trackWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    logger.info('Web Vitals: LCP', { value: lastEntry.startTime });
    Sentry.setContext('web_vitals_lcp', { value: lastEntry.startTime });
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      const fidEntry = entry as PerformanceEventTiming;
      const fid = fidEntry.processingStart - fidEntry.startTime;
      
      logger.info('Web Vitals: FID', { value: fid });
      Sentry.setContext('web_vitals_fid', { value: fid });
    });
  }).observe({ entryTypes: ['first-input'] });

  // Track Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    
    logger.info('Web Vitals: CLS', { value: clsValue });
    Sentry.setContext('web_vitals_cls', { value: clsValue });
  }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Track custom performance metric
 */
export function trackMetric(
  name: string,
  value: number,
  unit: 'millisecond' | 'second' | 'byte' | 'percent' | 'none' = 'millisecond'
): void {
  logger.info(`Performance Metric: ${name}`, { value, unit });
  Sentry.setContext(`metric_${name}`, { value, unit });
}

/**
 * Measure operation duration
 */
export async function measureOperation<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    trackMetric(`operation.${operationName}`, duration);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    trackMetric(`operation.${operationName}.error`, duration);
    throw error;
  }
}

/**
 * Track resource loading performance
 */
export function trackResourceTiming(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');
    
    // Group resources by type
    const resourceTypes: Record<string, number[]> = {};
    
    resources.forEach((resource) => {
      const entry = resource as PerformanceResourceTiming;
      const type = getResourceType(entry.name);
      
      if (!resourceTypes[type]) {
        resourceTypes[type] = [];
      }
      
      resourceTypes[type].push(entry.duration);
    });

    // Calculate and log averages
    Object.entries(resourceTypes).forEach(([type, durations]) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      
      logger.info(`Resource Loading: ${type}`, {
        count: durations.length,
        averageDuration: avg,
        totalDuration: durations.reduce((a, b) => a + b, 0),
      });
      
      trackMetric(`resource.${type}.avg`, avg);
    });
  });
}

/**
 * Get resource type from URL
 */
function getResourceType(url: string): string {
  if (url.match(/\.(js|mjs)$/)) return 'script';
  if (url.match(/\.css$/)) return 'style';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
  if (url.includes('/api/')) return 'api';
  return 'other';
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Track initial page load
  trackPagePerformance(window.location.pathname);
  
  // Track Web Vitals
  trackWebVitals();
  
  // Track resource timings
  trackResourceTiming();
  
  // Monitor long tasks
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        logger.warn('Long Task Detected', {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name,
        });
        
        trackMetric('long_task', entry.duration);
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
}