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
      gold: 'bg-gold/10 text-gold border border-gold/30',
      success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-600/50',
      warning: 'bg-amber/10 text-amber border border-amber/30',
      error: 'bg-red-500/10 text-red-600 border border-red-400/40 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600/50',
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
