'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Zap, 
  Clock, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { ComparisonWidgetProps } from '@/types';

export function ComparisonWidget({
  title,
  traditional,
  modern,
  businessImpact
}: ComparisonWidgetProps) {
  const [activeView, setActiveView] = useState<'traditional' | 'modern'>('traditional');
  const [isInteracting, setIsInteracting] = useState(false);

  const handleSwitch = () => {
    setActiveView(prev => prev === 'traditional' ? 'modern' : 'traditional');
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary">
          See the difference modern development makes
        </p>
      </div>

      {/* Comparison Container */}
      <div className="relative">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-full bg-glass-light/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveView('traditional')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeView === 'traditional'
                  ? "bg-white shadow-sm text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Traditional
            </button>
            <button
              onClick={() => setActiveView('modern')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeView === 'modern'
                  ? "bg-white shadow-sm text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Modern
            </button>
          </div>
        </div>

        {/* Demo Area */}
        <GlassPanel level="light" className="relative h-[400px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: activeView === 'modern' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeView === 'modern' ? -100 : 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 p-8"
            >
              {activeView === 'traditional' ? (
                <div className="h-full flex flex-col">
                  {/* Traditional Demo */}
                  <div className="flex-1">
                    {traditional.demo || (
                      <div className="h-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <RefreshCw className="w-16 h-16 text-gray-400 mx-auto animate-spin" />
                          <p className="text-gray-600 font-medium">Loading...</p>
                          <p className="text-sm text-gray-500">Page refresh required</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Traditional Issues */}
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-text-primary flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-accent-orange" />
                      Common Issues
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {traditional.issues.map((issue, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <span className="text-accent-red mt-0.5">✕</span>
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                    {traditional.time && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Average time: {traditional.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Modern Demo */}
                  <div className="flex-1">
                    {modern.demo || (
                      <div className="h-full rounded-lg bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Zap className="w-16 h-16 text-accent-blue mx-auto" />
                          <p className="text-text-primary font-medium">Instant Updates</p>
                          <p className="text-sm text-text-secondary">No refresh needed</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modern Benefits */}
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-text-primary flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {modern.benefits.map((benefit, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <span className="text-accent-green mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    {modern.time && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Average time: {modern.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Interactive Switch Button */}
          <motion.button
            onClick={handleSwitch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 z-10"
          >
            <GlassPanel 
              level="medium" 
              className="px-4 py-2 flex items-center gap-2"
            >
              <span className="text-sm font-medium">Try {activeView === 'traditional' ? 'Modern' : 'Traditional'}</span>
              <ArrowRight className="w-4 h-4" />
            </GlassPanel>
          </motion.button>
        </GlassPanel>

        {/* Business Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <GlassPanel level="heavy" className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              <h4 className="font-semibold text-text-primary">Business Impact</h4>
            </div>
            <p className="text-lg text-text-primary">
              {businessImpact}
            </p>
            <motion.div
              animate={isInteracting ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Button variant="primary" size="sm">
                See This in Your Business
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
