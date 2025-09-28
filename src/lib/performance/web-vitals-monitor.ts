interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

interface PerformanceMetrics {
  [key: string]: WebVital;
}

export const usePerformanceMonitoring = () => {
  const getWebVitals = (): PerformanceMetrics => {
    const metrics: PerformanceMetrics = {};
    
    // Mock web vitals data for demo
    metrics['FCP'] = {
      name: 'First Contentful Paint',
      value: 1200,
      rating: 'good',
      delta: 0
    };
    
    metrics['LCP'] = {
      name: 'Largest Contentful Paint',
      value: 2100,
      rating: 'good',
      delta: 0
    };
    
    metrics['FID'] = {
      name: 'First Input Delay',
      value: 50,
      rating: 'good',
      delta: 0
    };
    
    metrics['CLS'] = {
      name: 'Cumulative Layout Shift',
      value: 0.05,
      rating: 'good',
      delta: 0
    };
    
    metrics['TTFB'] = {
      name: 'Time to First Byte',
      value: 200,
      rating: 'good',
      delta: 0
    };
    
    return metrics;
  };

  const measurePerformance = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  };

  const metrics = getWebVitals();

  const getRatingColor = (rating: WebVital['rating']): string => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (vital: WebVital): string => {
    if (vital.name.includes('Shift')) {
      return vital.value.toFixed(3);
    }
    return `${vital.value}ms`;
  };

  return {
    metrics,
    measurePerformance,
    getRatingColor,
    formatValue
  };
};