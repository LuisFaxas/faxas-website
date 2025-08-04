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
import { GlassCard, GlassButton, GlassInput, glass } from '@/components/ui/glass';
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
      ease: "easeInOut" as const
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
            <GlassCard
              level="strong"
              border="medium"
              shadow="xl"
              radius="xl"
              spacing="xl"
              animated
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-accent-green/20 to-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-accent-green" />
              </motion.div>
              
              <h2 className={cn("text-3xl font-bold mb-4", glass.text.primary)}>Check Your Email</h2>
              <p className={cn("mb-2", glass.text.secondary)}>
                We&apos;ve sent a password reset link to:
              </p>
              <p className={cn("font-medium mb-8", glass.text.primary)}>{email}</p>
              
              <p className={cn("text-sm mb-8", glass.text.secondary)}>
                Didn&apos;t receive the email? Check your spam folder or try sending again.
              </p>
              
              <div className="space-y-3">
                <GlassButton
                  variant="secondary"
                  fullWidth
                  onClick={() => setIsSubmitted(false)}
                >
                  Try Again
                </GlassButton>
                
                <Link href="/login">
                  <GlassButton
                    variant="primary"
                    fullWidth
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back to Login
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
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
          <GlassCard
            level="strong"
            border="medium"
            shadow="xl"
            radius="xl"
            spacing="xl"
            animated
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center"
              >
                <Key className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className={cn("text-3xl font-bold mb-2", glass.text.primary)}>Forgot Password?</h2>
              <p className={glass.text.secondary}>
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <GlassInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  fullWidth
                  required
                />
              </div>

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <GlassCard
                    level="subtle"
                    border="subtle"
                    radius="lg"
                    spacing="md"
                  >
                    <p className={cn("text-sm", glass.text.secondary)}>
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                    </p>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>

              <GlassButton
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={isLoading}
                icon={!isLoading && <ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </GlassButton>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-medium",
                  "text-accent-blue hover:text-accent-purple transition-colors"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </GlassCard>
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