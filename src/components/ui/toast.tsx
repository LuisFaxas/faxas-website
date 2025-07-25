'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { create } from 'zustand';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 5000);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div
                className={cn(
                  'max-w-sm w-full bg-white shadow-lg rounded-lg border-2 overflow-hidden',
                  toastStyles[toast.type]
                )}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{toast.title}</p>
                      {toast.message && (
                        <p className="mt-1 text-sm opacity-90">{toast.message}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="ml-4 flex-shrink-0 rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper function for easy toast creation
export const toast = {
  success: (title: string, message?: string) =>
    useToast.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useToast.getState().addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useToast.getState().addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useToast.getState().addToast({ type: 'warning', title, message }),
};