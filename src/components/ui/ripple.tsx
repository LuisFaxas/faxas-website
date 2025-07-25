'use client';

import { useState, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function Ripple({ children, className, color = 'rgba(255, 255, 255, 0.8)' }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; size: number; key: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextKey = useRef(0);

  const createRipple = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      key: nextKey.current++,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.key !== newRipple.key));
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}