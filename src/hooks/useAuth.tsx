'use client';

import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const signUpWithEmail = useAuthStore((state) => state.signUp);
  
  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    signInWithGoogle,
    signUpWithEmail,
  };
}