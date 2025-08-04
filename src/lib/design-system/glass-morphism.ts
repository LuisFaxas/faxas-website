/**
 * FAXAS.NET Glass Morphism Design System
 * A comprehensive, performant glass morphism implementation
 */

import { cn } from '@/lib/utils';

// Glass Morphism Levels - Hierarchy based on visual importance
export const glassLevels = {
  // Level 0 - Ultra Subtle (for backgrounds)
  ultraSubtle: {
    light: 'bg-white/[0.02] backdrop-blur-sm',
    dark: 'dark:bg-white/[0.01] dark:backdrop-blur-sm',
    combined: 'bg-white/[0.02] dark:bg-white/[0.01] backdrop-blur-sm'
  },
  
  // Level 1 - Subtle (cards, tiles, list items)
  subtle: {
    light: 'bg-white/[0.05] backdrop-blur-md',
    dark: 'dark:bg-white/[0.03] dark:backdrop-blur-md',
    combined: 'bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-md'
  },
  
  // Level 2 - Medium (panels, sections, containers)
  medium: {
    light: 'bg-white/[0.08] backdrop-blur-lg',
    dark: 'dark:bg-white/[0.05] dark:backdrop-blur-lg',
    combined: 'bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-lg'
  },
  
  // Level 3 - Strong (navigation, headers, important UI)
  strong: {
    light: 'bg-white/[0.7] backdrop-blur-xl',
    dark: 'dark:bg-gray-900/[0.7] dark:backdrop-blur-xl',
    combined: 'bg-white/[0.7] dark:bg-gray-900/[0.7] backdrop-blur-xl'
  },
  
  // Level 4 - Accent (CTAs, highlights, special elements)
  accent: {
    light: 'bg-gradient-to-r from-white/[0.15] to-white/[0.08] backdrop-blur-xl',
    dark: 'dark:bg-gradient-to-r dark:from-white/[0.1] dark:to-white/[0.05] dark:backdrop-blur-xl',
    combined: 'bg-gradient-to-r from-white/[0.15] to-white/[0.08] dark:from-white/[0.1] dark:to-white/[0.05] backdrop-blur-xl'
  }
} as const;

// Border Styles - Consistent border system
export const glassBorders = {
  none: '',
  subtle: 'border border-white/[0.08] dark:border-white/[0.06]',
  medium: 'border border-white/[0.12] dark:border-white/[0.08]',
  strong: 'border border-white/[0.18] dark:border-white/[0.12]',
  accent: 'border border-white/[0.25] dark:border-white/[0.15]'
} as const;

// Shadow System - Elevation hierarchy
export const glassShadows = {
  none: '',
  sm: 'shadow-sm shadow-black/[0.04] dark:shadow-black/[0.08]',
  md: 'shadow-md shadow-black/[0.06] dark:shadow-black/[0.12]',
  lg: 'shadow-lg shadow-black/[0.08] dark:shadow-black/[0.16]',
  xl: 'shadow-xl shadow-black/[0.10] dark:shadow-black/[0.20]',
  glow: 'shadow-lg shadow-accent-blue/[0.15] dark:shadow-accent-blue/[0.25]'
} as const;

// Text Colors - Hierarchical text system
export const glassText = {
  primary: 'text-gray-900 dark:text-white',
  secondary: 'text-gray-700 dark:text-gray-300',
  tertiary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
  accent: 'text-accent-blue dark:text-accent-blue',
  danger: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400'
} as const;

// Spacing Scale - Consistent spacing system
export const spacing = {
  xs: 'p-2',     // 8px
  sm: 'p-3',     // 12px
  md: 'p-4',     // 16px
  lg: 'p-6',     // 24px
  xl: 'p-8',     // 32px
  '2xl': 'p-12', // 48px
} as const;

// Border Radius - Consistent corners
export const radius = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full'
} as const;

