'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded-md border-2 transition-all duration-200",
              "bg-white/50 backdrop-blur-sm",
              error
                ? "border-red-300 group-hover:border-red-400"
                : "border-gray-300 group-hover:border-accent-blue/50",
              props.checked && !error && "bg-accent-blue border-accent-blue",
              props.checked && error && "bg-red-500 border-red-500",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {props.checked && (
              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
            )}
          </div>
        </div>
        {label && (
          <span className={cn(
            "text-sm",
            error ? "text-red-600" : "text-gray-700",
            props.disabled && "opacity-50"
          )}>
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };