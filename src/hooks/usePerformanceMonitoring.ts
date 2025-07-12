import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformanceMonitoring = () => {
  const reportMetric = useCallback((metric: PerformanceMetrics) => {
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metric:', metric);
    }
    
    // Warn user if performance is degraded
    if (metric.lcp && metric.lcp > 4000) {
      toast({
        title: 'Slow Loading Detected',
        description: 'The app is loading slower than usual. Check your connection.',
        variant: 'destructive',
      });
    }
  }, []);

  useEffect(() => {
    // Web Vitals monitoring
    if ('web-vital' in window) return;

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          reportMetric({ fcp: entry.startTime });
        }
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        reportMetric({ lcp: entry.startTime });
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        reportMetric({ fid: entry.processingStart - entry.startTime });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let cls = 0;
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      reportMetric({ cls });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [reportMetric]);

  // Monitor bundle size and loading performance
  useEffect(() => {
    const checkBundleSize = () => {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;

      scripts.forEach((script: any) => {
        if (script.src && script.src.includes('.js')) {
          fetch(script.src, { method: 'HEAD' })
            .then(response => {
              const size = response.headers.get('content-length');
              if (size) totalSize += parseInt(size);
            })
            .catch(() => {});
        }
      });

      // Check if bundle is too large (> 1MB)
      setTimeout(() => {
        if (totalSize > 1024 * 1024) {
          console.warn('Large bundle size detected:', totalSize);
        }
      }, 1000);
    };

    checkBundleSize();
  }, []);

  return { reportMetric };
};