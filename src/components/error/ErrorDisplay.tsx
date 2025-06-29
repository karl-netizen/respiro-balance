
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  action?: 'retry' | 'home' | 'custom';
  onRetry?: () => void;
  onCustomAction?: () => void;
  customActionLabel?: string;
  showDetails?: boolean;
  error?: Error;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  action = 'retry',
  onRetry,
  onCustomAction,
  customActionLabel = 'Try Again',
  showDetails = false,
  error
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">{message}</p>
        
        {showDetails && error && (
          <details className="rounded bg-muted p-3">
            <summary className="cursor-pointer text-sm font-medium">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-2 justify-center">
          {action === 'retry' && (
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          {action === 'home' && (
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}
          
          {action === 'custom' && onCustomAction && (
            <Button onClick={onCustomAction}>
              {customActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const InlineError: React.FC<{
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}> = ({ message, onRetry, compact = false }) => {
  return (
    <div className={`flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg ${compact ? 'text-sm' : ''}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <span className="text-red-800">{message}</span>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
