'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: [
          'bg-accent-blue text-white',
          'shadow-[0_4px_14px_0_rgba(0,122,255,0.3)]',
          'hover:shadow-[0_6px_20px_rgba(0,122,255,0.4)]',
          'hover:bg-accent-blue/90',
          'active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
        ].join(' '),
        secondary: [
          'bg-white/70 backdrop-blur-md text-text-primary',
          'border border-white/30',
          'shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
          'hover:bg-white/80',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
          'active:scale-[0.98]',
        ].join(' '),
        ghost: [
          'text-text-primary',
          'hover:bg-white/20 hover:backdrop-blur-sm',
          'active:scale-[0.98]',
        ].join(' '),
        glass: [
          'bg-white/30 backdrop-blur-md text-text-primary',
          'border border-white/20',
          'shadow-glass-sm',
          'hover:bg-white/40',
          'hover:border-white/30',
          'hover:shadow-glass',
          'active:scale-[0.98]',
        ].join(' '),
        link: [
          'text-accent-blue underline-offset-4',
          'hover:underline hover:text-accent-blue/80',
          'p-0 h-auto',
        ].join(' '),
      },
      size: {
        sm: 'min-h-[40px] sm:min-h-[36px] px-4 text-sm rounded-[20px]',
        md: 'min-h-[44px] sm:min-h-[44px] px-6 text-base rounded-[24px]',
        lg: 'min-h-[48px] sm:min-h-[56px] px-8 text-lg rounded-[28px]',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  float?: boolean;
  // ripple?: boolean; // TODO: Re-add when ripple effect is fixed
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, float = false, children, ...props }, ref) => {
    // TODO: Re-implement ripple effect with proper TypeScript compatibility

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="relative z-10">{children}</span>
        </Slot>
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={float ? { y: -2 } : undefined}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {/* Ripple effect - temporarily disabled for TypeScript compatibility */}
        {/* TODO: Fix ripple effect type issue */}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
