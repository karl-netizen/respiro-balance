// ===================================================================
// ADVANCED SECURITY INTEGRATIONS DEMO
// ===================================================================

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Import all advanced security components
import { OAuthLoginSection, type OAuthProvider } from './OAuthIntegration';
import { BiometricSetup, BiometricLogin } from './BiometricAuth';
import { TOTPSetup } from './TOTPSetup';
import { DeviceManagement } from './DeviceManagement';
import { SecurityAlerts } from './SecurityMonitoring';

const AdvancedSecurityDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');

  // Demo handlers
  const handleOAuthSuccess = (tokens: any) => {
    console.log('OAuth Success:', tokens);
  };

  const handleOAuthError = (error: any) => {
    console.log('OAuth Error:', error);
  };

  const handleBiometricSuccess = (credential: any) => {
    console.log('Biometric Success:', credential);
  };

  const handleBiometricError = (error: any) => {
    console.log('Biometric Error:', error);
  };

  const handleTOTPSuccess = (backupCodes: string[]) => {
    console.log('TOTP Success:', backupCodes);
  };

  const handleTOTPError = (error: any) => {
    console.log('TOTP Error:', error);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Advanced Security Integrations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive security features including OAuth 2.0, biometric authentication, 
          TOTP 2FA, device management, and security monitoring - all implemented with 
          enterprise-grade security standards.
        </p>
        <Badge variant="outline" className="text-sm">
          🔒 Production-Ready Security Suite
        </Badge>
      </div>

      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
          <TabsTrigger value="biometric">Biometric</TabsTrigger>
          <TabsTrigger value="totp">TOTP 2FA</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔍</span>
                <h3 className="font-semibold">OAuth 2.0 / OIDC</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• PKCE (Proof Key for Code Exchange)</li>
                <li>• CSRF state parameter protection</li>
                <li>• Multiple provider support</li>
                <li>• Secure token management</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👆</span>
                <h3 className="font-semibold">Biometric Auth</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• WebAuthn standard compliance</li>
                <li>• Platform authenticator support</li>
                <li>• Fingerprint, Face ID, Windows Hello</li>
                <li>• Phishing-resistant authentication</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔐</span>
                <h3 className="font-semibold">TOTP 2FA</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• RFC 6238 compliant TOTP</li>
                <li>• QR code generation</li>
                <li>• Backup codes system</li>
                <li>• Authenticator app support</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📱</span>
                <h3 className="font-semibold">Device Management</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Device fingerprinting</li>
                <li>• Trust level assessment</li>
                <li>• Geographic tracking</li>
                <li>• Remote device revocation</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚨</span>
                <h3 className="font-semibold">Security Monitoring</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Real-time threat detection</li>
                <li>• Anomaly pattern analysis</li>
                <li>• Automated response actions</li>
                <li>• Comprehensive audit logging</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-semibold">Enterprise Features</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Zero-trust architecture</li>
                <li>• Compliance ready (SOC 2, GDPR)</li>
                <li>• Risk-based authentication</li>
                <li>• Advanced session management</li>
              </ul>
            </Card>
          </div>

          <Alert>
            <div className="space-y-2">
              <p className="font-medium">🎯 Implementation Highlights</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>Type Safety:</strong> Full TypeScript support with branded types</li>
                <li>• <strong>Security First:</strong> OWASP guidelines and security best practices</li>
                <li>• <strong>Standards Compliant:</strong> OAuth 2.1, WebAuthn, RFC 6238</li>
                <li>• <strong>Production Ready:</strong> Error handling, rate limiting, monitoring</li>
                <li>• <strong>Developer Experience:</strong> Comprehensive documentation and testing</li>
              </ul>
            </div>
          </Alert>
        </TabsContent>

        <TabsContent value="oauth" className="space-y-6">
          <Card className="p-6">
            <OAuthLoginSection
              providers={['google', 'github', 'microsoft'] as OAuthProvider[]}
              onSuccess={handleOAuthSuccess}
              onError={handleOAuthError}
            />
          </Card>
        </TabsContent>

        <TabsContent value="biometric" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Setup Biometric Authentication</h3>
              <BiometricSetup
                onSuccess={handleBiometricSuccess}
                onError={handleBiometricError}
              />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Biometric Sign In</h3>
              <BiometricLogin
                onSuccess={(token) => console.log('Login success:', token)}
                onError={handleBiometricError}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="totp" className="space-y-6">
          <Card className="p-6">
            <TOTPSetup
              onSuccess={handleTOTPSuccess}
              onError={handleTOTPError}
            />
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card className="p-6">
            <DeviceManagement />
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="p-6">
            <SecurityAlerts />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSecurityDemo;