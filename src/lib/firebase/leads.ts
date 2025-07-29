import { 
  collection, 
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { 
  Lead, 
  ContactFormData, 
  LeadStatus, 
  LeadSource,
  DashboardStats 
} from '@/types/firebase';
import { createLead, trackAnalyticsEvent } from './db';
import { authRateLimiter, getRateLimitKey, formatRemainingTime } from './rate-limiter';

// Import RateLimiter class
import { RateLimiter } from './rate-limiter';

// Rate limiter for form submissions (3 per 10 minutes)
const formRateLimiter = new RateLimiter(3, 10 * 60 * 1000, 30 * 60 * 1000);

// Submit contact form with rate limiting and duplicate detection
export const submitContactForm = async (
  formData: ContactFormData
): Promise<{ success: boolean; error?: string; leadId?: string }> => {
  try {
    // Check rate limiting by email
    const rateLimitKey = getRateLimitKey('email', formData.email);
    const { blocked, remainingTime } = formRateLimiter.isBlocked(rateLimitKey);
    
    if (blocked && remainingTime) {
      return { 
        success: false, 
        error: `Too many submissions. Please try again in ${formatRemainingTime(remainingTime)}.` 
      };
    }

    // Check for duplicate submissions (same email within 24 hours)
    const isDuplicate = await checkDuplicateSubmission(formData.email);
    if (isDuplicate) {
      return { 
        success: false, 
        error: 'You have already submitted a form recently. We\'ll get back to you soon!' 
      };
    }

    // Create the lead
    const leadId = await createLead(formData);
    
    // Record successful submission
    formRateLimiter.recordAttempt(rateLimitKey, true);
    
    // Track analytics event
    await trackAnalyticsEvent('contact_form_submit', {
      leadId,
      source: formData.source || 'contact_form',
      hasCompany: !!formData.company,
      hasProjectDetails: !!(formData.projectType || formData.budget || formData.timeline)
    });
    
    // TODO: Trigger email notification
    // await sendEmailNotification(leadId, formData);
    
    return { success: true, leadId };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    
    // Record failed attempt
    const rateLimitKey = getRateLimitKey('email', formData.email);
    formRateLimiter.recordAttempt(rateLimitKey, false);
    
    return { 
      success: false, 
      error: 'Failed to submit form. Please try again later.' 
    };
  }
};

// Check for duplicate submissions within 24 hours
async function checkDuplicateSubmission(email: string): Promise<boolean> {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const q = query(
      collection(db, 'leads'),
      where('email', '==', email),
      where('createdAt', '>', twentyFourHoursAgo),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return false; // Don't block on error
  }
}

// Get all leads for admin dashboard
export const getLeads = async (
  filters?: {
    status?: LeadStatus;
    source?: LeadSource;
    startDate?: Date;
    endDate?: Date;
  },
  pagination?: {
    pageSize?: number;
    lastDoc?: any;
  }
): Promise<{ leads: Lead[]; hasMore: boolean }> => {
  try {
    let q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    
    // Apply filters
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.source) {
      q = query(q, where('source', '==', filters.source));
    }
    if (filters?.startDate) {
      q = query(q, where('createdAt', '>=', filters.startDate));
    }
    if (filters?.endDate) {
      q = query(q, where('createdAt', '<=', filters.endDate));
    }
    
    // Apply pagination
    const pageSize = pagination?.pageSize || 50;
    q = query(q, limit(pageSize + 1)); // Get one extra to check if there's more
    
    if (pagination?.lastDoc) {
      q = query(q, startAfter(pagination.lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    
    // Remove the extra doc if present
    if (hasMore) {
      docs.pop();
    }
    
    const leads = docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Lead));
    
    return { leads, hasMore };
  } catch (error) {
    console.error('Error fetching leads:', error);
    return { leads: [], hasMore: false };
  }
};

// Update lead status
export const updateLeadStatus = async (
  leadId: string, 
  status: LeadStatus
): Promise<boolean> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    const leadDoc = await getDoc(leadRef);
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    // Add timestamp for specific status changes
    if (status === 'contacted' && !leadDoc.data()?.contactedAt) {
      updateData.contactedAt = serverTimestamp();
    } else if (status === 'converted' && !leadDoc.data()?.convertedAt) {
      updateData.convertedAt = serverTimestamp();
    }
    
    await updateDoc(leadRef, updateData);
    
    // Track analytics
    await trackAnalyticsEvent('lead_status_updated', {
      leadId,
      newStatus: status
    });
    
    return true;
  } catch (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
};

// Add note to lead
export const addLeadNote = async (
  leadId: string,
  note: string,
  authorId: string,
  authorName: string
): Promise<boolean> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }
    
    const currentNotes = leadDoc.data().notes || [];
    const newNote = {
      content: note,
      authorId,
      authorName,
      createdAt: new Date()
    };
    
    await updateDoc(leadRef, {
      notes: [...currentNotes, newNote],
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding note:', error);
    return false;
  }
};

