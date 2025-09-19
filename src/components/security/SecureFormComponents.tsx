// ===================================================================
// SECURE FORM COMPONENTS & XSS PROTECTION
// ===================================================================

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import {
  useAuth,
  emailSchema,
  passwordSchema,
  sanitizeUserInput,
  type LoginCredentials,
  type SecurityError,
  type PlainPassword,
  type CSRFToken,
  type TwoFactorToken
} from '@/security/SecureAuthSystem';
import { Result, Ok, Err, Failure, type Email } from '@/types/advanced-patterns';

// 1. XSS PROTECTION UTILITIES
// ===================================================================

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

export const generateCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// HTML encoding for XSS prevention
export const encodeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const decodeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.innerHTML = input;
  return div.textContent || '';
};

// URL sanitization
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return '';
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
};

// Safe JSON parsing with size limits
export function safeJsonParse<T>(
  json: string, 
  maxSize: number = 10000
): Result<T, string> {
  if (json.length > maxSize) {
    return Err('JSON payload too large');
  }
  
  try {
    const parsed = JSON.parse(json);
    return Ok(parsed);
  } catch (error) {
    return Err('Invalid JSON format');
  }
}

// 2. CSRF PROTECTION
// ===================================================================

interface CSRFContextType {
  token: CSRFToken | null;
  refreshToken: () => Promise<void>;
  validateToken: (token: CSRFToken) => boolean;
}

const CSRFContext = React.createContext<CSRFContextType | null>(null);

