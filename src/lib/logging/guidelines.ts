/**
 * Privacy compliance and deployment guidelines
 */

export const PRIVACY_GUIDELINES = {
  // Data to NEVER log in production
  NEVER_LOG: [
    'password',
    'token',
    'apiKey',
    'secret',
    'ssn',
    'creditCard',
    'bankAccount',
    'personalId',
    'medicalInfo'
  ],

  // Data that requires user consent
  REQUIRES_CONSENT: [
    'email',
    'phone',
    'address',
    'location',
    'biometricData',
    'healthData'
  ],

  // Data safe to log
  SAFE_TO_LOG: [
    'userId', // if hashed/anonymized
    'sessionId',
    'feature',
    'component',
    'action',
    'timestamp',
    'device_type',
    'browser_version',
    'performance_metrics'
  ]
};

export const GDPR_COMPLIANCE = {
  // User rights under GDPR
  USER_RIGHTS: [
    'right_to_access',
    'right_to_rectification', 
    'right_to_erasure',
    'right_to_portability',
    'right_to_restrict_processing',
    'right_to_object'
  ],

  // Data retention policies
  RETENTION_PERIODS: {
    error_logs: '30 days',
    performance_logs: '90 days', 
    user_analytics: '13 months',
    session_data: '30 days'
  },

  // Anonymization requirements
  ANONYMIZATION: {
    immediate: ['password', 'token', 'secret'],
    delayed: ['email', 'ip_address'], // 24 hours
    hashed: ['userId', 'sessionId']
  }
};

export const DEPLOYMENT_STRATEGY = {
  // Phase 1: Logging Infrastructure (Week 1)
  PHASE_1: {
    tasks: [
      'Deploy centralized logger',
      'Set up error boundaries',
      'Configure log levels per environment',
      'Test logging pipeline'
    ],
    risk: 'LOW',
    rollback_plan: 'Disable remote logging, keep local only'
  },

  // Phase 2: Performance Monitoring (Week 2)
  PHASE_2: {
    tasks: [
      'Enable performance monitoring',
      'Set up alerts for slow operations',
      'Monitor memory usage',
      'Track Core Web Vitals'
    ],
    risk: 'LOW',
    rollback_plan: 'Disable performance observer'
  },

  // Phase 3: User Analytics (Week 3)
  PHASE_3: {
    tasks: [
      'Deploy user behavior tracking',
      'Implement feature usage analytics',
      'Set up conversion tracking',
      'Create privacy-compliant identification'
    ],
    risk: 'MEDIUM',
    rollback_plan: 'Disable user tracking, keep anonymous metrics only'
  },

  // Phase 4: External Integrations (Week 4)
  PHASE_4: {
    tasks: [
      'Integrate Sentry for error monitoring',
      'Connect DataDog for performance',
      'Set up LogRocket for session replay',
      'Configure Google Analytics'
    ],
    risk: 'MEDIUM',
    rollback_plan: 'Revert to internal logging only'
  }
};

export const MONITORING_CONFIGURATION = {
  // Environment-specific settings
  ENVIRONMENTS: {
    development: {
      logLevel: 'DEBUG',
      enableConsole: true,
      enableRemote: false,
      enableStorage: true,
      enableAnalytics: false
    },
    staging: {
      logLevel: 'INFO',
      enableConsole: false,
      enableRemote: true,
      enableStorage: true,
      enableAnalytics: true
    },
    production: {
      logLevel: 'WARN',
      enableConsole: false,
      enableRemote: true,
      enableStorage: false, // Use external storage only
      enableAnalytics: true
    }
  },

  // Alert thresholds
  ALERTS: {
    error_rate: '> 1% in 5 minutes',
    slow_operations: '> 2 seconds average',
    memory_usage: '> 100MB sustained',
    crash_rate: '> 0.1% in 1 hour'
  },

  // Performance budgets
  PERFORMANCE_BUDGETS: {
    page_load: '< 3 seconds',
    first_contentful_paint: '< 1.5 seconds',
    largest_contentful_paint: '< 2.5 seconds',
    cumulative_layout_shift: '< 0.1',
    first_input_delay: '< 100ms'
  }
};

// Migration helper for replacing console.log
export const MIGRATION_HELPERS = {
  // RegEx patterns to find console statements
  CONSOLE_PATTERNS: [
    /console\.(log|info|warn|error|debug)\(/g,
    /console\.group\(/g,
    /console\.table\(/g
  ],

  // Replacement suggestions
  REPLACEMENTS: {
    'console.log': 'logger.info',
    'console.info': 'logger.info', 
    'console.warn': 'logger.warn',
    'console.error': 'logger.error',
    'console.debug': 'logger.debug'
  },

  // Code transformation examples
  EXAMPLES: `
    // Before
    console.log('User logged in', user);
    console.error('API error', error);
    
    // After  
    logger.info('User logged in', { userId: user.id, feature: 'auth' });
    logger.error('API call failed', error, { endpoint: '/api/login' });
  `
};