'use client';

import { forwardRef, HTMLAttributes, useEffect, useRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { glass } from '@/lib/design-system/glass-morphism';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassButton } from './GlassButton';

export interface GlassModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4'
};

export const GlassModal = forwardRef<HTMLDivElement, GlassModalProps>(
  ({ 
    className,
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
    footer,
    children,
    ...props 
  }, ref) => {
    const modalId = useId();
    const titleId = `${modalId}-title`;
    const descriptionId = `${modalId}-description`;
    const previousActiveElement = useRef<HTMLElement | null>(null);
    // Lock body scroll when modal is open and manage focus
    useEffect(() => {
      if (isOpen) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        
        // Focus trap - focus the modal content
        const modalContent = document.getElementById(modalId);
        if (modalContent) {
          const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusable = focusableElements[0] as HTMLElement;
          const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          // Focus the first focusable element
          setTimeout(() => firstFocusable?.focus(), 100);
          
          // Handle tab key for focus trap
          const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
              if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
              }
            } else {
              if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
              }
            }
          };
          
          document.addEventListener('keydown', handleTab);
          return () => document.removeEventListener('keydown', handleTab);
        }
      } else {
        document.body.style.overflow = '';
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
          previousActiveElement.current = null;
        }
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen, modalId]);
    
    // Handle escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'fixed inset-0 z-50',
                glass.styles.modal.overlay
              )}
              onClick={closeOnOverlayClick ? onClose : undefined}
              aria-hidden="true"
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                ref={ref}
                id={modalId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                  'relative w-full',
                  sizes[size],
                  glass.styles.modal.content,
                  glass.spacing.lg,
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
                  className
                )}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClick?.(e as any);
                }}
                tabIndex={-1}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {title && (
                        <h2 
                          id={titleId}
                          className={cn(
                          'text-xl font-semibold',
                          glass.text.primary
                        )}>
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p 
                          id={descriptionId}
                          className={cn(
                          'mt-1 text-sm',
                          glass.text.secondary
                        )}>
                          {description}
                        </p>
                      )}
                    </div>
                    
                    {showCloseButton && (
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="ml-4"
                        icon={<X className="w-4 h-4" />}
                        aria-label="Close modal"
                      />
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className={cn(
                  (title || showCloseButton) && footer && 'my-4'
                )}>
                  {children}
                </div>
                
                {/* Footer */}
                {footer && (
                  <div className={cn(
                    'flex items-center justify-end gap-2 mt-6 pt-4',
                    'border-t',
                    glass.borders.subtle
                  )}>
                    {footer}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

GlassModal.displayName = 'GlassModal';

// Dialog variant with built-in actions
export interface GlassDialogProps extends Omit<GlassModalProps, 'footer'> {
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
}

export const GlassDialog = forwardRef<HTMLDivElement, GlassDialogProps>(
  ({ 
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'primary',
    loading = false,
    ...props 
  }, ref) => {
    return (
      <GlassModal
        ref={ref}
        footer={
          <>
            <GlassButton
              variant="ghost"
              onClick={props.onClose}
              disabled={loading}
            >
              {cancelText}
            </GlassButton>
            {onConfirm && (
              <GlassButton
                variant={confirmVariant}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmText}
              </GlassButton>
            )}
          </>
        }
        {...props}
      />
    );
  }
);

GlassDialog.displayName = 'GlassDialog';