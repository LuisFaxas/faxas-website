'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PortalUser, getPortalFeatures } from '@/types/portal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Home,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(true);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Check if we're on pages that don't need portal layout
  const isStartPage = pathname?.includes('/portal/start');
  const isQuestionnairePage = pathname?.includes('/portal/questionnaire');

  const loadPortalUser = useCallback(async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as PortalUser;
        setPortalUser(userData);
        
        // Check if questionnaire is completed
        const sessionDoc = await getDoc(doc(db, 'questionnaire_sessions', user.uid));
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data();
          setQuestionnaireCompleted(sessionData.status === 'completed');
          
          // If user is a lead and hasn't completed questionnaire, redirect to questionnaire
          if (userData.role === 'lead' && sessionData.status !== 'completed' && !isQuestionnairePage) {
            router.push('/portal/questionnaire');
          }
        } else if (userData.role === 'lead' && !isQuestionnairePage) {
          // No session exists, redirect to questionnaire
          router.push('/portal/questionnaire');
        }
      } else {
        // First time portal user - redirect to start
        router.push('/portal/start');
      }
    } catch (error) {
      console.error('Error loading portal user:', error);
    } finally {
      setLoadingPortal(false);
    }
  }, [user, router, isQuestionnairePage]);

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
  }, [user, loading, router, isStartPage, loadPortalUser]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // For start page or questionnaire (when not completed), don't show the portal chrome
  if (isStartPage || (isQuestionnairePage && portalUser?.role === 'lead' && !questionnaireCompleted)) {
    return <>{children}</>;
  }

  if (loading || loadingPortal) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-background-start via-background-middle to-background-end">
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
      icon: BarChart3,
      enabled: features.dashboard && (portalUser.role !== 'lead' || questionnaireCompleted)
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
      enabled: features.resources && (portalUser.role !== 'lead' || questionnaireCompleted)
    },
    { 
      name: 'Communication', 
      href: '/portal/communication', 
      icon: MessageSquare,
      enabled: features.communication 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end">
      <AnimatedBackground />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 p-4">
          <GlassPanel level="primary" className="h-full p-6 flex flex-col">
            {/* Portal Logo/Title */}
            <div className="mb-8">
              <Link href="/" className="group inline-flex items-center gap-2 mb-4">
                <ChevronRight className="w-4 h-4 text-text-secondary rotate-180 group-hover:text-accent-blue transition-colors" />
                <span className="text-sm text-text-secondary group-hover:text-accent-blue transition-colors">Back to site</span>
              </Link>
              <div>
                <h2 className="text-2xl font-bold gradient-text">
                  FAXAS
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {portalUser.role === 'lead' && 'Lead Portal'}
                  {portalUser.role === 'qualified_lead' && 'Qualified Lead Portal'}
                  {portalUser.role === 'client' && 'Client Portal'}
                  {portalUser.role === 'past_client' && 'Alumni Portal'}
                </p>
              </div>
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
            <nav className="space-y-2 flex-1">
              {navigation.map((item) => {
                if (!item.enabled) return null;
                
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
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
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-accent-blue" : "text-text-secondary"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-text-primary" : "text-text-secondary"
                    )}>
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

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
          <div className="p-4">
            <GlassPanel level="primary" className="px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu className="w-6 h-6 text-text-primary" />
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold gradient-text">FAXAS</h1>
                  <span className="text-sm text-text-secondary">Portal</span>
                </div>
                <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Home className="w-5 h-5 text-text-secondary" />
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-br from-background-start via-background-middle to-background-end z-50 lg:hidden"
              >
                <GlassPanel level="primary" className="h-full m-0 rounded-none">
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold gradient-text">FAXAS</h2>
                        <p className="text-xs text-text-secondary mt-1">
                          {portalUser.role === 'lead' && 'Lead Portal'}
                          {portalUser.role === 'qualified_lead' && 'Qualified Lead'}
                          {portalUser.role === 'client' && 'Client Portal'}
                          {portalUser.role === 'past_client' && 'Alumni Portal'}
                        </p>
                      </div>
                      <button
                        onClick={() => setMobileNavOpen(false)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <X className="w-6 h-6 text-text-primary" />
                      </button>
                    </div>
                    
                    {/* User Info */}
                    <div className="mb-6 p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-sm font-bold">
                          {portalUser.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {portalUser.displayName}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {portalUser.company || portalUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                      {navigation.map((item) => {
                        if (!item.enabled) return null;
                        
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                              'hover:bg-white/10 active:scale-[0.98]',
                              isActive && 'bg-white/15 shadow-sm'
                            )}
                          >
                            <Icon className={cn(
                              "w-5 h-5",
                              isActive ? "text-accent-blue" : "text-text-secondary"
                            )} />
                            <span className={cn(
                              "flex-1 text-sm font-medium",
                              isActive ? "text-text-primary" : "text-text-secondary"
                            )}>
                              {item.name}
                            </span>
                            {isActive && (
                              <ChevronRight className="w-4 h-4 text-accent-blue" />
                            )}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="pt-6 space-y-1 border-t border-glass-lighter">
                      <Link
                        href="/"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        <Home className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-secondary">Back to Homepage</span>
                      </Link>
                      
                      <Link
                        href="/portal/settings"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        <Settings className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-secondary">Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileNavOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-left"
                      >
                        <LogOut className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium text-text-secondary">Logout</span>
                      </button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 pt-24 lg:pt-0 lg:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}