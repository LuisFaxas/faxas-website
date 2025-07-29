import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  level?: 'primary' | 'secondary' | 'accent' | 'light';
  float?: boolean;
}

export function GlassPanel({
  children,
  className,
  level = 'primary',
  float = false,
}: GlassPanelProps) {
  const levelClasses = {
    primary: 'glass-primary',
    secondary: 'glass-secondary',
    accent: 'glass-accent',
    light: 'glass-light',
  };

  return (
    <div
      className={cn(
        levelClasses[level],
        float && 'floating-tile hover:shadow-glass-hover',
        'relative overflow-hidden',
        className
      )}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
