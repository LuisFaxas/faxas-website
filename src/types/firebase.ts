// Firestore Collection Types

// User roles
export type UserRole = 'user' | 'admin';

// User status
export type UserStatus = 'active' | 'suspended' | 'deleted';

// Lead status
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

// Lead source
export type LeadSource = 'contact_form' | 'project_inquiry' | 'direct' | 'referral' | 'organic';

// Project status
export type ProjectStatus = 'draft' | 'published' | 'archived';

// Project category
export type ProjectCategory = 'web_app' | 'mobile_app' | 'ecommerce' | 'enterprise' | 'startup' | 'other';

// Display mode for projects
export type DisplayMode = 'iframe' | 'subdomain' | 'external' | 'gallery';

// Analytics event types
export type AnalyticsEventType = 
  | 'page_view'
  | 'project_view'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'lead_score_calculated'
  | 'cta_click'
  | 'demo_interaction'
  | 'tooltip_view'
  | 'resource_download';

// User document
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  metadata?: {
    company?: string;
    position?: string;
    phone?: string;
    timezone?: string;
    preferences?: {
      emailNotifications: boolean;
      marketingEmails: boolean;
    };
  };
}

// Lead document
export interface Lead {
  id: string;
  // Basic information
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  
  // Lead details
  status: LeadStatus;
  source: LeadSource;
  score: number; // 0-100
  
  // Project information
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  
  // Tracking
  createdAt: Date;
  updatedAt: Date;
  contactedAt?: Date;
  convertedAt?: Date;
  
  // Engagement metrics
  engagement: {
    pagesViewed: number;
    timeOnSite: number; // seconds
    projectsViewed: string[]; // project IDs
    resourcesDownloaded: string[];
    lastActivityAt: Date;
  };
  
  // Admin notes
  notes?: Array<{
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
  }>;
  
  // Tags for categorization
  tags?: string[];
  
  // Attribution
  attribution?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    landingPage?: string;
  };
  
  // Communication history
  communications?: Array<{
    type: 'email' | 'call' | 'meeting';
    subject: string;
    content?: string;
    authorId: string;
    createdAt: Date;
  }>;
}

// Lighthouse scores
export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

// Core Web Vitals
export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

// Project document
export interface Project {
  id: string;
  
  // Basic information
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: ProjectCategory;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  
  // Display configuration
  displayMode: DisplayMode;
  mobileReady: boolean;
  devicePreviews: {
    desktop: string;
    tablet?: string;
    mobile?: string;
  };
  
  // Technical details
  techStack: string[];
  features: string[];
  performanceMetrics: {
    lighthouse: LighthouseScores;
    loadTime: number;
    coreWebVitals: WebVitals;
    beforeOptimization?: {
      loadTime: number;
      lighthouse?: LighthouseScores;
    };
  };
  
  // Media
  thumbnail: string;
  images: string[];
  videos?: string[];
  
  // Links
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  demoUrl?: string;
  
  // Client information
  client?: {
    name: string;
    logo?: string;
    industry?: string;
    size?: string;
  };
  
  // Timeline
  startDate?: Date;
  completedAt?: Date;
  duration?: string; // e.g., "3 months"
  
  // Results & Impact
  results?: {
    metrics: Array<{
      label: string;
      value: string;
      improvement?: string;
    }>;
    testimonial?: {
      content: string;
      author: string;
      role: string;
      company?: string;
      avatar?: string;
    };
  };
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  updatedBy: string; // User ID
  
  // Analytics
  analytics?: {
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    conversionRate: number;
  };
}

// Analytics event document
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  userId?: string; // Optional for anonymous events
  sessionId: string;
  
  // Event details
  properties: {
    [key: string]: any;
  };
  
  // Context
  context: {
    page: string;
    referrer?: string;
    userAgent: string;
    device: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
    screenResolution: string;
    viewport: string;
    language: string;
  };
  
  // Location (anonymized)
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  
  // Timing
  timestamp: Date;
  
  // Performance metrics (for page views)
  performance?: {
    loadTime?: number;
    domReady?: number;
    pageSize?: number;
  };
}

// Contact form submission (subset of Lead)
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  source?: string;
}

// Admin dashboard statistics
export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageLeadScore: number;
  leadsByStatus: Record<LeadStatus, number>;
  leadsBySource: Record<LeadSource, number>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
  topProjects: Array<{
    projectId: string;
    title: string;
    views: number;
  }>;
}

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  LEADS: 'leads',
  PROJECTS: 'projects',
  ANALYTICS: 'analytics',
} as const;

// Helper type for Firestore timestamps
export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

// Helper function to convert Firestore timestamp to Date
export function timestampToDate(timestamp: FirestoreTimestamp | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp.seconds * 1000);
}

// Type guards
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin' && user?.status === 'active';
}

export function isActiveUser(user: User | null): boolean {
  return user?.status === 'active';
}