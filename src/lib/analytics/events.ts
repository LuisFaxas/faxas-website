import { getPostHog } from './posthog-client';

// Event types for type safety
export enum EventCategory {
  USER = 'user',
  NAVIGATION = 'navigation',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  ERROR = 'error',
}

export enum UserEvent {
  SIGN_UP = 'user_sign_up',
  LOGIN = 'user_login',
  LOGOUT = 'user_logout',
  PROFILE_UPDATE = 'user_profile_update',
}

export enum NavigationEvent {
  PAGE_VIEW = 'page_view',
  LINK_CLICK = 'link_click',
  MENU_TOGGLE = 'menu_toggle',
  SEARCH = 'search',
}

export enum EngagementEvent {
  PROJECT_VIEW = 'project_view',
  PROJECT_DEMO_CLICK = 'project_demo_click',
  SKILL_HOVER = 'skill_hover',
  SCROLL_DEPTH = 'scroll_depth',
  TIME_ON_PAGE = 'time_on_page',
}

export enum ConversionEvent {
  CONTACT_FORM_START = 'contact_form_start',
  CONTACT_FORM_SUBMIT = 'contact_form_submit',
  CONTACT_FORM_ERROR = 'contact_form_error',
  CTA_CLICK = 'cta_click',
  DOWNLOAD = 'download',
}

export enum ErrorEvent {
  CLIENT_ERROR = 'client_error',
  API_ERROR = 'api_error',
  FORM_VALIDATION_ERROR = 'form_validation_error',
}

// Event properties types
interface BaseEventProps {
  timestamp?: string;
  session_id?: string;
  [key: string]: unknown;
}

interface UserEventProps extends BaseEventProps {
  user_id?: string;
  email?: string;
  method?: 'email' | 'google' | 'github';
}

interface NavigationEventProps extends BaseEventProps {
  from_path?: string;
  to_path?: string;
  link_text?: string;
  link_url?: string;
}

interface EngagementEventProps extends BaseEventProps {
  project_id?: string;
  project_title?: string;
  skill_name?: string;
  scroll_percentage?: number;
  time_seconds?: number;
}

interface ConversionEventProps extends BaseEventProps {
  form_field?: string;
  form_step?: number;
  cta_text?: string;
  cta_location?: string;
  download_file?: string;
}

interface ErrorEventProps extends BaseEventProps {
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  error_code?: string | number;
  component?: string;
}

// Analytics tracking functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

