'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end">
      <AnimatedBackground />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            {/* Back Link */}
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-text-secondary hover:text-accent-blue transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Home</span>
            </Link>

            <GlassPanel level="primary" className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple mb-4 shadow-lg"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-text-primary">Admin Access</h1>
                <p className="text-sm text-text-secondary mt-2">
                  Sign in to manage your dashboard
                </p>
              </div>

              {/* Notice Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <GlassPanel level="secondary" className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-accent-blue" />
                    </div>
                    <div className="text-sm">
                      <p className="text-text-primary font-medium mb-1">Secure Admin Area</p>
                      <p className="text-text-secondary text-xs">
                        This area is protected. All login attempts are monitored for security.
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent-blue transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm",
                        "border border-white/20 rounded-xl",
                        "focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-transparent",
                        "placeholder:text-text-tertiary transition-all"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent-blue transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm",
                        "border border-white/20 rounded-xl",
                        "focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-transparent",
                        "placeholder:text-text-tertiary transition-all"
                      )}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl font-medium text-white",
                      "bg-gradient-to-r from-accent-blue to-accent-purple",
                      "hover:shadow-lg hover:shadow-accent-blue/25 transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "relative overflow-hidden group"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In as Admin</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </button>
                </motion.div>
              </form>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <p className="text-xs text-text-tertiary text-center">
                  Protected by enterprise-grade security.
                  All access attempts are monitored.
                </p>
              </motion.div>
            </GlassPanel>

            {/* Regular User Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-text-secondary">
                Not an admin?{' '}
                <Link href="/login" className="text-accent-blue hover:text-accent-purple transition-colors">
                  Sign in as regular user
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Info Panel (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md"
          >
            <div className="mb-8">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 mb-6"
              >
                <Sparkles className="w-10 h-10 text-accent-purple" />
              </motion.div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Admin Command Center
              </h2>
              <p className="text-text-secondary mb-8">
                Access powerful tools to manage your leads, projects, and client communications
                from one unified dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "📊", title: "Real-time Analytics", desc: "Monitor lead activity and conversions live" },
                { icon: "🚀", title: "Lead Management", desc: "Track and nurture leads through the pipeline" },
                { icon: "💬", title: "Communication Hub", desc: "Centralized messaging and notifications" },
                { icon: "🔒", title: "Secure Access", desc: "Enterprise-grade security for your data" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlassPanel level="secondary" className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h3 className="font-medium text-text-primary">{feature.title}</h3>
                        <p className="text-xs text-text-secondary">{feature.desc}</p>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}