
import React, { Suspense, lazy, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { MobileErrorBoundary } from '@/components/ui/mobile-error-boundary';
import { MobileLoadingState } from '@/components/ui/mobile-loading-states';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { FocusManager } from '@/components/accessibility/FocusManager';
import { ScreenReaderAnnouncements } from '@/components/accessibility/ScreenReaderAnnouncements';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

// Lazy load heavy components with performance considerations
const BiofeedbackAnalytics = lazy(() => 
  import('@/components/analytics/BiofeedbackAnalytics').then(module => ({
    default: module.default
  }))
);

const LazyMeditationPlayer = lazy(() => 
  import('./LazyMeditationPlayer').then(module => ({
    default: module.default
  }))
);

// Performance-aware loading component
const PerformanceAwareLoader: React.FC<{ variant?: string }> = ({ variant = 'default' }) => {
  const { isLowPerformanceDevice, deviceType } = usePerformanceOptimization();
  
  if (isLowPerformanceDevice) {
    return <MobileLoadingState variant="spinner" title="Loading..." />;
  }
  
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
  children: React.ReactNode;
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

  const AppContent = () => (
    <>
      {enableOfflineIndicator && <OfflineIndicator />}
      <ScreenReaderAnnouncements />
      {enableFocusManagement ? (
        <FocusManager autoFocus={false} restoreFocus={true}>
          {children}
        </FocusManager>
      ) : (
        children
      )}
    </>
  );

  return (
    <MobileErrorBoundary>
      <Suspense 
        fallback={
          <PerformanceAwareLoader 
            variant={loadingStrategy === 'progressive' ? 'dashboard' : 'spinner'} 
          />
        }
      >
        <AppContent />
      </Suspense>
    </MobileErrorBoundary>
  );
};

export { PerformanceOptimizedApp, BiofeedbackAnalytics, LazyMeditationPlayer };
