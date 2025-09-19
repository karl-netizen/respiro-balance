// ===================================================================
// TYPE-SAFE AUTHENTICATION & SECURITY SYSTEM
// ===================================================================

import { 
  Brand,
  Result,
  Ok,
  Err,
  Failure,
  AuthState,
  UserId,
  Email,
  createUserId,
  createEmail 
} from '../types/advanced-patterns';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { z } from 'zod'; // For runtime validation

// 1. SECURITY-FOCUSED BRANDED TYPES
// ===================================================================

// Security tokens with expiration
export type AccessToken = Brand<string, 'AccessToken'> & { 
  readonly __expires: Date; 
  readonly __scopes: readonly string[];
};
export type RefreshToken = Brand<string, 'RefreshToken'>;
export type SessionId = Brand<string, 'SessionId'>;
export type CSRFToken = Brand<string, 'CSRFToken'>;

// Password types for different security levels
export type PlainPassword = Brand<string, 'PlainPassword'>;
export type HashedPassword = Brand<string, 'HashedPassword'>;
export type SaltedHash = Brand<string, 'SaltedHash'>;

// Security-related IDs
export type SecurityQuestionId = Brand<string, 'SecurityQuestionId'>;
export type TwoFactorToken = Brand<string, 'TwoFactorToken'>;
export type RecoveryCode = Brand<string, 'RecoveryCode'>;

// Rate limiting keys
export type RateLimitKey = Brand<string, 'RateLimitKey'>;
export type IPAddress = Brand<string, 'IPAddress'>;

// 2. AUTHENTICATION STATE MANAGEMENT
// ===================================================================

// Enhanced auth state with security context
export type SecureAuthState = 
  | { type: 'unauthenticated'; lastFailedAttempt?: Date }
  | { type: 'authenticating'; method: 'password' | '2fa' | 'biometric' }
  | { 
      type: 'authenticated'; 
      user: SecureUser;
      session: SecureSession;
      permissions: readonly Permission[];
      lastActivity: Date;
      requiresPasswordChange: boolean;
      mfaEnabled: boolean;
    }
  | { 
      type: 'locked'; 
      reason: 'failed_attempts' | 'suspicious_activity' | 'admin_lock';
      unlockAt: Date;
    }
  | { type: 'expired'; canRefresh: boolean }
  | { type: 'error'; error: SecurityError; canRetry: boolean };

export interface SecureUser {
  id: UserId;
  email: Email;
  role: UserRole;
  permissions: readonly Permission[];
  securityLevel: 'basic' | 'enhanced' | 'high';
  mfaEnabled: boolean;
  lastPasswordChange: Date;
  accountStatus: 'active' | 'suspended' | 'pending_verification';
  loginHistory: readonly LoginAttempt[];
}

export interface SecureSession {
  id: SessionId;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  csrfToken: CSRFToken;
  expiresAt: Date;
  ipAddress: IPAddress;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  isDeviceTrusted: boolean;
}

// User roles with hierarchical permissions
export type UserRole = 'guest' | 'user' | 'moderator' | 'admin' | 'super_admin';

export type Permission = 
  | 'read:profile'
  | 'write:profile'
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:content'
  | 'write:content'
  | 'moderate:content'
  | 'admin:system'
  | 'super:all';

// Login attempt tracking
export interface LoginAttempt {
  timestamp: Date;
  ipAddress: IPAddress;
  userAgent: string;
  success: boolean;
  method: 'password' | '2fa' | 'social' | 'biometric';
  failureReason?: 'invalid_credentials' | 'account_locked' | 'rate_limited' | '2fa_required';
}

// 3. SECURITY ERROR TYPES
// ===================================================================

export type SecurityError = 
  | { type: 'invalid_credentials'; attempts: number; maxAttempts: number }
  | { type: 'account_locked'; unlockAt: Date; reason: string }
  | { type: 'rate_limited'; retryAfter: Date; limitType: 'login' | 'api' | 'password_reset' }
  | { type: 'session_expired'; canRefresh: boolean }
  | { type: 'insufficient_permissions'; required: Permission[]; current: Permission[] }
  | { type: 'csrf_token_invalid'; newToken: CSRFToken }
  | { type: 'suspicious_activity'; reason: string; actionTaken: string }
  | { type: 'password_policy_violation'; violations: PasswordViolation[] }
  | { type: 'two_factor_required'; methods: TwoFactorMethod[] }
  | { type: 'device_not_trusted'; trustToken?: string };

export type PasswordViolation = 
  | 'too_short'
  | 'too_long'
  | 'no_uppercase'
  | 'no_lowercase' 
  | 'no_numbers'
  | 'no_special_chars'
  | 'common_password'
  | 'previous_password'
  | 'contains_personal_info';

