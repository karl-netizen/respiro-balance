
import { useMemo, useCallback } from 'react';

export const useMemoizedStats = (dependencies: any[]) => {
  return useMemo(() => {
    // Memoize expensive calculations
    return dependencies.reduce((acc, dep) => {
      if (typeof dep === 'number') {
        acc.sum = (acc.sum || 0) + dep;
      }
      return acc;
    }, {});
  }, dependencies);
};

export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
