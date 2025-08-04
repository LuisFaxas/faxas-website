import { cn } from '@/lib/utils';

// Consistent glass morphism classes
export const glassClasses = {
  // Base glass effect - use this for all glass surfaces
  base: 'bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10',
  
  // Hover state
  hover: 'hover:bg-white/10 dark:hover:bg-white/10',
  
  // Card glass (slightly more opaque)
  card: 'bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10',
  
  // Panel glass (for larger surfaces)
  panel: 'bg-white/5 dark:bg-black/5 backdrop-blur-2xl border border-white/10 dark:border-white/5',
  
  // Input glass
  input: 'bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/10 dark:border-white/10',
};

// Helper function to apply glass effect
export function glass(variant: keyof typeof glassClasses = 'base', className?: string) {
  return cn(glassClasses[variant], className);
}