'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'flex w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-2.5',
    'text-sm text-gray-900 placeholder:text-gray-500',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'border-gray-200/50',
          'hover:border-gray-300/50',
          'focus:border-accent-blue/50 focus:ring-accent-blue/20',
        ].join(' '),
        error: [
          'border-red-300',
          'focus:border-red-500 focus:ring-red-500/20',
          'text-red-900 placeholder:text-red-400',
        ].join(' '),
        success: [
          'border-green-300',
          'focus:border-green-500 focus:ring-green-500/20',
        ].join(' '),
      },
      size: {
        sm: 'h-9 text-xs',
        md: 'h-11 text-sm',
        lg: 'h-13 text-base',
      },
      glass: {
        true: 'bg-white/30 backdrop-blur-xl border-white/30',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      glass: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    glass,
    error,
    success,
    startIcon,
    endIcon,
    ...props 
  }, ref) => {
    const computedVariant = error ? 'error' : success ? 'success' : variant;

    if (startIcon || endIcon) {
      return (
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-gray-500">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              inputVariants({ variant: computedVariant, size, glass, className }),
              startIcon && 'pl-10',
              endIcon && 'pr-10'
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-gray-500">
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant: computedVariant, size, glass, className }))}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };