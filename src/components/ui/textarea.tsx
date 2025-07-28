'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  [
    'flex w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-3',
    'text-sm text-gray-900 placeholder:text-gray-500',
    'transition-all duration-200 resize-none',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
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
        sm: 'min-h-[80px] text-xs',
        md: 'min-h-[120px] text-sm',
        lg: 'min-h-[160px] text-base',
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  success?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size, 
    glass,
    error,
    success,
    showCount,
    maxLength,
    onChange,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    const [count, setCount] = React.useState(0);
    const computedVariant = error ? 'error' : success ? 'success' : variant;

    React.useEffect(() => {
      const currentValue = value || defaultValue || '';
      setCount(String(currentValue).length);
    }, [value, defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(textareaVariants({ variant: computedVariant, size, glass, className }))}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          {...props}
        />
        {showCount && (
          <div className={cn(
            "absolute bottom-2 right-3 text-xs",
            error ? "text-red-500" : "text-gray-500"
          )}>
            {count}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };