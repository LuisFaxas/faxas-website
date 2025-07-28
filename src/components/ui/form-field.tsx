'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  success,
  helper,
  required,
  children,
  className
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {(error || success || helper) && (
        <div className={cn(
          "flex items-start gap-1.5 text-xs mt-1.5",
          error && "text-red-600",
          success && "text-green-600",
          !error && !success && "text-gray-500"
        )}>
          {error && <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
          {!error && !success && helper && <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
          <span>{error || success || helper}</span>
        </div>
      )}
    </div>
  );
}