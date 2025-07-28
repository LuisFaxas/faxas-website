'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Alert } from '@/components/ui/alert';
import { logger, trackEvent } from '@/lib/monitoring/logger';
import { handleApiError, handleFirebaseError } from '@/lib/monitoring/error-handlers';
import { measureOperation, trackMetric } from '@/lib/monitoring/performance';
import { toast } from '@/components/ui/toast';
import { Zap, AlertTriangle, Activity, Database, Globe, Timer } from 'lucide-react';

export default function TestSentryPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Client-side error
  const triggerClientError = () => {
    throw new Error('Test client-side error from Sentry test page');
  };

  // Handled error
  const triggerHandledError = () => {
    try {
      // Simulate an error
      throw new Error('Test handled error');
    } catch (error) {
      logger.error('Handled error test', error, {
        testType: 'handled',
        location: 'test-sentry-page',
      });
      toast.error('Error Logged', 'Check Sentry dashboard for details');
    }
  };

  // API error
  const triggerApiError = async () => {
    setIsLoading(true);
    try {
      // Simulate API error
      const response = new Response(null, { status: 500 });
      handleApiError(response, 'test-api-call', {
        context: { endpoint: '/api/test' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase error
  const triggerFirebaseError = () => {
    const mockFirebaseError = {
      code: 'permission-denied',
      message: 'Missing or insufficient permissions',
    };
    handleFirebaseError(mockFirebaseError, 'test-firebase-operation');
  };

  // Performance tracking
  const testPerformance = async () => {
    setIsLoading(true);
    try {
      await measureOperation('test-operation', async () => {
        // Simulate slow operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        trackMetric('test_metric', Math.random() * 100);
      });
      toast.success('Performance tracked', 'Check Sentry performance tab');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom event
  const trackCustomEvent = () => {
    trackEvent('test_button_clicked', {
      page: 'test-sentry',
      timestamp: new Date().toISOString(),
      randomValue: Math.random(),
    });
    logger.info('Custom event tracked', {
      eventName: 'test_button_clicked',
    });
    toast.success('Event tracked', 'Check Sentry breadcrumbs');
  };

  // User context
  const setTestUser = () => {
    logger.setUser({
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
    });
    logger.setContext('test_context', {
      environment: 'testing',
      feature: 'sentry-integration',
    });
    logger.setTag('test_tag', 'sentry-test-page');
    toast.success('User context set', 'Future errors will include this user info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sentry Error Tracking Test
        </h1>
        
        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <strong>Development Only</strong>
            <p>This page is for testing Sentry integration. Do not deploy to production.</p>
          </div>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Error Testing */}
          <GlassPanel level="medium" className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              Error Testing
            </h2>
            <div className="space-y-3">
              <Button
                onClick={triggerHandledError}
                variant="outline"
                className="w-full justify-start"
              >
                Trigger Handled Error
              </Button>
              <Button
                onClick={triggerApiError}
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
              >
                Trigger API Error (500)
              </Button>
              <Button
                onClick={triggerFirebaseError}
                variant="outline"
                className="w-full justify-start"
              >
                Trigger Firebase Error
              </Button>
              <Button
                onClick={triggerClientError}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
              >
                Trigger Unhandled Error (Will Crash)
              </Button>
            </div>
          </GlassPanel>

          {/* Performance Testing */}
          <GlassPanel level="medium" className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Performance & Events
            </h2>
            <div className="space-y-3">
              <Button
                onClick={testPerformance}
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
              >
                <Timer className="w-4 h-4 mr-2" />
                Track Performance Metric
              </Button>
              <Button
                onClick={trackCustomEvent}
                variant="outline"
                className="w-full justify-start"
              >
                Track Custom Event
              </Button>
              <Button
                onClick={setTestUser}
                variant="outline"
                className="w-full justify-start"
              >
                Set Test User Context
              </Button>
            </div>
          </GlassPanel>

          {/* Instructions */}
          <GlassPanel level="light" className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-500" />
              How to Verify
            </h2>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Click any test button above</li>
              <li>2. Go to your Sentry dashboard at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sentry.io</a></li>
              <li>3. Check the Issues tab for errors</li>
              <li>4. Check the Performance tab for metrics</li>
              <li>5. View breadcrumbs and context in error details</li>
            </ol>
          </GlassPanel>

          {/* Current Config */}
          <GlassPanel level="light" className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Current Configuration
            </h2>
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
{JSON.stringify({
  environment: process.env.NODE_ENV,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Configured' : 'Not configured',
  org: 'faxas-enterprise',
  project: 'javascript-nextjs',
}, null, 2)}
            </pre>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}