import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncOptions<T> = {}
) => {
  const {
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
    retryAttempts = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: immediate,
    error: null,
    lastUpdated: null
  });

  const cancelRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);

  const execute = useCallback(async () => {
    cancelRef.current = false;
    retryCountRef.current = 0;

    setState(prev => ({ ...prev, loading: true, error: null }));

    const attemptExecution = async (): Promise<void> => {
      try {
        const result = await asyncFunction();
        
        if (!cancelRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
            lastUpdated: new Date()
          });
          onSuccess?.(result);
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        if (retryCountRef.current < retryAttempts) {
          retryCountRef.current++;
          setTimeout(attemptExecution, retryDelay);
          return;
        }

        if (!cancelRef.current) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorObj
          }));
          onError?.(errorObj);
        }
      }
    };

    await attemptExecution();
  }, [asyncFunction, onSuccess, onError, retryAttempts, retryDelay]);

  const reset = useCallback(() => {
    cancelRef.current = true;
    setState({
      data: initialData,
      loading: false,
      error: null,
      lastUpdated: null
    });
  }, [initialData]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      cancelRef.current = true;
    };
  }, dependencies);

  return {
    ...state,
    execute,
    reset,
    cancel,
    isStale: state.lastUpdated ? Date.now() - state.lastUpdated.getTime() > 5 * 60 * 1000 : true
  };
};

// Specialized hook for API calls with caching
export const useApiCall = <T>(
  apiCall: () => Promise<T>,
  cacheKey?: string,
  options: UseAsyncOptions<T> & { 
    cacheDuration?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) => {
  const { cacheDuration = 5 * 60 * 1000, refetchOnWindowFocus = true } = options;
  
  const getCachedData = (): T | null => {
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(`api_cache_${cacheKey}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheDuration) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    
    return null;
  };

  const setCachedData = (data: T) => {
    if (!cacheKey) return;
    
    try {
      localStorage.setItem(`api_cache_${cacheKey}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  };

  const cachedData = getCachedData();
  
  const asyncResult = useAsync(apiCall, [], {
    ...options,
    immediate: !cachedData,
    initialData: cachedData,
    onSuccess: (data) => {
      setCachedData(data);
      options.onSuccess?.(data);
    }
  });

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (!asyncResult.loading && asyncResult.isStale) {
        asyncResult.execute();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [asyncResult.loading, asyncResult.isStale, asyncResult.execute, refetchOnWindowFocus]);

  const invalidateCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(`api_cache_${cacheKey}`);
    }
  }, [cacheKey]);

  return {
    ...asyncResult,
    invalidateCache,
    fromCache: !!cachedData
  };
};

// Hook for debounced async operations
export const useDebouncedAsync = <T>(
  asyncFunction: () => Promise<T>,
  delay: number = 300,
  dependencies: any[] = []
) => {
  const [debouncedDeps, setDebouncedDeps] = useState(dependencies);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDeps(dependencies);
    }, delay);

    return () => clearTimeout(timer);
  }, dependencies);

  return useAsync(asyncFunction, debouncedDeps, { immediate: true });
};