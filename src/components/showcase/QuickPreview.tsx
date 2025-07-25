'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Eye } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { QuickPreviewConfig } from '@/types';

interface QuickPreviewProps {
  type: 'video' | 'widget' | 'carousel';
  config: QuickPreviewConfig;
  projectTitle: string;
  isActive?: boolean;
  onActivate?: () => void;
}

export function QuickPreview({ 
  type, 
  config, 
  projectTitle,
  isActive = false,
  onActivate 
}: QuickPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-play video on hover/activation
  useEffect(() => {
    if (type === 'video' && isActive) {
      setIsPlaying(true);
    }
  }, [isActive, type]);

  // Carousel auto-advance
  useEffect(() => {
    if (type === 'carousel' && isActive && config.carousel) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => 
          (prev + 1) % parseInt(config.carousel!.images.split('-')[0])
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive, type, config.carousel]);

  const renderVideo = () => {
    if (!config.video) return null;
    
    return (
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black/5">
        {/* Video Player Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            autoPlay={isActive && config.video.autoplay}
            loop
            muted
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={config.video.content} type="video/mp4" />
          </video>
        </div>
        
        {/* Play/Pause Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center"
              >
                <Play className="w-6 h-6 text-text-primary ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
          <span className="text-xs text-white font-medium">
            {config.video.duration}
          </span>
        </div>
      </div>
    );
  };

  const renderWidget = () => {
    if (!config.widget) return null;
    
    return (
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-gradient-to-br from-glass-blue/20 to-glass-purple/20 p-4">
        {/* Interactive Widget Placeholder */}
        <div className="h-full flex flex-col items-center justify-center space-y-4">
          <Eye className="w-8 h-8 text-accent-blue" />
          <div className="text-center">
            <h4 className="font-semibold text-text-primary mb-1">
              {config.widget.example}
            </h4>
            <p className="text-sm text-text-secondary">
              {config.widget.interaction}
            </p>
          </div>
          {config.widget.realtime && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-text-secondary">Real-time</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCarousel = () => {
    if (!config.carousel) return null;
    
    const imageCount = parseInt(config.carousel.images.split('-')[0]);
    
    return (
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-gray-100">
        {/* Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            {/* Image Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-glass-blue/30 to-glass-purple/30 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">
                {currentImage + 1}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {Array.from({ length: imageCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentImage === idx 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className={cn(
        "relative w-full h-full cursor-pointer",
        "transition-all duration-300",
        isActive && "scale-[1.02]"
      )}
      onMouseEnter={onActivate}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {type === 'video' && renderVideo()}
      {type === 'widget' && renderWidget()}
      {type === 'carousel' && renderCarousel()}
      
      {/* Hover Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-[24px]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
