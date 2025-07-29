'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { 
  CheckCircle,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function QuestionnaireResultsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!user) {
      router.push('/portal/start');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/portal/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-3xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-40 w-40 h-40 bg-gradient-to-tr from-accent-blue/20 to-accent-green/20 rounded-full blur-3xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <GlassPanel level="primary" className="p-12 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                duration: 0.6,
                delay: 0.2 
              }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-accent-green/20 to-accent-blue/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-accent-green" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-text-secondary mb-2">
                We've received your assessment responses.
              </p>
              <p className="text-text-secondary mb-8">
                We're preparing your personalized recommendations...
              </p>
            </motion.div>

            {/* Sparkles decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-2 mb-8"
            >
              <Sparkles className="w-5 h-5 text-accent-purple" />
              <Sparkles className="w-6 h-6 text-accent-blue" />
              <Sparkles className="w-5 h-5 text-accent-green" />
            </motion.div>

            {/* Redirect countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-text-secondary"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting to your dashboard in {countdown}...</span>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}