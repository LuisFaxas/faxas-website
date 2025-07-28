'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { initPostHog } from '@/lib/analytics/posthog-client';
import { useAuth } from '@/hooks/useAuth';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Initialize PostHog
  useEffect(() => {
    const client = initPostHog();
    if (!client) return;

    // Set user properties when authenticated
    if (user) {
      posthog.identify(user.uid, {
        email: user.email,
        name: user.displayName,
        created_at: user.metadata?.creationTime,
      });
    } else {
      // Reset when user logs out
      posthog.reset();
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    const client = initPostHog();
    if (!client) return;

    // Get full URL
    const url = window.location.href;
    const referrer = document.referrer;

    // Track pageview with custom properties
    posthog.capture('$pageview', {
      $current_url: url,
      $pathname: pathname,
      $referrer: referrer,
      $search: searchParams.toString(),
      timestamp: new Date().toISOString(),
    });
  }, [pathname, searchParams]);

  // Handle page leave
  useEffect(() => {
    const handlePageLeave = () => {
      const client = initPostHog();
      if (!client) return;
      
      posthog.capture('$pageleave', {
        $pathname: pathname,
        time_on_page: performance.now() / 1000, // Convert to seconds
      });
    };

    window.addEventListener('beforeunload', handlePageLeave);
    return () => window.removeEventListener('beforeunload', handlePageLeave);
  }, [pathname]);

  if (typeof window === 'undefined') return <>{children}</>;
  
  const client = initPostHog();
  if (!client) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}