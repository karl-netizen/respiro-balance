import { useEffect, useRef, useCallback } from 'react';

interface PerformanceEntry {
  operation: string;
  duration: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>();
  const performanceEntries = useRef<PerformanceEntry[]>([]);

  // Measure component mount time
  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    return () => {
      if (mountTimeRef.current) {
        const mountDuration = performance.now() - mountTimeRef.current;
        console.log(`${componentName} mount time: ${mountDuration.toFixed(2)}ms`);
        
        // Log performance entries
        if (performanceEntries.current.length > 0) {
          console.table(performanceEntries.current);
        }
      }
    };
  }, [componentName]);

  // Measure async operations
  const measureAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    label: string
  ) => {
    const start = performance.now();
    
    try {
      await operation();
    } finally {
      const duration = performance.now() - start;
      const entry: PerformanceEntry = {
        operation: label,
        duration: parseFloat(duration.toFixed(2)),
        timestamp: Date.now()
      };
      
      performanceEntries.current.push(entry);
      
      if (duration > 100) { // Log slow operations
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    }
  }, []);

  // Measure sync operations
  const measureOperation = useCallback(<T,>(
    operation: () => T,
    label: string
  ): T => {
    const start = performance.now();
    
    try {
      return operation();
    } finally {
      const duration = performance.now() - start;
      const entry: PerformanceEntry = {
        operation: label,
        duration: parseFloat(duration.toFixed(2)),
        timestamp: Date.now()
      };
      
      performanceEntries.current.push(entry);
      
      if (duration > 16) { // Log operations that might affect 60fps
        console.warn(`Frame-affecting operation: ${label} took ${duration.toFixed(2)}ms`);
      }
    }
  }, []);

  return {
    measureAsyncOperation,
    measureOperation
  };
};