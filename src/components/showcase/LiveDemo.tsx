'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Monitor, 
  Smartphone, 
  Tablet,
  ExternalLink,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingTile } from '@/components/ui/floating-tile';

interface LiveDemoProps {
  title: string;
  description: string;
  demoUrl: string;
  videoUrl?: string;
  mobileOptimized?: boolean;
  loadTime?: string;
  techStack?: string[];
  metrics?: {
    desktop: number;
    mobile: number;
  };
}

export function LiveDemo({
  title,
  description,
  demoUrl,
  videoUrl,
  mobileOptimized = true,
  loadTime = "0.8s",
  techStack = [],
  metrics
}: LiveDemoProps) {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const viewportSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '1024px', scale: 0.7 },
    mobile: { width: '375px', height: '667px', scale: 0.8 }
  };

  const currentSize = viewportSizes[view];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-text-secondary">{description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Device Switcher */}
          <div className="glass-secondary p-1 rounded-lg flex">
            <button
              onClick={() => setView('desktop')}
              className={cn(
                "p-2 rounded-md transition-all",
                view === 'desktop' ? "bg-white shadow-sm" : "hover:bg-glass-light"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('tablet')}
              className={cn(
                "p-2 rounded-md transition-all",
                view === 'tablet' ? "bg-white shadow-sm" : "hover:bg-glass-light"
              )}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('mobile')}
              className={cn(
                "p-2 rounded-md transition-all",
                view === 'mobile' ? "bg-white shadow-sm" : "hover:bg-glass-light"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          
          {/* External Link */}
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-accent p-2 rounded-lg hover:scale-105 transition-transform"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FloatingTile className="glass-secondary p-3 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-green-600" />
          <p className="text-xs text-text-secondary">Load Time</p>
          <p className="font-semibold">{loadTime}</p>
        </FloatingTile>
        
        {metrics && (
          <>
            <FloatingTile className="glass-secondary p-3 text-center">
              <Monitor className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-text-secondary">Desktop Score</p>
              <p className="font-semibold text-green-600">{metrics.desktop}/100</p>
            </FloatingTile>
            
            <FloatingTile className="glass-secondary p-3 text-center">
              <Smartphone className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-text-secondary">Mobile Score</p>
              <p className="font-semibold text-green-600">{metrics.mobile}/100</p>
            </FloatingTile>
          </>
        )}
        
        <FloatingTile className="glass-secondary p-3 text-center">
          <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-600" />
          <p className="text-xs text-text-secondary">Optimized</p>
          <p className="font-semibold">✓ {view}</p>
        </FloatingTile>
      </div>

      {/* Demo Container */}
      <div className="relative">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "glass-primary p-4 rounded-2xl overflow-hidden",
            view !== 'desktop' && "flex justify-center"
          )}
        >
          {/* Demo Controls */}
          {videoUrl && (
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="glass-accent p-2 rounded-lg hover:scale-105 transition-transform"
              >
                {showVideo ? 'Live Demo' : 'Watch Video'}
              </button>
              {showVideo && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="glass-accent p-2 rounded-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}
            </div>
          )}

          {/* Demo Content */}
          <AnimatePresence mode="wait">
            {showVideo && videoUrl ? (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-lg overflow-hidden"
                style={{ 
                  width: view === 'desktop' ? '100%' : currentSize.width,
                  height: currentSize.height
                }}
              >
                <video
                  src={videoUrl}
                  controls={isPlaying}
                  autoPlay={isPlaying}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                key="iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "relative rounded-lg overflow-hidden bg-white",
                  view !== 'desktop' && "transform origin-top-left"
                )}
                style={{ 
                  width: currentSize.width,
                  height: currentSize.height,
                  transform: view !== 'desktop' ? `scale(${currentSize.scale})` : undefined
                }}
              >
                <iframe
                  src={demoUrl}
                  className="w-full h-full"
                  title={`${title} Demo`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
                
                {/* Loading Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none opacity-0 transition-opacity">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Loading demo...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile Warning */}
        {view === 'mobile' && !mobileOptimized && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p className="text-sm text-yellow-800">
              ⚠️ This demo isn't fully optimized for mobile yet. View on desktop for the best experience.
            </p>
          </motion.div>
        )}
      </div>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-text-secondary">Built with:</span>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="glass-secondary px-3 py-1 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}