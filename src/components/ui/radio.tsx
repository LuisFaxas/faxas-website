'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 transition-all duration-200",
              "bg-white/50 backdrop-blur-sm",
              error
                ? "border-red-300 group-hover:border-red-400"
                : "border-gray-300 group-hover:border-accent-blue/50",
              props.checked && !error && "border-accent-blue",
              props.checked && error && "border-red-500",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {props.checked && (
              <div className={cn(
                "w-2.5 h-2.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                error ? "bg-red-500" : "bg-accent-blue"
              )} />
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
Radio.displayName = 'Radio';

export { Radio };