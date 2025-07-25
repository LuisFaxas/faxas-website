'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  level?: 'light' | 'medium' | 'heavy' | 'primary' | 'secondary' | 'accent';
  float?: boolean;
  glow?: boolean;
  shine?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, level = 'medium', float = false, glow = false, shine = true, ...props }, ref) => {
    const levelClasses = {
      light: 'bg-white/60 backdrop-blur-[20px] border-white/30',
      medium: 'bg-white/70 backdrop-blur-[40px] border-white/30', 
      heavy: 'bg-white/85 backdrop-blur-[60px] border-white/40',
      primary: 'bg-white/70 backdrop-blur-[40px] border-white/30',
      secondary: 'bg-white/60 backdrop-blur-[20px] border-white/30',
      accent: 'bg-accent-blue/10 backdrop-blur-[40px] border-accent-blue/20',
    };

    const glowClasses = glow ? 'shadow-[0_0_30px_rgba(0,122,255,0.15)]' : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-[32px] border',
          levelClasses[level],
          float && 'floating-tile',
          'shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
          'transition-all duration-500',
          glowClasses,
          className
        )}
        whileHover={float ? {
          y: -4,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        } : undefined}
        {...props}
      >
        {/* Glass shine effect */}
        {shine && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Noise texture overlay for authentic glass feel */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
          <svg width="100%" height="100%">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
