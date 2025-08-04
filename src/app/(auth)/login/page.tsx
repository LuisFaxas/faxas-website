'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Loader2, 
  Sparkles,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  AlertCircle,
  Send
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/lib/store/authStore';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { toast } from '@/components/ui/toast';
import { isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { cn } from '@/lib/utils';

// Floating animation variants
const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Decorative floating elements
function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-tr from-accent-green/20 to-accent-blue/20 rounded-full blur-2xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-bl from-accent-purple/30 to-accent-pink/30 rounded-full blur-lg"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 4 }}
      />
    </>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, sendMagicLink, verifyMagicLink, error, clearError, isLoading, isAdmin } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isMagicLinkVerifying, setIsMagicLinkVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showMagicLink, setShowMagicLink] = useState(false);
  
  // Check for magic link on mount
  useEffect(() => {
    const checkMagicLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsMagicLinkVerifying(true);
        
        const result = await verifyMagicLink();
        
        if (result.success) {
          toast.success('Welcome!', 'Successfully signed in with magic link.');
          const returnUrl = searchParams.get('from') || '/portal';
          router.push(returnUrl);
        } else {
          toast.error('Magic link failed', result.error || 'Invalid or expired link.');
        }
        
        setIsMagicLinkVerifying(false);
      }
    };
    
    checkMagicLink();
  }, [verifyMagicLink, router, searchParams]);

  // Email validation
  const validateEmail = (email: string) => {
    const errors: Record<string, string> = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    return errors;
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return strength;
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    if (isEmailFocused) {
      const errors = validateEmail(email);
      setValidationErrors(prev => ({ ...prev, ...errors }));
    }
  };

  // Handle password change with strength indicator
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
    
    if (isPasswordFocused && password) {
      const errors: Record<string, string> = {};
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      setValidationErrors(prev => ({ ...prev, ...errors }));
    }
  };

  // Handle magic link request
  const handleMagicLink = async () => {
    const emailErrors = validateEmail(formData.email);
    if (Object.keys(emailErrors).length > 0) {
      setValidationErrors(emailErrors);
      toast.error('Please enter a valid email address');
      return;
    }

    setIsMagicLinkLoading(true);
    clearError();
    
    // Store email for when user returns
    window.localStorage.setItem('emailForSignIn', formData.email);
    
    const result = await sendMagicLink(formData.email);
    
    if (result.success) {
      toast.success('Magic link sent!', 'Check your email for the sign-in link.');
      setShowMagicLink(false);
    } else {
      toast.error('Failed to send magic link', result.error || 'Please try again.');
    }
    
    setIsMagicLinkLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await signIn(formData.email, formData.password, formData.rememberMe);
    
    if (result.success) {
      toast.success('Welcome back!', 'Successfully signed in.');
      // Check if user came from a specific page
      const returnUrl = searchParams.get('from');
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        // Default based on user role
        router.push(isAdmin ? '/admin' : '/portal');
      }
    } else {
      toast.error('Sign in failed', result.error || 'Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Welcome!', 'Successfully signed in with Google.');
      // Check if user came from a specific page
      const returnUrl = searchParams.get('from');
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        // Default based on user role
        router.push(isAdmin ? '/admin' : '/portal');
      }
    }
    setIsGoogleLoading(false);
  };

  // Show loading state while verifying magic link
  if (isMagicLinkVerifying) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassPanel level="primary" className="p-8 text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-white relative z-10 animate-spin p-4" />
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-2">Verifying Magic Link</h2>
              <p className="text-text-secondary">Please wait while we sign you in securely...</p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
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
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:block space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="glass-accent px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-green" />
                  <span className="text-sm font-medium">Secure Authentication</span>
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome Back to
                <span className="block gradient-text mt-2">Your Portal</span>
              </h1>
              
              <p className="text-xl text-text-secondary">
                Sign in to access your personalized dashboard and continue building amazing projects.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Lightning Fast</h3>
                  <p className="text-sm text-text-secondary">Access your projects instantly with our optimized platform</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Bank-Level Security</h3>
                  <p className="text-sm text-text-secondary">Your data is encrypted and protected at all times</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Premium Experience</h3>
                  <p className="text-sm text-text-secondary">Enjoy a beautiful, intuitive interface designed for productivity</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassPanel level="primary" className="p-8 md:p-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5, delay: 0.3 }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center"
                >
                  <LogIn className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-text-primary mb-2">Sign In</h2>
                <p className="text-text-secondary">Enter your credentials to continue</p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6"
                  >
                    <div className="glass-error p-4 rounded-xl border border-red-200/50">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleEmailChange}
                      onFocus={() => {
                        setIsEmailFocused(true);
                        if (formData.email) {
                          const errors = validateEmail(formData.email);
                          setValidationErrors(prev => ({ ...prev, ...errors }));
                        }
                      }}
                      onBlur={() => {
                        setIsEmailFocused(false);
                        const errors = validateEmail(formData.email);
                        setValidationErrors(prev => ({ ...prev, ...errors }));
                      }}
                      className={cn(
                        "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                        "border-2 rounded-2xl transition-all duration-300",
                        "focus:outline-none focus:ring-0",
                        validationErrors.email 
                          ? "border-red-400 bg-red-50/30"
                          : isEmailFocused
                          ? "border-accent-blue bg-white/70 shadow-lg"
                          : "border-glass-lighter hover:border-glass-light"
                      )}
                      placeholder="you@example.com"
                      aria-invalid={!!validationErrors.email}
                      aria-describedby={validationErrors.email ? "email-error" : undefined}
                    />
                    <Mail className={cn(
                      "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                      isEmailFocused ? "text-accent-blue" : "text-text-tertiary"
                    )} />
                    {isEmailFocused && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                      />
                    )}
                  </div>
                  {validationErrors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handlePasswordChange}
                      onFocus={() => {
                        setIsPasswordFocused(true);
                        if (formData.password && formData.password.length < 8) {
                          setValidationErrors(prev => ({ 
                            ...prev, 
                            password: 'Password must be at least 8 characters' 
                          }));
                        }
                      }}
                      onBlur={() => {
                        setIsPasswordFocused(false);
                        if (formData.password && formData.password.length < 8) {
                          setValidationErrors(prev => ({ 
                            ...prev, 
                            password: 'Password must be at least 8 characters' 
                          }));
                        } else {
                          setValidationErrors(prev => {
                            const { password, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                        "border-2 rounded-2xl transition-all duration-300",
                        "focus:outline-none focus:ring-0",
                        validationErrors.password
                          ? "border-red-400 bg-red-50/30"
                          : isPasswordFocused
                          ? "border-accent-blue bg-white/70 shadow-lg"
                          : "border-glass-lighter hover:border-glass-light"
                      )}
                      placeholder="••••••••"
                      aria-invalid={!!validationErrors.password}
                      aria-describedby={validationErrors.password ? "password-error" : undefined}
                    />
                    <Lock className={cn(
                      "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                      isPasswordFocused ? "text-accent-blue" : "text-text-tertiary"
                    )} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {isPasswordFocused && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                      />
                    )}
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && isPasswordFocused && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Password strength</span>
                        <span className={cn(
                          "text-xs font-medium",
                          passwordStrength < 50 ? "text-red-600" :
                          passwordStrength < 75 ? "text-amber-600" :
                          "text-green-600"
                        )}>
                          {passwordStrength < 50 ? "Weak" :
                           passwordStrength < 75 ? "Good" :
                           "Strong"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "h-full rounded-full",
                            passwordStrength < 50 ? "bg-red-500" :
                            passwordStrength < 75 ? "bg-amber-500" :
                            "bg-green-500"
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {validationErrors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-accent-blue bg-white/50 border-glass-lighter rounded focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-accent-blue hover:text-accent-purple transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
                    {/* Glass overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-3">
                      {isLoading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </div>
                  
                  {/* Focus ring */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-accent-blue ring-offset-2 ring-offset-transparent opacity-0 focus-visible:opacity-100 transition-opacity" />
                </button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-glass-lighter" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-text-secondary">Or continue with</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                        <span className="font-medium text-text-primary">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <FcGoogle className="w-6 h-6" />
                        <span className="font-medium text-text-primary">Continue with Google</span>
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Magic Link Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3"
                >
                  <button
                    type="button"
                    onClick={() => setShowMagicLink(!showMagicLink)}
                    className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                  >
                    <Send className="w-5 h-5 text-accent-purple" />
                    <span className="font-medium text-text-primary">Send me a magic link</span>
                  </button>
                </motion.div>

                {/* Magic Link Form */}
                <AnimatePresence>
                  {showMagicLink && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="p-4 glass-accent rounded-xl border border-accent-purple/20">
                        <p className="text-sm text-text-secondary mb-3">
                          We'll send you a secure sign-in link to your email address.
                        </p>
                        <button
                          type="button"
                          onClick={handleMagicLink}
                          disabled={isMagicLinkLoading || !formData.email}
                          className="w-full px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isMagicLinkLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              <span>Send Magic Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-8 text-center text-sm text-text-secondary">
                Don&apos;t have an account?{' '}
                <Link
                  href="/portal/start"
                  className="font-semibold text-accent-blue hover:text-accent-purple transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-green/10 to-accent-blue/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-base">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}