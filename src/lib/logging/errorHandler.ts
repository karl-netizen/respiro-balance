/**
 * Production error handling and monitoring system
 */

import React from 'react';
import { logger } from './logger';

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'route' | 'feature' | 'component';
}

export class ProductionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { level = 'component', onError } = this.props;
    
    // Log to our centralized logging system
    logger.error(`React Error Boundary [${level}]`, error, {
      component: 'ErrorBoundary',
      feature: 'errorHandling',
      level,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    logger.info('User initiated error recovery', {
      component: 'ErrorBoundary',
      feature: 'errorRecovery',
      errorId: this.state.errorId
    });
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return React.createElement(Fallback, { error: this.state.error, retry: this.handleRetry });
      }

      // Default error UI
      return React.createElement('div', 
        { className: 'error-boundary-container p-8 text-center' },
        React.createElement('h2', 
          { className: 'text-2xl font-bold text-red-600 mb-4' }, 
          'Something went wrong'
        ),
        React.createElement('p', 
          { className: 'text-gray-600 mb-4' },
          'We\'re sorry, but something unexpected happened. Please try refreshing the page.'
        ),
        React.createElement('button', 
          {
            onClick: this.handleRetry,
            className: 'bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
          },
          'Try Again'
        )
      );
    }

    return this.props.children;
  }
}

// Async error handler for promises and async operations
export const handleAsyncError = (error: Error, context?: Record<string, any>) => {
  logger.error('Async Operation Failed', error, {
    component: 'AsyncErrorHandler',
    feature: 'errorHandling',
    ...context
  });
};

// Network error handler
export const handleNetworkError = (error: Error, request: { url: string; method: string }) => {
  logger.error('Network Request Failed', error, {
    component: 'NetworkErrorHandler',
    feature: 'network',
    url: request.url,
    method: request.method,
    isOnline: navigator.onLine
  });
};