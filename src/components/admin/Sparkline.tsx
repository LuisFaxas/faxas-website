'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  animate?: boolean;
}

export function Sparkline({ 
  data, 
  width = 100, 
  height = 30, 
  color = 'from-accent-blue to-accent-purple',
  showDots = false,
  animate = true 
}: SparklineProps) {
  // Normalize data to fit within the height
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });
  
  // Create SVG path
  const pathData = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, '');
  
  // Create area path (for gradient fill)
  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={cn("text-blue-500", color.includes('blue') && "text-blue-500")} stopColor="currentColor" />
            <stop offset="100%" className={cn("text-purple-500", color.includes('purple') && "text-purple-500")} stopColor="currentColor" />
          </linearGradient>
          <linearGradient id={`gradient-fill-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={cn("text-blue-500/20", color.includes('blue') && "text-blue-500/20")} stopColor="currentColor" />
            <stop offset="100%" className={cn("text-purple-500/0", color.includes('purple') && "text-purple-500/0")} stopColor="currentColor" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#gradient-fill-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animate ? 1 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Dots */}
        {showDots && points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            className="fill-white stroke-accent-blue"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + (index * 0.1), type: "spring" }}
          />
        ))}
        
        {/* Latest value indicator */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          className="fill-accent-purple"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1.5, duration: 0.5 }}
        />
      </svg>
      
      {/* Trend indicator */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2">
        {data[data.length - 1] > data[data.length - 2] ? (
          <span className="text-green-500 text-xs">↑</span>
        ) : (
          <span className="text-red-500 text-xs">↓</span>
        )}
      </div>
    </div>
  );
}