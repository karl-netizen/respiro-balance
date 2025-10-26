import { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

const PerformanceAwareLoader = () => {
  const { deviceType } = usePerformanceOptimization();
  
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
}

const PerformanceOptimizedApp = ({ children }: PerformanceOptimizedAppProps) => {
  return (
    <Suspense fallback={<PerformanceAwareLoader />}>
      {children}
    </Suspense>
  );
};

export { PerformanceOptimizedApp };