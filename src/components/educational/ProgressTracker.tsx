'use client';

import { motion } from 'framer-motion';
import { Brain, Lightbulb, Trophy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/glass/glass-panel';

interface ConceptProgress {
  id: string;
  name: string;
  understood: boolean;
  viewedAt?: Date;
}

interface ProgressTrackerProps {
  concepts: ConceptProgress[];
  totalConcepts: number;
  className?: string;
  compact?: boolean;
}

export function ProgressTracker({ 
  concepts, 
  totalConcepts,
  className,
  compact = false
}: ProgressTrackerProps) {
  const understoodCount = concepts.filter(c => c.understood).length;
  const progressPercentage = (understoodCount / totalConcepts) * 100;
  
  const getMilestoneIcon = () => {
    if (progressPercentage === 100) return <Trophy className="w-5 h-5" />;
    if (progressPercentage >= 75) return <TrendingUp className="w-5 h-5" />;
    if (progressPercentage >= 50) return <Lightbulb className="w-5 h-5" />;
    return <Brain className="w-5 h-5" />;
  };

  const getMilestoneText = () => {
    if (progressPercentage === 100) return "Expert Level! 🎉";
    if (progressPercentage >= 75) return "Almost There!";
    if (progressPercentage >= 50) return "Great Progress!";
    if (progressPercentage >= 25) return "Keep Learning!";
    return "Just Getting Started";
  };

  const getMilestoneColor = () => {
    if (progressPercentage === 100) return "text-accent-purple";
    if (progressPercentage >= 75) return "text-accent-green";
    if (progressPercentage >= 50) return "text-accent-blue";
    return "text-text-secondary";
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("inline-flex items-center gap-2", className)}
      >
        <div className={cn("transition-colors", getMilestoneColor())}>
          {getMilestoneIcon()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            {understoodCount}/{totalConcepts}
          </span>
          <span className="text-xs text-text-secondary">concepts learned</span>
        </div>
      </motion.div>
    );
  }

  return (
    <GlassPanel level="light" className={cn("p-6", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("transition-colors", getMilestoneColor())}>
              {getMilestoneIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Your Learning Journey
              </h3>
              <p className="text-sm text-text-secondary">
                {getMilestoneText()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-text-primary">
              {understoodCount}
            </p>
            <p className="text-xs text-text-secondary">
              of {totalConcepts} concepts
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-glass-lighter rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20,
              delay: 0.2 
            }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
          />
          
          {/* Milestone Markers */}
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-full bg-white/50"
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>

        {/* Recent Concepts */}
        {concepts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">
              Recently Learned
            </p>
            <div className="flex flex-wrap gap-2">
              {concepts
                .filter(c => c.understood)
                .slice(-3)
                .map((concept) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-xs font-medium"
                  >
                    ✓ {concept.name}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        {progressPercentage < 100 && progressPercentage > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-text-secondary text-center pt-2"
          >
            💡 Keep exploring projects to unlock more concepts!
          </motion.p>
        )}
      </div>
    </GlassPanel>
  );
}
