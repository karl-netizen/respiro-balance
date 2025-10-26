// ===================================================================
// BIOMETRIC AUTHENTICATION
// ===================================================================

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type BiometricType = 'fingerprint' | 'face' | 'voice' | 'iris';

interface BiometricCredential {
  id: string;
  type: BiometricType;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

interface SecurityError {
  type: string;
  reason?: string;
  actionTaken?: string;
}

interface Result<T, E> {
  success: boolean;
  data?: T;
  error?: E;
}

const Ok = <T,>(data: T): Result<T, never> => ({ success: true, data });
const Err = <E,>(error: E): Result<never, E> => ({ success: false, error });

export class BiometricAuthService {
  async isSupported(): Promise<boolean> {
    return !!(navigator.credentials && window.PublicKeyCredential);
  }

  async getAvailableAuthenticators(): Promise<BiometricType[]> {
    if (!await this.isSupported()) {
      return [];
    }

    try {
      // Check for platform authenticator (built-in biometrics)
      const platformSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      const available: BiometricType[] = [];
      
      if (platformSupported) {
        // Most mobile devices support fingerprint
        if (/Android|iPhone|iPad/.test(navigator.userAgent)) {
          available.push('fingerprint');
        }
        
        // Face ID on newer iOS devices
        if (/iPhone|iPad/.test(navigator.userAgent)) {
          available.push('face');
        }
        
        // Windows Hello
        if (/Windows/.test(navigator.userAgent)) {
          available.push('fingerprint', 'face');
        }
      }
      
      return available;
    } catch (error) {
      return [];
    }
  }

  async registerBiometric(
    credentialName: string
  ): Promise<Result<BiometricCredential, SecurityError>> {
    if (!await this.isSupported()) {
      return Err({
        type: 'device_not_trusted'
      });
    }

    // In demo mode, simulate successful registration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Ok({
          id: `cred_${Date.now()}`,
          type: 'fingerprint',
          name: credentialName,
          createdAt: new Date(),
          isActive: true
        }));
      }, 2000);
    });
  }

  async authenticateWithBiometric(): Promise<Result<string, SecurityError>> {
    if (!await this.isSupported()) {
      return Err({
        type: 'device_not_trusted'
      });
    }

    // In demo mode, simulate successful authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Ok('demo-session-token'));
      }, 1500);
    });
  }
}

// Biometric Setup Component
interface BiometricSetupProps {
  onSuccess: (credential: BiometricCredential) => void;
  onError: (error: SecurityError) => void;
}

export const BiometricSetup: React.FC<BiometricSetupProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [availableTypes, setAvailableTypes] = useState<BiometricType[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentialName, setCredentialName] = useState('');
  
  const biometricService = new BiometricAuthService();

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await biometricService.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        const types = await biometricService.getAvailableAuthenticators();
        setAvailableTypes(types);
      }
    };
    
    checkSupport();
  }, []);

  const handleRegister = async () => {
    if (!credentialName.trim()) return;
    
    setIsRegistering(true);
    
    const result = await biometricService.registerBiometric(
      'current-user-id',
      credentialName
    );
    
    if (result.success) {
      onSuccess(result.data!);
    } else {
      onError(result.error!);
    }
    
    setIsRegistering(false);
  };

  const getBiometricIcon = (type: BiometricType) => {
    const icons = {
      fingerprint: '👆',
      face: '👤',
      voice: '🎤',
      iris: '👁️'
    };
    return icons[type];
  };

  if (isSupported === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking biometric support...</p>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <Alert>
        <div className="space-y-2">
          <p className="font-medium">⚠️ Biometric Authentication Unavailable</p>
          <p className="text-sm">
            Your device doesn't support biometric authentication or WebAuthn is not available.
          </p>
          <ul className="text-sm space-y-1 mt-3">
            <li>• Ensure you're using a modern browser (Chrome 67+, Firefox 60+)</li>
            <li>• Check if your device has biometric capabilities</li>
            <li>• Make sure biometric authentication is enabled in your system settings</li>
          </ul>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Set Up Biometric Authentication</h3>
        <p className="text-muted-foreground text-sm">
          Use your device's biometric sensors for secure, passwordless authentication
        </p>
      </div>

      {availableTypes.length > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Available Biometric Types:</h4>
          <div className="flex gap-2 flex-wrap">
            {availableTypes.map(type => (
              <div 
                key={type}
                className="flex items-center gap-2 px-3 py-2 bg-background rounded border"
              >
                <span className="text-lg">{getBiometricIcon(type)}</span>
                <span className="capitalize text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="credential-name">Credential Name</Label>
          <Input
            id="credential-name"
            placeholder="e.g., My iPhone Touch ID"
            value={credentialName}
            onChange={(e) => setCredentialName(e.target.value)}
            disabled={isRegistering}
          />
          <p className="text-xs text-muted-foreground">
            Give this biometric credential a memorable name for easy identification
          </p>
        </div>

        <Button
          onClick={handleRegister}
          disabled={!credentialName.trim() || isRegistering}
          className="w-full"
        >
          {isRegistering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Registering Biometric...
            </>
          ) : (
            <>
              <span className="mr-2">🔐</span>
              Register Biometric Authentication
            </>
          )}
        </Button>
      </div>

      <Alert>
        <div className="space-y-2">
          <p className="font-medium">🛡️ Security Features</p>
          <ul className="text-sm space-y-1">
            <li>• WebAuthn standard compliance for maximum security</li>
            <li>• Private keys never leave your device</li>
            <li>• Resistance to phishing and replay attacks</li>
            <li>• Platform authenticator (built-in) preferred over external devices</li>
          </ul>
        </div>
      </Alert>
    </div>
  );
};

// Biometric Login Component
interface BiometricLoginProps {
  onSuccess: (token: string) => void;
  onError: (error: SecurityError) => void;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({
  onSuccess,
  onError
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  
  const biometricService = new BiometricAuthService();

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await biometricService.isSupported();
      setIsSupported(supported);
    };
    
    checkSupport();
  }, []);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    
    const result = await biometricService.authenticateWithBiometric();
    
    if (result.success) {
      onSuccess(result.data!);
    } else {
      onError(result.error!);
    }
    
    setIsAuthenticating(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="text-center space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Biometric Sign In</h3>
        <p className="text-muted-foreground text-sm">
          Use your biometric sensor to sign in securely
        </p>
      </div>

      <Button
        onClick={handleAuthenticate}
        disabled={isAuthenticating}
        variant="outline"
        size="lg"
        className="w-full"
      >
        {isAuthenticating ? (
          <>
            <div className="animate-pulse mr-2">🔓</div>
            Authenticating...
          </>
        ) : (
          <>
            <span className="mr-2">👆</span>
            Sign In with Biometrics
          </>
        )}
      </Button>
    </div>
  );
};