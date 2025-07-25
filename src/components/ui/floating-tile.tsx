'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FloatingTileProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  href?: string;
  onClick?: () => void;
}

export function FloatingTile({ 
  children, 
  className, 
  delay = 0,
  href,
  onClick 
}: FloatingTileProps) {
  const Component = href ? motion.a : motion.div;
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'floating-tile glass-secondary p-6 cursor-pointer',
        'hover:shadow-2xl hover:shadow-black/10',
        'transform-gpu transition-all duration-500',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{ 
        delay: delay / 1000,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ 
        y: -8, 
        rotateX: 2, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        transformStyle: 'preserve-3d',
        animation: `subtle-float 6s ease-in-out ${delay}ms infinite`
      }}
    >
      {children}
    </Component>
  );
}