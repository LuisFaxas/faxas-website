'use client';

import { forwardRef, ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { glass } from '@/lib/design-system/glass-morphism';
import { Loader2 } from 'lucide-react';

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants = {
  primary: glass.styles.button.primary,
  secondary: glass.styles.button.secondary,
  ghost: glass.styles.button.ghost,
  danger: cn(
    glass.levels.accent.combined,
    'bg-gradient-to-r from-red-500/20 to-red-600/10',
    glass.borders.accent,
    glass.shadows.md,
    glass.radius.md,
    glass.animations.hoverGlow,
    glass.animations.press,
    'hover:shadow-red-500/20'
  )
};

const sizes = {
  sm: cn('px-3 py-1.5 text-sm min-h-[36px]', glass.radius.sm),
  md: cn('px-4 py-2 text-base min-h-[44px]', glass.radius.md),
  lg: cn('px-6 py-3 text-lg min-h-[52px]', glass.radius.lg)
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    disabled,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Mobile touch optimization
          'touch-manipulation active:scale-[0.97] transition-transform',
          // Accessibility - focus visible for keyboard navigation
          'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Text color based on variant
          variant === 'primary' && 'text-white',
          variant === 'secondary' && glass.text.primary,
          variant === 'ghost' && glass.text.secondary,
          variant === 'danger' && 'text-red-600 dark:text-red-400',
          
          // Performance
          glass.performance.gpu,
          
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 
            className={cn(
              'animate-spin',
              size === 'sm' && 'w-3.5 h-3.5',
              size === 'md' && 'w-4 h-4',
              size === 'lg' && 'w-5 h-5',
              children && 'mr-2'
            )}
            aria-hidden="true"
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(
            'inline-flex',
            children && 'mr-2'
          )}>
            {icon}
          </span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(
            'inline-flex',
            children && 'ml-2'
          )}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// Button Group Component
export interface GlassButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md';
  direction?: 'horizontal' | 'vertical';
}

export const GlassButtonGroup = forwardRef<HTMLDivElement, GlassButtonGroupProps>(
  ({ className, spacing = 'sm', direction = 'horizontal', children, ...props }, ref) => {
    const gaps = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3'
    };
    
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'flex',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          gaps[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassButtonGroup.displayName = 'GlassButtonGroup';