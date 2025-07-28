'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/lib/store/authStore';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, error, clearError, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    const result = await signInWithGoogle();
    
    if (result.success) {
      router.push('/');
    }
  };

  const displayError = validationError || error;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassPanel className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
              <p className="text-text-secondary">Join us to start building amazing projects</p>
            </div>

            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {displayError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  <Link href="/terms" className="text-accent-blue hover:text-accent-blue/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-accent-blue hover:text-accent-blue/80">
                    Privacy Policy
                  </Link>
                </label>
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Sign Up
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
                Sign up with Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}