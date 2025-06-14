
import React, { Suspense, lazy, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';

// Lazy load heavy components
const BiofeedbackAnalytics = lazy(() => import('@/components/analytics/BiofeedbackAnalytics'));
const LazyMeditationPlayer = lazy(() => import('./LazyMeditationPlayer'));

// Simple error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SimpleErrorBoundary extends React.Component<
  { children: ReactNode; fallback: (error: Error, resetError: () => void) => ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.resetError);
    }

    return this.props.children;
  }
}

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
    <SimpleErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<GlobalLoader />}>
        {children}
      </Suspense>
    </SimpleErrorBoundary>
  );
};

export { PerformanceOptimizedApp, BiofeedbackAnalytics, LazyMeditationPlayer };
