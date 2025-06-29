
import { useState, useEffect, useCallback } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkSpeed: string;
  fps: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  userAgent: string;
  url: string;
  userId?: string;
  context: Record<string, any>;
}

export const usePerformanceMonitoring = () => {
  const { deviceType, isMobile } = useDeviceDetection();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkSpeed: 'unknown',
    fps: 60,
    coreWebVitals: { lcp: 0, fid: 0, cls: 0 }
  });
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Core Web Vitals monitoring
  const measureCoreWebVitals = useCallback(() => {
    if ('web-vital' in window) return;

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      setMetrics(prev => ({
        ...prev,
        coreWebVitals: {
          ...prev.coreWebVitals,
          lcp: lastEntry.startTime
        }
      }));
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => ({
          ...prev,
          coreWebVitals: {
            ...prev.coreWebVitals,
            fid: entry.processingStart - entry.startTime
          }
        }));
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      setMetrics(prev => ({
        ...prev,
        coreWebVitals: {
          ...prev.coreWebVitals,
          cls: clsValue
        }
      }));
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }, []);

  // Memory usage monitoring
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }));
    }
  }, []);

  // Network speed estimation
  const measureNetworkSpeed = useCallback(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      setMetrics(prev => ({
        ...prev,
        networkSpeed: connection.effectiveType || 'unknown'
      }));
    }
  }, []);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();
    
    const countFrames = (currentTime: number) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frames * 1000) / (currentTime - lastTime))
        }));
        
        frames = 0;
        lastTime = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(countFrames);
      }
    };
    
    if (isMonitoring) {
      requestAnimationFrame(countFrames);
    }
  }, [isMonitoring]);

  // Error tracking
  const trackError = useCallback((error: Error, context: Record<string, any> = {}) => {
    const errorReport: ErrorReport = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: {
        ...context,
        deviceType,
        isMobile,
        userAgent: navigator.userAgent
      }
    };

    setErrors(prev => [...prev.slice(-99), errorReport]); // Keep last 100 errors
    
    // Send to error tracking service (would be actual service in production)
    console.warn('Error tracked:', errorReport);
  }, [deviceType, isMobile]);

  // Performance timing
  const measureLoadTime = useCallback(() => {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({
        ...prev,
        loadTime
      }));
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    measureCoreWebVitals();
    measureMemoryUsage();
    measureNetworkSpeed();
    measureLoadTime();
    
    // Set up error listeners
    window.addEventListener('error', (event) => {
      trackError(event.error, { type: 'javascript' });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      trackError(new Error(event.reason), { type: 'promise' });
    });
    
    // Periodic measurements
    const interval = setInterval(() => {
      measureMemoryUsage();
      measureNetworkSpeed();
    }, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [measureCoreWebVitals, measureMemoryUsage, measureNetworkSpeed, measureLoadTime, trackError]);

  // Performance score calculation
  const getPerformanceScore = useCallback(() => {
    let score = 100;
    
    // Deduct points for poor metrics
    if (metrics.coreWebVitals.lcp > 2500) score -= 20;
    if (metrics.coreWebVitals.fid > 100) score -= 20;
    if (metrics.coreWebVitals.cls > 0.1) score -= 20;
    if (metrics.loadTime > 3000) score -= 20;
    if (metrics.fps < 30) score -= 10;
    if (metrics.memoryUsage > 0.8) score -= 10;
    
    return Math.max(0, score);
  }, [metrics]);

  // Get optimization recommendations
  const getOptimizationRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    
    if (metrics.coreWebVitals.lcp > 2500) {
      recommendations.push('Optimize images and reduce server response time');
    }
    if (metrics.coreWebVitals.fid > 100) {
      recommendations.push('Reduce JavaScript execution time');
    }
    if (metrics.coreWebVitals.cls > 0.1) {
      recommendations.push('Add size attributes to images and avoid layout shifts');
    }
    if (metrics.loadTime > 3000) {
      recommendations.push('Enable compression and use a CDN');
    }
    if (metrics.fps < 30) {
      recommendations.push('Optimize animations and reduce DOM manipulation');
    }
    if (metrics.memoryUsage > 0.8) {
      recommendations.push('Optimize memory usage and avoid memory leaks');
    }
    
    return recommendations;
  }, [metrics]);

  useEffect(() => {
    const cleanup = startMonitoring();
    measureFPS();
    
    return cleanup;
  }, [startMonitoring, measureFPS]);

  return {
    metrics,
    errors,
    isMonitoring,
    trackError,
    getPerformanceScore,
    getOptimizationRecommendations,
    startMonitoring
  };
};
