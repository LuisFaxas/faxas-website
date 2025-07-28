import { getPostHog } from './posthog-client';
import { analytics } from './events';
import { useEffect, useState } from 'react';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  metrics: Metric[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-100, must sum to 100 across all variants
  isControl?: boolean;
}

export interface Metric {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'revenue';
  event: string;
  goalValue?: number;
}

export interface ExperimentResult {
  experimentId: string;
  variantId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metrics: Record<string, any>;
}

// A/B Testing Manager
export class ExperimentManager {
  private experiments: Map<string, Experiment> = new Map();
  private userVariants: Map<string, Map<string, string>> = new Map(); // userId -> experimentId -> variantId

  // Register an experiment
  registerExperiment(experiment: Experiment) {
    // Validate variant weights
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight !== 100) {
      throw new Error(`Variant weights must sum to 100, got ${totalWeight}`);
    }

    this.experiments.set(experiment.id, experiment);
    
    // Track experiment registration
    analytics.track('experiment_registered', {
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      variant_count: experiment.variants.length,
      metric_count: experiment.metrics.length,
    });
  }

  // Get variant for a user
  getVariant(experimentId: string, userId?: string): Variant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') return null;

    const userKey = userId || 'anonymous';
    
    // Check if user already has a variant assigned
    let userExperiments = this.userVariants.get(userKey);
    if (userExperiments?.has(experimentId)) {
      const variantId = userExperiments.get(experimentId)!;
      return experiment.variants.find(v => v.id === variantId) || null;
    }

    // Assign variant based on weights
    const variant = this.assignVariant(experiment, userKey);
    
    // Store assignment
    if (!userExperiments) {
      userExperiments = new Map();
      this.userVariants.set(userKey, userExperiments);
    }
    userExperiments.set(experimentId, variant.id);

    // Track assignment
    analytics.track('experiment_assigned', {
      experiment_id: experimentId,
      experiment_name: experiment.name,
      variant_id: variant.id,
      variant_name: variant.name,
      is_control: variant.isControl || false,
      user_id: userId,
    });

    return variant;
  }

  // Track experiment event
  trackEvent(experimentId: string, eventName: string, userId?: string, properties?: Record<string, any>) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    const userKey = userId || 'anonymous';
    const userExperiments = this.userVariants.get(userKey);
    const variantId = userExperiments?.get(experimentId);
    
    if (!variantId) return;

    const variant = experiment.variants.find(v => v.id === variantId);
    if (!variant) return;

    // Track the event with experiment context
    analytics.track(eventName, {
      ...properties,
      experiment_id: experimentId,
      experiment_name: experiment.name,
      variant_id: variantId,
      variant_name: variant.name,
      is_control: variant.isControl || false,
      user_id: userId,
    });

    // Check if this event matches any metrics
    const matchingMetrics = experiment.metrics.filter(m => m.event === eventName);
    for (const metric of matchingMetrics) {
      analytics.track('experiment_metric_recorded', {
        experiment_id: experimentId,
        variant_id: variantId,
        metric_id: metric.id,
        metric_name: metric.name,
        metric_type: metric.type,
        user_id: userId,
      });
    }
  }

  // Start an experiment
  startExperiment(experimentId: string) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    experiment.status = 'running';
    experiment.startDate = new Date();

    analytics.track('experiment_started', {
      experiment_id: experimentId,
      experiment_name: experiment.name,
    });
  }

  // Stop an experiment
  stopExperiment(experimentId: string) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    experiment.status = 'completed';
    experiment.endDate = new Date();

    analytics.track('experiment_stopped', {
      experiment_id: experimentId,
      experiment_name: experiment.name,
      duration_days: experiment.startDate 
        ? Math.floor((experiment.endDate.getTime() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    });
  }

  // Get all running experiments
  getRunningExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter(e => e.status === 'running');
  }

  // Private helper to assign variant
  private assignVariant(experiment: Experiment, userId: string): Variant {
    // Use PostHog's feature flag functionality if available
    const posthog = getPostHog();
    if (posthog) {
      const flagValue = posthog.getFeatureFlag(`experiment_${experiment.id}`);
      if (flagValue && typeof flagValue === 'string') {
        const variant = experiment.variants.find(v => v.id === flagValue);
        if (variant) return variant;
      }
    }

    // Fallback to random assignment based on weights
    const random = this.hashUserId(userId + experiment.id) % 100;
    let cumulative = 0;
    
    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (random < cumulative) {
        return variant;
      }
    }

    // Fallback to first variant (shouldn't happen)
    return experiment.variants[0];
  }

  // Simple hash function for consistent assignment
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Export singleton instance
export const experimentManager = new ExperimentManager();

// React hook for A/B testing
export function useExperiment(experimentId: string, userId?: string) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVariant = () => {
      try {
        const assignedVariant = experimentManager.getVariant(experimentId, userId);
        setVariant(assignedVariant);
      } catch (error) {
        console.error('Error loading experiment variant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVariant();
  }, [experimentId, userId]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    experimentManager.trackEvent(experimentId, eventName, userId, properties);
  };

  return {
    variant,
    isLoading,
    isControl: variant?.isControl || false,
    trackEvent,
  };
}

// Predefined experiments
export const experiments = {
  // Hero CTA Button Test
  HERO_CTA: {
    id: 'hero_cta_test',
    name: 'Hero CTA Button Test',
    description: 'Test different CTA button texts on the hero section',
    variants: [
      {
        id: 'control',
        name: 'Control - View My Work',
        description: 'Original CTA text',
        weight: 50,
        isControl: true,
      },
      {
        id: 'variant_a',
        name: 'Variant A - Explore Projects',
        description: 'Alternative CTA text focusing on exploration',
        weight: 50,
      },
    ],
    metrics: [
      {
        id: 'cta_clicks',
        name: 'CTA Click Rate',
        type: 'conversion' as const,
        event: 'cta_click',
      },
      {
        id: 'project_views',
        name: 'Project Views',
        type: 'engagement' as const,
        event: 'project_view',
      },
    ],
    status: 'draft' as const,
  },

  // Contact Form Layout Test
  CONTACT_FORM_LAYOUT: {
    id: 'contact_form_layout',
    name: 'Contact Form Layout Test',
    description: 'Test single-column vs two-column contact form layout',
    variants: [
      {
        id: 'single_column',
        name: 'Single Column',
        description: 'Traditional single column form',
        weight: 50,
        isControl: true,
      },
      {
        id: 'two_column',
        name: 'Two Column',
        description: 'Two column form layout',
        weight: 50,
      },
    ],
    metrics: [
      {
        id: 'form_starts',
        name: 'Form Start Rate',
        type: 'engagement' as const,
        event: 'contact_form_start',
      },
      {
        id: 'form_completions',
        name: 'Form Completion Rate',
        type: 'conversion' as const,
        event: 'contact_form_submit',
      },
    ],
    status: 'draft' as const,
  },
};