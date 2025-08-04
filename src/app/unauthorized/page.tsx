'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';
import { GlassCard, GlassButton, glass } from '@/components/ui/glass';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { cn } from '@/lib/utils';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
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
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShieldOff className="w-10 h-10 text-red-500" />
            </motion.div>
            
            <h1 className={cn(glass.responsive.text['3xl'], "font-bold mb-4", glass.text.primary)}>
              Access Denied
            </h1>
            
            <p className={cn("mb-8", glass.text.secondary)}>
              You don't have permission to access this area. This incident has been logged.
            </p>
            
            <div className="space-y-3">
              <Link href="/">
                <GlassButton
                  variant="primary"
                  fullWidth
                  icon={<Home className="w-5 h-5" />}
                  aria-label="Go to homepage"
                >
                  Go to Homepage
                </GlassButton>
              </Link>
              
              <GlassButton
                variant="ghost"
                fullWidth
                onClick={() => window.history.back()}
                icon={<ArrowLeft className="w-5 h-5" />}
                aria-label="Go back to previous page"
              >
                Go Back
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}