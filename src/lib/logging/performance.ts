/**
 * Production-ready performance monitoring utilities
 */

import { logger } from './logger';

export interface PerformanceConfig {
  enableMetrics: boolean;
  slowOperationThreshold: number;
  memoryWarningThreshold: number;
  batchSize: number;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Map<string, number[]> = new Map();
  private pendingMetrics: any[] = [];

  constructor() {
    this.config = {
      enableMetrics: process.env.NODE_ENV === 'production',
      slowOperationThreshold: 1000, // 1 second
      memoryWarningThreshold: 50 * 1024 * 1024, // 50MB
      batchSize: 10
    };

    this.setupMemoryMonitoring();
  }

  private setupMemoryMonitoring(): void {
    if (!this.config.enableMetrics) return;

    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);
  }

  private checkMemoryUsage(): void {
    if (!(performance as any).memory) return;

    const memory = (performance as any).memory;
    const usedMB = memory.usedJSHeapSize / (1024 * 1024);

    if (usedMB > this.config.memoryWarningThreshold) {
      logger.warn(`High memory usage detected: ${usedMB.toFixed(2)}MB`, {
        component: 'PerformanceMonitor',
        feature: 'memoryMonitoring',
        usedHeapSize: memory.usedJSHeapSize,
        totalHeapSize: memory.totalJSHeapSize,
        heapLimit: memory.jsHeapSizeLimit
      });
    }
  }

  public measureOperation<T>(
    operationName: string,
    operation: () => T | Promise<T>,
    context?: Record<string, any>
  ): T | Promise<T> {
    if (!this.config.enableMetrics) {
      return operation();
    }

    const startTime = performance.now();
    const result = operation();

    // Handle both sync and async operations
    if (result instanceof Promise) {
      return result.then(
        (value) => {
          this.recordMetric(operationName, startTime, context);
          return value;
        },
        (error) => {
          this.recordMetric(operationName, startTime, { ...context, error: true });
          throw error;
        }
      );
    } else {
      this.recordMetric(operationName, startTime, context);
      return result;
    }
  }

  private recordMetric(operationName: string, startTime: number, context?: Record<string, any>): void {
    const duration = performance.now() - startTime;

    // Store metric for analysis
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, []);
    }
    this.metrics.get(operationName)!.push(duration);

    // Log slow operations
    if (duration > this.config.slowOperationThreshold) {
      logger.warn(`Slow operation detected: ${operationName}`, {
        component: 'PerformanceMonitor',
        feature: 'slowOperations',
        operation: operationName,
        duration,
        ...context
      });
    }

    // Log performance metric
    logger.performance(operationName, duration, context);

    // Batch metrics for reporting
    this.pendingMetrics.push({
      operation: operationName,
      duration,
      timestamp: Date.now(),
      context
    });

    if (this.pendingMetrics.length >= this.config.batchSize) {
      this.flushMetrics();
    }
  }

  private flushMetrics(): void {
    if (this.pendingMetrics.length === 0) return;

    logger.info('Performance Metrics Batch', {
      component: 'PerformanceMonitor',
      feature: 'metricsBatch',
      count: this.pendingMetrics.length,
      metrics: this.pendingMetrics
    });

    this.pendingMetrics = [];
  }

  public getMetricSummary(operationName: string): { 
    count: number; 
    average: number; 
    min: number; 
    max: number; 
    p95: number;
  } | null {
    const durations = this.metrics.get(operationName);
    if (!durations || durations.length === 0) return null;

    const sorted = [...durations].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  public getAllMetrics(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    for (const [operation, durations] of this.metrics.entries()) {
      summary[operation] = this.getMetricSummary(operation);
    }

    return summary;
  }

  public clearMetrics(): void {
    this.metrics.clear();
    this.pendingMetrics = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const measureOperation = <T>(
  operationName: string,
  operation: () => T | Promise<T>,
  context?: Record<string, any>
): T | Promise<T> => {
  return performanceMonitor.measureOperation(operationName, operation, context);
};

// Decorator for measuring component render times
export function measureRender(componentName: string) {
  return function <T extends React.ComponentType<any>>(Component: T): T {
    const MeasuredComponent = React.forwardRef((props: any, ref: any) => {
      return measureOperation(
        `render_${componentName}`,
        () => React.createElement(Component, { ...props, ref }),
        { component: componentName }
      ) as React.ReactElement;
    });

    MeasuredComponent.displayName = `Measured(${componentName})`;
    return MeasuredComponent as T;
  };
}

// Hook for measuring custom operations
export function usePerformanceMeasure() {
  return {
    measureOperation: performanceMonitor.measureOperation.bind(performanceMonitor),
    getMetrics: performanceMonitor.getAllMetrics.bind(performanceMonitor)
  };
}

import React from 'react';