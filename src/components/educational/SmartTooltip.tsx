'use client';

import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, TrendingUp, Code, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartTooltipProps } from '@/types';
import { GlassPanel } from '@/components/ui/glass/glass-panel';

export function SmartTooltip({ 
  term, 
  concept, 
  userLevel = 'novice',
  children 
}: SmartTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'simple' | 'detailed' | 'businessValue'>('simple');

  const getInitialView = () => {
    switch (userLevel) {
      case 'novice': return 'simple';
      case 'intermediate': return 'businessValue';
      case 'advanced': return 'detailed';
      default: return 'simple';
    }
  };

  const viewIcons = {
    simple: <HelpCircle className="w-4 h-4" />,
    detailed: <Code className="w-4 h-4" />,
    businessValue: <TrendingUp className="w-4 h-4" />
  };

  const viewLabels = {
    simple: 'Simple',
    detailed: 'Technical',
    businessValue: 'Business Value'
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip.Trigger asChild>
          <span className={cn(
            "underline decoration-dotted decoration-accent-blue/50 underline-offset-4",
            "cursor-help transition-all hover:decoration-accent-blue",
            "hover:text-accent-blue"
          )}>
            {children}
          </span>
        </Tooltip.Trigger>
        
        <AnimatePresence>
          {isOpen && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                sideOffset={5}
                className="z-50"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    duration: 0.2 
                  }}
                >
                  <GlassPanel 
                    level="heavy" 
                    className="max-w-sm p-4 shadow-xl"
                  >
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-text-primary capitalize">
                        {term}
                      </h4>
                      
                      {/* View Switcher */}
                      <div className="flex items-center gap-1 mt-2">
                        {(['simple', 'detailed', 'businessValue'] as const).map((view) => (
                          <button
                            key={view}
                            onClick={() => setCurrentView(view)}
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                              "transition-all duration-200",
                              currentView === view
                                ? "bg-accent-blue/20 text-accent-blue"
                                : "text-text-secondary hover:bg-glass-light/50"
                            )}
                          >
                            {viewIcons[view]}
                            <span>{viewLabels[view]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentView}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {typeof concept === 'string' ? concept : concept[currentView]}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Learn More Link */}
                    <div className="mt-3 pt-3 border-t border-glass-lighter">
                      <button className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue/80 transition-colors">
                        <span>Explore examples</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent rounded-full" />
                  </GlassPanel>
                </motion.div>
                
                <Tooltip.Arrow className="fill-white/85" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
