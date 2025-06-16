
import { useEffect, useRef } from 'react';

export const useCleanupEffect = (
  effect: () => (() => void) | void,
  deps?: React.DependencyList
) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clean up previous effect if exists
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // Run the effect and store cleanup function
    const cleanup = effect();
    if (typeof cleanup === 'function') {
      cleanupRef.current = cleanup;
    }

    // Return cleanup function for useEffect
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
};
