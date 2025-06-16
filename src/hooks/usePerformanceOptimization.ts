
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

interface PerformanceMetrics {
  networkSpeed: 'slow' | 'medium' | 'fast';
  deviceMemory: number;
  hardwareConcurrency: number;
  connectionType: string;
}

export const usePerformanceOptimization = () => {
  const { deviceType } = useDeviceDetection();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    networkSpeed: 'medium',
    deviceMemory: 4,
    hardwareConcurrency: 4,
    connectionType: 'unknown'
  });

  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      const nav = navigator as any;
      
      const deviceMemory = nav.deviceMemory || 4;
      const hardwareConcurrency = nav.hardwareConcurrency || 4;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      let networkSpeed: 'slow' | 'medium' | 'fast' = 'medium';
      let connectionType = 'unknown';

      if (connection) {
        connectionType = connection.effectiveType || 'unknown';
        
        // Determine network speed based on effective connection type
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          networkSpeed = 'slow';
        } else if (connection.effectiveType === '3g') {
          networkSpeed = 'medium';
        } else if (connection.effectiveType === '4g') {
          networkSpeed = 'fast';
        }
      }

      setMetrics({
        networkSpeed,
        deviceMemory,
        hardwareConcurrency,
        connectionType
      });

      // Determine if this is a low-performance device
      const isLowPerf = (
        deviceMemory < 4 || 
        hardwareConcurrency < 4 || 
        networkSpeed === 'slow' ||
        deviceType === 'mobile'
      );
      
      setIsLowPerformanceDevice(isLowPerf);
    };

    checkPerformance();
  }, [deviceType]);

  const getOptimizedImageSize = useCallback((originalSize: { width: number; height: number }) => {
    if (isLowPerformanceDevice) {
      return {
        width: Math.min(originalSize.width, deviceType === 'mobile' ? 400 : 600),
        height: Math.min(originalSize.height, deviceType === 'mobile' ? 300 : 400)
      };
    }
    return originalSize;
  }, [isLowPerformanceDevice, deviceType]);

  const shouldLazyLoad = useMemo(() => {
    return isLowPerformanceDevice || metrics.networkSpeed === 'slow';
  }, [isLowPerformanceDevice, metrics.networkSpeed]);

  const getChartOptimizations = useCallback(() => {
    if (isLowPerformanceDevice) {
      return {
        animationDuration: deviceType === 'mobile' ? 200 : 300,
        maxDataPoints: deviceType === 'mobile' ? 20 : 50,
        enableAnimations: false,
        reducedComplexity: true
      };
    }
    
    return {
      animationDuration: 500,
      maxDataPoints: 100,
      enableAnimations: true,
      reducedComplexity: false
    };
  }, [isLowPerformanceDevice, deviceType]);

  const getLoadingStrategy = useCallback(() => {
    if (metrics.networkSpeed === 'slow') {
      return 'progressive'; // Load critical content first
    } else if (isLowPerformanceDevice) {
      return 'lazy'; // Lazy load non-critical content
    }
    return 'eager'; // Load everything normally
  }, [metrics.networkSpeed, isLowPerformanceDevice]);

  return {
    metrics,
    isLowPerformanceDevice,
    getOptimizedImageSize,
    shouldLazyLoad,
    getChartOptimizations,
    getLoadingStrategy,
    deviceType
  };
};

export default usePerformanceOptimization;
