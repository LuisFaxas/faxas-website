import { Timestamp } from 'firebase/firestore';

// Portal User Types - Core of the unified system
export type PortalRole = 'lead' | 'qualified_lead' | 'client' | 'past_client' | 'admin';
export type JourneyStage = 'exploring' | 'evaluating' | 'deciding' | 'onboarding' | 'active' | 'completed';
export type MilestoneType = 
  | 'account_created' 
  | 'questionnaire_started'
  | 'questionnaire_completed' 
  | 'proposal_viewed' 
  | 'contract_signed' 
  | 'project_started' 
  | 'project_completed';

export interface RoleChange {
  from: PortalRole;
  to: PortalRole;
  timestamp: Timestamp;
  reason: string;
}

export interface Milestone {
  type: MilestoneType;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

export interface PortalFeatures {
  questionnaire: boolean;      // leads+
  dashboard: boolean;          // leads+
  resources: boolean;          // leads+
  proposals: boolean;          // qualified_leads+
  contracts: boolean;          // qualified_leads+
  projects: boolean;           // clients+
  files: boolean;             // clients+
  invoices: boolean;          // clients+
  communication: boolean;      // clients+
}

export interface PortalUser {
  // Core identity (permanent)
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  company?: string;
  phone?: string;
  
  // Role evolution
  role: PortalRole;
  roleHistory: RoleChange[];
  
  // Portal access (grows with role)
  portalFeatures: PortalFeatures;
  
  // Journey tracking
  journeyStage: JourneyStage;
  milestones: Milestone[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

// Questionnaire Types
export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'multi-select' 
  | 'card-select' 
  | 'slider' 
  | 'yes-no'
  | 'file-upload';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface BranchRule {
  condition: {
    questionId: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  nextQuestionId: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  branching?: BranchRule[];
  metadata?: {
    scoreWeight?: number;
    category?: string;
  };
}

export interface QuestionnaireResponse {
  questionId: string;
  value: any;
  answeredAt: Timestamp;
  timeSpent?: number; // seconds
}

export interface QuestionnaireSession {
  id: string;
  userId: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  lastQuestionId?: string;
  responses: QuestionnaireResponse[];
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  version: string;
}

// Lead Scoring 2.0
export interface LeadScoreBreakdown {
  budget: number;         // 0-35 points
  timeline: number;       // 0-25 points
  authority: number;      // 0-15 points
  complexity: number;     // 0-15 points
  engagement: number;     // 0-10 points
  total: number;         // 0-100 points
  temperature: 'hot' | 'warm' | 'qualified' | 'cool' | 'early';
}

// Portal Dashboard Types
export interface PortalDashboardData {
  user: PortalUser;
  questionnaire?: {
    status: 'not_started' | 'in_progress' | 'completed';
    completionPercentage: number;
    responses?: QuestionnaireResponse[];
    score?: LeadScoreBreakdown;
  };
  resources: {
    recommended: Resource[];
    downloaded: Resource[];
  };
  nextSteps: NextStep[];
  communications: Communication[];
  projectBrief?: ProjectBrief;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'case_study' | 'template' | 'video';
  url: string;
  downloadedAt?: Timestamp;
  relevanceScore: number;
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  action: {
    type: 'link' | 'button' | 'form';
    label: string;
    url?: string;
    handler?: string;
  };
  priority: 'high' | 'medium' | 'low';
  dueBy?: Timestamp;
}

export interface Communication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  summary?: string;
  date: Timestamp;
  direction: 'inbound' | 'outbound';
}

export interface ProjectBrief {
  id: string;
  generatedAt: Timestamp;
  summary: string;
  objectives: string[];
  scope: string[];
  timeline: {
    start?: Date;
    end?: Date;
    milestones: Array<{
      name: string;
      date: Date;
    }>;
  };
  budget: {
    min?: number;
    max?: number;
    currency: string;
  };
  downloadUrl?: string;
}

// Helper functions
export function getPortalFeatures(role: PortalRole): PortalFeatures {
  const baseFeatures: PortalFeatures = {
    questionnaire: false,
    dashboard: false,
    resources: false,
    proposals: false,
    contracts: false,
    projects: false,
    files: false,
    invoices: false,
    communication: false,
  };

  switch (role) {
    case 'lead':
      return {
        ...baseFeatures,
        questionnaire: true,
        dashboard: true,
        resources: true,
      };
    case 'qualified_lead':
      return {
        ...baseFeatures,
        questionnaire: true,
        dashboard: true,
        resources: true,
        proposals: true,
        contracts: true,
      };
    case 'client':
    case 'past_client':
      return {
        ...baseFeatures,
        questionnaire: true,
        dashboard: true,
        resources: true,
        proposals: true,
        contracts: true,
        projects: true,
        files: true,
        invoices: true,
        communication: true,
      };
    case 'admin':
      // Admin has access to everything
      return Object.keys(baseFeatures).reduce((acc, key) => {
        acc[key as keyof PortalFeatures] = true;
        return acc;
      }, {} as PortalFeatures);
    default:
      return baseFeatures;
  }
}

export function getTemperatureEmoji(temperature: LeadScoreBreakdown['temperature']): string {
  const temperatureMap = {
    hot: '🔥',
    warm: '🌟',
    qualified: '💎',
    cool: '❄️',
    early: '🌱',
  };
  return temperatureMap[temperature] || '❓';
}

export function calculateLeadTemperature(score: number): LeadScoreBreakdown['temperature'] {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'qualified';
  if (score >= 20) return 'cool';
  return 'early';
}