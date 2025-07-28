import { getPostHog } from './posthog-client';

export enum ConsentType {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PREFERENCES = 'preferences',
}

export interface ConsentSettings {
  [ConsentType.NECESSARY]: boolean;
  [ConsentType.ANALYTICS]: boolean;
  [ConsentType.MARKETING]: boolean;
  [ConsentType.PREFERENCES]: boolean;
  timestamp: string;
  version: string;
}

const CONSENT_KEY = 'faxas_cookie_consent';
const CONSENT_VERSION = '1.0.0';

// Default consent settings (necessary only)
const DEFAULT_CONSENT: ConsentSettings = {
  [ConsentType.NECESSARY]: true,
  [ConsentType.ANALYTICS]: false,
  [ConsentType.MARKETING]: false,
  [ConsentType.PREFERENCES]: false,
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
};

// Consent manager class
export class ConsentManager {
  private consent: ConsentSettings;
  private listeners: Set<(consent: ConsentSettings) => void> = new Set();

  constructor() {
    this.consent = this.loadConsent();
    this.applyConsent();
  }

  // Load consent from localStorage
  private loadConsent(): ConsentSettings {
    if (typeof window === 'undefined') return DEFAULT_CONSENT;

    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if version matches
        if (parsed.version === CONSENT_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading consent:', error);
    }

    return DEFAULT_CONSENT;
  }

  // Save consent to localStorage
  private saveConsent() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(this.consent));
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  }

  // Apply consent settings
  private applyConsent() {
    const posthog = getPostHog();
    if (!posthog) return;

    if (this.consent[ConsentType.ANALYTICS]) {
      // Enable analytics
      posthog.opt_in_capturing();
    } else {
      // Disable analytics
      posthog.opt_out_capturing();
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(this.consent));
  }

  // Get current consent settings
  getConsent(): ConsentSettings {
    return { ...this.consent };
  }

  // Check if a specific consent type is granted
  hasConsent(type: ConsentType): boolean {
    return this.consent[type] === true;
  }

  // Update consent settings
  updateConsent(updates: Partial<Omit<ConsentSettings, 'timestamp' | 'version'>>) {
    this.consent = {
      ...this.consent,
      ...updates,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    this.saveConsent();
    this.applyConsent();
  }

  // Accept all cookies
  acceptAll() {
    this.updateConsent({
      [ConsentType.NECESSARY]: true,
      [ConsentType.ANALYTICS]: true,
      [ConsentType.MARKETING]: true,
      [ConsentType.PREFERENCES]: true,
    });
  }

  // Reject all non-necessary cookies
  rejectAll() {
    this.updateConsent({
      [ConsentType.NECESSARY]: true,
      [ConsentType.ANALYTICS]: false,
      [ConsentType.MARKETING]: false,
      [ConsentType.PREFERENCES]: false,
    });
  }

  // Subscribe to consent changes
  subscribe(listener: (consent: ConsentSettings) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Check if consent has been given
  hasUserConsented(): boolean {
    return localStorage.getItem(CONSENT_KEY) !== null;
  }

  // Clear consent (for testing or user request)
  clearConsent() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(CONSENT_KEY);
    this.consent = DEFAULT_CONSENT;
    this.applyConsent();
  }

  // Get consent for data export (GDPR right to data portability)
  exportConsentData(): string {
    return JSON.stringify({
      consent: this.consent,
      exportedAt: new Date().toISOString(),
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
      },
    }, null, 2);
  }
}

// Export singleton instance
export const consentManager = new ConsentManager();

// Cookie categories with descriptions
export const COOKIE_CATEGORIES = {
  [ConsentType.NECESSARY]: {
    name: 'Necessary',
    description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
    cookies: [
      {
        name: 'faxas_cookie_consent',
        purpose: 'Stores your cookie consent preferences',
        duration: '1 year',
      },
      {
        name: 'faxas_auth_token',
        purpose: 'Maintains your authenticated session',
        duration: 'Session',
      },
    ],
  },
  [ConsentType.ANALYTICS]: {
    name: 'Analytics',
    description: 'Help us understand how visitors interact with our website to improve user experience.',
    cookies: [
      {
        name: 'ph_*',
        purpose: 'PostHog analytics tracking',
        duration: '1 year',
      },
      {
        name: '_ga*',
        purpose: 'Google Analytics tracking (if enabled)',
        duration: '2 years',
      },
    ],
  },
  [ConsentType.MARKETING]: {
    name: 'Marketing',
    description: 'Used to track visitors across websites to display relevant advertisements.',
    cookies: [
      {
        name: 'fbp',
        purpose: 'Facebook pixel tracking (if enabled)',
        duration: '90 days',
      },
    ],
  },
  [ConsentType.PREFERENCES]: {
    name: 'Preferences',
    description: 'Remember your preferences and personalization settings.',
    cookies: [
      {
        name: 'theme_preference',
        purpose: 'Stores your theme preference (light/dark)',
        duration: '1 year',
      },
      {
        name: 'language_preference',
        purpose: 'Stores your language preference',
        duration: '1 year',
      },
    ],
  },
};