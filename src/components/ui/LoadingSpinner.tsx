import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}) => {
  const spinner = (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin border-4 border-primary border-t-transparent rounded-full',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse bg-muted rounded',
      className
    )}
  />
);

export const CardSkeleton: React.FC = () => (
  <div className="p-6 space-y-4">
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-3 w-1/2" />
    <SkeletonLoader className="h-3 w-2/3" />
  </div>
);