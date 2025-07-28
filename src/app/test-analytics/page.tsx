'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics/events';
import { FunnelType, useFunnelTracking } from '@/lib/analytics/funnels';
import { experimentManager, experiments, useExperiment } from '@/lib/analytics/experiments';
import { consentManager, ConsentType } from '@/lib/analytics/consent';
import { CookieSettingsButton } from '@/components/CookieConsent';
import { BarChart3, Beaker, Cookie, Zap } from 'lucide-react';

export default function TestAnalyticsPage() {
  const [eventsFired, setEventsFired] = useState<string[]>([]);
  const funnelTracking = useFunnelTracking();
  
  // Initialize experiments
  useState(() => {
    experimentManager.registerExperiment(experiments.HERO_CTA);
    experimentManager.startExperiment(experiments.HERO_CTA.id);
  });

  const heroExperiment = useExperiment(experiments.HERO_CTA.id);

  const addEvent = (event: string) => {
    setEventsFired(prev => [`${new Date().toLocaleTimeString()} - ${event}`, ...prev.slice(0, 9)]);
  };

  const testUserEvents = () => {
    analytics.user.signUp({ method: 'email', email: 'test@example.com' });
    addEvent('User Sign Up');
  };

  const testNavigationEvents = () => {
    analytics.navigation.linkClick({ 
      link_text: 'Test Link', 
      link_url: '/test',
      from_path: '/test-analytics' 
    });
    addEvent('Navigation Link Click');
  };

  const testEngagementEvents = () => {
    analytics.engagement.projectView('test-project', 'Test Project');
    addEvent('Project View');
    
    analytics.engagement.scrollDepth(75);
    addEvent('Scroll Depth 75%');
  };

  const testConversionEvents = () => {
    analytics.conversion.contactFormStart();
    addEvent('Contact Form Start');
    
    setTimeout(() => {
      analytics.conversion.contactFormSubmit();
      addEvent('Contact Form Submit');
    }, 1000);
  };

  const testFunnel = () => {
    funnelTracking.startFunnel(FunnelType.CONTACT);
    addEvent('Started Contact Funnel');
    
    setTimeout(() => {
      funnelTracking.trackStep(FunnelType.CONTACT, 1);
      addEvent('Contact Funnel Step 1');
    }, 500);
    
    setTimeout(() => {
      funnelTracking.trackStep(FunnelType.CONTACT, 2);
      addEvent('Contact Funnel Step 2 (Completed)');
    }, 1000);
  };

  const testExperiment = () => {
    if (heroExperiment.variant) {
      heroExperiment.trackEvent('cta_click');
      addEvent(`Experiment Event: ${heroExperiment.variant.name}`);
    }
  };

  const testError = () => {
    try {
      throw new Error('Test error for analytics');
    } catch (error) {
      analytics.error.client(error as Error, { component: 'TestAnalyticsPage' });
      addEvent('Error Event Tracked');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto space-y-8">
        <GlassPanel level="primary" className="p-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics Test Page
          </h1>
          
          <div className="space-y-6">
            {/* Consent Status */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Cookie Consent Status
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Analytics consent: {consentManager.hasConsent(ConsentType.ANALYTICS) ? '✅ Granted' : '❌ Not granted'}
              </p>
              <CookieSettingsButton />
            </div>

            {/* Experiment Status */}
            {heroExperiment.variant && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Beaker className="w-5 h-5" />
                  Active Experiment
                </h3>
                <p className="text-sm">
                  Hero CTA Test - Variant: <strong>{heroExperiment.variant.name}</strong>
                </p>
              </div>
            )}

            {/* Event Testing */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Test Analytics Events</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button onClick={testUserEvents} variant="glass" size="sm">
                  User Events
                </Button>
                <Button onClick={testNavigationEvents} variant="glass" size="sm">
                  Navigation Events
                </Button>
                <Button onClick={testEngagementEvents} variant="glass" size="sm">
                  Engagement Events
                </Button>
                <Button onClick={testConversionEvents} variant="glass" size="sm">
                  Conversion Events
                </Button>
                <Button onClick={testFunnel} variant="glass" size="sm">
                  Test Funnel
                </Button>
                <Button onClick={testExperiment} variant="glass" size="sm">
                  Test Experiment
                </Button>
                <Button onClick={testError} variant="glass" size="sm">
                  Test Error
                </Button>
              </div>
            </div>

            {/* Events Log */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recent Events
              </h3>
              <div className="bg-background/50 rounded-lg p-4 h-48 overflow-y-auto">
                {eventsFired.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No events fired yet</p>
                ) : (
                  <ul className="space-y-1">
                    {eventsFired.map((event, index) => (
                      <li key={index} className="text-sm font-mono">
                        {event}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Events will only be sent if analytics consent is granted</p>
              <p>• Check your browser developer console for PostHog events</p>
              <p>• Events are batched and sent periodically</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}