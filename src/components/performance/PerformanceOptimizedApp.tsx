import React, { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

const PerformanceAwareLoader: React.FC<{ variant?: string }> = ({ variant = 'default' }) => {
  const { isLowPerformanceDevice, deviceType } = usePerformanceOptimization();
  
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-4 text-primary ${deviceType === 'mobile' ? 'h-6 w-6' : ''}`} />
        <p className={`text-muted-foreground ${deviceType === 'mobile' ? 'text-sm' : 'text-base'}`}>
          Loading component...
        </p>
      </div>
    </div>
  );
};

interface PerformanceOptimizedAppProps {
  children: ReactNode;
  enableOfflineIndicator?: boolean;
  enableFocusManagement?: boolean;
}

const PerformanceOptimizedApp: React.FC<PerformanceOptimizedAppProps> = ({ 
  children,
  enableOfflineIndicator = true,
  enableFocusManagement = true
}) => {
  const { getLoadingStrategy } = usePerformanceOptimization();
  const loadingStrategy = getLoadingStrategy();

  return (
    <Suspense 
      fallback={
        <PerformanceAwareLoader 
          variant={loadingStrategy === 'progressive' ? 'dashboard' : 'spinner'} 
        />
      }
    >
      {children}
    </Suspense>
  );
};

export { PerformanceOptimizedApp };