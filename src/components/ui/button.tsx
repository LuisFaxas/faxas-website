'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import * as React from 'react';
import { Ripple } from './ripple';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden transform-gpu',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-accent-blue to-accent-purple text-white',
          'shadow-[0_8px_32px_rgba(59,130,246,0.3)]',
          'hover:shadow-[0_12px_48px_rgba(59,130,246,0.4)]',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
          'border border-white/20',
        ].join(' '),
        secondary: [
          'glass-secondary text-text-primary',
          'hover:shadow-lg',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
        ].join(' '),
        ghost: [
          'text-text-primary',
          'hover:bg-glass-blue',
          'hover:backdrop-blur-sm',
          'active:scale-[0.98]',
        ].join(' '),
        glass: [
          'glass-accent text-text-primary',
          'hover:shadow-xl',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
        ].join(' '),
        link: [
          'text-accent-blue underline-offset-4',
          'hover:underline hover:text-accent-blue/80',
          'p-0 h-auto',
        ].join(' '),
      },
      size: {
        sm: 'min-h-[36px] px-4 text-sm rounded-[18px]',
        md: 'min-h-[44px] px-6 text-base rounded-[22px]',
        lg: 'min-h-[52px] px-8 text-lg rounded-[26px]',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  float?: boolean;
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, float = false, ripple = true, children, onClick, ...props }, ref) => {
    const buttonContent = <span className="relative z-10">{children}</span>;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const motionButton = (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={float ? { y: -2 } : undefined}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick}
        aria-label={props['aria-label']}
        role={props.role || 'button'}
        tabIndex={props.tabIndex ?? 0}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );

    if (ripple && variant !== 'link') {
      return (
        <Ripple 
          color={variant === 'primary' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.3)'}
        >
          {motionButton}
        </Ripple>
      );
    }

    return motionButton;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
