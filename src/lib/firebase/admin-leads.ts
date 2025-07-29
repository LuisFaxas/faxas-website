import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  getDocs,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
  where,
  limit
} from 'firebase/firestore';
import { db } from './config';
import { Lead } from './leads';
import { PortalUser, QuestionnaireSession } from '@/types/portal';

export interface EnhancedLead extends Lead {
  portalUser?: PortalUser;
  questionnaire?: QuestionnaireSession;
}

// Real-time listener for leads with portal data
export function subscribeToLeads(
  callback: (leads: EnhancedLead[]) => void,
  errorCallback?: (error: Error) => void,
  options?: {
    statusFilter?: Lead['status'];
    limit?: number;
    orderByScore?: boolean;
  }
): Unsubscribe {
  // Build query
  let q = query(collection(db, 'leads'));
  
  // Add filters
  if (options?.statusFilter) {
    q = query(q, where('status', '==', options.statusFilter));
  }
  
  // Add ordering
  if (options?.orderByScore) {
    q = query(q, orderBy('score', 'desc'));
  } else {
    q = query(q, orderBy('createdAt', 'desc'));
  }
  
  // Add limit
  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    q,
    async (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        const leads: EnhancedLead[] = [];
        
        // Process each lead
        for (const docSnap of snapshot.docs) {
          const leadData = {
            id: docSnap.id,
            ...docSnap.data()
          } as Lead;
          
          // Create enhanced lead
          const enhancedLead: EnhancedLead = { ...leadData };
          
          // Try to fetch portal user data if email exists
          if (leadData.email) {
            try {
              // Get user by email (you might need to adjust this query based on your structure)
              const userQuery = query(
                collection(db, 'users'),
                where('email', '==', leadData.email),
                limit(1)
              );
              
              const userSnapshot = await getDoc(doc(db, 'users', leadData.uid || ''));
              if (userSnapshot.exists()) {
                enhancedLead.portalUser = userSnapshot.data() as PortalUser;
                
                // If we have a user, try to get their questionnaire
                const questionnaireDoc = await getDoc(
                  doc(db, 'questionnaire_sessions', userSnapshot.id)
                );
                
                if (questionnaireDoc.exists()) {
                  enhancedLead.questionnaire = {
                    id: questionnaireDoc.id,
                    ...questionnaireDoc.data()
                  } as QuestionnaireSession;
                }
              }
            } catch (error) {
              console.error('Error fetching portal data for lead:', leadData.email, error);
              // Continue without portal data
            }
          }
          
          leads.push(enhancedLead);
        }
        
        callback(leads);
      } catch (error) {
        console.error('Error processing leads:', error);
        if (errorCallback) {
          errorCallback(error as Error);
        }
      }
    },
    (error) => {
      console.error('Firestore listener error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );

  return unsubscribe;
}

// Get real-time stats for dashboard
export function subscribeToDashboardStats(
  callback: (stats: {
    totalLeads: number;
    hotLeads: number;
    warmLeads: number;
    newToday: number;
    completedQuestionnaires: number;
  }) => void
): Unsubscribe {
  const unsubscribe = onSnapshot(
    collection(db, 'leads'),
    async (snapshot) => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let totalLeads = 0;
      let hotLeads = 0;
      let warmLeads = 0;
      let newToday = 0;
      let completedQuestionnaires = 0;
      
      for (const doc of snapshot.docs) {
        const lead = doc.data() as Lead;
        totalLeads++;
        
        // Count by score
        if (lead.score >= 80) hotLeads++;
        else if (lead.score >= 60) warmLeads++;
        
        // Count new today
        const createdAt = lead.createdAt?.toDate();
        if (createdAt && createdAt >= todayStart) {
          newToday++;
        }
      }
      
      // Count completed questionnaires
      try {
        const questionnairesQuery = query(
          collection(db, 'questionnaire_sessions'),
          where('status', '==', 'completed')
        );
        const questionnairesSnapshot = await getDocs(questionnairesQuery);
        completedQuestionnaires = questionnairesSnapshot.size;
      } catch (error) {
        console.error('Error counting questionnaires:', error);
      }
      
      callback({
        totalLeads,
        hotLeads,
        warmLeads,
        newToday,
        completedQuestionnaires
      });
    }
  );
  
  return unsubscribe;
}