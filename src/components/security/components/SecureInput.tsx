// Secure Input Component with XSS Protection
// Extracted from SecureFormComponents.tsx

import { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { sanitizeUserInput } from '@/security/SecureAuthSystem';

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
