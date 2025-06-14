
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';

// Lazy load heavy components
const BiofeedbackAnalytics = lazy(() => import('@/components/analytics/BiofeedbackAnalytics'));
const LazyMeditationPlayer = lazy(() => import('./LazyMeditationPlayer'));

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <Card className="border-red-200">
    <CardContent className="p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </CardContent>
  </Card>
);

// Global loading fallback
const GlobalLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-sm text-muted-foreground">Loading component...</p>
    </div>
  </div>
);

interface PerformanceOptimizedAppProps {
  children: React.ReactNode;
}

const PerformanceOptimizedApp: React.FC<PerformanceOptimizedAppProps> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<GlobalLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export { PerformanceOptimizedApp, BiofeedbackAnalytics, LazyMeditationPlayer };
