'use client';

import { useEffect, useState } from 'react';

interface Orb {
  id: number;
  color: 'blue' | 'purple' | 'pink';
  size: 'small' | 'medium' | 'large';
  initialX: number;
  initialY: number;
  animationDelay: number;
}

export function AnimatedBackground() {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    // Generate random orbs on client side only
    const generateOrbs = () => {
      const orbConfigs: Orb[] = [
        {
          id: 1,
          color: 'blue',
          size: 'large',
          initialX: 20,
          initialY: 20,
          animationDelay: 0,
        },
        {
          id: 2,
          color: 'purple',
          size: 'medium',
          initialX: 80,
          initialY: 60,
          animationDelay: 7,
        },
        {
          id: 3,
          color: 'pink',
          size: 'medium',
          initialX: 50,
          initialY: 80,
          animationDelay: 14,
        },
      ];
      setOrbs(orbConfigs);
    };

    generateOrbs();
  }, []);

  const getOrbClasses = (orb: Orb) => {
    const sizeClasses = {
      small: 'w-[300px] h-[300px]',
      medium: 'w-[400px] h-[400px]',
      large: 'w-[600px] h-[600px]',
    };

    const colorClasses = {
      blue: 'orb-blue',
      purple: 'orb-purple',
      pink: 'orb-pink',
    };

    return `floating-orb ${colorClasses[orb.color]} ${sizeClasses[orb.size]}`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 mesh-dawn" />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 gradient-background opacity-30" />

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={getOrbClasses(orb)}
            style={{
              left: `${orb.initialX}%`,
              top: `${orb.initialY}%`,
              animationDelay: `${orb.animationDelay}s`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
