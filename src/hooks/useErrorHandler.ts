import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  retryLimit?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

interface ErrorHandlerState {
  error: Error | null;
  isLoading: boolean;
  retryCount: number;
  hasError: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    retryLimit = 3,
    retryDelay = 1000,
    onError
  } = options;

  const [state, setState] = useState<ErrorHandlerState>({
    error: null,
    isLoading: false,
    retryCount: 0,
    hasError: false
  });

  const handleError = useCallback((error: Error | unknown) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (logToConsole) {
      console.error('Error caught by useErrorHandler:', errorObj);
    }

    setState(prev => ({
      ...prev,
      error: errorObj,
      hasError: true,
      isLoading: false
    }));

    if (showToast) {
      toast({
        title: 'Something went wrong',
        description: getErrorMessage(errorObj),
        variant: 'destructive',
      });
    }

    onError?.(errorObj);
  }, [showToast, logToConsole, onError]);

  const retry = useCallback(async (operation: () => Promise<any>) => {
    if (state.retryCount >= retryLimit) {
      handleError(new Error('Maximum retry attempts reached'));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      retryCount: prev.retryCount + 1
    }));

    try {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      const result = await operation();
      
      setState(prev => ({
        ...prev,
        error: null,
        hasError: false,
        isLoading: false
      }));

      return result;
    } catch (error) {
      handleError(error);
    }
  }, [state.retryCount, retryLimit, retryDelay, handleError]);

  const reset = useCallback(() => {
    setState({
      error: null,
      isLoading: false,
      retryCount: 0,
      hasError: false
    });
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, hasError: false }));
    
    try {
      const result = await operation();
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [handleError]);

  return {
    ...state,
    handleError,
    retry,
    reset,
    executeWithErrorHandling,
    canRetry: state.retryCount < retryLimit
  };
};

// Network-specific error handler
export const useNetworkErrorHandler = () => {
  const baseHandler = useErrorHandler({
    retryLimit: 3,
    retryDelay: 2000,
  });

  const handleNetworkOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    fallbackData?: T
  ): Promise<T | null> => {
    try {
      return await baseHandler.executeWithErrorHandling(operation);
    } catch (error) {
      if (isNetworkError(error)) {
        toast({
          title: 'Connection Issue',
          description: 'Please check your internet connection and try again.',
          variant: 'destructive',
        });
      }
      
      return fallbackData || null;
    }
  }, [baseHandler]);

  return {
    ...baseHandler,
    handleNetworkOperation
  };
};

// Utility functions
export const getErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      return 'Network connection failed. Please check your internet connection.';
    }
    
    // API errors
    if (error.message.includes('401')) {
      return 'Please log in to continue.';
    }
    
    if (error.message.includes('403')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }

    // Supabase specific errors
    if (error.message.includes('row-level security')) {
      return 'Access denied. Please make sure you\'re logged in.';
    }

    return error.message || 'An unexpected error occurred.';
  }
  
  return 'An unexpected error occurred.';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('NETWORK_ERROR') ||
      error.name === 'NetworkError'
    );
  }
  return false;
};

export const createRetryableOperation = <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
    
    throw lastError!;
  };
};