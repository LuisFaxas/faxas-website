'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { 
  Sparkles, 
  ArrowRight, 
  Building, 
  User,
  Loader2,
  Check
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PortalUser, getPortalFeatures } from '@/types/portal';
import { createLead } from '@/lib/firebase/db';
import { trackAnalyticsEvent } from '@/lib/firebase/db';

type OnboardingStep = 'welcome' | 'auth' | 'profile' | 'complete';

export default function PortalOnboardingPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signUpWithEmail } = useAuth();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isCreating, setIsCreating] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    if (user && step === 'auth') {
      // Auto-advance to profile step if user just signed in
      setStep('profile');
      // Pre-fill name if available from auth provider
      if (user.displayName) {
        setProfileData(prev => ({ ...prev, displayName: user.displayName || '' }));
      }
    }
  }, [user, step]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // User effect will handle advancing to next step
    } catch (error: any) {
      toast.error('Sign in failed', error.message);
    }
  };

  const handleProfileSubmit = async () => {
    if (!user) return;

    setIsCreating(true);
    try {
      // Create portal user document
      const portalUser: PortalUser = {
        id: user.uid,
        email: user.email || '',
        displayName: profileData.displayName || user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        company: profileData.company || undefined,
        phone: profileData.phone || undefined,
        role: 'lead',
        roleHistory: [{
          from: 'lead' as const,
          to: 'lead' as const,
          timestamp: serverTimestamp() as any,
          reason: 'Account created'
        }],
        portalFeatures: getPortalFeatures('lead'),
        journeyStage: 'exploring',
        milestones: [{
          type: 'account_created',
          timestamp: serverTimestamp() as any,
          metadata: { method: 'google' }
        }],
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), portalUser);

      // Create lead record
      await createLead({
        name: portalUser.displayName,
        email: portalUser.email,
        company: portalUser.company,
        phone: portalUser.phone,
        message: 'Portal account created - awaiting questionnaire',
        source: 'portal_onboarding'
      });

      // Track analytics
      await trackAnalyticsEvent('portal_account_created', {
        method: 'google',
        hasCompany: !!portalUser.company,
        hasPhone: !!portalUser.phone,
      });

      // Show success
      setStep('complete');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error creating portal account:', error);
      toast.error('Failed to create account', error.message);
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Welcome to Your Growth Journey
              </h1>
              <p className="text-xl text-text-secondary">
                Start with a simple questionnaire, end with your perfect web solution.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Smart Discovery</h3>
                  <p className="text-sm text-text-secondary">
                    Answer a few questions about your project and goals
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Personalized Portal</h3>
                  <p className="text-sm text-text-secondary">
                    Get your own dashboard with resources and next steps
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Evolving Relationship</h3>
                  <p className="text-sm text-text-secondary">
                    Your portal grows with you from lead to client
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep('auth')}
              className="gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        );

      case 'auth':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Create Your Account
              </h2>
              <p className="text-text-secondary">
                One account for your entire journey with us
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full gap-3"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-glass-lighter" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background-primary text-text-secondary">
                    More options coming soon
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary text-center">
                By creating an account, you agree to receive communications about your
                project. We respect your privacy and never share your data.
              </p>
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Tell Us About Yourself
              </h2>
              <p className="text-text-secondary">
                This helps us personalize your experience
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileSubmit();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    displayName: e.target.value 
                  }))}
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    company: e.target.value 
                  }))}
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="Acme Inc."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isCreating || !profileData.displayName}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Your Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to Your Portal!
            </h2>
            <p className="text-text-secondary mb-6">
              Your account is ready. Let's start your journey...
            </p>
            <div className="flex items-center justify-center gap-2 text-accent-blue">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting to your dashboard...</span>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-4xl">
        <GlassPanel level="primary" className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </GlassPanel>
      </div>
    </div>
  );
}