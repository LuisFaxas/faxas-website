'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GlassPanel } from './glass-panel';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  hoverable?: boolean;
  level?: 'light' | 'medium' | 'heavy';
}

export function GlassCard({
  children,
  className,
  title,
  subtitle,
  icon,
  hoverable = true,
  level = 'medium',
}: GlassCardProps) {
  return (
    <GlassPanel
      level={level}
      float={hoverable}
      className={cn('p-6 md:p-8', className)}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
    >
      {(title || subtitle || icon) && (
        <div className="mb-6">
          {icon && (
            <div className="mb-4 inline-flex">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-accent-blue"
              >
                {icon}
              </motion.div>
            </div>
          )}
          {title && (
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </GlassPanel>
  );
}
