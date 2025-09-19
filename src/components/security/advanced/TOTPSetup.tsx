// ===================================================================
// TOTP (Time-based One-Time Password) SETUP COMPONENT
// ===================================================================

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface TOTPSetupData {
  secret: string;
  qrCode: string;
  accountName: string;
  backupCodes: string[];
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

export class AdvancedTwoFactorService {
  async setupTOTP(userId: string): Promise<Result<TOTPSetupData, SecurityError>> {
    // In demo mode, generate mock TOTP setup data
    return new Promise((resolve) => {
      setTimeout(() => {
        const secret = this.generateSecret();
        const accountName = 'user@example.com';
        const issuer = 'Respiro Balance';
        
        // Generate mock QR code data URL
        const qrData = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
        const qrCodeUrl = `data:image/svg+xml;base64,${btoa(this.generateQRCodeSVG(qrData))}`;
        
        resolve(Ok({
          secret,
          qrCode: qrCodeUrl,
          accountName,
          backupCodes: this.generateBackupCodes()
        }));
      }, 1000);
    });
  }

  async verifyTOTPSetup(
    userId: string, 
    code: string, 
    secret: string
  ): Promise<Result<string[], SecurityError>> {
    // In demo mode, accept any 6-digit code
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.length === 6 && /^\d+$/.test(code)) {
          resolve(Ok(this.generateBackupCodes()));
        } else {
          resolve(Err({
            type: 'invalid_credentials',
            reason: 'Invalid verification code'
          }));
        }
      }, 800);
    });
  }

  private generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(10).substr(2, 8);
      codes.push(code.match(/.{4}/g)?.join('-') || code);
    }
    return codes;
  }

  private generateQRCodeSVG(data: string): string {
    // Simple mock QR code SVG
    return `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">QR CODE</text>
        <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="8">(Demo)</text>
      </svg>
    `;
  }
}

// TOTP Setup Component
interface TOTPSetupProps {
  onSuccess: (backupCodes: string[]) => void;
  onError: (error: SecurityError) => void;
}

export const TOTPSetup: React.FC<TOTPSetupProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [setupData, setSetupData] = useState<TOTPSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'init' | 'verify' | 'complete'>('init');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  const twoFactorService = new AdvancedTwoFactorService();

  const handleSetupStart = async () => {
    setIsLoading(true);
    
    const result = await twoFactorService.setupTOTP('current-user-id');
    
    if (result.success) {
      setSetupData(result.data!);
      setStep('verify');
    } else {
      onError(result.error!);
    }
    
    setIsLoading(false);
  };

  const handleVerification = async () => {
    if (!setupData || !verificationCode) return;
    
    setIsLoading(true);
    
    const result = await twoFactorService.verifyTOTPSetup(
      'current-user-id',
      verificationCode,
      setupData.secret
    );
    
    if (result.success) {
      onSuccess(result.data!);
      setStep('complete');
      setShowBackupCodes(true);
    } else {
      onError(result.error!);
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  if (step === 'init') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Set Up Authenticator App</h3>
          <p className="text-muted-foreground">
            Use an authenticator app like Google Authenticator, Authy, or 1Password 
            to generate secure verification codes.
          </p>
        </div>

        <Button
          onClick={handleSetupStart}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Setting up...
            </>
          ) : (
            <>
              <span className="mr-2">🔐</span>
              Set Up Authenticator App
            </>
          )}
        </Button>
      </div>
    );
  }

  if (step === 'verify' && setupData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
          <p className="text-muted-foreground">
            Scan this QR code with your authenticator app
          </p>
        </div>

        {/* QR Code Display */}
        <Card className="p-6">
          <div className="flex justify-center">
            <img 
              src={setupData.qrCode} 
              alt="TOTP QR Code"
              className="w-48 h-48"
            />
          </div>
        </Card>

        {/* Manual Entry Option */}
        <Card className="p-4">
          <details className="cursor-pointer">
            <summary className="font-medium text-primary hover:underline">
              Can't scan? Enter manually
            </summary>
            <div className="mt-4 space-y-2">
              <div>
                <Label className="text-sm font-medium">Account:</Label>
                <p className="text-sm text-muted-foreground">{setupData.accountName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Secret Key:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {setupData.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(setupData.secret)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </details>
        </Card>

        {/* Verification */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-wider"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <Button
            onClick={handleVerification}
            disabled={verificationCode.length !== 6 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify & Complete Setup'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'complete' && showBackupCodes) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication Enabled</h3>
          <p className="text-muted-foreground">
            Your account is now protected with two-factor authentication
          </p>
        </div>

        <Alert>
          <div className="space-y-3">
            <p className="font-medium">⚠️ Important: Save Your Backup Codes</p>
            <p className="text-sm">
              Store these backup codes in a safe place. You can use them to access your account 
              if you lose access to your authenticator app.
            </p>
          </div>
        </Alert>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {setupData?.backupCodes.map((code, index) => (
              <div 
                key={index}
                className="p-2 bg-muted rounded text-center"
              >
                {code}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => copyToClipboard(setupData?.backupCodes.join('\n') || '')}
          >
            Copy All Backup Codes
          </Button>
        </Card>

        <Alert>
          <div className="space-y-2">
            <p className="font-medium">🔒 Security Tips</p>
            <ul className="text-sm space-y-1">
              <li>• Keep your backup codes secure and private</li>
              <li>• Don't store them on the same device as your authenticator app</li>
              <li>• Each backup code can only be used once</li>
              <li>• You can generate new backup codes anytime from your security settings</li>
            </ul>
          </div>
        </Alert>
      </div>
    );
  }

  return null;
};