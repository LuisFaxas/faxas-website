'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
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
  LogIn,
  Eye,
  EyeOff,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PortalUser, getPortalFeatures } from '@/types/portal';
import { createLead } from '@/lib/firebase/db';
import { trackAnalyticsEvent } from '@/lib/firebase/db';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ViewState = 'welcome' | 'signin' | 'signup' | 'profile' | 'redirecting';

// Floating animation variants
const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Decorative floating elements
function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-2xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-tr from-accent-blue/20 to-accent-green/20 rounded-full blur-3xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-bl from-accent-green/30 to-accent-blue/30 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 4 }}
      />
    </>
  );
}

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

  // Focus states
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        toast.success('Welcome!', 'Successfully signed in with Google.');
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
        toast.success('Welcome back!', 'Successfully signed in.');
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
      <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassPanel level="primary" className="p-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
                <p className="text-text-secondary">Loading...</p>
              </div>
            </GlassPanel>
          </motion.div>
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-3xl flex items-center justify-center"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Start Your
              <span className="block gradient-text mt-2">Project Journey</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-10 sm:mb-12 px-4">
              Join FAXAS Portal to get personalized solutions and pricing for your web project
            </p>

            {/* Feature Cards - Horizontal Layout */}
            <div className="w-full px-4 mb-10 sm:mb-12 max-w-6xl mx-auto">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="glass-secondary p-5 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1 text-lg">Quick Assessment</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Answer a few questions to help us understand your needs
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="glass-secondary p-5 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-accent-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1 text-lg">Instant Pricing</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Get an estimated budget range based on your requirements
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="glass-secondary p-5 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1 text-lg">Personal Dashboard</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Track your project from initial idea to launch
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setViewState('signup')}
                className="w-full sm:w-auto relative group"
              >
                <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    Create Account
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
              
              <div className="text-sm text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => setViewState('signin')}
                  className="text-accent-blue hover:text-accent-purple transition-colors font-semibold"
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
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
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    onFocus={() => setFocusedField('signin-email')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signin-email'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="you@example.com"
                  />
                  <Mail className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signin-email' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  {focusedField === 'signin-email' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    onFocus={() => setFocusedField('signin-password')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signin-password'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="••••••••"
                  />
                  <Lock className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signin-password' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {focusedField === 'signin-password' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent-blue hover:text-accent-purple transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full relative group"
              >
                <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    Sign In
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span className="font-medium text-text-primary">Continue with Google</span>
                </button>
              </motion.div>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setViewState('signup')}
                className="font-semibold text-accent-blue hover:text-accent-purple transition-colors"
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Create Your Account
              </h2>
              <p className="text-text-secondary">
                Join FAXAS Portal to start your project
              </p>
            </div>

            <div className="mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span className="font-medium text-text-primary">Sign up with Google</span>
                </button>
              </motion.div>
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
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    onFocus={() => setFocusedField('signup-name')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signup-name'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="John Doe"
                  />
                  <User className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signup-name' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  {focusedField === 'signup-name' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    onFocus={() => setFocusedField('signup-email')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signup-email'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="you@example.com"
                  />
                  <Mail className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signup-email' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  {focusedField === 'signup-email' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    onFocus={() => setFocusedField('signup-password')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signup-password'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="••••••••"
                  />
                  <Lock className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signup-password' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {focusedField === 'signup-password' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    onFocus={() => setFocusedField('signup-confirm')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'signup-confirm'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="••••••••"
                  />
                  <Lock className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'signup-confirm' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {focusedField === 'signup-confirm' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-accent-blue bg-white/50 border-glass-lighter rounded focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-0"
                />
                <label className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-accent-blue hover:text-accent-purple transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-accent-blue hover:text-accent-purple transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full relative group"
              >
                <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    Create Account
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => setViewState('signin')}
                className="font-semibold text-accent-blue hover:text-accent-purple transition-colors"
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-green to-accent-blue rounded-2xl flex items-center justify-center"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
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
                  Your Name *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={profileData.displayName}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      displayName: e.target.value 
                    }))}
                    onFocus={() => setFocusedField('profile-name')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'profile-name'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="John Doe"
                  />
                  <User className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'profile-name' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  {focusedField === 'profile-name' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company (Optional)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      company: e.target.value 
                    }))}
                    onFocus={() => setFocusedField('profile-company')}
                    onBlur={() => setFocusedField('')}
                    className={cn(
                      "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                      "border-2 rounded-2xl transition-all duration-300",
                      "focus:outline-none focus:ring-0",
                      focusedField === 'profile-company'
                        ? "border-accent-blue bg-white/70 shadow-lg"
                        : "border-glass-lighter hover:border-glass-light"
                    )}
                    placeholder="Acme Inc."
                  />
                  <Building className={cn(
                    "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                    focusedField === 'profile-company' ? "text-accent-blue" : "text-text-tertiary"
                  )} />
                  {focusedField === 'profile-company' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating || !profileData.displayName}
                className="w-full relative group"
              >
                <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Setting up your portal...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Assessment</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </div>
              </button>
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
            <div className="w-20 h-20 bg-gradient-to-br from-accent-green/20 to-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-accent-green" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Welcome to FAXAS Portal!
            </h2>
            <p className="text-text-secondary mb-6">
              Let&apos;s start with a quick assessment...
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
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />
      
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <span className="text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
            FAXAS
          </span>
        </Link>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <GlassPanel level="primary" className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-blue/10 to-accent-green/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}