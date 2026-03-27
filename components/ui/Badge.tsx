import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-elevated text-text-primary',
      gold: 'bg-gold bg-opacity-10 text-gold border border-gold border-opacity-30',
      success: 'bg-green-900 bg-opacity-20 text-green-400 border border-green-600',
      warning: 'bg-amber bg-opacity-10 text-amber border border-amber border-opacity-30',
      error: 'bg-red-900 bg-opacity-20 text-red-400 border border-red-600',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs font-medium',
      md: 'px-3 py-1 text-sm font-medium',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-block rounded-full border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
