'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useAuthStore();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login with return URL
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
      } else if (requireAdmin && !isAdmin) {
        // Redirect to home if not admin
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, requireAdmin, router, pathname]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-blue" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render children if not authenticated
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }
  
  return <>{children}</>;
}