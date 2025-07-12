import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button';
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text',
  lines = 1 
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    avatar: "h-10 w-10 rounded-full",
    card: "h-32 w-full",
    button: "h-10 w-24"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses.text,
              i === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  );
};

export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export const LoadingDots: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  fallback,
  delay = 0,
  className,
  variant = 'spinner',
  size = 'md',
  text
}) => {
  const [showLoading, setShowLoading] = React.useState(!delay);

  React.useEffect(() => {
    if (delay > 0 && isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay);
      return () => clearTimeout(timer);
    }
    setShowLoading(isLoading);
  }, [isLoading, delay]);

  if (!isLoading) {
    return <>{children}</>;
  }

  if (!showLoading) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const renderLoadingVariant = () => {
    switch (variant) {
      case 'skeleton':
        return <Skeleton className={className} />;
      case 'pulse':
        return (
          <div className={cn("animate-pulse bg-gray-200 rounded", className)}>
            <div className="h-full w-full" />
          </div>
        );
      case 'dots':
        return <LoadingDots size={size} className={className} />;
      default:
        return <LoadingSpinner size={size} className={className} text={text} />;
    }
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      {renderLoadingVariant()}
    </div>
  );
};

export default LoadingState;