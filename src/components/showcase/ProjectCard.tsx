'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { QuickPreview } from './QuickPreview';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categoryIcons = {
    'web-app': <Code2 className="w-5 h-5" />,
    'interactive': <Sparkles className="w-5 h-5" />,
    'technical': <TrendingUp className="w-5 h-5" />
  };

  const categoryColors = {
    'web-app': 'text-accent-blue',
    'interactive': 'text-accent-purple',
    'technical': 'text-accent-green'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/projects/${project.slug}`}>
        <GlassPanel
          level="medium"
          float
          glow={project.featured}
          className="h-full flex flex-col p-0 overflow-hidden cursor-pointer"
        >
          {/* Quick Preview Section */}
          <div className="relative h-48 md:h-56 overflow-hidden">
            {project.showcase.quickPreview && (
              <QuickPreview
                type={project.showcase.quickPreview.type}
                config={{
                  [project.showcase.quickPreview.type]: project.showcase.quickPreview
                }}
                projectTitle={project.title}
                isActive={isHovered}
                onActivate={() => setShowPreview(true)}
              />
            )}
            
            {/* Featured Badge */}
            {project.featured && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="absolute top-4 left-4 z-10"
              >
                <div className="px-3 py-1 rounded-full bg-accent-blue/90 backdrop-blur-sm text-white text-xs font-medium flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured</span>
                </div>
              </motion.div>
            )}

            {/* Hook Message Overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6 pointer-events-none"
            >
              <p className="text-white font-medium">
                {project.showcase.quickPreview.hookMessage}
              </p>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 space-y-4">
            {/* Category & Title */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={cn("", categoryColors[project.category])}>
                  {categoryIcons[project.category]}
                </span>
                <span className="text-sm text-text-secondary capitalize">
                  {project.category.replace('-', ' ')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {project.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-text-secondary line-clamp-2 flex-1">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {project.technical.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-full bg-glass-light/50 text-text-secondary"
                >
                  {tech}
                </span>
              ))}
              {project.technical.stack.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-glass-light/50 text-text-secondary">
                  +{project.technical.stack.length - 3} more
                </span>
              )}
            </div>

            {/* Business Metrics */}
            {project.results.metrics.length > 0 && (
              <div className="pt-2 border-t border-glass-lighter">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-secondary">
                      {project.results.metrics[0].label}
                    </p>
                    <p className="text-sm font-semibold text-accent-green">
                      {project.results.metrics[0].value}
                    </p>
                  </div>
                  <ArrowRight className={cn(
                    "w-5 h-5 text-text-secondary transition-all",
                    "group-hover:text-accent-blue group-hover:translate-x-1"
                  )} />
                </div>
              </div>
            )}
          </div>

          {/* View Project Button (Mobile) */}
          <div className="p-4 pt-0 md:hidden">
            <Button variant="secondary" size="sm" className="w-full">
              View Project
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </GlassPanel>
      </Link>
    </motion.div>
  );
}
