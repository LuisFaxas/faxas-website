'use client';

import { X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { GlassButton, glass } from '@/components/ui/glass';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-xs lg:hidden"
          >
            <div className={cn(
              "h-full",
              glass.levels.strong.combined,
              glass.borders.medium,
              glass.shadows.xl,
              "border-r"
            )}>
              {/* Close button */}
              <div className="absolute right-0 top-0 p-4">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close drawer"
                  icon={<X className="w-5 h-5" />}
                />
              </div>
              
              {/* Sidebar content */}
              <div className="h-full overflow-y-auto">
                <AdminSidebar />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}