'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Play, 
  ChevronRight,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingTile } from '@/components/ui/floating-tile';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    techStack: string[];
    images: string[];
    liveUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    featured?: boolean;
    metrics?: {
      desktop: number;
      mobile: number;
      loadTime: number;
      improvement?: number;
    };
  };
  index?: number;
}

export function OptimizedProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Use a placeholder image if no images or if image fails to load
  const imageUrl = imageError || !project.images?.[0] 
    ? `https://via.placeholder.com/600x400/3b82f6/ffffff?text=${encodeURIComponent(project.title)}`
    : project.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <FloatingTile className="glass-primary overflow-hidden group cursor-pointer h-full">
          {/* Image Container */}
          <div className="relative h-48 md:h-56 overflow-hidden">
            {/* Loading Skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-glass-lighter to-glass-light animate-pulse" />
            )}
            
            {/* Optimized Image */}
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-110",
                imageLoading && "opacity-0"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              priority={index < 3} // Prioritize first 3 images
              quality={85}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 glass-accent px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Featured
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4 glass-secondary px-3 py-1 rounded-full text-xs font-medium">
              {project.category}
            </div>
            
            {/* Quick Actions - Show on Hover */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="glass-accent p-2 rounded-lg hover:scale-110 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="glass-accent p-2 rounded-lg hover:scale-110 transition-transform"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-accent p-2 rounded-lg hover:scale-110 transition-transform"
                >
                  <Play className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-blue transition-colors">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
            
            {/* Metrics */}
            {project.metrics && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-xs text-text-secondary">Load Time</p>
                  <p className="text-sm font-semibold text-green-600">
                    {project.metrics.loadTime}s
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-secondary">Performance</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {Math.round((project.metrics.desktop + project.metrics.mobile) / 2)}
                  </p>
                </div>
                {project.metrics.improvement && (
                  <div className="text-center">
                    <p className="text-xs text-text-secondary">Impact</p>
                    <p className="text-sm font-semibold text-purple-600">
                      +{project.metrics.improvement}%
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="glass-lighter px-2 py-1 rounded-md text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="glass-lighter px-2 py-1 rounded-md text-xs">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
            
            {/* View Project Link */}
            <div className="flex items-center text-accent-blue text-sm font-medium group-hover:gap-2 transition-all">
              View Project
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </FloatingTile>
      </Link>
    </motion.div>
  );
}