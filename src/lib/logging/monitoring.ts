/**
 * Application monitoring and analytics system
 */

import { logger } from './logger';

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface UserAnalytics {
  userId?: string;
  sessionId: string;
  pageViews: number;
  timeOnPage: number;
  interactions: number;
  features_used: string[];
}

class MonitoringService {
  private performanceObserver?: PerformanceObserver;
  private sessionStartTime: number;
  private currentPage: string;
  private userAnalytics: UserAnalytics;

  constructor() {
    this.sessionStartTime = Date.now();
    this.currentPage = window.location.pathname;
    this.userAnalytics = {
      sessionId: this.generateSessionId(),
      pageViews: 0,
      timeOnPage: 0,
      interactions: 0,
      features_used: []
    };

    this.setupPerformanceMonitoring();
    this.setupUserBehaviorTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          logger.warn(`Long task detected: ${entry.duration}ms`, {
            component: 'PerformanceMonitoring',
            feature: 'longTasks',
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        logger.performance('Page Load', navEntry.loadEventEnd - navEntry.fetchStart, {
          component: 'PagePerformance',
          feature: 'navigation',
          page: this.currentPage,
          domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
          firstByte: navEntry.responseStart - navEntry.fetchStart
        });
        break;

      case 'paint':
        logger.performance(`${entry.name}`, entry.startTime, {
          component: 'PagePerformance',
          feature: 'paint',
          page: this.currentPage
        });
        break;

      case 'largest-contentful-paint':
        logger.performance('Largest Contentful Paint', entry.startTime, {
          component: 'PagePerformance',
          feature: 'lcp',
          page: this.currentPage
        });
        break;
    }
  }

  private setupUserBehaviorTracking(): void {
    // Track page views
    this.trackPageView();

    // Track user interactions
    document.addEventListener('click', this.handleUserInteraction.bind(this));
    document.addEventListener('keypress', this.handleUserInteraction.bind(this));

    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Track before page unload
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
  }

  private handleUserInteraction(): void {
    this.userAnalytics.interactions++;
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.calculateTimeOnPage();
    } else {
      this.sessionStartTime = Date.now();
    }
  }

  private handlePageUnload(): void {
    this.calculateTimeOnPage();
    this.sendAnalytics();
  }

  private calculateTimeOnPage(): void {
    const timeSpent = Date.now() - this.sessionStartTime;
    this.userAnalytics.timeOnPage += timeSpent;
  }

  private trackPageView(): void {
    this.userAnalytics.pageViews++;
    
    logger.getUserFlow('page_view', {
      page: this.currentPage,
      timestamp: Date.now(),
      sessionId: this.userAnalytics.sessionId
    });
  }

  public trackFeatureUsage(feature: string, action: string, context?: Record<string, any>): void {
    if (!this.userAnalytics.features_used.includes(feature)) {
      this.userAnalytics.features_used.push(feature);
    }

    logger.getUserFlow(`feature_${action}`, {
      feature,
      action,
      page: this.currentPage,
      sessionId: this.userAnalytics.sessionId,
      ...context
    });
  }

  public trackUserJourney(step: string, context?: Record<string, any>): void {
    logger.getUserFlow(`journey_${step}`, {
      step,
      page: this.currentPage,
      sessionId: this.userAnalytics.sessionId,
      ...context
    });
  }

  public trackConversion(event: string, value?: number, context?: Record<string, any>): void {
    logger.info(`Conversion: ${event}`, {
      component: 'Analytics',
      feature: 'conversion',
      event,
      value,
      page: this.currentPage,
      sessionId: this.userAnalytics.sessionId,
      ...context
    });
  }

  private sendAnalytics(): void {
    // Send analytics data to external services
    logger.info('Session Analytics', {
      component: 'Analytics',
      feature: 'sessionSummary',
      ...this.userAnalytics,
      page: this.currentPage
    });
  }

  public getHealthMetrics(): Record<string, any> {
    return {
      sessionId: this.userAnalytics.sessionId,
      currentPage: this.currentPage,
      sessionDuration: Date.now() - this.sessionStartTime,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

// Convenience functions
export const trackFeature = (feature: string, action: string, context?: Record<string, any>) => {
  monitoring.trackFeatureUsage(feature, action, context);
};

export const trackUserJourney = (step: string, context?: Record<string, any>) => {
  monitoring.trackUserJourney(step, context);
};

export const trackConversion = (event: string, value?: number, context?: Record<string, any>) => {
  monitoring.trackConversion(event, value, context);
};

export const getHealthCheck = () => {
  return monitoring.getHealthMetrics();
};