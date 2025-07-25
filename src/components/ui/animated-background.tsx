'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Orb {
  id: number;
  color: 'blue' | 'purple' | 'pink' | 'green';
  size: 'small' | 'medium' | 'large';
  initialX: number;
  initialY: number;
  animationDelay: number;
}

export function AnimatedBackground() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

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
        {
          id: 4,
          color: 'green',
          size: 'small',
          initialX: 30,
          initialY: 50,
          animationDelay: 3.5,
        },
      ];
      setOrbs(orbConfigs);
    };

    generateOrbs();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
      green: 'orb-green',
    };

    return `floating-orb ${colorClasses[orb.color]} ${sizeClasses[orb.size]}`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Interactive Gradient Mesh Background */}
      <motion.div 
        className="absolute inset-0 mesh-dawn"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 gradient-background opacity-30" />

      {/* Floating Orbs with Parallax */}
      <div className="absolute inset-0">
        {orbs.map((orb, index) => (
          <motion.div
            key={orb.id}
            className={getOrbClasses(orb)}
            style={{
              left: `${orb.initialX}%`,
              top: `${orb.initialY}%`,
              animationDelay: `${orb.animationDelay}s`,
              x: smoothMouseX,
              y: smoothMouseY,
            }}
            animate={{
              x: smoothMouseX.get() * (0.1 + index * 0.05),
              y: smoothMouseY.get() * (0.1 + index * 0.05),
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
