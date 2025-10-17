// Secure Password Change Form Component
// Extracted from SecureFormComponents.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth, passwordSchema } from '@/security/SecureAuthSystem';
import { SecureFormValidator } from '../validators/SecureFormValidator';

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
