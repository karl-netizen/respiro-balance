import { useCallback, useMemo } from 'react';
import { usePerformanceOptimization } from '../usePerformanceOptimization';
import { MeditationSession } from '@/types/meditation';

export const useMeditationPerformance = (sessions: MeditationSession[]) => {
  const { 
    isLowPerformanceDevice, 
    shouldLazyLoad,
    getLoadingStrategy 
  } = usePerformanceOptimization();

  // Optimize session list based on device performance
  const optimizedSessions = useMemo(() => {
    if (!sessions?.length) return [];
    
    if (isLowPerformanceDevice) {
      // Limit sessions on low-performance devices
      return sessions.slice(0, 20);
    }
    
    return sessions;
  }, [sessions, isLowPerformanceDevice]);

  // Virtual scrolling threshold
  const virtualScrollThreshold = useMemo(() => {
    return isLowPerformanceDevice ? 10 : 50;
  }, [isLowPerformanceDevice]);

  // Image optimization
  const getOptimizedImageUrl = useCallback((imageUrl: string | undefined) => {
    if (!imageUrl) return undefined;
    
    // Apply image optimizations based on device performance
    if (isLowPerformanceDevice) {
      // Use smaller image sizes or placeholder for low-performance devices
      return imageUrl.includes('?') 
        ? `${imageUrl}&w=300&q=60` 
        : `${imageUrl}?w=300&q=60`;
    }
    
    return imageUrl;
  }, [isLowPerformanceDevice]);

  // Loading strategy
  const loadingStrategy = useMemo(() => {
    return getLoadingStrategy();
  }, [getLoadingStrategy]);

  return {
    optimizedSessions,
    virtualScrollThreshold,
    getOptimizedImageUrl,
    shouldLazyLoad,
    loadingStrategy,
    isLowPerformanceDevice
  };
};