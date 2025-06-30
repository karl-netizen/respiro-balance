
import { useCallback } from 'react';

interface ErrorContext {
  source?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  [key: string]: any;
}

export const usePerformanceMonitoring = () => {
  const trackError = useCallback((error: Error, context?: ErrorContext) => {
    console.error('Performance monitoring - Error tracked:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // In a real app, you would send this to your monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
  }, []);

  const trackMetric = useCallback((metricName: string, value: number, tags?: Record<string, string>) => {
    console.log('Performance monitoring - Metric tracked:', {
      metric: metricName,
      value,
      tags,
      timestamp: new Date().toISOString()
    });
    
    // In a real app, you would send this to your analytics service
  }, []);

  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    console.log('Performance monitoring - User action tracked:', {
      action,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
    
    // In a real app, you would send this to your analytics service
  }, []);

  return {
    trackError,
    trackMetric,
    trackUserAction
  };
};
