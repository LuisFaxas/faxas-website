// Core Type Definitions for FAXAS.NET

// Project Types
export interface Project {
  // Identification
  id: string;
  slug: string;
  status: 'active' | 'archived' | 'draft';
  
  // Basic Info
  title: string;
  subtitle: string;
  description: string;
  category: 'web-app' | 'interactive' | 'technical';
  featured: boolean;
  priority: number;
  
  // Showcase Configuration
  showcase: {
    tier: 1 | 2 | 3;
    quickPreview: {
      type: 'video' | 'widget' | 'carousel';
      mediaUrl?: string;
      component?: string;
      hookMessage: string;
    };
    standardShowcase?: {
      template: 'business' | 'interactive' | 'technical';
      demoUrl?: string;
      mobileStrategy: 'responsive' | 'video' | 'screenshots';
    };
    customExperience?: {
      enabled: boolean;
      route: string;
    };
  };
  
  // Technical Details
  technical: {
    stack: string[];
    features: Feature[];
    liveUrl?: string;
    githubUrl?: string;
    performance: PerformanceMetrics;
  };
  
  // Business Impact
  results: {
    metrics: BusinessMetric[];
    testimonial?: Testimonial;
  };
  
  // Educational Content
  educational: {
    concepts: Concept[];
    comparisons: Comparison[];
    learningPath: string[];
  };
  
  // Analytics
  analytics: {
    views: number;
    engagement: EngagementMetrics;
    conversion: ConversionMetrics;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User {
  // Auth
  uid: string;
  email: string;
  role: 'visitor' | 'lead' | 'client' | 'admin';
  
  // Profile
  profile: {
    name?: string;
    company?: string;
    role?: string;
    phone?: string;
  };
  
  // Behavior
  behavior: {
    firstVisit: Date;
    sessions: Session[];
    projectsViewed: string[];
    conceptsLearned: string[];
  };
  
  // Lead Data
  leadData?: {
    score: number;
    status: 'new' | 'contacted' | 'qualified' | 'converted';
    source: string;
    notes: Note[];
  };
}

// Educational Types
export interface EducationalConcept {
  id: string;
  term: string;
  category: 'technical' | 'business' | 'process';
  
  content: {
    simple: string;      // For beginners
    detailed: string;    // For technical people
    businessValue: string; // ROI focus
  };
  
  triggers: {
    projects: string[];
    pages: string[];
    interactions: string[];
  };
  
  analytics: {
    views: number;
    understood: number;
    conversionImpact: number;
  };
}

// Supporting Types
export interface Feature {
  name: string;
  description: string;
  icon?: string;
  educationalConceptId?: string;
}

export interface BusinessMetric {
  label: string;
  value: string | number;
  improvement?: string;
  icon?: string;
}

export interface Testimonial {
  author: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
  image?: string;
}

export interface Concept {
  id: string;
  name: string;
  simpleExplanation: string;
}

export interface Comparison {
  id: string;
  title: string;
  traditional: {
    description: string;
    issues: string[];
    metric?: string;
  };
  modern: {
    description: string;
    benefits: string[];
    metric?: string;
  };
  businessImpact: string;
}

export interface PerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  webVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  loadTime: number;
}

export interface EngagementMetrics {
  timeSpent: number;
  interactions: number;
  scrollDepth: number;
  educationalEngagement: number;
}

export interface ConversionMetrics {
  viewToLead: number;
  leadToDiscovery: number;
  discoveryToClient: number;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  pageViews: PageView[];
  events: AnalyticsEvent[];
}

export interface PageView {
  path: string;
  timestamp: Date;
  duration: number;
}

export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, string | number | boolean | null>;
  timestamp: Date;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

// Component Prop Types
export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  level?: 'light' | 'medium' | 'heavy';
  float?: boolean;
  glow?: boolean;
}

export interface SmartTooltipProps {
  term: string;
  concept: string | {
    simple: string;
    detailed: string;
    businessValue: string;
  };
  userLevel?: 'novice' | 'intermediate' | 'advanced';
  children: React.ReactNode;
}

export interface ComparisonWidgetProps {
  title: string;
  traditional: {
    demo?: React.ReactNode;
    issues: string[];
    time?: string;
  };
  modern: {
    demo?: React.ReactNode;
    benefits: string[];
    time?: string;
  };
  businessImpact: string;
}

// Quick Preview Types
export interface QuickPreviewConfig {
  video?: {
    duration: string;
    content: string;
    autoplay: boolean;
    size: string;
  };
  widget?: {
    size: string;
    interaction: string;
    realtime: boolean;
    example: string;
  };
  carousel?: {
    images: string;
    timing: string;
    captions: string;
    transition: string;
  };
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  projectType?: 'web-app' | 'interactive' | 'technical' | 'other';
  budget?: string;
  timeline?: string;
}