export const analytics = {
  // Track custom event
  track(eventName: string, properties?: BaseEventProps) {
    const posthog = getPostHog();
    if (!posthog) return;

    posthog.capture(eventName, {
      ...properties,
      timestamp: properties?.timestamp || new Date().toISOString(),
    });
  },

  // User events
  user: {
    signUp(properties?: UserEventProps) {
      analytics.track(UserEvent.SIGN_UP, {
        category: EventCategory.USER,
        ...properties,
      });
    },
    
    login(properties?: UserEventProps) {
      analytics.track(UserEvent.LOGIN, {
        category: EventCategory.USER,
        ...properties,
      });
    },
    
    logout(properties?: UserEventProps) {
      analytics.track(UserEvent.LOGOUT, {
        category: EventCategory.USER,
        ...properties,
      });
    },
    
    updateProfile(properties?: UserEventProps) {
      analytics.track(UserEvent.PROFILE_UPDATE, {
        category: EventCategory.USER,
        ...properties,
      });
    },
  },

  // Navigation events
  navigation: {
    linkClick(properties: NavigationEventProps) {
      analytics.track(NavigationEvent.LINK_CLICK, {
        category: EventCategory.NAVIGATION,
        ...properties,
      });
    },
    
    menuToggle(isOpen: boolean, properties?: NavigationEventProps) {
      analytics.track(NavigationEvent.MENU_TOGGLE, {
        category: EventCategory.NAVIGATION,
        is_open: isOpen,
        ...properties,
      });
    },
    
    search(query: string, properties?: NavigationEventProps) {
      analytics.track(NavigationEvent.SEARCH, {
        category: EventCategory.NAVIGATION,
        query,
        ...properties,
      });
    },
  },

  // Engagement events
  engagement: {
    projectView(projectId: string, projectTitle: string, properties?: EngagementEventProps) {
      analytics.track(EngagementEvent.PROJECT_VIEW, {
        category: EventCategory.ENGAGEMENT,
        project_id: projectId,
        project_title: projectTitle,
        ...properties,
      });
    },
    
    projectDemoClick(projectId: string, projectTitle: string, properties?: EngagementEventProps) {
      analytics.track(EngagementEvent.PROJECT_DEMO_CLICK, {
        category: EventCategory.ENGAGEMENT,
        project_id: projectId,
        project_title: projectTitle,
        ...properties,
      });
    },
    
    skillHover(skillName: string, properties?: EngagementEventProps) {
      analytics.track(EngagementEvent.SKILL_HOVER, {
        category: EventCategory.ENGAGEMENT,
        skill_name: skillName,
        ...properties,
      });
    },
    
    scrollDepth(percentage: number, properties?: EngagementEventProps) {
      analytics.track(EngagementEvent.SCROLL_DEPTH, {
        category: EventCategory.ENGAGEMENT,
        scroll_percentage: percentage,
        ...properties,
      });
    },
    
    timeOnPage(seconds: number, properties?: EngagementEventProps) {
      analytics.track(EngagementEvent.TIME_ON_PAGE, {
        category: EventCategory.ENGAGEMENT,
        time_seconds: seconds,
        ...properties,
      });
    },
  },

  // Conversion events
  conversion: {
    contactFormStart(properties?: ConversionEventProps) {
      analytics.track(ConversionEvent.CONTACT_FORM_START, {
        category: EventCategory.CONVERSION,
        ...properties,
      });
    },
    
    contactFormSubmit(properties?: ConversionEventProps) {
      analytics.track(ConversionEvent.CONTACT_FORM_SUBMIT, {
        category: EventCategory.CONVERSION,
        ...properties,
      });
    },
    
    contactFormError(errorMessage: string, properties?: ConversionEventProps) {
      analytics.track(ConversionEvent.CONTACT_FORM_ERROR, {
        category: EventCategory.CONVERSION,
        error_message: errorMessage,
        ...properties,
      });
    },
    
    ctaClick(ctaText: string, ctaLocation: string, properties?: ConversionEventProps) {
      analytics.track(ConversionEvent.CTA_CLICK, {
        category: EventCategory.CONVERSION,
        cta_text: ctaText,
        cta_location: ctaLocation,
        ...properties,
      });
    },
    
    download(fileName: string, properties?: ConversionEventProps) {
      analytics.track(ConversionEvent.DOWNLOAD, {
        category: EventCategory.CONVERSION,
        download_file: fileName,
        ...properties,
      });
    },
  },

  // Error events
  error: {
    client(error: Error, properties?: ErrorEventProps) {
      analytics.track(ErrorEvent.CLIENT_ERROR, {
        category: EventCategory.ERROR,
        error_type: error.name,
        error_message: error.message,
        error_stack: error.stack,
        ...properties,
      });
    },
    
    api(endpoint: string, statusCode: number, errorMessage: string, properties?: ErrorEventProps) {
      analytics.track(ErrorEvent.API_ERROR, {
        category: EventCategory.ERROR,
        endpoint,
        status_code: statusCode,
        error_message: errorMessage,
        ...properties,
      });
    },
    
    formValidation(field: string, errorMessage: string, properties?: ErrorEventProps) {
      analytics.track(ErrorEvent.FORM_VALIDATION_ERROR, {
        category: EventCategory.ERROR,
        form_field: field,
        error_message: errorMessage,
        ...properties,
      });
    },
  },

  // Feature flags
  featureFlag(flagKey: string) {
    const posthog = getPostHog();
    if (!posthog) return false;
    
    return posthog.isFeatureEnabled(flagKey);
  },

  // Get feature flag payload
  featureFlagPayload(flagKey: string) {
    const posthog = getPostHog();
    if (!posthog) return null;
    
    return posthog.getFeatureFlagPayload(flagKey);
  },
};