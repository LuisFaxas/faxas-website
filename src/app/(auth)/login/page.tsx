'use client';

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
  Zap
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
      ease: "easeInOut"
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, verifyMagicLink, error, clearError, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isMagicLinkVerifying, setIsMagicLinkVerifying] = useState(false);
  
  // Check for magic link on mount
  useEffect(() => {
    const checkMagicLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsMagicLinkVerifying(true);
        
        const result = await verifyMagicLink();
        
        if (result.success) {
          toast.success('Welcome!', 'Successfully signed in with magic link.');
          const returnUrl = searchParams.get('from') || '/';
          router.push(returnUrl);
        } else {
          toast.error('Magic link failed', result.error || 'Invalid or expired link.');
        }
        
        setIsMagicLinkVerifying(false);
      }
    };
    
    checkMagicLink();
  }, [verifyMagicLink, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const result = await signIn(formData.email, formData.password, formData.rememberMe);
    
    if (result.success) {
      toast.success('Welcome back!', 'Successfully signed in.');
      router.push('/');
    } else {
      toast.error('Sign in failed', result.error || 'Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Welcome!', 'Successfully signed in with Google.');
      router.push('/');
    }
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      className={cn(
                        "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                        "border-2 rounded-2xl transition-all duration-300",
                        "focus:outline-none focus:ring-0",
                        isEmailFocused
                          ? "border-accent-blue bg-white/70 shadow-lg"
                          : "border-glass-lighter hover:border-glass-light"
                      )}
                      placeholder="you@example.com"
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
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className={cn(
                        "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                        "border-2 rounded-2xl transition-all duration-300",
                        "focus:outline-none focus:ring-0",
                        isPasswordFocused
                          ? "border-accent-blue bg-white/70 shadow-lg"
                          : "border-glass-lighter hover:border-glass-light"
                      )}
                      placeholder="••••••••"
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
                    disabled={isLoading}
                    className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                  >
                    <FcGoogle className="w-6 h-6" />
                    <span className="font-medium text-text-primary">Continue with Google</span>
                  </button>
                </motion.div>
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