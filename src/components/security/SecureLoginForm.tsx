import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { useAuth, emailSchema, passwordSchema, type LoginCredentials, type SecurityError } from '@/security/SecureAuthSystem';
import { type Failure } from '@/types/advanced-patterns';
import { Badge } from '@/components/ui/badge';

// Form validation schema
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SecureLoginFormProps {
  onSuccess?: () => void;
  onError?: (error: SecurityError) => void;
}

export const SecureLoginForm: React.FC<SecureLoginFormProps> = ({
  onSuccess,
  onError
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SecurityError | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const { login, state } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });
  
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    if (state.type === 'locked') {
      setError({
        type: 'account_locked',
        unlockAt: state.unlockAt,
        reason: state.reason
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const credentials: LoginCredentials = {
        type: 'password',
        email: data.email as any, // Cast to Email branded type
        password: data.password as any, // Cast to PlainPassword branded type
        rememberMe: data.rememberMe
      };
      
      const result = await login(credentials);
      
      if (result.success) {
        onSuccess?.();
      } else {
        const loginError = (result as Failure<SecurityError>).error;
        setError(loginError);
        setAttemptCount(prev => prev + 1);
        onError?.(loginError);
      }
    } catch (err) {
      const securityError: SecurityError = {
        type: 'suspicious_activity',
        reason: 'Unexpected error during login',
        actionTaken: 'Login attempt blocked'
      };
      setError(securityError);
      onError?.(securityError);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: SecurityError): string => {
    switch (error.type) {
      case 'invalid_credentials':
        return `Invalid email or password. ${error.maxAttempts - error.attempts} attempts remaining.`;
      case 'account_locked':
        return `Account locked due to ${error.reason}. Try again after ${error.unlockAt.toLocaleTimeString()}.`;
      case 'rate_limited':
        return `Too many attempts. Please wait ${Math.ceil((error.retryAfter.getTime() - Date.now()) / 60000)} minutes.`;
      case 'two_factor_required':
        return 'Two-factor authentication required. Please enter your verification code.';
      case 'password_policy_violation':
        return `Password policy violation: ${error.violations.join(', ')}`;
      case 'device_not_trusted':
        return 'Device not trusted. Please verify your identity.';
      case 'suspicious_activity':
        return `Suspicious activity detected: ${error.reason}. ${error.actionTaken}`;
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const getSecurityLevel = (): 'low' | 'medium' | 'high' => {
    if (!watchedEmail || !watchedPassword) return 'low';
    
    const hasStrongPassword = passwordSchema.safeParse(watchedPassword).success;
    const hasValidEmail = emailSchema.safeParse(watchedEmail).success;
    
    if (hasStrongPassword && hasValidEmail) return 'high';
    if (hasValidEmail) return 'medium';
    return 'low';
  };

  const securityLevel = getSecurityLevel();
  const isAccountLocked = state.type === 'locked';
  const showRateLimitWarning = error?.type === 'rate_limited' || attemptCount >= 3;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Login
          </CardTitle>
          <Badge 
            variant={
              securityLevel === 'high' ? 'default' : 
              securityLevel === 'medium' ? 'secondary' : 'outline'
            }
          >
            {securityLevel.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>
          Enter your credentials to access your secure account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Security Warnings */}
          {isAccountLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account locked until {state.unlockAt.toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
          
          {showRateLimitWarning && !isAccountLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Multiple failed attempts detected. Please be careful.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="enter@email.com"
              autoComplete="username"
              disabled={isLoading || isAccountLocked}
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your secure password"
                autoComplete="current-password"
                disabled={isLoading || isAccountLocked}
                {...register('password')}
                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isAccountLocked}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <input
              id="rememberMe"
              type="checkbox"
              disabled={isLoading || isAccountLocked}
              {...register('rememberMe')}
              className="rounded border-gray-300"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me for 30 days
            </label>
          </div>
          
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading || isAccountLocked}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Sign In Securely
              </>
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Forgot your password?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Reset Password
              </button>
            </p>
            
            <p className="text-xs text-muted-foreground">
              🔒 Protected by enterprise-grade security
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SecureLoginForm;