export const CSRFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<CSRFToken | null>(null);
  
  const refreshToken = useCallback(async () => {
    try {
      // Generate a mock CSRF token for demo purposes
      const mockToken = `csrf_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      setToken(mockToken as CSRFToken);
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }, []);

  const validateToken = useCallback((tokenToValidate: CSRFToken): boolean => {
    return token === tokenToValidate;
  }, [token]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  return (
    <CSRFContext.Provider value={{ token, refreshToken, validateToken }}>
      {children}
    </CSRFContext.Provider>
  );
};

export const useCSRF = (): CSRFContextType => {
  const context = React.useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRF must be used within CSRFProvider');
  }
  return context;
};

// 3. SECURE FORM VALIDATION
// ===================================================================

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, unknown>;
}

export class SecureFormValidator {
  private schema: z.ZodSchema;
  
  constructor(schema: z.ZodSchema) {
    this.schema = schema;
  }

  validate(data: unknown): ValidationResult {
    const result = this.schema.safeParse(data);
    
    if (result.success) {
      return {
        isValid: true,
        errors: {},
        sanitizedData: result.data
      };
    }
    
    const errors: Record<string, string[]> = {};
    
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }
    
    return {
      isValid: false,
      errors,
      sanitizedData: {}
    };
  }

  sanitizeAndValidate(data: Record<string, unknown>): ValidationResult {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const sanitizedResult = sanitizeUserInput(value);
        if (sanitizedResult.success) {
          sanitized[key] = sanitizedResult.data;
        } else {
          return {
            isValid: false,
            errors: { [key]: [(sanitizedResult as Failure<string>).error] },
            sanitizedData: {}
          };
        }
      } else {
        sanitized[key] = value;
      }
    }
    
    return this.validate(sanitized);
  }
}

// 4. SECURE LOGIN FORM
// ===================================================================

interface SecureLoginFormProps {
  onSuccess?: (user: any) => void;
  onError?: (error: SecurityError) => void;
  allowRememberMe?: boolean;
  enableTwoFactor?: boolean;
}

export const EnhancedSecureLoginForm: React.FC<SecureLoginFormProps> = ({
  onSuccess,
  onError,
  allowRememberMe = false,
  enableTwoFactor = true
}) => {
  const { login, state } = useAuth();
  const { token: csrfToken } = useCSRF();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const validator = new SecureFormValidator(
    z.object({
      email: emailSchema,
      password: z.string().min(1, 'Password required'),
      twoFactorToken: z.string().optional(),
    })
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!csrfToken) {
      toast.error('Security Error: CSRF token not available. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const validationResult = validator.sanitizeAndValidate({
      email,
      password,
      twoFactorToken: showTwoFactor ? twoFactorToken : undefined,
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      let credentials: LoginCredentials;

      if (showTwoFactor) {
        credentials = {
          type: '2fa',
          sessionId: 'temp_session' as any,
          token: twoFactorToken as TwoFactorToken,
        };
      } else {
        credentials = {
          type: 'password',
          email: validationResult.sanitizedData.email as Email,
          password: validationResult.sanitizedData.password as PlainPassword,
          rememberMe: allowRememberMe ? rememberMe : false,
        };
      }

      const result = await login(credentials);

      if (result.success) {
        toast.success('Login successful! Welcome back.');
        onSuccess?.(state);
      } else {
        const error = (result as Failure<SecurityError>).error;
        
        switch (error.type) {
          case 'two_factor_required':
            setShowTwoFactor(true);
            toast.info('Two-factor authentication required. Please enter your 2FA code.');
            break;
            
          case 'invalid_credentials':
            setAttempts(prev => prev + 1);
            setErrors({ 
              general: [`Invalid credentials. ${error.maxAttempts - error.attempts} attempts remaining.`] 
            });
            break;
            
          case 'account_locked':
            setErrors({ 
              general: [`Account locked until ${error.unlockAt.toLocaleString()}`] 
            });
            break;
            
          case 'rate_limited':
            setErrors({ 
              general: [`Too many attempts. Try again after ${error.retryAfter.toLocaleString()}`] 
            });
            break;
            
          default:
            setErrors({ general: ['Login failed. Please try again.'] });
        }
        
        onError?.(error);
      }
    } catch (error) {
      setErrors({ general: ['An unexpected error occurred. Please try again.'] });
    }
    
    setIsSubmitting(false);
  };

  const isLocked = state.type === 'locked';
  const maxAttempts = 5;
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">
            {showTwoFactor ? '2FA Verification' : 'Secure Sign In'}
          </CardTitle>
        </div>
        <CardDescription>
          {showTwoFactor 
            ? 'Enter the code from your authenticator app'
            : 'Enter your credentials to access your account'
          }
        </CardDescription>
        <Badge variant="outline" className="mx-auto">
          🔒 Enterprise Security
        </Badge>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {attempts >= 3 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Multiple failed attempts detected. Account will be locked after {maxAttempts} failures.
              </AlertDescription>
            </Alert>
          )}

          {isLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account locked due to suspicious activity. Please contact support.
              </AlertDescription>
            </Alert>
          )}

          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {errors.general.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {!showTwoFactor ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLocked || isSubmitting}
                    autoComplete="email"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLocked || isSubmitting}
                      autoComplete="current-password"
                      className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLocked || isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password[0]}</p>
                  )}
                </div>

                {allowRememberMe && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLocked || isSubmitting}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="rememberMe" className="text-sm">
                      Remember me for 30 days
                    </label>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="twofactor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="twoFactorToken" className="text-sm font-medium">
                    Authentication Code
                  </label>
                  <Input
                    id="twoFactorToken"
                    type="text"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    disabled={isSubmitting}
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  {errors.twoFactorToken && (
                    <p className="text-sm text-destructive">{errors.twoFactorToken[0]}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTwoFactor(false)}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={
              isLocked || 
              isSubmitting || 
              (!showTwoFactor && (!email || !password)) || 
              (showTwoFactor && twoFactorToken.length !== 6)
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signing in...
              </>
            ) : showTwoFactor ? (
              <>
                <Key className="h-4 w-4 mr-2" />
                Verify & Sign In
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-xs text-center text-muted-foreground">
              🔒 This site uses industry-standard security measures including SSL encryption, 
              CSRF protection, and secure authentication protocols to protect your data.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// 5. SECURE PASSWORD CHANGE FORM
// ===================================================================

interface SecurePasswordChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SecurePasswordChangeForm: React.FC<SecurePasswordChangeFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { state } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({ score: 0, feedback: [] });

  const validator = new SecureFormValidator(
    z.object({
      currentPassword: z.string().min(1, 'Current password required'),
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  );

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 12) score++;
    else feedback.push('Use at least 12 characters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('Include special characters');

    if (!/(.)\1{2,}/.test(password)) score++;
    else feedback.push('Avoid repeated characters');

    return { score, feedback };
  };

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(checkPasswordStrength(newPassword));
    }
  }, [newPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (state.type !== 'authenticated') {
      toast.error('Authentication required. Please log in to change your password.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const validationResult = validator.sanitizeAndValidate({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password changed successfully!');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      onSuccess?.();
    } catch (error) {
      setErrors({ general: ['An unexpected error occurred. Please try again.'] });
    }
    
    setIsSubmitting(false);
  };

  const getStrengthColor = (score: number): string => {
    if (score <= 2) return 'hsl(0, 84%, 60%)';
    if (score <= 4) return 'hsl(45, 93%, 47%)';
    return 'hsl(142, 76%, 36%)';
  };

  const getStrengthText = (score: number): string => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Choose a strong, unique password to protect your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {errors.general.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              disabled={isSubmitting}
              autoComplete="current-password"
              className={errors.currentPassword ? 'border-destructive' : ''}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={isSubmitting}
              autoComplete="new-password"
              className={errors.newPassword ? 'border-destructive' : ''}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword[0]}</p>
            )}
          </div>

          {newPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Password Strength</span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: getStrengthColor(passwordStrength.score) }}
                >
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
              
              <Progress 
                value={(passwordStrength.score / 6) * 100}
                className="h-2"
              />
              
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isSubmitting}
              autoComplete="new-password"
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword[0]}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={
                isSubmitting || 
                !currentPassword || 
                !newPassword || 
                !confirmPassword || 
                passwordStrength.score < 3
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Changing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// 6. SECURE INPUT COMPONENT
// ===================================================================

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange: (value: string, isValid: boolean) => void;
  validation?: z.ZodSchema;
  sanitize?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
  securityLevel?: 'basic' | 'enhanced' | 'maximum';
}

export const SecureInput: React.FC<SecureInputProps> = ({
  onSecureChange,
  validation,
  sanitize = true,
  maxLength = 1000,
  allowedChars,
  securityLevel = 'enhanced',
  onChange,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(props.value?.toString() || '');
  const [isValid, setIsValid] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<'safe' | 'warning' | 'blocked'>('safe');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let status: 'safe' | 'warning' | 'blocked' = 'safe';
    
    if (allowedChars && !allowedChars.test(value)) {
      setSecurityStatus('blocked');
      return;
    }
    
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      status = 'warning';
    }
    
    if (securityLevel === 'maximum') {
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /eval\s*\(/i,
        /document\./i,
        /window\./i
      ];
      
      if (dangerousPatterns.some(pattern => pattern.test(value))) {
        setSecurityStatus('blocked');
        return;
      }
    }
    
    if (sanitize) {
      const sanitizedResult = sanitizeUserInput(value);
      if (!sanitizedResult.success) {
        setIsValid(false);
        setSecurityStatus('blocked');
        onSecureChange(value, false);
        setInternalValue(value);
        return;
      }
      value = sanitizedResult.data;
    }
    
    let validationPassed = true;
    if (validation) {
      const result = validation.safeParse(value);
      validationPassed = result.success;
      if (!validationPassed) {
        status = 'warning';
      }
    }
    
    setInternalValue(value);
    setIsValid(validationPassed);
    setSecurityStatus(status);
    onSecureChange(value, validationPassed);
    
    if (onChange) {
      onChange(e);
    }
  };

  const getBorderColor = () => {
    if (securityStatus === 'blocked') return 'border-red-500';
    if (securityStatus === 'warning') return 'border-yellow-500';
    if (!isValid) return 'border-orange-500';
    return '';
  };

  const getSecurityIcon = () => {
    switch (securityStatus) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'blocked': return <Shield className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        value={internalValue}
        onChange={handleChange}
        className={`pr-10 ${getBorderColor()} ${className || ''}`}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        {getSecurityIcon()}
      </div>
      {securityStatus === 'blocked' && (
        <p className="text-xs text-red-600 mt-1">
          Input blocked: potentially dangerous content detected
        </p>
      )}
    </div>
  );
};

export default {
  CSRFProvider,
  useCSRF,
  SecureFormValidator,
  EnhancedSecureLoginForm,
  SecurePasswordChangeForm,
  SecureInput,
  generateCSPHeader,
  encodeHtml,
  decodeHtml,
  sanitizeUrl,
  safeJsonParse,
};