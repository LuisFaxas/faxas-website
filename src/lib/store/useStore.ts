import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { Project } from '@/types';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  reducedMotion?: boolean;
  educationLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface EducationalProgress {
  viewedConcepts: string[];
  completedConcepts: string[];
  totalTimeSpent: number;
  lastActivity: Date | null;
}

interface AppState {
  // Auth state
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  
  // Projects state
  projects: Project[];
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  
  // UI state
  sidebarOpen: boolean;
  modalOpen: boolean;
  toggleSidebar: () => void;
  setModalOpen: (open: boolean) => void;
  
  // User preferences
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  
  // Educational progress
  educationalProgress: EducationalProgress;
  trackConceptView: (conceptId: string) => void;
  markConceptComplete: (conceptId: string) => void;
  updateTimeSpent: (minutes: number) => void;
  
  // Loading states
  loading: {
    auth: boolean;
    projects: boolean;
    global: boolean;
  };
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  
  // Reset store
  reset: () => void;
}

const initialState = {
  user: null,
  isAdmin: false,
  projects: [],
  selectedProject: null,
  sidebarOpen: false,
  modalOpen: false,
  preferences: {
    theme: 'system' as const,
    reducedMotion: false,
    educationLevel: 'beginner' as const,
  },
  educationalProgress: {
    viewedConcepts: [],
    completedConcepts: [],
    totalTimeSpent: 0,
    lastActivity: null,
  },
  loading: {
    auth: true,
    projects: false,
    global: false,
  },
};

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        // Auth actions
        setUser: (user) => set({ user }),
        setIsAdmin: (isAdmin) => set({ isAdmin }),
        
        // Projects actions
        setProjects: (projects) => set({ projects }),
        setSelectedProject: (selectedProject) => set({ selectedProject }),
        
        // UI actions
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setModalOpen: (modalOpen) => set({ modalOpen }),
        
        // Preferences actions
        setPreference: (key, value) => 
          set((state) => ({
            preferences: {
              ...state.preferences,
              [key]: value,
            },
          })),
        
        // Educational progress actions
        trackConceptView: (conceptId) =>
          set((state) => ({
            educationalProgress: {
              ...state.educationalProgress,
              viewedConcepts: state.educationalProgress.viewedConcepts.includes(conceptId)
                ? state.educationalProgress.viewedConcepts
                : [...state.educationalProgress.viewedConcepts, conceptId],
              lastActivity: new Date(),
            },
          })),
          
        markConceptComplete: (conceptId) =>
          set((state) => ({
            educationalProgress: {
              ...state.educationalProgress,
              completedConcepts: state.educationalProgress.completedConcepts.includes(conceptId)
                ? state.educationalProgress.completedConcepts
                : [...state.educationalProgress.completedConcepts, conceptId],
              lastActivity: new Date(),
            },
          })),
          
        updateTimeSpent: (minutes) =>
          set((state) => ({
            educationalProgress: {
              ...state.educationalProgress,
              totalTimeSpent: state.educationalProgress.totalTimeSpent + minutes,
              lastActivity: new Date(),
            },
          })),
        
        // Loading actions
        setLoading: (key, value) =>
          set((state) => ({
            loading: {
              ...state.loading,
              [key]: value,
            },
          })),
        
        // Reset action
        reset: () => set(initialState),
      }),
      {
        name: 'faxas-store',
        partialize: (state) => ({
          preferences: state.preferences,
          educationalProgress: state.educationalProgress,
        }),
      }
    ),
    {
      name: 'FaxasStore',
    }
  )
);

// Selectors
export const useUser = () => useStore((state) => state.user);
export const useIsAdmin = () => useStore((state) => state.isAdmin);
export const useProjects = () => useStore((state) => state.projects);
export const useSelectedProject = () => useStore((state) => state.selectedProject);
export const usePreferences = () => useStore((state) => state.preferences);
export const useEducationalProgress = () => useStore((state) => state.educationalProgress);
export const useLoading = () => useStore((state) => state.loading);