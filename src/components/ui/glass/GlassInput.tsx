'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';
import { glass } from '@/lib/design-system/glass-morphism';

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'outline' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  helper?: string;
  fullWidth?: boolean;
  errorMessage?: string;
}

const variants = {
  outline: glass.styles.input.base,
  filled: glass.styles.input.filled
};

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-base min-h-[44px]',
  lg: 'px-5 py-3 text-lg min-h-[52px]'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ 
    className,
    variant = 'outline',
    inputSize = 'md',
    error = false,
    icon,
    iconPosition = 'left',
    label,
    helper,
    fullWidth = false,
    errorMessage,
    id,
    required,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = helper || errorMessage ? `${inputId}-helper` : undefined;
    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = icon && iconPosition === 'right';
    
    const inputElement = (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {hasLeftIcon && (
          <div 
            aria-hidden="true"
            className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
            glass.text.tertiary,
            iconSizes[inputSize]
          )}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            // Base styles
            'w-full font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
            'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Mobile optimization
            'touch-manipulation appearance-none',
            // iOS Safari fixes
            '[&::-webkit-search-decoration]:appearance-none',
            '[&::-webkit-search-cancel-button]:appearance-none',
            
            // Variant styles
            variants[variant],
            
            // Size styles
            sizes[inputSize],
            
            // Icon padding
            hasLeftIcon && (inputSize === 'sm' ? 'pl-8' : inputSize === 'md' ? 'pl-10' : 'pl-12'),
            hasRightIcon && (inputSize === 'sm' ? 'pr-8' : inputSize === 'md' ? 'pr-10' : 'pr-12'),
            
            // Error styles
            error && 'border-red-500/50 focus:ring-red-500/50',
            
            // Text color
            glass.text.primary,
            
            // Performance
            glass.performance.gpu,
            
            className
          )}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperId}
          aria-required={required}
          {...props}
        />
        
        {hasRightIcon && (
          <div 
            aria-hidden="true"
            className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
            glass.text.tertiary,
            iconSizes[inputSize]
          )}>
            {icon}
          </div>
        )}
      </div>
    );
    
    if (label || helper) {
      return (
        <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
          {label && (
            <label 
              htmlFor={inputId}
              className={cn(
              'block text-sm font-medium mb-1',
              glass.text.secondary,
              error && 'text-red-600 dark:text-red-400'
            )}>
              {label}
              {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
          )}
          
          {inputElement}
          
          {(helper || errorMessage) && (
            <p 
              id={helperId}
              role={error ? 'alert' : undefined}
              className={cn(
              'text-xs mt-1',
              error ? 'text-red-600 dark:text-red-400' : glass.text.tertiary
            )}>
              {errorMessage || helper}
            </p>
          )}
        </div>
      );
    }
    
    return inputElement;
  }
);

GlassInput.displayName = 'GlassInput';

// Textarea Component
export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'outline' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  label?: string;
  helper?: string;
  fullWidth?: boolean;
  errorMessage?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ 
    className,
    variant = 'outline',
    inputSize = 'md',
    error = false,
    label,
    helper,
    fullWidth = false,
    errorMessage,
    id,
    required,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const helperId = helper || errorMessage ? `${textareaId}-helper` : undefined;
    
    const textareaElement = (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          'w-full font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue/50',
          'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'min-h-[100px] resize-y',
          // Mobile optimization
          'touch-manipulation appearance-none',
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[inputSize],
          
          // Error styles
          error && 'border-red-500/50 focus:ring-red-500/50',
          
          // Text color
          glass.text.primary,
          
          // Performance
          glass.performance.gpu,
          
          className
        )}
        id={textareaId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={helperId}
        aria-required={required}
        {...props}
      />
    );
    
    if (label || helper) {
      return (
        <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
          {label && (
            <label 
              htmlFor={textareaId}
              className={cn(
              'block text-sm font-medium mb-1',
              glass.text.secondary,
              error && 'text-red-600 dark:text-red-400'
            )}>
              {label}
              {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
          )}
          
          {textareaElement}
          
          {(helper || errorMessage) && (
            <p 
              id={helperId}
              role={error ? 'alert' : undefined}
              className={cn(
              'text-xs mt-1',
              error ? 'text-red-600 dark:text-red-400' : glass.text.tertiary
            )}>
              {errorMessage || helper}
            </p>
          )}
        </div>
      );
    }
    
    return textareaElement;
  }
);

GlassTextarea.displayName = 'GlassTextarea';