'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { glass, GlassLevel, GlassBorder, GlassShadow, GlassRadius } from '@/lib/design-system/glass-morphism';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  level?: GlassLevel;
  border?: GlassBorder;
  shadow?: GlassShadow;
  radius?: GlassRadius;
  spacing?: keyof typeof glass.spacing;
  floating?: boolean;
  as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
  ariaLabel?: string;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ 
    className, 
    level = 'medium',
    border = 'medium',
    shadow = 'md',
    radius = 'lg',
    spacing = 'lg',
    floating = false,
    as: Component = 'div',
    ariaLabel,
    children,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          // Base glass styles
          glass.levels[level].combined,
          glass.borders[border],
          glass.shadows[shadow],
          glass.radius[radius],
          glass.spacing[spacing],
          
          // Floating effect
          floating && glass.shadows.lg,
          floating && glass.animations.fadeIn,
          
          // Performance
          glass.performance.gpu,
          
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Section variant for larger content areas
export interface GlassSectionProps extends HTMLAttributes<HTMLElement> {
  level?: GlassLevel;
  border?: GlassBorder;
  shadow?: GlassShadow;
  radius?: GlassRadius;
  spacing?: keyof typeof glass.spacing;
  container?: boolean;
  ariaLabel?: string;
}

export const GlassSection = forwardRef<HTMLElement, GlassSectionProps>(
  ({ 
    className, 
    level = 'ultraSubtle',
    border = 'none',
    shadow = 'none',
    radius = 'lg',
    spacing = 'xl',
    container = false,
    ariaLabel,
    children,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          // Base glass styles
          glass.levels[level].combined,
          glass.borders[border],
          glass.shadows[shadow],
          glass.radius[radius],
          glass.spacing[spacing],
          
          // Container styles
          container && 'max-w-7xl mx-auto',
          
          // Performance
          glass.performance.gpu,
          glass.performance.reduceMotion,
          
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

GlassSection.displayName = 'GlassSection';

// Header variant
export interface GlassHeaderProps extends HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  transparent?: boolean;
  ariaLabel?: string;
}

export const GlassHeader = forwardRef<HTMLElement, GlassHeaderProps>(
  ({ 
    className, 
    sticky = false,
    transparent = false,
    ariaLabel,
    children,
    ...props 
  }, ref) => {
    return (
      <header
        ref={ref}
        aria-label={ariaLabel}
        role="banner"
        className={cn(
          // Base styles
          transparent ? 'bg-transparent' : glass.styles.nav.header,
          
          // Sticky positioning
          sticky && 'sticky top-0 z-50',
          
          // Performance
          glass.performance.gpu,
          
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);

GlassHeader.displayName = 'GlassHeader';

// Sidebar variant
export interface GlassSidebarProps extends HTMLAttributes<HTMLElement> {
  position?: 'left' | 'right';
  floating?: boolean;
  ariaLabel?: string;
}

export const GlassSidebar = forwardRef<HTMLElement, GlassSidebarProps>(
  ({ 
    className, 
    position = 'left',
    floating = false,
    ariaLabel,
    children,
    ...props 
  }, ref) => {
    return (
      <aside
        ref={ref}
        aria-label={ariaLabel || 'Sidebar'}
        role="complementary"
        className={cn(
          // Base styles
          glass.styles.nav.sidebar,
          
          // Positioning
          position === 'left' && 'border-r',
          position === 'right' && 'border-l',
          
          // Floating effect
          floating && glass.shadows.xl,
          
          // Performance
          glass.performance.gpu,
          
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

GlassSidebar.displayName = 'GlassSidebar';