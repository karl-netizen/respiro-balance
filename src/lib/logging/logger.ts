/**
 * Centralized logging system with environment-based filtering
 * Replaces all console.log statements with structured logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  component?: string;
  feature?: string;
  stackTrace?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  remoteEndpoint?: string;
  sanitizeData: boolean;
}

class Logger {
  private config: LoggerConfig;
  private storage: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: this.getEnvironmentLogLevel(),
      enableConsole: process.env.NODE_ENV === 'development',
      enableRemote: process.env.NODE_ENV === 'production',
      enableStorage: true,
      maxStorageEntries: 1000,
      sanitizeData: true,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private getEnvironmentLogLevel(): LogLevel {
    const env = process.env.NODE_ENV;
    switch (env) {
      case 'development':
        return LogLevel.DEBUG;
      case 'test':
        return LogLevel.WARN;
      case 'production':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    if (!this.config.sanitizeData) return context;

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'ssn', 'creditCard'];
    
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result: any = Array.isArray(obj) ? [] : {};
      
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };

    return sanitizeObject(sanitized);
  }

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context: context ? this.sanitizeContext(context) : undefined,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
      stackTrace: error?.stack,
      component: context?.component,
      feature: context?.feature
    };
  }

  private getCurrentUserId(): string | undefined {
    // Integration with your auth system
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.user?.id;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }

  private outputToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const levelColors = {
      [LogLevel.DEBUG]: 'color: #6366f1',
      [LogLevel.INFO]: 'color: #059669',
      [LogLevel.WARN]: 'color: #d97706',
      [LogLevel.ERROR]: 'color: #dc2626'
    };

    const prefix = `[${LogLevel[entry.level]}] ${entry.timestamp.toISOString()}`;
    const style = levelColors[entry.level];

    if (entry.context) {
      console.group(`%c${prefix} ${entry.message}`, style);
      console.log('Context:', entry.context);
      if (entry.stackTrace) console.log('Stack:', entry.stackTrace);
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${entry.message}`, style);
    }
  }

  private storeEntry(entry: LogEntry): void {
    if (!this.config.enableStorage) return;

    this.storage.push(entry);
    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage.shift();
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fail silently to avoid infinite loops
      console.error('Failed to send log to remote:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);
    
    this.outputToConsole(entry);
    this.storeEntry(entry);
    
    if (this.config.enableRemote) {
      this.sendToRemote(entry).catch(() => {
        // Ignore remote logging failures
      });
    }
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  public getUserFlow(action: string, context?: Record<string, any>): void {
    this.info(`User Flow: ${action}`, { 
      ...context, 
      component: 'userFlow',
      feature: 'analytics' 
    });
  }

  public performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      ...context,
      duration,
      component: 'performance',
      feature: 'monitoring'
    });
  }

  public getLogs(filter?: { level?: LogLevel; component?: string; feature?: string }): LogEntry[] {
    let filtered = this.storage;

    if (filter?.level !== undefined) {
      filtered = filtered.filter(entry => entry.level >= filter.level!);
    }

    if (filter?.component) {
      filtered = filtered.filter(entry => entry.component === filter.component);
    }

    if (filter?.feature) {
      filtered = filtered.filter(entry => entry.feature === filter.feature);
    }

    return filtered;
  }

  public clearLogs(): void {
    this.storage = [];
  }

  private setupGlobalErrorHandlers(): void {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', event.reason, {
        component: 'global',
        feature: 'errorHandling',
        promise: event.promise
      });
    });

    // Global errors
    window.addEventListener('error', (event) => {
      this.error('Global Error', new Error(event.message), {
        component: 'global',
        feature: 'errorHandling',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions for common patterns
export const logUserAction = (action: string, context?: Record<string, any>) => {
  logger.getUserFlow(action, context);
};

export const logPerformance = (operation: string, startTime: number, context?: Record<string, any>) => {
  const duration = Date.now() - startTime;
  logger.performance(operation, duration, context);
};

export const logError = (message: string, error?: Error, context?: Record<string, any>) => {
  logger.error(message, error, context);
};

export const logApiCall = (endpoint: string, method: string, duration: number, status: number, context?: Record<string, any>) => {
  const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
  const message = `API ${method} ${endpoint} - ${status}`;
  const logContext = {
    ...context,
    endpoint,
    method,
    status,
    duration,
    component: 'api',
    feature: 'network'
  };
  
  if (level === LogLevel.ERROR) {
    logger.error(message, undefined, logContext);
  } else {
    logger.info(message, logContext);
  }
};