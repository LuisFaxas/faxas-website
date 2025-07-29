import * as admin from 'firebase-admin';
import { User, Lead, Project, AnalyticsEvent, COLLECTIONS } from '@/types/firebase';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Use environment variables
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && 
        process.env.FIREBASE_ADMIN_PROJECT_ID && 
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn('Firebase Admin SDK not initialized: Missing environment variables');
      console.warn('Please set FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_PROJECT_ID, and FIREBASE_ADMIN_CLIENT_EMAIL');
    }

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    console.error('Make sure your service account key is configured correctly');
  }
}

// Check if admin is initialized
const isAdminInitialized = admin.apps.length > 0;

export const adminAuth = isAdminInitialized ? admin.auth() : null;
export const adminDb = isAdminInitialized ? admin.firestore() : null;

// Type-safe collection references
export const collections = isAdminInitialized && adminDb ? {
  users: adminDb.collection(COLLECTIONS.USERS) as admin.firestore.CollectionReference<User>,
  leads: adminDb.collection(COLLECTIONS.LEADS) as admin.firestore.CollectionReference<Lead>,
  projects: adminDb.collection(COLLECTIONS.PROJECTS) as admin.firestore.CollectionReference<Project>,
  analytics: adminDb.collection(COLLECTIONS.ANALYTICS) as admin.firestore.CollectionReference<AnalyticsEvent>,
} : null;

// User management functions
export async function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    await collections.users.doc(userData.uid).set({
      ...userData,
      createdAt: now,
      updatedAt: now,
    } as any);
    console.log(`Successfully created user ${userData.uid}`);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserRole(uid: string, role: 'admin' | 'user'): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    await collections.users.doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Successfully updated user ${uid} role to ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

export async function makeUserAdminByEmail(email: string): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const userQuery = await collections.users.where('email', '==', email).limit(1).get();
    
    if (userQuery.empty) {
      throw new Error(`No user found with email: ${email}`);
    }
    
    const userDoc = userQuery.docs[0];
    await updateUserRole(userDoc.id, 'admin');
    
    console.log(`Successfully made ${email} an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
}

// Lead management functions
export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const leadRef = await collections.leads.add({
      ...leadData,
      createdAt: now,
      updatedAt: now,
    } as any);
    
    console.log(`Successfully created lead ${leadRef.id}`);
    return leadRef.id;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const updateData: any = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (status === 'contacted') {
      updateData.contactedAt = admin.firestore.FieldValue.serverTimestamp();
    } else if (status === 'converted') {
      updateData.convertedAt = admin.firestore.FieldValue.serverTimestamp();
    }
    
    await collections.leads.doc(leadId).update(updateData);
    console.log(`Successfully updated lead ${leadId} status to ${status}`);
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
}

// Project management functions
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const projectRef = await collections.projects.add({
      ...projectData,
      createdAt: now,
      updatedAt: now,
    } as any);
    
    console.log(`Successfully created project ${projectRef.id}`);
    return projectRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProjectStatus(projectId: string, status: Project['status']): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    await collections.projects.doc(projectId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Successfully updated project ${projectId} status to ${status}`);
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

// Analytics functions
export async function trackEvent(eventData: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
  if (!collections) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    await collections.analytics.add({
      ...eventData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    } as any);
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Helper function to get server timestamp
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;