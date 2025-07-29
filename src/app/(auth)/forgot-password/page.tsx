'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  ArrowLeft, 
  Key,
  Check,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { toast } from '@/components/ui/toast';
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
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-tr from-accent-green/20 to-accent-blue/20 rounded-full blur-2xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      />
    </>
  );
}

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await resetPassword(email);
    
    if (result.success) {
      toast.success('Email sent!', 'Check your inbox for the password reset link.');
      setIsSubmitted(true);
    } else {
      toast.error('Failed to send email', result.error || 'Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <GlassPanel level="primary" className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-accent-green/20 to-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-accent-green" />
              </motion.div>
              
              <h2 className="text-3xl font-bold gradient-text mb-4">Check Your Email</h2>
              <p className="text-text-secondary mb-2">
                We&apos;ve sent a password reset link to:
              </p>
              <p className="font-medium text-text-primary mb-8">{email}</p>
              
              <p className="text-sm text-text-secondary mb-8">
                Didn&apos;t receive the email? Check your spam folder or try sending again.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full glass-secondary px-6 py-3 rounded-2xl font-medium text-text-primary hover:bg-white/80 transition-all duration-300"
                >
                  Try Again
                </button>
                
                <Link href="/login" className="block">
                  <button className="w-full relative group">
                    <div className="relative h-12 px-6 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </span>
                    </div>
                  </button>
                </Link>
              </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassPanel level="primary" className="p-8 md:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center"
              >
                <Key className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">Forgot Password?</h2>
              <p className="text-text-secondary">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass-secondary p-4 rounded-xl"
                >
                  <p className="text-sm text-text-secondary">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                  </p>
                </motion.div>
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group"
              >
                <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] group-active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-green/10 to-accent-blue/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}