import { useEffect, useState } from 'react';

/**
 * Hook to detect device performance and optimize glass morphism effects
 * Returns optimization level based on device capabilities
 */
export function useGlassPerformance() {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Detect performance level
    const detectPerformance = () => {
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory && deviceMemory < 4) {
        setPerformanceLevel('low');
        return;
      }

      // Check hardware concurrency (CPU cores)
      const hardwareConcurrency = navigator.hardwareConcurrency;
      if (hardwareConcurrency && hardwareConcurrency < 4) {
        setPerformanceLevel('medium');
        return;
      }

      // Check connection type
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setPerformanceLevel('low');
          return;
        } else if (effectiveType === '3g') {
          setPerformanceLevel('medium');
          return;
        }
      }

      // Test CSS performance
      testCSSPerformance();
    };

    const testCSSPerformance = () => {
      // Create test element with heavy glass effects
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: fixed;
        top: -9999px;
        width: 200px;
        height: 200px;
        backdrop-filter: blur(20px);
        transform: translateZ(0);
      `;
      document.body.appendChild(testElement);

      // Measure paint performance
      const startTime = performance.now();
      
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        // Clean up
        document.body.removeChild(testElement);
        
        // Set performance level based on render time
        if (renderTime > 50) {
          setPerformanceLevel('low');
        } else if (renderTime > 20) {
          setPerformanceLevel('medium');
        } else {
          setPerformanceLevel('high');
        }
      });
    };

    detectPerformance();

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return {
    performanceLevel,
    isReducedMotion,
    shouldReduceEffects: performanceLevel === 'low' || isReducedMotion,
    shouldOptimizeAnimations: performanceLevel !== 'high',
  };
}

/**
 * Get optimized glass styles based on performance level
 */
export function getOptimizedGlassStyles(
  baseStyles: string,
  performanceLevel: 'high' | 'medium' | 'low'
): string {
  if (performanceLevel === 'low') {
    // Replace backdrop-blur with simple opacity
    return baseStyles
      .replace(/backdrop-blur-[a-z]+/g, '')
      .replace(/bg-white\/\[0\.\d+\]/g, 'bg-white/10')
      .replace(/dark:bg-white\/\[0\.\d+\]/g, 'dark:bg-white/5');
  }
  
  if (performanceLevel === 'medium') {
    // Reduce blur intensity
    return baseStyles
      .replace(/backdrop-blur-2xl/g, 'backdrop-blur-lg')
      .replace(/backdrop-blur-xl/g, 'backdrop-blur-md')
      .replace(/backdrop-blur-lg/g, 'backdrop-blur-sm');
  }
  
  return baseStyles;
}