import { create } from 'zustand';
import { User } from 'firebase/auth';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  onAuthChange,
  getCurrentUser,
  isAdmin as checkIsAdmin,
  sendPasswordReset
} from '@/lib/firebase/auth';
import { getUserProfile, UserProfile } from '@/lib/firebase/auth-enhanced';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => () => void;
  refreshUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await signInWithEmail(email, password);
    
    if (error) {
      set({ error, isLoading: false });
      return { success: false, error };
    }
    
    if (user) {
      const isAdminUser = await checkIsAdmin(user);
      const profile = await getUserProfile(user.uid);
      
      set({
        user,
        userProfile: profile,
        isAuthenticated: true,
        isAdmin: isAdminUser,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    }
    
    return { success: false, error: 'Authentication failed' };
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await signUpWithEmail(email, password, displayName);
    
    if (error) {
      set({ error, isLoading: false });
      return { success: false, error };
    }
    
    if (user) {
      const profile = await getUserProfile(user.uid);
      
      set({
        user,
        userProfile: profile,
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    }
    
    return { success: false, error: 'Registration failed' };
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await firebaseSignInWithGoogle();
    
    if (error) {
      set({ error, isLoading: false });
      return { success: false, error };
    }
    
    if (user) {
      const isAdminUser = await checkIsAdmin(user);
      const profile = await getUserProfile(user.uid);
      
      set({
        user,
        userProfile: profile,
        isAuthenticated: true,
        isAdmin: isAdminUser,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    }
    
    return { success: false, error: 'Google sign-in failed' };
  },

  signOut: async () => {
    set({ isLoading: true });
    
    await firebaseSignOut();
    
    set({
      user: null,
      userProfile: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,
    });
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    const { error } = await sendPasswordReset(email);
    
    set({ isLoading: false });
    
    if (error) {
      set({ error });
      return { success: false, error };
    }
    
    return { success: true };
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Set up auth state listener
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const isAdminUser = await checkIsAdmin(user);
        const profile = await getUserProfile(user.uid);
        
        set({
          user,
          userProfile: profile,
          isAuthenticated: true,
          isAdmin: isAdminUser,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      }
    });

    // Check current user on initialization
    const currentUser = getCurrentUser();
    if (currentUser) {
      checkIsAdmin(currentUser).then(isAdminUser => {
        getUserProfile(currentUser.uid).then(profile => {
          set({
            user: currentUser,
            userProfile: profile,
            isAuthenticated: true,
            isAdmin: isAdminUser,
            isLoading: false,
          });
        });
      });
    } else {
      set({ isLoading: false });
    }

    return unsubscribe;
  },

  refreshUserProfile: async () => {
    const { user } = get();
    if (user) {
      const profile = await getUserProfile(user.uid);
      set({ userProfile: profile });
    }
  },
}));