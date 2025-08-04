'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { glass, GlassLevel, GlassBorder, GlassShadow, GlassRadius } from '@/lib/design-system/glass-morphism';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  level?: GlassLevel;
  border?: GlassBorder;
  shadow?: GlassShadow;
  radius?: GlassRadius;
  hover?: boolean;
  interactive?: boolean;
  animated?: boolean;
  spacing?: keyof typeof glass.spacing;
  as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
  ariaLabel?: string;
}

export interface GlassMotionCardProps extends HTMLMotionProps<"div"> {
  level?: GlassLevel;
  border?: GlassBorder;
  shadow?: GlassShadow;
  radius?: GlassRadius;
  hover?: boolean;
  interactive?: boolean;
  spacing?: keyof typeof glass.spacing;
  ariaLabel?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    level = 'subtle',
    border = 'subtle',
    shadow = 'sm',
    radius = 'lg',
    hover = false,
    interactive = false,
    animated = false,
    spacing = 'md',
    as: Component = 'div',
    ariaLabel,
    role,
    tabIndex,
    children,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      glass.levels[level].combined,
      glass.borders[border],
      glass.shadows[shadow],
      glass.radius[radius],
      glass.spacing[spacing],
      glass.performance.gpu
    );

    const interactionStyles = cn(
      interactive && 'cursor-pointer',
      interactive && glass.animations.press,
      hover && glass.animations.hoverLift,
      animated && glass.animations.fadeIn
    );

    const accessibilityProps = {
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(interactive && !role && { role: 'button' }),
      ...(interactive && tabIndex === undefined && { tabIndex: 0 }),
      ...(interactive && {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (e.target as HTMLElement).click();
          }
          props.onKeyDown?.(e as any);
        }
      })
    };

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          interactionStyles,
          glass.animations.base,
          interactive && 'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
          className
        )}
        role={role}
        tabIndex={tabIndex}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export const GlassMotionCard = forwardRef<HTMLDivElement, GlassMotionCardProps>(
  ({ 
    className, 
    level = 'subtle',
    border = 'subtle',
    shadow = 'sm',
    radius = 'lg',
    hover = false,
    interactive = false,
    spacing = 'md',
    ariaLabel,
    role,
    tabIndex,
    children,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      glass.levels[level].combined,
      glass.borders[border],
      glass.shadows[shadow],
      glass.radius[radius],
      glass.spacing[spacing],
      glass.performance.gpu
    );

    const interactionStyles = cn(
      interactive && 'cursor-pointer',
      interactive && glass.animations.press,
      hover && glass.animations.hoverLift
    );

    const accessibilityProps = {
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(interactive && !role && { role: 'button' }),
      ...(interactive && tabIndex === undefined && { tabIndex: 0 }),
      ...(interactive && {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (e.target as HTMLElement).click();
          }
          props.onKeyDown?.(e as any);
        }
      })
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          interactionStyles,
          glass.animations.base,
          interactive && 'focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
          className
        )}
        role={role}
        tabIndex={tabIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassMotionCard.displayName = 'GlassMotionCard';