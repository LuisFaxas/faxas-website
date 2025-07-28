import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  DocumentData,
  Timestamp,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { 
  User, 
  Lead, 
  Project, 
  AnalyticsEvent, 
  COLLECTIONS,
  ContactFormData,
  timestampToDate 
} from '@/types/firebase';

// Collection references
export const usersCollection = collection(db, COLLECTIONS.USERS);
export const leadsCollection = collection(db, COLLECTIONS.LEADS);
export const projectsCollection = collection(db, COLLECTIONS.PROJECTS);
export const analyticsCollection = collection(db, COLLECTIONS.ANALYTICS);

// User operations
export async function createUserProfile(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const userRef = doc(usersCollection, user.uid);
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = doc(usersCollection, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        lastLoginAt: data.lastLoginAt ? timestampToDate(data.lastLoginAt) : undefined,
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Lead operations
export async function createLead(leadData: ContactFormData): Promise<string> {
  try {
    // Calculate lead score based on data
    const score = calculateLeadScore(leadData);
    
    const lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company,
      message: leadData.message,
      projectType: leadData.projectType,
      budget: leadData.budget,
      timeline: leadData.timeline,
      status: 'new',
      source: leadData.source as Lead['source'] || 'contact_form',
      score,
      engagement: {
        pagesViewed: 1,
        timeOnSite: 0,
        projectsViewed: [],
        resourcesDownloaded: [],
        lastActivityAt: new Date(),
      },
    };
    
    const docRef = await addDoc(leadsCollection, {
      ...lead,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      engagement: {
        ...lead.engagement,
        lastActivityAt: serverTimestamp(),
      },
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

function calculateLeadScore(data: ContactFormData): number {
  let score = 0;
  
  // Budget weight (40 points)
  if (data.budget === '$50k+') score += 40;
  else if (data.budget === '$25k-$50k') score += 30;
  else if (data.budget === '$10k-$25k') score += 20;
  else if (data.budget === '$5k-$10k') score += 10;
  
  // Timeline urgency (30 points)
  if (data.timeline === 'ASAP') score += 30;
  else if (data.timeline === '1-3 months') score += 20;
  else if (data.timeline === '3-6 months') score += 10;
  
  // Project type (15 points)
  if (data.projectType) score += 15;
  
  // Company info (15 points)
  if (data.company) score += 15;
  
  return Math.min(score, 100);
}

export async function getLeads(constraints: QueryConstraint[] = []): Promise<Lead[]> {
  try {
    const q = query(leadsCollection, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt),
      contactedAt: doc.data().contactedAt ? timestampToDate(doc.data().contactedAt) : undefined,
      convertedAt: doc.data().convertedAt ? timestampToDate(doc.data().convertedAt) : undefined,
      engagement: {
        ...doc.data().engagement,
        lastActivityAt: timestampToDate(doc.data().engagement.lastActivityAt),
      },
    } as Lead));
  } catch (error) {
    console.error('Error getting leads:', error);
    throw error;
  }
}

export function subscribeToLeads(
  constraints: QueryConstraint[],
  callback: (leads: Lead[]) => void
): Unsubscribe {
  const q = query(leadsCollection, ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt),
      contactedAt: doc.data().contactedAt ? timestampToDate(doc.data().contactedAt) : undefined,
      convertedAt: doc.data().convertedAt ? timestampToDate(doc.data().convertedAt) : undefined,
      engagement: {
        ...doc.data().engagement,
        lastActivityAt: timestampToDate(doc.data().engagement.lastActivityAt),
      },
    } as Lead));
    
    callback(leads);
  });
}

// Project operations
export async function getProjects(constraints: QueryConstraint[] = []): Promise<Project[]> {
  try {
    const q = query(projectsCollection, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate ? timestampToDate(doc.data().startDate) : undefined,
      completedAt: doc.data().completedAt ? timestampToDate(doc.data().completedAt) : undefined,
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt),
    } as Project));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const q = query(projectsCollection, where('slug', '==', slug), where('status', '==', 'published'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate ? timestampToDate(doc.data().startDate) : undefined,
      completedAt: doc.data().completedAt ? timestampToDate(doc.data().completedAt) : undefined,
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt),
    } as Project;
  } catch (error) {
    console.error('Error getting project by slug:', error);
    throw error;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  return getProjects([
    where('status', '==', 'published'),
    orderBy('order', 'asc'),
  ]);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getProjects([
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('order', 'asc'),
    limit(6),
  ]);
}

// Analytics operations
export async function trackAnalyticsEvent(
  type: AnalyticsEvent['type'],
  properties: Record<string, any> = {},
  userId?: string
): Promise<void> {
  try {
    const event: Omit<AnalyticsEvent, 'id' | 'timestamp'> = {
      type,
      userId,
      sessionId: getSessionId(),
      properties,
      context: {
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOSName(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
      },
    };
    
    await addDoc(analyticsCollection, {
      ...event,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Helper functions
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowserName(): string {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes('chrome')) return 'Chrome';
  if (agent.includes('firefox')) return 'Firefox';
  if (agent.includes('safari')) return 'Safari';
  if (agent.includes('edge')) return 'Edge';
  return 'Other';
}

function getOSName(): string {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';
  if (/android/i.test(navigator.userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return 'iOS';
  return 'Other';
}

// Export helper functions
export { serverTimestamp, Timestamp };