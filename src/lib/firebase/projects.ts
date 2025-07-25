import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Project } from '@/types';

const PROJECTS_COLLECTION = 'projects';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('priority', 'asc'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(projectsQuery);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    } as Project));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Get featured projects
export const getFeaturedProjects = async (limitCount = 3): Promise<Project[]> => {
  try {
    const featuredQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('featured', '==', true),
      where('status', '==', 'active'),
      orderBy('priority', 'asc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(featuredQuery);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt),
    } as Project));
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};

// Get single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Project;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

// Get project by slug
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    const projectQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    
    const snapshot = await getDocs(projectQuery);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Project;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
};

// Create new project (admin only)
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};

// Update project (admin only)
export const updateProject = async (id: string, updates: Partial<Project>): Promise<boolean> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    
    // Remove id from updates and add updatedAt
    const { id: _, createdAt, ...updateData } = updates;
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
};

// Delete project (admin only)
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Track project view
export const trackProjectView = async (projectId: string, userId?: string): Promise<void> => {
  try {
    // In a real app, you'd update analytics in Firestore
    // For now, just log it
    console.log('Project viewed:', projectId, 'by user:', userId || 'anonymous');
  } catch (error) {
    console.error('Error tracking project view:', error);
  }
};