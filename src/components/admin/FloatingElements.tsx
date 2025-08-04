'use client';

import { motion } from 'framer-motion';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large Gradient Orb - Top Right */}
      <motion.div
        className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-gray-200/20 dark:bg-gray-600/20 blur-3xl"
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Medium Gradient Orb - Bottom Left */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gray-300/20 dark:bg-gray-700/20 blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      {/* Small Floating Diamond - Top Left */}
      <motion.div
        className="absolute top-24 left-24 w-8 h-8 rotate-45"
        animate={{
          y: [0, -20, 0],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gray-300/20 dark:bg-gray-600/20 backdrop-blur-sm rounded-sm" />
      </motion.div>
      
      {/* Floating Triangle - Mid Right */}
      <motion.div
        className="absolute top-1/2 right-32 w-0 h-0"
        style={{
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid rgba(156, 163, 175, 0.2)',
        }}
        animate={{
          y: [0, 30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Floating Circle - Bottom Right */}
      <motion.div
        className="absolute bottom-32 right-48 w-12 h-12 rounded-full bg-gray-400/20 dark:bg-gray-500/20 backdrop-blur-sm"
        animate={{
          y: [0, -25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* Hexagon - Top Center */}
      <motion.div
        className="absolute top-32 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 60, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-20">
          <path
            d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z"
            fill="url(#hexGradient)"
            stroke="url(#hexGradient)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(156, 163, 175)" />
              <stop offset="100%" stopColor="rgb(107, 114, 128)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Floating Cross - Left Mid */}
      <motion.div
        className="absolute top-1/3 left-16 w-10 h-10"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      >
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300/30 dark:bg-gray-600/30 -translate-y-1/2" />
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gray-300/30 dark:bg-gray-600/30 -translate-x-1/2" />
      </motion.div>
    </div>
  );
}