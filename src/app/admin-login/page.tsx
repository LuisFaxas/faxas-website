'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from '@/components/ui/toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isAdmin, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Missing Information', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { success, error } = await signIn(email, password);
      
      if (success) {
        // Check if user is admin after successful login
        const authStore = useAuthStore.getState();
        
        // Wait a moment for auth state to update
        setTimeout(async () => {
          // Double-check admin status
          const freshAuthStore = useAuthStore.getState();
          
          if (freshAuthStore.isAdmin) {
            toast.success('Welcome Admin!', 'Redirecting to dashboard...');
            router.push('/admin');
          } else {
            toast.error(
              'Access Denied', 
              'This account does not have admin privileges. Please ask an administrator to grant you access.'
            );
            // Provide helpful info
            console.log('To make this user admin, add role:"admin" to their Firestore document');
            // Sign them out since they're not admin
            authStore.signOut();
          }
        }, 1000);
      } else {
        toast.error('Login Failed', error || 'Invalid credentials');
      }
    } catch {
      toast.error('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in as admin (in useEffect to avoid render-time state updates)
  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  // Show loading state while checking auth
  if (user && isAdmin) {
    return null;
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <GlassPanel level="heavy" className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Access</h1>
              <p className="text-sm text-text-secondary mt-2">
                Sign in with your admin credentials
              </p>
            </div>

            {/* Notice Box */}
            <div className="mb-6 p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-blue mt-0.5" />
                <div className="text-sm">
                  <p className="text-text-primary font-medium mb-1">Admin Account Required</p>
                  <p className="text-text-secondary">
                    Only authorized administrators can access this area. 
                    Regular user accounts will be denied access.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-glass-lighter">
              <p className="text-xs text-text-tertiary text-center">
                This is a secure area. All login attempts are logged and monitored.
                Unauthorized access attempts will be reported.
              </p>
            </div>
          </GlassPanel>

          {/* Regular User Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Not an admin?{' '}
              <Link href="/login" className="text-accent-blue hover:underline">
                Sign in as regular user
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}