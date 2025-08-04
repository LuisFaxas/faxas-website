'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import * as React from 'react';
import { Ripple } from './ripple';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative group overflow-hidden',
  {
    variants: {
      variant: {
        primary: [
          // Premium gradient button with proper contrast
          'text-white',
          'bg-gradient-to-r from-accent-blue to-accent-purple',
          'backdrop-blur-xl',
          'shadow-[0_8px_32px_rgba(59,130,246,0.4)]',
          'hover:from-accent-blue/90 hover:to-accent-purple/90',
          'hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)]',
          'active:scale-[0.98]',
          // Gradient overlay for depth
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/20 before:to-transparent',
          'before:pointer-events-none before:rounded-[inherit]',
        ].join(' '),
        secondary: [
          // Subtle glass with dark text
          'text-gray-900',
          'bg-white/60',
          'backdrop-blur-md',
          'shadow-[0_4px_16px_rgba(0,0,0,0.1)]',
          'hover:bg-white/80',
          'hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]',
          'active:scale-[0.98]',
        ].join(' '),
        ghost: [
          // Minimal with hover glass effect
          'text-gray-700',
          'hover:bg-white/30',
          'hover:backdrop-blur-sm',
          'active:scale-[0.98]',
        ].join(' '),
        glass: [
          // Colored glass with gradient - enhanced contrast
          'text-white',
          'bg-gradient-to-r from-accent-blue/50 to-accent-purple/50',
          'backdrop-blur-xl',
          'shadow-[0_8px_32px_rgba(59,130,246,0.37)]',
          'hover:from-accent-blue/60 hover:to-accent-purple/60',
          'hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)]',
          'active:scale-[0.98]',
          // Shimmer effect
          'after:absolute after:inset-0',
          'after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
          'after:translate-x-[-200%] hover:after:translate-x-[200%]',
          'after:transition-transform after:duration-700',
          'after:pointer-events-none after:rounded-[inherit]',
        ].join(' '),
        outline: [
          // Outlined glass button
          'text-gray-900',
          'bg-transparent',
          'hover:bg-white/30',
          'hover:backdrop-blur-sm',
          'active:scale-[0.98]',
        ].join(' '),
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg gap-2',
        md: 'h-11 px-6 text-base rounded-xl gap-2.5',
        lg: 'h-14 px-10 text-lg rounded-xl gap-3',
        xl: 'h-16 px-12 text-xl rounded-xl gap-4',
        icon: 'h-10 w-10 rounded-xl',
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
        disabled={props.disabled}
        form={props.form}
        formAction={props.formAction}
        formEncType={props.formEncType}
        formMethod={props.formMethod}
        formNoValidate={props.formNoValidate}
        formTarget={props.formTarget}
        name={props.name}
        type={props.type}
        value={props.value}
      >
        {buttonContent}
      </motion.button>
    );

    if (ripple) {
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
