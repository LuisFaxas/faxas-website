'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const selectVariants = cva(
  [
    'flex w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-2.5',
    'text-sm text-gray-900 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'appearance-none cursor-pointer',
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
          'text-red-900',
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: boolean;
  success?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant, 
    size, 
    glass,
    error,
    success,
    placeholder,
    children,
    ...props 
  }, ref) => {
    const computedVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(selectVariants({ variant: computedVariant, size, glass, className }))}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select, selectVariants };