export type TwoFactorMethod = 'totp' | 'sms' | 'email' | 'backup_codes' | 'hardware_key';

// 4. INPUT VALIDATION & SANITIZATION
// ===================================================================

// Zod schemas for runtime validation
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .refine(email => !email.includes('<script'), 'Potentially malicious email');

export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password too long')
  .refine(pwd => /[A-Z]/.test(pwd), 'Must contain uppercase letter')
  .refine(pwd => /[a-z]/.test(pwd), 'Must contain lowercase letter')
  .refine(pwd => /[0-9]/.test(pwd), 'Must contain number')
  .refine(pwd => /[^A-Za-z0-9]/.test(pwd), 'Must contain special character')
  .refine(pwd => !/(password|123456|qwerty)/i.test(pwd), 'Common password not allowed');

export const userInputSchema = z.object({
  name: z.string()
    .min(1, 'Name required')
    .max(100, 'Name too long')
    .refine(name => !/[<>\"']/.test(name), 'Invalid characters in name'),
  
  bio: z.string()
    .max(500, 'Bio too long')
    .refine(bio => !/<script|javascript:|on\w+=/i.test(bio), 'Potentially malicious content'),
  
  website: z.string()
    .url('Invalid URL')
    .optional()
    .refine(url => !url || new URL(url).protocol === 'https:', 'Only HTTPS URLs allowed'),
});

// Sanitization utilities
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

export const sanitizeUserInput = (input: unknown): Result<string, string> => {
  if (typeof input !== 'string') {
    return Err('Input must be a string');
  }
  
  if (input.length > 10000) {
    return Err('Input too long');
  }
  
  // Check for XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /eval\s*\(/gi,
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return Err('Potentially malicious content detected');
    }
  }
  
  return Ok(sanitizeHtml(input));
};

// 5. AUTHENTICATION SERVICE
// ===================================================================

export interface AuthService {
  login(credentials: LoginCredentials): Promise<Result<SecureSession, SecurityError>>;
  logout(sessionId: SessionId): Promise<Result<void, SecurityError>>;
  refreshToken(refreshToken: RefreshToken): Promise<Result<AccessToken, SecurityError>>;
  changePassword(oldPassword: PlainPassword, newPassword: PlainPassword): Promise<Result<void, SecurityError>>;
  enableTwoFactor(): Promise<Result<{ qrCode: string; backupCodes: RecoveryCode[] }, SecurityError>>;
  verifyTwoFactor(token: TwoFactorToken): Promise<Result<void, SecurityError>>;
  resetPassword(email: Email): Promise<Result<void, SecurityError>>;
  getCurrentUser(): Promise<Result<SecureUser, SecurityError>>;
  validateSession(): Promise<Result<boolean, SecurityError>>;
}

export type LoginCredentials = 
  | { type: 'password'; email: Email; password: PlainPassword; rememberMe?: boolean }
  | { type: '2fa'; sessionId: SessionId; token: TwoFactorToken }
  | { type: 'refresh'; refreshToken: RefreshToken }
  | { type: 'social'; provider: 'google' | 'github' | 'microsoft'; token: string };

