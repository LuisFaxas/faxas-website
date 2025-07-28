import { getPostHog } from './posthog-client';
import { analytics } from './events';

export enum FunnelType {
  CONTACT = 'contact_funnel',
  PROJECT_ENGAGEMENT = 'project_engagement_funnel',
  USER_ONBOARDING = 'user_onboarding_funnel',
}

interface FunnelStep {
  name: string;
  event: string;
  properties?: Record<string, any>;
}

interface FunnelConfig {
  id: string;
  name: string;
  steps: FunnelStep[];
}

// Define conversion funnels
const funnels: Record<FunnelType, FunnelConfig> = {
  [FunnelType.CONTACT]: {
    id: 'contact_funnel',
    name: 'Contact Form Conversion',
    steps: [
      {
        name: 'View Contact Page',
        event: '$pageview',
        properties: { $pathname: '/contact' }
      },
      {
        name: 'Start Filling Form',
        event: 'contact_form_start'
      },
      {
        name: 'Submit Form',
        event: 'contact_form_submit'
      }
    ]
  },
  
  [FunnelType.PROJECT_ENGAGEMENT]: {
    id: 'project_engagement_funnel',
    name: 'Project Engagement',
    steps: [
      {
        name: 'View Projects Page',
        event: '$pageview',
        properties: { $pathname: '/projects' }
      },
      {
        name: 'View Project Details',
        event: 'project_view'
      },
      {
        name: 'Click Demo Link',
        event: 'project_demo_click'
      }
    ]
  },
  
  [FunnelType.USER_ONBOARDING]: {
    id: 'user_onboarding_funnel',
    name: 'User Onboarding',
    steps: [
      {
        name: 'Land on Homepage',
        event: '$pageview',
        properties: { $pathname: '/' }
      },
      {
        name: 'Click Sign Up',
        event: 'cta_click',
        properties: { cta_text: 'Sign Up' }
      },
      {
        name: 'Complete Sign Up',
        event: 'user_sign_up'
      },
      {
        name: 'Update Profile',
        event: 'user_profile_update'
      }
    ]
  }
};

// Funnel tracking manager
export class FunnelTracker {
  private activeFunnels: Map<string, { startTime: number; currentStep: number }> = new Map();

  // Start tracking a funnel
  startFunnel(type: FunnelType, userId?: string) {
    const funnel = funnels[type];
    if (!funnel) return;

    const funnelKey = this.getFunnelKey(type, userId);
    this.activeFunnels.set(funnelKey, {
      startTime: Date.now(),
      currentStep: 0
    });

    // Track funnel start
    analytics.track('funnel_started', {
      funnel_id: funnel.id,
      funnel_name: funnel.name,
      user_id: userId
    });
  }

  // Track progress through a funnel
  trackStep(type: FunnelType, stepIndex: number, userId?: string, properties?: Record<string, any>) {
    const funnel = funnels[type];
    if (!funnel || !funnel.steps[stepIndex]) return;

    const funnelKey = this.getFunnelKey(type, userId);
    const funnelState = this.activeFunnels.get(funnelKey);
    
    if (!funnelState) {
      // Start funnel if not already started
      this.startFunnel(type, userId);
    }

    const step = funnel.steps[stepIndex];
    const timeSinceStart = funnelState ? Date.now() - funnelState.startTime : 0;

    // Track the step
    analytics.track('funnel_step', {
      funnel_id: funnel.id,
      funnel_name: funnel.name,
      step_index: stepIndex,
      step_name: step.name,
      step_event: step.event,
      time_since_start_ms: timeSinceStart,
      user_id: userId,
      ...properties
    });

    // Update current step
    if (funnelState) {
      funnelState.currentStep = stepIndex;
    }

    // Check if funnel completed
    if (stepIndex === funnel.steps.length - 1) {
      this.completeFunnel(type, userId);
    }
  }

  // Complete a funnel
  completeFunnel(type: FunnelType, userId?: string) {
    const funnel = funnels[type];
    if (!funnel) return;

    const funnelKey = this.getFunnelKey(type, userId);
    const funnelState = this.activeFunnels.get(funnelKey);
    
    if (funnelState) {
      const totalTime = Date.now() - funnelState.startTime;
      
      analytics.track('funnel_completed', {
        funnel_id: funnel.id,
        funnel_name: funnel.name,
        total_time_ms: totalTime,
        total_steps: funnel.steps.length,
        user_id: userId
      });

      // Clean up
      this.activeFunnels.delete(funnelKey);
    }
  }

  // Abandon a funnel
  abandonFunnel(type: FunnelType, userId?: string, reason?: string) {
    const funnel = funnels[type];
    if (!funnel) return;

    const funnelKey = this.getFunnelKey(type, userId);
    const funnelState = this.activeFunnels.get(funnelKey);
    
    if (funnelState) {
      const totalTime = Date.now() - funnelState.startTime;
      
      analytics.track('funnel_abandoned', {
        funnel_id: funnel.id,
        funnel_name: funnel.name,
        abandoned_at_step: funnelState.currentStep,
        abandoned_at_step_name: funnel.steps[funnelState.currentStep]?.name,
        total_time_ms: totalTime,
        reason,
        user_id: userId
      });

      // Clean up
      this.activeFunnels.delete(funnelKey);
    }
  }

  // Get funnel progress
  getFunnelProgress(type: FunnelType, userId?: string): number {
    const funnel = funnels[type];
    if (!funnel) return 0;

    const funnelKey = this.getFunnelKey(type, userId);
    const funnelState = this.activeFunnels.get(funnelKey);
    
    if (!funnelState) return 0;
    
    return ((funnelState.currentStep + 1) / funnel.steps.length) * 100;
  }

  // Check if user is in a funnel
  isInFunnel(type: FunnelType, userId?: string): boolean {
    const funnelKey = this.getFunnelKey(type, userId);
    return this.activeFunnels.has(funnelKey);
  }

  // Get active funnels for a user
  getActiveFunnels(userId?: string): FunnelType[] {
    const activeFunnels: FunnelType[] = [];
    
    for (const [key] of this.activeFunnels) {
      const [type] = key.split(':');
      if (!userId || key.includes(userId)) {
        activeFunnels.push(type as FunnelType);
      }
    }
    
    return activeFunnels;
  }

  // Private helper to generate funnel key
  private getFunnelKey(type: FunnelType, userId?: string): string {
    return userId ? `${type}:${userId}` : type;
  }
}

// Export singleton instance
export const funnelTracker = new FunnelTracker();

// Hook for React components
export function useFunnelTracking() {
  return {
    startFunnel: (type: FunnelType, userId?: string) => 
      funnelTracker.startFunnel(type, userId),
    
    trackStep: (type: FunnelType, stepIndex: number, userId?: string, properties?: Record<string, any>) => 
      funnelTracker.trackStep(type, stepIndex, userId, properties),
    
    completeFunnel: (type: FunnelType, userId?: string) => 
      funnelTracker.completeFunnel(type, userId),
    
    abandonFunnel: (type: FunnelType, userId?: string, reason?: string) => 
      funnelTracker.abandonFunnel(type, userId, reason),
    
    getFunnelProgress: (type: FunnelType, userId?: string) => 
      funnelTracker.getFunnelProgress(type, userId),
    
    isInFunnel: (type: FunnelType, userId?: string) => 
      funnelTracker.isInFunnel(type, userId),
    
    getActiveFunnels: (userId?: string) => 
      funnelTracker.getActiveFunnels(userId)
  };
}