// Add tags to lead
export const addLeadTags = async (
  leadId: string,
  tags: string[]
): Promise<boolean> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }
    
    const currentTags = leadDoc.data().tags || [];
    const uniqueTags = Array.from(new Set([...currentTags, ...tags]));
    
    await updateDoc(leadRef, {
      tags: uniqueTags,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding tags:', error);
    return false;
  }
};

// Remove tag from lead
export const removeLeadTag = async (
  leadId: string,
  tag: string
): Promise<boolean> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }
    
    const currentTags = leadDoc.data().tags || [];
    const updatedTags = currentTags.filter((t: string) => t !== tag);
    
    await updateDoc(leadRef, {
      tags: updatedTags,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error removing tag:', error);
    return false;
  }
};

// Get lead statistics for dashboard
export const getLeadStats = async (): Promise<DashboardStats> => {
  try {
    const leadsSnapshot = await getDocs(collection(db, 'leads'));
    const leads = leadsSnapshot.docs.map(doc => doc.data() as Lead);
    
    // Calculate statistics
    const totalLeads = leads.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newLeadsToday = leads.filter(lead => {
      const createdAt = lead.createdAt instanceof Timestamp 
        ? lead.createdAt.toDate() 
        : lead.createdAt;
      return createdAt >= today;
    }).length;
    
    const qualifiedLeads = leads.filter(lead => 
      lead.status === 'qualified' || lead.status === 'converted'
    ).length;
    
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    const totalScore = leads.reduce((sum, lead) => sum + lead.score, 0);
    const averageLeadScore = totalLeads > 0 ? totalScore / totalLeads : 0;
    
    // Group by status
    const leadsByStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<LeadStatus, number>);
    
    // Group by source
    const leadsBySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<LeadSource, number>);
    
    // Recent activity (last 10 events)
    const recentActivity = leads
      .sort((a, b) => {
        const aTime = a.updatedAt instanceof Timestamp ? a.updatedAt.toDate() : a.updatedAt;
        const bTime = b.updatedAt instanceof Timestamp ? b.updatedAt.toDate() : b.updatedAt;
        return bTime.getTime() - aTime.getTime();
      })
      .slice(0, 10)
      .map(lead => ({
        type: 'new_lead',
        description: `New lead: ${lead.name} (${lead.email})`,
        timestamp: lead.createdAt instanceof Timestamp ? lead.createdAt.toDate() : lead.createdAt
      }));
    
    // Top projects (placeholder - would need project view tracking)
    const topProjects: any[] = [];
    
    return {
      totalLeads,
      newLeadsToday,
      qualifiedLeads,
      conversionRate,
      averageLeadScore,
      leadsByStatus,
      leadsBySource,
      recentActivity,
      topProjects
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return {
      totalLeads: 0,
      newLeadsToday: 0,
      qualifiedLeads: 0,
      conversionRate: 0,
      averageLeadScore: 0,
      leadsByStatus: {} as Record<LeadStatus, number>,
      leadsBySource: {} as Record<LeadSource, number>,
      recentActivity: [],
      topProjects: []
    };
  }
};

// Get lead quality label and color
export const getLeadQuality = (score: number): { label: string; color: string; bgColor: string } => {
  if (score >= 80) return { 
    label: 'Hot', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100' 
  };
  if (score >= 60) return { 
    label: 'Warm', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100' 
  };
  if (score >= 40) return { 
    label: 'Cool', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100' 
  };
  if (score >= 20) return { 
    label: 'Cold', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100' 
  };
  return { 
    label: 'New', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100' 
  };
};

// Search leads by name, email, or company
export const searchLeads = async (searchTerm: string): Promise<Lead[]> => {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    // Firestore doesn't support full-text search, so we'll do a simple prefix search on email
    // For production, consider using Algolia or ElasticSearch
    const emailQuery = query(
      collection(db, 'leads'),
      where('email', '>=', searchTerm.toLowerCase()),
      where('email', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      limit(10)
    );
    
    const snapshot = await getDocs(emailQuery);
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Lead));
    
    // Client-side filtering for name and company
    const searchLower = searchTerm.toLowerCase();
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      (lead.company && lead.company.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching leads:', error);
    return [];
  }
};

// Export leads to CSV (returns CSV string)
export const exportLeadsToCSV = (leads: Lead[]): string => {
  const headers = [
    'Name',
    'Email',
    'Company',
    'Phone',
    'Status',
    'Score',
    'Source',
    'Budget',
    'Timeline',
    'Project Type',
    'Created At',
    'Message'
  ];
  
  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.company || '',
    lead.phone || '',
    lead.status,
    lead.score.toString(),
    lead.source,
    lead.budget || '',
    lead.timeline || '',
    lead.projectType || '',
    lead.createdAt instanceof Timestamp 
      ? lead.createdAt.toDate().toISOString() 
      : lead.createdAt.toISOString(),
    lead.message.replace(/"/g, '""') // Escape quotes in message
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};