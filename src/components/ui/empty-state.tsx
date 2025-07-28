'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-12 h-12 mb-3',
      title: 'text-base',
      description: 'text-sm',
      actions: 'gap-2',
    },
    md: {
      container: 'py-12 px-6',
      icon: 'w-16 h-16 mb-4',
      title: 'text-lg',
      description: 'text-base',
      actions: 'gap-3',
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-20 h-20 mb-6',
      title: 'text-xl',
      description: 'text-base',
      actions: 'gap-4',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className
      )}
    >
      {Icon && (
        <div className="flex items-center justify-center">
          <Icon className={cn('text-gray-400', styles.icon)} />
        </div>
      )}
      
      <h3 className={cn('font-semibold text-gray-900 mb-2', styles.title)}>
        {title}
      </h3>
      
      {description && (
        <p className={cn('text-gray-600 max-w-md mb-6', styles.description)}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className={cn('flex items-center', styles.actions)}>
          {action && (
            <Button onClick={action.onClick} size={size === 'sm' ? 'sm' : 'md'}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}