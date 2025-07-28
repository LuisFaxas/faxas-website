'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/lib/store/authStore';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, verifyMagicLink, error, clearError, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
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
      router.push('/');
    }
  };

  // Show loading state while verifying magic link
  if (isMagicLinkVerifying) {
    return (
      <div className="relative min-h-screen bg-white">
        <AnimatedBackground />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-blue" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Verifying your magic link...</h2>
            <p className="text-text-secondary">Please wait while we sign you in.</p>
          </GlassPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassPanel className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
              <p className="text-text-secondary">Sign in to your account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pl-11 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-accent-blue border-glass-lighter rounded focus:ring-accent-blue"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-glass-lighter"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-secondary">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                variant="secondary"
                size="lg"
                className="w-full mt-4"
                disabled={isLoading}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}