// Animation Presets - Smooth transitions
export const animations = {
  // Base transition
  base: 'transition-all duration-200 ease-out',
  
  // Hover lift effect
  hoverLift: 'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ease-out',
  
  // Hover glow effect
  hoverGlow: 'hover:shadow-xl hover:shadow-accent-blue/20 transition-all duration-300 ease-out',
  
  // Press effect
  press: 'active:scale-[0.98] transition-transform duration-150 ease-out',
  
  // Fade in
  fadeIn: 'animate-in fade-in duration-300 ease-out',
  
  // Slide up
  slideUp: 'animate-in slide-in-from-bottom-2 duration-300 ease-out'
} as const;

// Composite Styles - Pre-built combinations
export const glassStyles = {
  // Card styles
  card: {
    base: cn(
      glassLevels.subtle.combined,
      glassBorders.subtle,
      glassShadows.sm,
      radius.lg,
      animations.base
    ),
    hover: cn(
      glassLevels.subtle.combined,
      glassBorders.subtle,
      glassShadows.sm,
      radius.lg,
      animations.hoverLift
    ),
    interactive: cn(
      glassLevels.subtle.combined,
      glassBorders.subtle,
      glassShadows.sm,
      radius.lg,
      animations.hoverLift,
      animations.press,
      'cursor-pointer'
    )
  },
  
  // Panel styles
  panel: {
    base: cn(
      glassLevels.medium.combined,
      glassBorders.medium,
      glassShadows.md,
      radius.lg
    ),
    floating: cn(
      glassLevels.medium.combined,
      glassBorders.medium,
      glassShadows.lg,
      radius.xl
    )
  },
  
  // Navigation styles
  nav: {
    header: cn(
      glassLevels.strong.combined,
      glassBorders.subtle,
      glassShadows.md,
      'border-b'
    ),
    sidebar: cn(
      glassLevels.strong.combined,
      glassBorders.subtle,
      glassShadows.lg,
      radius.lg
    ),
    bottomBar: cn(
      glassLevels.strong.combined,
      glassBorders.subtle,
      glassShadows.lg,
      'border-t'
    )
  },
  
  // Button styles
  button: {
    primary: cn(
      glassLevels.accent.combined,
      glassBorders.accent,
      glassShadows.md,
      radius.md,
      animations.hoverGlow,
      animations.press
    ),
    secondary: cn(
      glassLevels.medium.combined,
      glassBorders.medium,
      glassShadows.sm,
      radius.md,
      animations.hoverLift,
      animations.press
    ),
    ghost: cn(
      'bg-transparent',
      glassBorders.subtle,
      radius.md,
      animations.base,
      'hover:bg-white/[0.05] dark:hover:bg-white/[0.03]'
    )
  },
  
  // Input styles
  input: {
    base: cn(
      glassLevels.subtle.combined,
      glassBorders.medium,
      radius.md,
      'focus-within:border-accent-blue/50',
      animations.base
    ),
    filled: cn(
      glassLevels.medium.combined,
      glassBorders.subtle,
      radius.md,
      'focus-within:border-accent-blue/50',
      animations.base
    )
  },
  
  // Modal/Dialog styles
  modal: {
    overlay: 'bg-black/50 backdrop-blur-sm',
    content: cn(
      glassLevels.strong.combined,
      glassBorders.medium,
      glassShadows.xl,
      radius.xl
    )
  }
} as const;

// Performance Utilities
export const glassPerformance = {
  // Use for elements that need GPU acceleration
  gpu: 'transform-gpu',
  
  // Use for elements that should be on their own layer
  layer: 'will-change-transform',
  
  // Disable blur on low-end devices
  reduceMotion: 'motion-reduce:backdrop-blur-none',
  
  // Performance-optimized glass (less blur)
  optimized: 'backdrop-blur supports-[backdrop-filter]:backdrop-blur-md',
  
  // Mobile performance mode
  mobile: 'backdrop-blur-[8px] sm:backdrop-blur-md',
  
  // Touch optimization
  touch: 'touch-manipulation'
} as const;

