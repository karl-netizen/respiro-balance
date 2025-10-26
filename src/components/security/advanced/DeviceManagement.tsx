// ===================================================================
// DEVICE TRUST & MANAGEMENT
// ===================================================================

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TrustedDevice {
  id: string;
  name: string;
  fingerprint: string;
  userAgent: string;
  ipAddress: string;
  location?: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number; };
  };
  createdAt: Date;
  lastUsed: Date;
  isCurrentDevice: boolean;
  riskLevel: 'low' | 'medium' | 'high';
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

export class DeviceTrustService {
  async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      screen.colorDepth.toString(),
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || 'unknown',
      (navigator as any).deviceMemory?.toString() || 'unknown',
    ];

    // Add canvas fingerprinting for additional entropy
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }

    const fingerprint = await this.hashComponents(components);
    return fingerprint;
  }

  private async hashComponents(components: string[]): Promise<string> {
    const data = components.join('|');
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async getTrustedDevices(): Promise<Result<TrustedDevice[], SecurityError>> {
    // In demo mode, return mock trusted devices
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDevices: TrustedDevice[] = [
          {
            id: 'device-1',
            name: 'iPhone 15 Pro',
            fingerprint: 'abc123def456',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            ipAddress: '192.168.1.105',
            location: {
              city: 'San Francisco',
              country: 'United States'
            },
            createdAt: new Date('2024-01-15'),
            lastUsed: new Date(),
            isCurrentDevice: true,
            riskLevel: 'low'
          },
          {
            id: 'device-2',
            name: 'MacBook Pro M3',
            fingerprint: 'def456ghi789',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            ipAddress: '192.168.1.102',
            location: {
              city: 'San Francisco',
              country: 'United States'
            },
            createdAt: new Date('2024-02-01'),
            lastUsed: new Date('2024-12-18'),
            isCurrentDevice: false,
            riskLevel: 'low'
          },
          {
            id: 'device-3',
            name: 'Unknown Device',
            fingerprint: 'ghi789jkl012',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            ipAddress: '203.0.113.15',
            location: {
              city: 'London',
              country: 'United Kingdom'
            },
            createdAt: new Date('2024-12-10'),
            lastUsed: new Date('2024-12-15'),
            isCurrentDevice: false,
            riskLevel: 'high'
          }
        ];
        
        resolve(Ok(mockDevices));
      }, 800);
    });
  }

  async revokeTrustedDevice(): Promise<Result<void, SecurityError>> {
    // In demo mode, simulate successful revocation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Ok(undefined));
      }, 500);
    });
  }
}

// Device Management Component
export const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokeDeviceId, setRevokeDeviceId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  
  const deviceService = new DeviceTrustService();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    const result = await deviceService.getTrustedDevices();
    
    if (result.success) {
      setDevices(result.data!);
    }
    
    setIsLoading(false);
  };

  const handleRevokeDevice = async (deviceId: string) => {
    setIsRevoking(true);
    const result = await deviceService.revokeTrustedDevice(deviceId);
    
    if (result.success) {
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      setRevokeDeviceId(null);
    }
    
    setIsRevoking(false);
  };

  const getRiskLevelVariant = (level: TrustedDevice['riskLevel']) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (/iPhone|iPad/.test(userAgent)) return '📱';
    if (/Android/.test(userAgent)) return '📱';
    if (/Mac/.test(userAgent)) return '💻';
    if (/Windows/.test(userAgent)) return '💻';
    if (/Linux/.test(userAgent)) return '💻';
    return '🖥️';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trusted devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Trusted Devices</h3>
        <p className="text-muted-foreground">
          Manage devices that can access your account without additional verification
        </p>
      </div>

      {devices.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="font-medium mb-2">No Trusted Devices</h4>
            <p className="text-muted-foreground">
              No devices are currently marked as trusted for your account
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {devices.map(device => (
            <Card 
              key={device.id} 
              className={`p-6 ${device.isCurrentDevice ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {getDeviceIcon(device.userAgent)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{device.name}</h4>
                      {device.isCurrentDevice && (
                        <Badge variant="outline" className="text-xs">
                          Current Device
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {device.location?.city}, {device.location?.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getRiskLevelVariant(device.riskLevel)}>
                    {device.riskLevel} Risk
                  </Badge>
                  
                  {!device.isCurrentDevice && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setRevokeDeviceId(device.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Last Used</p>
                  <p className="text-muted-foreground">{formatDate(device.lastUsed)}</p>
                </div>
                <div>
                  <p className="font-medium">Added</p>
                  <p className="text-muted-foreground">{formatDate(device.createdAt)}</p>
                </div>
                <div>
                  <p className="font-medium">IP Address</p>
                  <p className="text-muted-foreground font-mono">{device.ipAddress}</p>
                </div>
              </div>

              {device.riskLevel === 'high' && (
                <Alert className="mt-4">
                  <div className="space-y-1">
                    <p className="font-medium">⚠️ High Risk Device Detected</p>
                    <p className="text-sm">
                      This device shows suspicious activity patterns. Consider revoking access 
                      if you don't recognize it.
                    </p>
                  </div>
                </Alert>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Revoke Device Dialog */}
      <Dialog open={!!revokeDeviceId} onOpenChange={() => setRevokeDeviceId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Trusted Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke trust for this device? 
              The device will require additional verification on the next login.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeDeviceId(null)}
              disabled={isRevoking}
            >
              Cancel
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => handleRevokeDevice(revokeDeviceId!)}
              disabled={isRevoking}
            >
              {isRevoking ? 'Revoking...' : 'Revoke Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Alert>
        <div className="space-y-2">
          <p className="font-medium">🛡️ Security Tip</p>
          <p className="text-sm">
            Regularly review your trusted devices and revoke access for any devices you no longer use 
            or recognize. If you see an unfamiliar device, change your password immediately and enable 
            two-factor authentication.
          </p>
        </div>
      </Alert>
    </div>
  );
};