/**
 * Security Utilities
 * Centralized security functions and validation
 */

import { env, isProduction } from '@/config/environment';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Email validation with additional security checks
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email);
  return emailRegex.test(sanitized) && sanitized === email;
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  requirements: { [key: string]: boolean };
} => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommonPatterns: !/(password|123456|qwerty|admin)/i.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const isValid = score >= 4 && requirements.minLength;

  return { isValid, score, requirements };
};

// Rate limiting helper for client-side
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxAttempts: number = 5, timeWindowMinutes: number = 15) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(Date.now());
    this.attempts.set(identifier, attempts);
  }

  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

// Auth rate limiter instance
export const authRateLimiter = new RateLimiter(5, 15); // 5 attempts per 15 minutes

// Session security helpers
export const clearSecuritySensitiveData = (): void => {
  // Clear all authentication-related storage
  const keysToRemove: string[] = [];
  
  // Check localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase.auth') || key.includes('sb-'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage if it exists
  if (typeof sessionStorage !== 'undefined') {
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('supabase.auth') || key.includes('sb-'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure redirect validation
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const allowedOrigins = [
      window.location.origin,
      env.supabase.url,
    ];
    
    return allowedOrigins.some(origin => parsedUrl.origin === origin);
  } catch {
    return false;
  }
};

// Security headers validation (for development)
export const checkSecurityHeaders = (): void => {
  if (!isProduction) return;
  
  // This would typically be done server-side, but we can log warnings
  const missingHeaders = [];
  
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    missingHeaders.push('Content-Security-Policy');
  }
  
  if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
    missingHeaders.push('X-Frame-Options');
  }
  
  if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
    missingHeaders.push('X-Content-Type-Options');
  }
  
  if (missingHeaders.length > 0) {
    console.warn('⚠️ Missing security headers:', missingHeaders);
  }
};

// Audit logging (for security events)
export const logSecurityEvent = (
  event: string,
  details: Record<string, any> = {},
  level: 'info' | 'warn' | 'error' = 'info'
): void => {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details,
  };
  
  if (isProduction) {
    // In production, send to logging service
    console[level](`[SECURITY] ${event}`, logData);
  } else {
    console[level](`[SECURITY] ${event}`, logData);
  }
};