import React from 'react';

// ===================================================================
// CORE WEB VITALS & PERFORMANCE MONITORING
// ===================================================================

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

interface MemoryUsage {
  used: number;
  total: number;
  limit: number;
  percentage: number;
}

interface PerformanceThresholds {
  LCP: { good: number; poor: number };
  FID: { good: number; poor: number };
  CLS: { good: number; poor: number };
  FCP: { good: number; poor: number };
  TTFB: { good: number; poor: number };
}

export class WebVitalsMonitor {
  private metrics = new Map<string, PerformanceMetric>();
  private listeners: Array<(metric: PerformanceMetric) => void> = [];
  private memoryCheckInterval?: NodeJS.Timeout;
  
  private readonly thresholds: PerformanceThresholds = {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
    FID: { good: 100, poor: 300 },   // First Input Delay
    CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
    TTFB: { good: 800, poor: 1800 }  // Time to First Byte
  };

  constructor() {
    this.initializeWebVitals();
    this.monitorRuntimePerformance();
    this.startMemoryMonitoring();
  }

  private initializeWebVitals(): void {
    // Core Web Vitals monitoring
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: any): void {
    const rating = this.calculateRating(metric.name, metric.value);
    
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.set(metric.name, performanceMetric);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(performanceMetric));
    
    // Check if metric exceeds threshold
    if (rating === 'poor') {
      this.reportPerformanceIssue(performanceMetric);
    }

    // Send to analytics
    this.sendToAnalytics(performanceMetric);
  }

  private calculateRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metricName as keyof PerformanceThresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private monitorRuntimePerformance(): void {
    // Monitor component render times
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes('React')) {
            if (entry.duration > 16) { // 60fps = 16ms per frame
              console.warn(`Slow render detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
              this.reportSlowRender(entry.name, entry.duration);
            }
          }

          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.trackNavigationMetrics(navEntry);
          }

          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.trackResourceMetrics(resourceEntry);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (e) {
        console.warn('Performance observer not fully supported');
      }
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            this.reportLongTask(entry.duration, entry.startTime);
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task observer not supported');
      }
    }
  }

  private startMemoryMonitoring(): void {
    if (!(performance as any).memory) {
      console.warn('Memory monitoring not available');
      return;
    }

    this.memoryCheckInterval = setInterval(() => {
      const memory = (performance as any).memory;
      const memoryUsage: MemoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      if (memoryUsage.percentage > 90) {
        console.error('Critical memory usage detected', memoryUsage);
        this.reportMemoryIssue(memoryUsage);
      } else if (memoryUsage.percentage > 80) {
        console.warn('High memory usage detected', memoryUsage);
      }

      // Notify listeners about memory usage
      this.listeners.forEach(listener => {
        listener({
          name: 'memory-usage',
          value: memoryUsage.percentage,
          rating: memoryUsage.percentage > 80 ? 'poor' : memoryUsage.percentage > 60 ? 'needs-improvement' : 'good',
          timestamp: Date.now(),
          url: window.location.href
        });
      });
    }, 30000); // Check every 30 seconds
  }

  private trackNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connect': entry.connectEnd - entry.connectStart,
      'ssl-negotiate': entry.connectEnd - entry.secureConnectionStart,
      'ttfb': entry.responseStart - entry.requestStart,
      'download': entry.responseEnd - entry.responseStart,
      'dom-interactive': entry.domInteractive - entry.navigationStart,
      'dom-complete': entry.domComplete - entry.navigationStart,
      'load-complete': entry.loadEventEnd - entry.navigationStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0) {
        const metric: PerformanceMetric = {
          name,
          value,
          rating: value > 1000 ? 'poor' : value > 500 ? 'needs-improvement' : 'good',
          timestamp: Date.now(),
          url: window.location.href
        };
        this.metrics.set(name, metric);
        this.listeners.forEach(listener => listener(metric));
      }
    });
  }

  private trackResourceMetrics(entry: PerformanceResourceTiming): void {
    // Track slow resources
    const duration = entry.responseEnd - entry.startTime;
    
    if (duration > 2000) { // Resources taking more than 2 seconds
      console.warn(`Slow resource detected: ${entry.name} took ${duration.toFixed(2)}ms`);
      
      this.sendToAnalytics({
        name: 'slow-resource',
        value: duration,
        rating: 'poor',
        timestamp: Date.now(),
        url: entry.name
      });
    }
  }

  private reportPerformanceIssue(metric: PerformanceMetric): void {
    fetch('/api/performance/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        threshold: this.thresholds[metric.name as keyof PerformanceThresholds],
        url: metric.url,
        userAgent: navigator.userAgent,
        timestamp: metric.timestamp,
        connectionType: this.getConnectionInfo()
      }),
    }).catch(err => console.warn('Failed to report performance issue:', err));
  }

  private reportSlowRender(componentName: string, duration: number): void {
    this.sendToAnalytics({
      name: 'slow-render',
      value: duration,
      rating: 'poor',
      timestamp: Date.now(),
      url: `${window.location.href}#${componentName}`
    });
  }

  private reportLongTask(duration: number, startTime: number): void {
    this.sendToAnalytics({
      name: 'long-task',
      value: duration,
      rating: 'poor',
      timestamp: startTime,
      url: window.location.href
    });
  }

  private reportMemoryIssue(memoryUsage: MemoryUsage): void {
    fetch('/api/performance/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...memoryUsage,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(err => console.warn('Failed to report memory issue:', err));
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    // Send to Google Analytics 4 if available
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        custom_parameter_rating: metric.rating,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(() => {}); // Fail silently for analytics
  }

  private getConnectionInfo(): string {
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';
    
    return `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'}Mbps)`;
  }

  // Public API
  public onMetric(listener: (metric: PerformanceMetric) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public getMetrics(): Record<string, PerformanceMetric> {
    return Object.fromEntries(this.metrics);
  }

  public getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  public destroy(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    this.listeners.length = 0;
    this.metrics.clear();
  }

  // Force trigger performance measurement
  public measurePerformance(name: string, fn: () => void): void {
    const start = performance.now();
    performance.mark(`${name}-start`);
    
    fn();
    
    const end = performance.now();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const duration = end - start;
    
    this.handleMetric({
      name: `custom-${name}`,
      value: duration,
      delta: duration,
      id: Math.random().toString(36),
      entries: []
    });
  }
}

// Singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState<Record<string, PerformanceMetric>>({});

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(webVitalsMonitor.getMetrics());
    };

    const unsubscribe = webVitalsMonitor.onMetric(updateMetrics);
    updateMetrics(); // Initial update

    return unsubscribe;
  }, []);

  return {
    metrics,
    measurePerformance: webVitalsMonitor.measurePerformance.bind(webVitalsMonitor)
  };
};

export default webVitalsMonitor;