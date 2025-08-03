import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <DefaultFallback />,
  className = ""
}) => {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
};

export default LazyWrapper;