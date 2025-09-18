// Comprehensive error handling utilities

import { toast } from 'sonner';
import {
  MeditationLibraryError,
  AudioProcessingError,
  StorageError,
  PlaybackError,
  ValidationError,
  NetworkError,
  ErrorContext
} from '../types/errors.types';

// Main error handler
export const handleError = (error: unknown, context?: Partial<ErrorContext>): void => {
  const errorContext: ErrorContext = {
    component: context?.component || 'Unknown',
    action: context?.action || 'Unknown',
    userId: context?.userId,
    contentId: context?.contentId,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };

  if (error instanceof MeditationLibraryError) {
    handleMeditationLibraryError(error, errorContext);
  } else if (error instanceof Error) {
    handleGenericError(error, errorContext);
  } else {
    handleUnknownError(error, errorContext);
  }
};

// Specific error handlers
const handleMeditationLibraryError = (
  error: MeditationLibraryError, 
  context: ErrorContext
): void => {
  console.error(`${error.name}:`, {
    message: error.message,
    code: error.code,
    context: error.context,
    errorContext: context
  });

  // Show user-friendly messages based on error type
  if (error instanceof AudioProcessingError) {
    toast.error('Audio file processing failed. Please try a different file.');
  } else if (error instanceof StorageError) {
    toast.error('Storage operation failed. Please try again.');
  } else if (error instanceof PlaybackError) {
    toast.error('Playback failed. Please check your audio file.');
  } else if (error instanceof ValidationError) {
    toast.error(`Invalid ${error.field}: ${error.message}`);
  } else if (error instanceof NetworkError) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error(error.message);
  }

  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    logErrorToService(error, context);
  }
};

const handleGenericError = (error: Error, context: ErrorContext): void => {
  console.error('Generic Error:', {
    message: error.message,
    stack: error.stack,
    context
  });

  toast.error('An unexpected error occurred. Please try again.');

  if (process.env.NODE_ENV === 'production') {
    logErrorToService(error, context);
  }
};

const handleUnknownError = (error: unknown, context: ErrorContext): void => {
  console.error('Unknown Error:', {
    error,
    context
  });

  toast.error('Something went wrong. Please refresh the page.');

  if (process.env.NODE_ENV === 'production') {
    logErrorToService(new Error(`Unknown error: ${String(error)}`), context);
  }
};

// External logging service integration
const logErrorToService = async (error: Error, context: ErrorContext): Promise<void> => {
  try {
    // Replace with your actual error logging service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just log to console in production
    console.log('Error logged to service:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    });

    // Example Sentry integration:
    // Sentry.captureException(error, {
    //   tags: {
    //     component: context.component,
    //     action: context.action
    //   },
    //   user: {
    //     id: context.userId
    //   },
    //   extra: context
    // });
  } catch (loggingError) {
    console.error('Failed to log error to service:', loggingError);
  }
};

// Async error boundary for promises
export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Partial<ErrorContext>
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return undefined;
    }
  };
};

// Error boundary for synchronous functions
export const withSyncErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => R,
  context?: Partial<ErrorContext>
) => {
  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, context);
      return undefined;
    }
  };
};

// Retry mechanism with exponential backoff
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context?: Partial<ErrorContext>
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        handleError(error, {
          ...context,
          action: `${context?.action || 'retry'} (final attempt)`
        });
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Network error specific handler
export const handleNetworkError = (
  error: unknown,
  endpoint: string,
  context?: Partial<ErrorContext>
): void => {
  if (error instanceof Error) {
    const networkError = new NetworkError(
      `Network request failed: ${error.message}`,
      endpoint
    );
    handleError(networkError, context);
  } else {
    handleError(
      new NetworkError('Unknown network error', endpoint),
      context
    );
  }
};

// File processing error handler
export const handleFileError = (
  error: unknown,
  file: File | string,
  context?: Partial<ErrorContext>
): void => {
  const fileName = typeof file === 'string' ? file : file.name;
  
  if (error instanceof Error) {
    const audioError = new AudioProcessingError(
      `File processing failed for ${fileName}: ${error.message}`,
      file
    );
    handleError(audioError, context);
  } else {
    handleError(
      new AudioProcessingError(`Unknown file processing error for ${fileName}`, file),
      context
    );
  }
};