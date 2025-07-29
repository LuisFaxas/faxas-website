'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PortalUser, getPortalFeatures } from '@/types/portal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Loader2, User, FileText, FolderOpen, MessageSquare, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(true);
  
  // Check if we're on pages that don't need portal layout
  const isStartPage = pathname?.includes('/portal/start');

  useEffect(() => {
    // Skip auth check for start page
    if (isStartPage) {
      setLoadingPortal(false);
      return;
    }

    if (!loading) {
      if (!user) {
        router.push('/portal/start');
      } else {
        loadPortalUser();
      }
    }
  }, [user, loading, router, isStartPage]);

  const loadPortalUser = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as PortalUser;
        setPortalUser(userData);
      } else {
        // First time portal user - redirect to start
        router.push('/portal/start');
      }
    } catch (error) {
      console.error('Error loading portal user:', error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // For start page, don't show the portal chrome
  if (isStartPage) {
    return <>{children}</>;
  }

  if (loading || loadingPortal) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-blue mx-auto mb-4" />
          <p className="text-text-secondary">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user || !portalUser) {
    return null; // Redirect will happen in useEffect
  }

  const features = getPortalFeatures(portalUser.role);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/portal/dashboard', 
      icon: User,
      enabled: features.dashboard 
    },
    { 
      name: 'Questionnaire', 
      href: '/portal/questionnaire', 
      icon: FileText,
      enabled: features.questionnaire 
    },
    { 
      name: 'Resources', 
      href: '/portal/resources', 
      icon: FolderOpen,
      enabled: features.resources 
    },
    { 
      name: 'Communication', 
      href: '/portal/communication', 
      icon: MessageSquare,
      enabled: features.communication 
    },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 p-4">
          <GlassPanel level="primary" className="h-full p-6">
            {/* Portal Logo/Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary">FAXAS Portal</h2>
              <p className="text-sm text-text-secondary mt-1">
                {portalUser.role === 'lead' && 'Lead Portal'}
                {portalUser.role === 'qualified_lead' && 'Qualified Lead Portal'}
                {portalUser.role === 'client' && 'Client Portal'}
                {portalUser.role === 'past_client' && 'Alumni Portal'}
              </p>
            </div>

            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-glass-lighter">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold">
                  {portalUser.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {portalUser.displayName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {portalUser.company || portalUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                if (!item.enabled) return null;
                
                const Icon = item.icon;
                const isActive = false; // TODO: Check current route
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
                      'hover:bg-white/10',
                      isActive && 'bg-white/20'
                    )}
                  >
                    <Icon className="w-5 h-5 text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 space-y-2">
              <Link
                href="/portal/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/10"
              >
                <Settings className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Settings</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/10 text-left"
              >
                <LogOut className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Logout</span>
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <GlassPanel level="secondary" className="min-h-full">
            {children}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}