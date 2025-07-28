'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { resendVerificationEmail } from '@/lib/firebase/auth-enhanced';

export function EmailVerificationBanner() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if no user, email is verified, or banner is dismissed
  if (!user || user.emailVerified || isDismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    const result = await resendVerificationEmail();
    
    if (result.error) {
      toast.error('Failed to send email', result.error);
    } else {
      toast.success('Email sent!', result.message || 'Check your inbox for the verification link.');
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                <strong>Verify your email address.</strong> We sent a verification email to {user.email}.
                Didn't receive it?{' '}
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="font-medium text-amber-900 underline hover:no-underline disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend email'}
                </button>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-4 flex-shrink-0 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function EmailVerificationModal() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // Don't show if no user or email is verified
  if (!user || user.emailVerified || !showModal) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    const result = await resendVerificationEmail();
    
    if (result.error) {
      toast.error('Failed to send email', result.error);
    } else {
      toast.success('Email sent!', result.message || 'Check your inbox for the verification link.');
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-amber-600" />
          </div>
          
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Verify your email address
          </h3>
          
          <p className="text-text-secondary mb-6">
            We've sent a verification email to <strong>{user.email}</strong>. 
            Please check your inbox and click the verification link to continue.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            
            <Button
              onClick={() => setShowModal(false)}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              I'll verify later
            </Button>
          </div>
          
          <p className="text-xs text-text-tertiary mt-4">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}