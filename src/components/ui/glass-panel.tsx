// Legacy GlassPanel component - redirects to new glass system
// This file is kept for backward compatibility
// Please use components from '@/components/ui/glass' instead

import { GlassPanel as NewGlassPanel } from '@/components/ui/glass';
import type { GlassLevel } from '@/lib/design-system/glass-morphism';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  level?: 'primary' | 'secondary' | 'accent' | 'light';
  float?: boolean;
}

// Map old level names to new glass levels
const levelMap: Record<string, GlassLevel> = {
  primary: 'medium',
  secondary: 'subtle',
  accent: 'accent',
  light: 'ultraSubtle',
};

export function GlassPanel({
  children,
  className,
  level = 'primary',
  float = false,
}: GlassPanelProps) {
  return (
    <NewGlassPanel
      level={levelMap[level]}
      floating={float}
      className={className}
    >
      {children}
    </NewGlassPanel>
  );
}
