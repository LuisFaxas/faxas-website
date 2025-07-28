'use client';

import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  
  return {
    user,
    loading,
    signIn,
    signOut,
  };
}