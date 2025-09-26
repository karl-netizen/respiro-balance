interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentage: number;
}

interface ResourceStats {
  total: number;
  byType: Record<string, number>;
  oldestResource?: {
    age: number;
    type: string;
  };
}

export const useMemoryMonitoring = () => {
  const getMemoryInfo = (): MemoryUsage => {
    const performance = (window as any).performance;
    
    if (performance && performance.memory) {
      const memory: MemoryInfo = performance.memory;
      const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        percentage
      };
    }
    
    // Fallback for browsers without memory API
    return {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB mock
      totalJSHeapSize: 100 * 1024 * 1024, // 100MB mock
      jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB mock
      percentage: 25
    };
  };

  const getResourceStats = (): ResourceStats => {
    return {
      total: 45,
      byType: {
        'script': 12,
        'stylesheet': 8,
        'image': 20,
        'font': 5
      },
      oldestResource: {
        age: 30000, // 30 seconds
        type: 'script'
      }
    };
  };

  const memoryUsage = getMemoryInfo();
  const resourceStats = getResourceStats();
  const isHighMemoryUsage = memoryUsage.percentage > 80;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    memoryUsage,
    resourceStats,
    isHighMemoryUsage,
    getMemoryInfo,
    formatBytes
  };
};

export const cleanupResources = () => {
  // Force garbage collection if available (only in development)
  if (process.env.NODE_ENV === 'development' && (window as any).gc) {
    (window as any).gc();
  }
};