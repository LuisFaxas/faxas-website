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
  sendPasswordReset,
  sendMagicLink as firebaseSendMagicLink,
  signInWithMagicLink
} from '@/lib/firebase/auth';
import { getUserProfile, UserProfile } from '@/lib/firebase/auth-enhanced';
import { authRateLimiter, getRateLimitKey, formatRemainingTime } from '@/lib/firebase/rate-limiter';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyMagicLink: () => Promise<{ success: boolean; error?: string }>;
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
  isInitialized: false,
  error: null,

  signIn: async (email: string, password: string, rememberMe: boolean = false) => {
    set({ isLoading: true, error: null });
    
    // Check rate limiting
    const rateLimitKey = getRateLimitKey('email', email);
    const { blocked, remainingTime } = authRateLimiter.isBlocked(rateLimitKey);
    
    if (blocked && remainingTime) {
      const error = `Too many login attempts. Please try again in ${formatRemainingTime(remainingTime)}.`;
      set({ error, isLoading: false });
      return { success: false, error };
    }
    
    const { user, error } = await signInWithEmail(email, password, rememberMe);
    
    // Record attempt
    authRateLimiter.recordAttempt(rateLimitKey, !error);
    
    if (error) {
      const { remainingAttempts } = authRateLimiter.recordAttempt(rateLimitKey, false);
      let errorMessage = error;
      
      if (remainingAttempts !== undefined && remainingAttempts > 0) {
        errorMessage += ` (${remainingAttempts} attempts remaining)`;
      }
      
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
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

  sendMagicLink: async (email: string) => {
    set({ isLoading: true, error: null });
    
    const { error } = await firebaseSendMagicLink(email);
    
    set({ isLoading: false });
    
    if (error) {
      set({ error });
      return { success: false, error };
    }
    
    return { success: true };
  },

  verifyMagicLink: async () => {
    set({ isLoading: true, error: null });
    
    // Check if we have a magic link in the URL
    const url = window.location.href;
    const email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
      set({ error: 'Email not found. Please request a new magic link.', isLoading: false });
      return { success: false, error: 'Email not found' };
    }
    
    const { user, error } = await signInWithMagicLink(email, url);
    
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
    
    return { success: false, error: 'Magic link verification failed' };
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
          isInitialized: true,
        });
      } else {
        set({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          isInitialized: true,
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