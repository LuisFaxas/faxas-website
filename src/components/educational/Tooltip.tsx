'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationalTooltipProps {
  concept: string;
  simple: string;
  detailed?: string;
  example?: string;
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
}

export function EducationalTooltip({
  concept,
  simple,
  detailed,
  example,
  trigger = 'hover',
  children,
}: EducationalTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [showDetailed, setShowDetailed] = React.useState(false);

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>
          <span 
            className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-accent-blue text-accent-blue"
            onClick={trigger === 'click' ? () => setOpen(!open) : undefined}
          >
            {children}
            <HelpCircle className="w-3 h-3" />
          </span>
        </TooltipPrimitive.Trigger>
        
        <AnimatePresence>
          {open && (
            <TooltipPrimitive.Portal forceMount>
              <TooltipPrimitive.Content
                sideOffset={5}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-primary p-4 rounded-xl max-w-xs shadow-xl z-50"
                >
                  <div className="space-y-3">
                    {trigger === 'click' && (
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{concept}</h4>
                        <button
                          onClick={() => setOpen(false)}
                          className="p-1 hover:bg-glass-light rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    <p className="text-sm text-text-primary">{simple}</p>
                    
                    {example && (
                      <div className="p-2 bg-glass-blue rounded-lg">
                        <p className="text-xs text-text-secondary">
                          <span className="font-medium">Example:</span> {example}
                        </p>
                      </div>
                    )}
                    
                    {detailed && !showDetailed && (
                      <button
                        onClick={() => setShowDetailed(true)}
                        className="text-xs text-accent-blue hover:underline"
                      >
                        Learn more →
                      </button>
                    )}
                    
                    {detailed && showDetailed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="pt-2 border-t border-glass-lighter"
                      >
                        <p className="text-xs text-text-secondary">{detailed}</p>
                      </motion.div>
                    )}
                  </div>
                  
                  <TooltipPrimitive.Arrow className="fill-white" />
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

// Pre-configured tooltips for common concepts
export const tooltips = {
  react: {
    concept: "React",
    simple: "A technology that makes websites update instantly without refreshing.",
    detailed: "React is used by Facebook, Instagram, and Netflix to create smooth, app-like experiences.",
    example: "Like when you 'like' a post on Instagram - it updates instantly!"
  },
  api: {
    concept: "API",
    simple: "A way for your website to talk to other services (like payment systems).",
    detailed: "APIs let your site connect to services like Stripe for payments, Google for maps, or Instagram for photos.",
    example: "When you pay with PayPal, the API handles the secure connection."
  },
  responsive: {
    concept: "Responsive Design",
    simple: "Your website automatically adjusts to look perfect on any device.",
    detailed: "Whether someone visits on a phone, tablet, or computer, everything will be perfectly sized and easy to use.",
    example: "Try resizing your browser window - see how everything adapts!"
  },
  seo: {
    concept: "SEO",
    simple: "Making sure Google can find and recommend your website.",
    detailed: "We optimize your site's code, content, and speed so you appear higher in search results.",
    example: "When someone searches 'best bakery near me', good SEO helps you show up first."
  },
  hosting: {
    concept: "Cloud Hosting",
    simple: "Your website lives on super-fast servers that never go down.",
    detailed: "Using services like AWS or Vercel, your site loads quickly from locations worldwide.",
    example: "Like Netflix - available 24/7, fast everywhere, handles millions of visitors."
  }
};