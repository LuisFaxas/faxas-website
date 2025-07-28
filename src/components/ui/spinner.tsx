'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      color: {
        primary: 'text-accent-blue',
        secondary: 'text-gray-600',
        white: 'text-white',
        current: 'text-current',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function Spinner({ size, color, className, label }: SpinnerProps) {
  return (
    <div className="inline-flex items-center justify-center" role="status">
      <span
        className={cn(spinnerVariants({ size, color }), className)}
        aria-label={label || 'Loading'}
      />
      {label && (
        <span className="ml-2 text-sm text-gray-600">{label}</span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Loading overlay component
export interface LoadingOverlayProps {
  visible?: boolean;
  label?: string;
  blur?: boolean;
}

export function LoadingOverlay({ visible = true, label, blur = true }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        blur && "backdrop-blur-sm bg-white/30"
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {label && (
          <p className="text-sm font-medium text-gray-700">{label}</p>
        )}
      </div>
    </div>
  );
}