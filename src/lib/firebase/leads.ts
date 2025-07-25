import { 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './config';

export interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  source?: string;
  referrer?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  metadata?: {
    budget?: string;
    timeline?: string;
    projectType?: string;
  };
}

const LEADS_COLLECTION = 'leads';
const CONTACTS_COLLECTION = 'contacts';

// Calculate lead score based on various factors
const calculateLeadScore = (data: LeadData): number => {
  let score = 0;
  
  // Budget scoring
  if (data.budget) {
    if (data.budget.includes('20k') || data.budget.includes('50k')) score += 30;
    else if (data.budget.includes('10k')) score += 20;
    else if (data.budget.includes('5k')) score += 10;
  }
  
  // Timeline scoring
  if (data.timeline) {
    if (data.timeline.toLowerCase().includes('immediate') || data.timeline.toLowerCase().includes('asap')) score += 30;
    else if (data.timeline.includes('1-3')) score += 20;
    else if (data.timeline.includes('3+')) score += 10;
  }
  
  // Company presence
  if (data.company) score += 10;
  
  // Phone number provided
  if (data.phone) score += 10;
  
  // Message length (shows engagement)
  if (data.message.length > 200) score += 10;
  
  return Math.min(score, 100); // Cap at 100
};

// Submit a lead from project inquiry
export const submitLead = async (leadData: LeadData): Promise<{ success: boolean; error?: string }> => {
  try {
    const score = calculateLeadScore(leadData);
    
    const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
      ...leadData,
      score,
      status: 'new',
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      source: leadData.source || 'website',
      engagement: {
        emailsOpened: 0,
        linksClicked: 0,
        projectsViewed: [],
        totalTimeOnSite: 0
      }
    });
    
    // In production, you'd trigger email notifications here
    console.log('New lead submitted:', docRef.id, 'Score:', score);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return { success: false, error: error.message };
  }
};

// Submit a general contact form
export const submitContactForm = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...formData,
      status: 'unread',
      createdAt: serverTimestamp(),
      source: 'contact-form'
    });
    
    // Also create a lead for tracking
    await submitLead({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      company: formData.company,
      source: 'contact-form'
    });
    
    console.log('Contact form submitted:', docRef.id);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'newsletter'), {
      email,
      subscribed: true,
      subscribedAt: serverTimestamp(),
      source: 'website'
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
};

// Get all leads
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      metadata: {
        budget: doc.data().budget,
        timeline: doc.data().timeline,
        projectType: doc.data().projectType,
      }
    } as Lead));
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Update lead status
export const updateLeadStatus = async (leadId: string, status: Lead['status']): Promise<boolean> => {
  try {
    await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
      status,
      lastUpdated: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
};

// Get lead quality color based on score
export const getLeadQuality = (score: number) => {
  if (score >= 80) return { label: 'Hot', color: 'red' };
  if (score >= 60) return { label: 'Warm', color: 'orange' };
  if (score >= 40) return { label: 'Cool', color: 'yellow' };
  if (score >= 20) return { label: 'Cold', color: 'blue' };
  return { label: 'New', color: 'gray' };
};

// Get lead statistics
export const getLeadStats = async () => {
  try {
    const snapshot = await getDocs(collection(db, LEADS_COLLECTION));
    const leads = snapshot.docs.map(doc => doc.data());
    
    const byStatus = leads.reduce((acc, lead) => {
      const status = lead.status || 'new';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: leads.length,
      byStatus
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return { total: 0, byStatus: {} };
  }
};