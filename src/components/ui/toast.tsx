import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  onClose?: () => void;
  className?: string;
}

export function Toast({
  title,
  description,
  variant = 'default',
  onClose,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4 shadow-lg',
        {
          'bg-background text-foreground': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive':
            variant === 'destructive',
          'border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-300':
            variant === 'success',
        },
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold leading-none tracking-tight">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  );
}
