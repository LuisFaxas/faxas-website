import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './config';
import { Project, Concept, User } from '@/types';

// Collection references
export const projectsRef = collection(db, 'projects');
export const conceptsRef = collection(db, 'concepts');
export const usersRef = collection(db, 'users');
export const analyticsRef = collection(db, 'analytics');

// Projects CRUD
export const projectsService = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    const snapshot = await getDocs(query(projectsRef, orderBy('priority', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  // Get project by ID
  async getById(id: string): Promise<Project | null> {
    const docSnap = await getDoc(doc(projectsRef, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Project : null;
  },

  // Get project by slug
  async getBySlug(slug: string): Promise<Project | null> {
    const q = query(projectsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project;
  },

  // Get featured projects
  async getFeatured(): Promise<Project[]> {
    const q = query(projectsRef, where('featured', '==', true), orderBy('priority', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  // Get projects by category
  async getByCategory(category: string): Promise<Project[]> {
    const q = query(projectsRef, where('category', '==', category), orderBy('priority', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  // Create project
  async create(project: Omit<Project, 'id'>): Promise<string> {
    const docRef = await addDoc(projectsRef, {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Update project
  async update(id: string, updates: Partial<Project>): Promise<void> {
    await updateDoc(doc(projectsRef, id), {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Delete project
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(projectsRef, id));
  }
};

// Concepts CRUD
export const conceptsService = {
  // Get all concepts
  async getAll(): Promise<Concept[]> {
    const snapshot = await getDocs(conceptsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Concept));
  },

  // Get concept by ID
  async getById(id: string): Promise<Concept | null> {
    const docSnap = await getDoc(doc(conceptsRef, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Concept : null;
  },

  // Create concept
  async create(concept: Omit<Concept, 'id'>): Promise<string> {
    const docRef = await addDoc(conceptsRef, concept);
    return docRef.id;
  },

  // Update concept
  async update(id: string, updates: Partial<Concept>): Promise<void> {
    await updateDoc(doc(conceptsRef, id), updates);
  },

  // Delete concept
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(conceptsRef, id));
  }
};

// Users service (for analytics and progress tracking)
export const usersService = {
  // Get or create user
  async getOrCreate(userId: string): Promise<User> {
    const docSnap = await getDoc(doc(usersRef, userId));
    
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as User;
    }
    
    // Create new user
    const newUser: Omit<User, 'uid'> = {
      email: '',
      role: 'visitor',
      profile: {},
      behavior: {
        firstVisit: new Date(),
        sessions: [],
        projectsViewed: [],
        conceptsLearned: []
      }
    };
    
    await updateDoc(doc(usersRef, userId), newUser);
    return { uid: userId, ...newUser };
  },

  // Update user progress
  async updateProgress(userId: string, conceptId: string): Promise<void> {
    const userRef = doc(usersRef, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const conceptsLearned = userData.behavior.conceptsLearned || [];
      
      if (!conceptsLearned.includes(conceptId)) {
        await updateDoc(userRef, {
          'behavior.conceptsLearned': [...conceptsLearned, conceptId]
        });
      }
    }
  }
};

// Analytics service
export const analyticsService = {
  // Track page view
  async trackPageView(userId: string, path: string): Promise<void> {
    await addDoc(analyticsRef, {
      userId,
      event: 'page_view',
      path,
      timestamp: new Date(),
      properties: {}
    });
  },

  // Track concept interaction
  async trackConceptInteraction(userId: string, conceptId: string, action: string): Promise<void> {
    await addDoc(analyticsRef, {
      userId,
      event: 'concept_interaction',
      conceptId,
      action,
      timestamp: new Date(),
      properties: {}
    });
  },

  // Track project view
  async trackProjectView(userId: string, projectId: string): Promise<void> {
    await addDoc(analyticsRef, {
      userId,
      event: 'project_view',
      projectId,
      timestamp: new Date(),
      properties: {}
    });
  }
};