export class SecureAuthService implements AuthService {
  private readonly baseUrl: string;
  private readonly rateLimiter: RateLimiter;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.rateLimiter = new RateLimiter();
  }

  async login(credentials: LoginCredentials): Promise<Result<SecureSession, SecurityError>> {
    // Rate limiting check
    const rateLimitKey = this.getRateLimitKey(credentials);
    const rateLimitResult = await this.rateLimiter.checkLimit(rateLimitKey, 5, 300); // 5 attempts per 5 minutes
    
    if (!rateLimitResult.allowed) {
      return Err({
        type: 'rate_limited',
        retryAfter: rateLimitResult.retryAfter,
        limitType: 'login'
      });
    }

    try {
      const response = await this.secureRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json() as SecurityError;
        
        // Track failed attempt
        await this.rateLimiter.recordAttempt(rateLimitKey, false);
        
        return Err(error);
      }

      const session: SecureSession = await response.json();
      
      // Store session securely
      await this.storeSession(session);
      
      // Track successful attempt
      await this.rateLimiter.recordAttempt(rateLimitKey, true);
      
      return Ok(session);
      
    } catch (error) {
      return Err({
        type: 'suspicious_activity',
        reason: 'Network request failed',
        actionTaken: 'Login blocked'
      });
    }
  }

  async logout(sessionId: SessionId): Promise<Result<void, SecurityError>> {
    try {
      await this.secureRequest(`/auth/logout/${sessionId}`, {
        method: 'POST',
      });
      
      // Clear local session
      await this.clearSession();
      
      return Ok(undefined);
    } catch (error) {
      return Err({
        type: 'suspicious_activity',
        reason: 'Logout request failed',
        actionTaken: 'Session cleared locally'
      });
    }
  }

  async changePassword(
    oldPassword: PlainPassword, 
    newPassword: PlainPassword
  ): Promise<Result<void, SecurityError>> {
    // Validate new password
    const validationResult = passwordSchema.safeParse(newPassword);
    if (!validationResult.success) {
      const violations = validationResult.error.issues.map(issue => 
        issue.message.toLowerCase().replace(/\s+/g, '_')
      ) as PasswordViolation[];
      
      return Err({
        type: 'password_policy_violation',
        violations
      });
    }

    try {
      const response = await this.secureRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: await this.hashPassword(oldPassword),
          newPassword: await this.hashPassword(newPassword)
        }),
      });

      if (!response.ok) {
        const error = await response.json() as SecurityError;
        return Err(error);
      }

      return Ok(undefined);
    } catch (error) {
      return Err({
        type: 'suspicious_activity',
        reason: 'Password change request failed',
        actionTaken: 'Request blocked'
      });
    }
  }

  // Additional methods...
  async refreshToken(refreshToken: RefreshToken): Promise<Result<AccessToken, SecurityError>> {
    try {
      const response = await this.secureRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return Err({ type: 'session_expired', canRefresh: false });
      }

      const { accessToken } = await response.json();
      return Ok(accessToken);
    } catch (error) {
      return Err({ type: 'session_expired', canRefresh: false });
    }
  }

  async enableTwoFactor(): Promise<Result<{ qrCode: string; backupCodes: RecoveryCode[] }, SecurityError>> {
    // Implementation for 2FA setup
    throw new Error('Not implemented');
  }

  async verifyTwoFactor(token: TwoFactorToken): Promise<Result<void, SecurityError>> {
    // Implementation for 2FA verification
    throw new Error('Not implemented');
  }

  async resetPassword(email: Email): Promise<Result<void, SecurityError>> {
    // Implementation for password reset
    throw new Error('Not implemented');
  }

  async getCurrentUser(): Promise<Result<SecureUser, SecurityError>> {
    // Implementation to get current user
    throw new Error('Not implemented');
  }

  async validateSession(): Promise<Result<boolean, SecurityError>> {
    // Implementation to validate current session
    throw new Error('Not implemented');
  }

  // Private helper methods
  private async secureRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const session = await this.getStoredSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      ...options.headers,
    };

    if (session) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
      headers['X-CSRF-Token'] = session.csrfToken;
    }

    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'same-origin', // CSRF protection
    });
  }

  private getRateLimitKey(credentials: LoginCredentials): RateLimitKey {
    if (credentials.type === 'password') {
      return `login:${credentials.email}` as RateLimitKey;
    }
    return `login:${credentials.type}` as RateLimitKey;
  }

  private async hashPassword(password: PlainPassword): Promise<HashedPassword> {
    // In a real app, use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex as HashedPassword;
  }

  private async storeSession(session: SecureSession): Promise<void> {
    // Store in secure HTTP-only cookie or secure storage
    // Never store in localStorage for security
    sessionStorage.setItem('session', JSON.stringify(session));
  }

  private async getStoredSession(): Promise<SecureSession | null> {
    const stored = sessionStorage.getItem('session');
    return stored ? JSON.parse(stored) : null;
  }

  private async clearSession(): Promise<void> {
    sessionStorage.removeItem('session');
  }
}

// 6. RATE LIMITING SYSTEM
// ===================================================================

interface RateLimitResult {
  allowed: boolean;
  retryAfter: Date;
  remainingAttempts: number;
}

class RateLimiter {
  private attempts = new Map<string, { count: number; resetAt: Date; successful: boolean[] }>();

  async checkLimit(
    key: RateLimitKey, 
    maxAttempts: number, 
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const now = new Date();
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetAt) {
      // Reset window
      this.attempts.set(key, {
        count: 0,
        resetAt: new Date(now.getTime() + windowSeconds * 1000),
        successful: []
      });
      
      return {
        allowed: true,
        retryAfter: new Date(now.getTime() + windowSeconds * 1000),
        remainingAttempts: maxAttempts
      };
    }

    const allowed = entry.count < maxAttempts;
    
    return {
      allowed,
      retryAfter: entry.resetAt,
      remainingAttempts: Math.max(0, maxAttempts - entry.count)
    };
  }

  async recordAttempt(key: RateLimitKey, success: boolean): Promise<void> {
    const entry = this.attempts.get(key);
    if (entry) {
      entry.count++;
      entry.successful.push(success);
      
      // Increase penalty for consecutive failures
      if (!success && entry.successful.slice(-3).every(s => !s)) {
        entry.resetAt = new Date(entry.resetAt.getTime() + 60000); // Add 1 minute penalty
      }
    }
  }
}

