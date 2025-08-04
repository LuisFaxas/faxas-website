'use client';

import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  animate?: boolean;
}

export function Sparkline({ 
  data, 
  width = 100, 
  height = 24, 
  color = 'blue',
  animate = true 
}: SparklineProps) {
  // Normalize data
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Calculate points for smooth curve
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return { x, y };
  });
  
  // Create smooth path using quadratic bezier curves
  let pathData = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const xMid = (points[i - 1].x + points[i].x) / 2;
    const yMid = (points[i - 1].y + points[i].y) / 2;
    const cp1x = (xMid + points[i - 1].x) / 2;
    const cp2x = (xMid + points[i].x) / 2;
    
    pathData += ` Q ${cp1x} ${points[i - 1].y}, ${xMid} ${yMid}`;
    pathData += ` Q ${cp2x} ${points[i].y}, ${points[i].x} ${points[i].y}`;
  }
  
  // Create area path for gradient fill
  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`;
  
  // Color schemes
  const colors = {
    blue: { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)' },
    purple: { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.1)' },
    green: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.1)' },
    red: { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.1)' },
    orange: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.1)' }
  };
  
  const selectedColor = colors[color as keyof typeof colors] || colors.blue;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Gradient fill */}
      <motion.path
        d={areaPath}
        fill={selectedColor.fill}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Smooth line */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={selectedColor.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ 
          pathLength: { duration: animate ? 1 : 0, ease: "easeOut" },
          opacity: { duration: 0.3 }
        }}
      />
    </svg>
  );
}