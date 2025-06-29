
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface OptimizedDataOptions {
  cacheTimeout?: number; // in milliseconds
  debounceDelay?: number;
  enablePrefetch?: boolean;
}

export const useOptimizedData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: OptimizedDataOptions = {}
) => {
  const {
    cacheTimeout = 5 * 60 * 1000, // 5 minutes default
    debounceDelay = 300,
    enablePrefetch = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cache] = useState(new Map<string, CacheEntry<T>>());

  // Create cache key from dependencies
  const cacheKey = useMemo(() => {
    return JSON.stringify(dependencies);
  }, dependencies);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        const now = Date.now();
        
        if (cached && now < cached.expiry) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const result = await fetchFunction();
        
        // Update cache
        cache.set(cacheKey, {
          data: result,
          timestamp: now,
          expiry: now + cacheTimeout
        });
        
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }, debounceDelay),
    [fetchFunction, cacheKey, cacheTimeout, cache]
  );

  // Prefetch function for proactive loading
  const prefetch = useCallback(async () => {
    if (!enablePrefetch) return;
    
    try {
      const result = await fetchFunction();
      const now = Date.now();
      
      cache.set(cacheKey, {
        data: result,
        timestamp: now,
        expiry: now + cacheTimeout
      });
    } catch (err) {
      console.warn('Prefetch failed:', err);
    }
  }, [fetchFunction, cacheKey, cacheTimeout, cache, enablePrefetch]);

  // Manual refresh function
  const refresh = useCallback(() => {
    cache.delete(cacheKey);
    debouncedFetch();
  }, [cacheKey, cache, debouncedFetch]);

  // Initial fetch
  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  return {
    data,
    loading,
    error,
    refresh,
    prefetch
  };
};