// 7. PERMISSION SYSTEM
// ===================================================================

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  guest: [],
  user: ['read:profile', 'write:profile', 'read:content'],
  moderator: ['read:profile', 'write:profile', 'read:content', 'write:content', 'moderate:content'],
  admin: ['read:profile', 'write:profile', 'read:content', 'write:content', 'moderate:content', 'read:users', 'write:users', 'admin:system'],
  super_admin: ['super:all'], // Super admin has all permissions
} as const;

export const hasPermission = (userPermissions: readonly Permission[], required: Permission): boolean => {
  return userPermissions.includes('super:all') || userPermissions.includes(required);
};

export const hasAnyPermission = (userPermissions: readonly Permission[], required: readonly Permission[]): boolean => {
  return userPermissions.includes('super:all') || required.some(perm => userPermissions.includes(perm));
};

export const hasAllPermissions = (userPermissions: readonly Permission[], required: readonly Permission[]): boolean => {
  return userPermissions.includes('super:all') || required.every(perm => userPermissions.includes(perm));
};

// Permission guard hook
export const useRequirePermission = (permission: Permission): boolean => {
  const { user } = useAuth();
  return user?.permissions ? hasPermission(user.permissions, permission) : false;
};

// 8. AUTHENTICATION CONTEXT
// ===================================================================

interface AuthContextType {
  state: SecureAuthState;
  login: (credentials: LoginCredentials) => Promise<Result<void, SecurityError>>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<Result<void, SecurityError>>;
  user: SecureUser | null;
  session: SecureSession | null;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SecureAuthState>({ type: 'unauthenticated' });
  const [authService] = useState(() => new SecureAuthService('/api'));

  // Auto-validate session on mount
  useEffect(() => {
    validateCurrentSession();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (state.type === 'authenticated') {
      const timeToExpiry = state.session.expiresAt.getTime() - Date.now();
      const refreshTime = Math.max(0, timeToExpiry - 300000); // Refresh 5 minutes before expiry

      const timer = setTimeout(async () => {
        const result = await authService.refreshToken(state.session.refreshToken);
        if (result.success) {
          // Update session with new token
          setState(prev => {
            if (prev.type === 'authenticated') {
              return {
                ...prev,
                session: {
                  ...prev.session,
                  accessToken: result.data
                }
              };
            }
            return prev;
          });
        } else {
          setState({ type: 'expired', canRefresh: false });
        }
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [state, authService]);

  const validateCurrentSession = async () => {
    const result = await authService.validateSession();
    if (!result.success) {
      setState({ type: 'unauthenticated' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<Result<void, SecurityError>> => {
    setState({ type: 'authenticating', method: 'password' });
    
    const result = await authService.login(credentials);
    
    if (result.success) {
      const userResult = await authService.getCurrentUser();
      
      if (userResult.success) {
        const permissions = ROLE_PERMISSIONS[userResult.data.role];
        
        setState({
          type: 'authenticated',
          user: userResult.data,
          session: result.data,
          permissions,
          lastActivity: new Date(),
          requiresPasswordChange: userResult.data.lastPasswordChange < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days
          mfaEnabled: userResult.data.mfaEnabled
        });
        
        return Ok(undefined);
      }
    }
    
    if (!result.success) {
      const error = (result as Failure<SecurityError>).error;
      setState({ 
        type: 'error', 
        error: error, 
        canRetry: error.type !== 'account_locked' 
      });
      
      return result as Result<void, SecurityError>;
    }
  };

  const logout = async (): Promise<void> => {
    if (state.type === 'authenticated') {
      await authService.logout(state.session.id);
    }
    setState({ type: 'unauthenticated' });
  };

  const refreshToken = async (): Promise<Result<void, SecurityError>> => {
    if (state.type !== 'authenticated') {
      return Err({ type: 'session_expired', canRefresh: false });
    }

    const result = await authService.refreshToken(state.session.refreshToken);
    
    if (result.success) {
      setState(prev => {
        if (prev.type === 'authenticated') {
          return {
            ...prev,
            session: {
              ...prev.session,
              accessToken: result.data
            }
          };
        }
        return prev;
      });
      return Ok(undefined);
    }
    
    return result as Result<void, SecurityError>;
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    refreshToken,
    user: state.type === 'authenticated' ? state.user : null,
    session: state.type === 'authenticated' ? state.session : null,
    isAuthenticated: state.type === 'authenticated',
    hasPermission: (permission: Permission) => 
      state.type === 'authenticated' && hasPermission(state.permissions, permission),
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export the main service and utilities
export { RateLimiter };
export default { 
  AuthProvider, 
  useAuth, 
  SecureAuthService,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  sanitizeUserInput,
  sanitizeHtml 
};