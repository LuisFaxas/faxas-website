'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Play, 
  ChevronRight,
  Zap,
  Rocket,
  Code2,
  Gauge,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    techStack: string[];
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
    gradient?: string;
  };
  index?: number;
}

const defaultGradients = [
  'from-blue-500/20 to-purple-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-green-500/20 to-blue-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-cyan-500/20 to-blue-500/20',
];

const techIcons: Record<string, string> = {
  'React': '⚛️',
  'Next.js': '▲',
  'TypeScript': '🔷',
  'Firebase': '🔥',
  'Tailwind CSS': '🎨',
  'Node.js': '🟢',
  'MongoDB': '🍃',
  'PostgreSQL': '🐘',
  'Python': '🐍',
  'AWS': '☁️',
};

export function GlassmorphicProjectCard({ project, index = 0 }: ProjectCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const gradient = project.gradient || defaultGradients[index % defaultGradients.length];
  
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    router.push(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="glass-primary group cursor-pointer h-full rounded-2xl overflow-hidden relative"
        onClick={handleCardClick}
      >
        {/* Gradient Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-500",
          gradient,
          isHovered && "opacity-50"
        )} />
        
        {/* Content */}
        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {project.featured && (
                <div className="inline-flex items-center gap-1 glass-accent px-3 py-1 rounded-full text-xs font-medium mb-2">
                  <Zap className="w-3 h-3" />
                  Featured Project
                </div>
              )}
              <h3 className="text-2xl font-bold mb-1 group-hover:text-accent-blue transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary">{project.category}</p>
            </div>
            
            {/* Metric Hero */}
            {project.metrics && (
              <div className="text-center glass-lighter p-3 rounded-xl">
                <Gauge className="w-6 h-6 mx-auto mb-1 text-accent-blue" />
                <div className="text-2xl font-bold text-accent-blue">
                  {Math.round((project.metrics.desktop + project.metrics.mobile) / 2)}
                </div>
                <div className="text-xs text-text-secondary">Score</div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-text-secondary mb-6 flex-grow">
            {project.description}
          </p>
          
          {/* Tech Stack with Icons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="glass-lighter px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
              >
                <span className="text-base">{techIcons[tech] || '💻'}</span>
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className="glass-lighter px-3 py-1.5 rounded-lg text-sm">
                +{project.techStack.length - 5} more
              </span>
            )}
          </div>
          
          {/* Metrics Bar */}
          {project.metrics && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="glass-lighter p-3 rounded-lg text-center">
                <Monitor className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <div className="text-lg font-semibold">{project.metrics.desktop}</div>
                <div className="text-xs text-text-secondary">Desktop</div>
              </div>
              <div className="glass-lighter p-3 rounded-lg text-center">
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-lg font-semibold">{project.metrics.mobile}</div>
                <div className="text-xs text-text-secondary">Mobile</div>
              </div>
              <div className="glass-lighter p-3 rounded-lg text-center">
                <Rocket className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                <div className="text-lg font-semibold">{project.metrics.loadTime}s</div>
                <div className="text-xs text-text-secondary">Load Time</div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="glass-accent p-2.5 rounded-lg hover:scale-110 transition-all"
                  aria-label="View live site"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="glass-accent p-2.5 rounded-lg hover:scale-110 transition-all"
                  aria-label="View source code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="glass-accent p-2.5 rounded-lg hover:scale-110 transition-all"
                  aria-label="View demo"
                >
                  <Play className="w-4 h-4" />
                </a>
              )}
            </div>
            
            {/* View Details */}
            <motion.div 
              className="flex items-center text-accent-blue text-sm font-medium"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
