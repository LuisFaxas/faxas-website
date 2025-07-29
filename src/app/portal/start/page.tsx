'use client';

import { useEffect, useState } from 'react';
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
  Mail,
  Lock,
  Loader2,
  Check,
  LogIn
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PortalUser, getPortalFeatures } from '@/types/portal';
import { createLead } from '@/lib/firebase/db';
import { trackAnalyticsEvent } from '@/lib/firebase/db';
import Link from 'next/link';

type ViewState = 'welcome' | 'signin' | 'signup' | 'profile' | 'redirecting';

export default function PortalStartPage() {
  const router = useRouter();
  const { user, loading, signIn, signInWithGoogle, signUpWithEmail } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('welcome');
  const [checkingUser, setCheckingUser] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    name: '' 
  });
  const [profileData, setProfileData] = useState({
    displayName: '',
    company: '',
    phone: '',
  });

  // Check user status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading && user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            // Existing portal user - go to dashboard
            router.push('/portal/dashboard');
            return;
          } else {
            // Has auth but no portal account - show profile form
            setViewState('profile');
            if (user.displayName) {
              setProfileData(prev => ({ ...prev, displayName: user.displayName || '' }));
            }
          }
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      }
      setCheckingUser(false);
    };

    checkUserStatus();
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // The useEffect will handle the redirect
      }
    } catch (error: any) {
      toast.error('Sign in failed', error.message);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn(signInData.email, signInData.password);
      if (result.success) {
        // The useEffect will handle the redirect
      } else {
        toast.error('Sign in failed', result.error || 'Invalid credentials');
      }
    } catch (error: any) {
      toast.error('Sign in failed', error.message);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await signUpWithEmail(
        signUpData.email, 
        signUpData.password, 
        signUpData.name
      );
      
      if (result.success) {
        setProfileData(prev => ({ ...prev, displayName: signUpData.name }));
        setViewState('profile');
      } else {
        toast.error('Sign up failed', result.error || 'Please try again');
      }
    } catch (error: any) {
      toast.error('Sign up failed', error.message);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          metadata: { method: user.providerData[0]?.providerId || 'email' }
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
        source: 'portal_start'
      });

      // Track analytics
      await trackAnalyticsEvent('portal_account_created', {
        method: user.providerData[0]?.providerId || 'email',
        hasCompany: !!portalUser.company,
        hasPhone: !!portalUser.phone,
      });

      // Show success and redirect
      setViewState('redirecting');
      toast.success('Welcome to FAXAS Portal!');
      
      setTimeout(() => {
        router.push('/portal/questionnaire');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating portal account:', error);
      toast.error('Failed to create account', error.message);
      setIsCreating(false);
    }
  };

  // Loading state
  if (loading || checkingUser) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10">
          <GlassPanel level="primary" className="p-8">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
              <p className="text-text-secondary">Loading...</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (viewState) {
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
                Start Your Project Journey
              </h1>
              <p className="text-xl text-text-secondary">
                Join FAXAS Portal to get personalized solutions and pricing for your project
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Quick Assessment</h3>
                  <p className="text-sm text-text-secondary">
                    Answer a few questions to help us understand your needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Instant Pricing</h3>
                  <p className="text-sm text-text-secondary">
                    Get an estimated budget range based on your requirements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Personal Dashboard</h3>
                  <p className="text-sm text-text-secondary">
                    Track your project from initial idea to launch
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setViewState('signup')}
                className="w-full sm:w-auto gap-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <div className="text-sm text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => setViewState('signin')}
                  className="text-accent-blue hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'signin':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Welcome Back
              </h2>
              <p className="text-text-secondary">
                Sign in to continue to your portal
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-glass-lighter" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-secondary">Or</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleSignIn}
                className="w-full mt-4 gap-3"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <button
                onClick={() => setViewState('signup')}
                className="font-medium text-accent-blue hover:underline"
              >
                Create one
              </button>
            </p>
          </motion.div>
        );

      case 'signup':
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
                Join FAXAS Portal to start your project
              </p>
            </div>

            <div className="mb-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleSignIn}
                className="w-full gap-3"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Sign up with Google</span>
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-lighter" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="John Doe"
                  />
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-accent-blue border-glass-lighter rounded focus:ring-accent-blue"
                />
                <label className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-accent-blue hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-accent-blue hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => setViewState('signin')}
                className="font-medium text-accent-blue hover:underline"
              >
                Sign in
              </button>
            </p>
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
                Complete Your Profile
              </h2>
              <p className="text-text-secondary">
                Help us personalize your experience
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
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
                  className="w-full px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-glass-lighter focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
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
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Setting up your portal...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Assessment</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        );

      case 'redirecting':
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
              Welcome to FAXAS Portal!
            </h2>
            <p className="text-text-secondary mb-6">
              Let's start with a quick assessment...
            </p>
            <div className="flex items-center justify-center gap-2 text-accent-blue">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading questionnaire...</span>
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
            {renderContent()}
          </AnimatePresence>
        </GlassPanel>
      </div>
    </div>
  );
}