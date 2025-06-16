
import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface MobileErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const { deviceType } = useDeviceDetection();
  
  const isMobile = deviceType === 'mobile';
  
  return (
    <Card className={`border-red-200 ${isMobile ? 'm-2' : 'm-4'}`}>
      <CardHeader className={isMobile ? 'pb-2 px-4 pt-4' : 'pb-4'}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <AlertTriangle className={`text-red-500 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'px-4 pb-4' : 'p-6 pt-0'}>
        <div className={`space-y-${isMobile ? '3' : '4'}`}>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            We're sorry, but something unexpected happened. You can try refreshing the page or go back to the home screen.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                Error details (development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <TouchFriendlyButton
              onClick={resetError}
              variant="default"
              className={`flex items-center gap-2 ${isMobile ? 'h-12' : ''}`}
              hapticFeedback={true}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </TouchFriendlyButton>
            
            <TouchFriendlyButton
              onClick={() => window.location.href = '/'}
              variant="outline"
              className={`flex items-center gap-2 ${isMobile ? 'h-12' : ''}`}
              hapticFeedback={true}
            >
              <Home className="h-4 w-4" />
              Go Home
            </TouchFriendlyButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

class MobileErrorBoundary extends Component<MobileErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mobile Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export { MobileErrorBoundary, DefaultErrorFallback };
