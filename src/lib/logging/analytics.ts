/**
 * External monitoring service integrations
 * Complete integration examples for Sentry, DataDog, LogRocket
 */

import { logger } from './logger';

// Sentry Integration
export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  beforeSend?: (event: any) => any;
}

export const initializeSentry = (config: SentryConfig) => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      release: config.release,
      beforeSend: config.beforeSend,
      integrations: [
        new window.Sentry.BrowserTracing(),
        new window.Sentry.Replay()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });

    logger.info('Sentry monitoring initialized', {
      component: 'MonitoringIntegration',
      feature: 'sentry',
      environment: config.environment
    });
  }
};

// DataDog Integration
export interface DataDogConfig {
  clientToken: string;
  applicationId: string;
  site: string;
  service: string;
  env: string;
  version?: string;
}

export const initializeDataDog = (config: DataDogConfig) => {
  if (typeof window !== 'undefined' && window.DD_RUM) {
    window.DD_RUM.init({
      clientToken: config.clientToken,
      applicationId: config.applicationId,
      site: config.site,
      service: config.service,
      env: config.env,
      version: config.version,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input'
    });

    logger.info('DataDog RUM initialized', {
      component: 'MonitoringIntegration',
      feature: 'datadog',
      service: config.service,
      environment: config.env
    });
  }
};

// LogRocket Integration
export interface LogRocketConfig {
  appId: string;
  release?: string;
  shouldCaptureIP?: boolean;
  console?: {
    shouldAggregateConsoleErrors?: boolean;
  };
  network?: {
    requestSanitizer?: (request: any) => any;
    responseSanitizer?: (response: any) => any;
  };
}

export const initializeLogRocket = (config: LogRocketConfig) => {
  if (typeof window !== 'undefined' && window.LogRocket) {
    window.LogRocket.init(config.appId, {
      release: config.release,
      shouldCaptureIP: config.shouldCaptureIP || false,
      console: {
        shouldAggregateConsoleErrors: config.console?.shouldAggregateConsoleErrors || true
      },
      network: {
        requestSanitizer: config.network?.requestSanitizer || ((request) => {
          // Remove sensitive headers
          if (request.headers) {
            delete request.headers.authorization;
            delete request.headers.cookie;
          }
          return request;
        }),
        responseSanitizer: config.network?.responseSanitizer || ((response) => {
          // Remove sensitive response data
          if (response.body && typeof response.body === 'object') {
            const sanitized = { ...response.body };
            delete sanitized.token;
            delete sanitized.password;
            delete sanitized.ssn;
            return { ...response, body: sanitized };
          }
          return response;
        })
      }
    });

    logger.info('LogRocket session recording initialized', {
      component: 'MonitoringIntegration',
      feature: 'logrocket',
      appId: config.appId
    });
  }
};

// Google Analytics 4 Integration
export interface GA4Config {
  measurementId: string;
  userId?: string;
  customDimensions?: Record<string, any>;
}

export const initializeGA4 = (config: GA4Config) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', config.measurementId, {
      user_id: config.userId,
      custom_map: config.customDimensions,
      send_page_view: true
    });

    logger.info('Google Analytics 4 initialized', {
      component: 'MonitoringIntegration',
      feature: 'ga4',
      measurementId: config.measurementId
    });
  }
};

// Unified monitoring initialization
export interface MonitoringConfig {
  sentry?: SentryConfig;
  datadog?: DataDogConfig;
  logrocket?: LogRocketConfig;
  ga4?: GA4Config;
}

export const initializeMonitoring = (config: MonitoringConfig) => {
  if (config.sentry) {
    initializeSentry(config.sentry);
  }

  if (config.datadog) {
    initializeDataDog(config.datadog);
  }

  if (config.logrocket) {
    initializeLogRocket(config.logrocket);
  }

  if (config.ga4) {
    initializeGA4(config.ga4);
  }

  logger.info('All monitoring services initialized', {
    component: 'MonitoringIntegration',
    feature: 'initialization',
    services: Object.keys(config)
  });
};

// Privacy-compliant user identification
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  const sanitizedTraits = sanitizeUserTraits(traits);

  // Sentry user context
  if (window.Sentry) {
    window.Sentry.setUser({
      id: userId,
      ...sanitizedTraits
    });
  }

  // DataDog user context
  if (window.DD_RUM) {
    window.DD_RUM.setUser({
      id: userId,
      ...sanitizedTraits
    });
  }

  // LogRocket user identification
  if (window.LogRocket) {
    window.LogRocket.identify(userId, sanitizedTraits);
  }

  // Google Analytics user ID
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      user_id: userId
    });
  }

  logger.info('User identified across monitoring services', {
    component: 'MonitoringIntegration',
    feature: 'userIdentification',
    userId
  });
};

// Sanitize user traits for privacy compliance
const sanitizeUserTraits = (traits?: Record<string, any>): Record<string, any> => {
  if (!traits) return {};

  const sanitized = { ...traits };
  
  // Remove PII
  const piiFields = ['email', 'phone', 'ssn', 'address', 'creditCard', 'password'];
  piiFields.forEach(field => {
    delete sanitized[field];
  });

  // Hash sensitive fields
  if (sanitized.email) {
    sanitized.emailHash = hashString(sanitized.email);
    delete sanitized.email;
  }

  return sanitized;
};

// Simple hash function for sensitive data
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
};

// Error reporting to external services
export const reportErrorToServices = (error: Error, context?: Record<string, any>) => {
  // Sentry
  if (window.Sentry) {
    window.Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      window.Sentry.captureException(error);
    });
  }

  // DataDog
  if (window.DD_RUM) {
    window.DD_RUM.addError(error, context);
  }

  // LogRocket
  if (window.LogRocket) {
    window.LogRocket.captureException(error);
  }
};

// Performance monitoring integration
export const reportPerformanceToServices = (metric: string, value: number, context?: Record<string, any>) => {
  // DataDog custom metrics
  if (window.DD_RUM) {
    window.DD_RUM.addTiming(metric, value);
  }

  // Google Analytics custom events
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metric,
      value: Math.round(value),
      custom_parameter_1: context?.component || 'unknown'
    });
  }
};

declare global {
  interface Window {
    Sentry: any;
    DD_RUM: any;
    LogRocket: any;
    gtag: any;
  }
}