// Utility function to create custom glass styles
export function createGlassStyle(
  level: keyof typeof glassLevels = 'medium',
  border: keyof typeof glassBorders = 'medium',
  shadow: keyof typeof glassShadows = 'md',
  borderRadius: keyof typeof radius = 'lg',
  additionalClasses?: string
) {
  return cn(
    glassLevels[level].combined,
    glassBorders[border],
    glassShadows[shadow],
    radius[borderRadius],
    animations.base,
    additionalClasses
  );
}

// Responsive glass utilities
export const responsiveGlass = {
  // Hide glass effects on small screens for performance
  mobileOptimized: 'backdrop-blur-sm sm:backdrop-blur-md lg:backdrop-blur-lg',
  
  // Adaptive opacity
  adaptiveOpacity: 'bg-white/10 sm:bg-white/8 lg:bg-white/5',
  
  // Responsive shadows
  responsiveShadow: 'shadow-sm sm:shadow-md lg:shadow-lg',
  
  // Mobile-first blur levels
  blur: {
    sm: 'backdrop-blur-[4px] sm:backdrop-blur-sm',
    md: 'backdrop-blur-[8px] sm:backdrop-blur-md',
    lg: 'backdrop-blur-[12px] sm:backdrop-blur-lg',
    xl: 'backdrop-blur-[16px] sm:backdrop-blur-xl',
  },
  
  // Touch-friendly sizes
  touch: {
    sm: 'min-h-[44px] min-w-[44px] p-3',
    md: 'min-h-[48px] min-w-[48px] p-4',
    lg: 'min-h-[56px] min-w-[56px] p-5',
  },
  
  // Responsive text sizes
  text: {
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl',
    '3xl': 'text-2xl sm:text-3xl',
  },
  
  // Responsive spacing
  spacing: {
    gap: 'gap-4 sm:gap-6 lg:gap-8',
    'gap-sm': 'gap-2 sm:gap-3 lg:gap-4',
    'gap-lg': 'gap-6 sm:gap-8 lg:gap-10',
    padding: 'p-4 sm:p-6 lg:p-8',
    'padding-sm': 'p-3 sm:p-4 lg:p-5',
    'padding-lg': 'p-6 sm:p-8 lg:p-10',
  },
  
  // Responsive grid
  grid: {
    '1-2': 'grid-cols-1 sm:grid-cols-2',
    '1-2-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '1-2-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    '2-3-4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  },
  
  // Hide/show utilities
  hide: {
    mobile: 'hidden sm:block',
    tablet: 'hidden md:block',
    desktop: 'hidden lg:block',
  },
  show: {
    mobile: 'block sm:hidden',
    tablet: 'block md:hidden',
    desktop: 'block lg:hidden',
  }
} as const;

// Export all as a unified system
export const glass = {
  levels: glassLevels,
  borders: glassBorders,
  shadows: glassShadows,
  text: glassText,
  spacing,
  radius,
  animations,
  styles: glassStyles,
  performance: glassPerformance,
  responsive: responsiveGlass,
  create: createGlassStyle
} as const;

// Type exports for TypeScript
export type GlassLevel = keyof typeof glassLevels;
export type GlassBorder = keyof typeof glassBorders;
export type GlassShadow = keyof typeof glassShadows;
export type GlassRadius = keyof typeof radius;

// Mobile-optimized presets
export const mobilePresets = {
  card: cn(
    glassLevels.subtle.combined,
    glassBorders.subtle,
    'shadow-sm',
    radius.lg,
    responsiveGlass.mobileOptimized,
    glassPerformance.touch
  ),
  button: cn(
    glassLevels.medium.combined,
    glassBorders.medium,
    'shadow-sm active:shadow-none',
    radius.md,
    responsiveGlass.touch.sm,
    glassPerformance.touch,
    'active:scale-[0.97]'
  ),
  input: cn(
    glassLevels.subtle.combined,
    glassBorders.medium,
    radius.md,
    responsiveGlass.touch.sm,
    glassPerformance.touch,
    'focus-within:border-accent-blue/50'
  )
} as const;
export type GlassTextColor = keyof typeof glassText;