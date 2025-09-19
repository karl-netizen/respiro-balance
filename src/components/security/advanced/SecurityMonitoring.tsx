// ===================================================================
// SECURITY MONITORING & ALERTS
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

export interface SecurityAlert {
  id: string;
  type: 'login_anomaly' | 'new_device' | 'location_change' | 'permission_change' | 'data_export' | 'failed_attempts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  metadata: {
    ipAddress?: string;
    location?: string;
    userAgent?: string;
    affectedResource?: string;
    attemptCount?: number;
  };
  isRead: boolean;
  actionTaken?: string;
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

export class SecurityMonitoringService {
  async getSecurityAlerts(): Promise<Result<SecurityAlert[], SecurityError>> {
    // In demo mode, return mock security alerts
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAlerts: SecurityAlert[] = [
          {
            id: 'alert-1',
            type: 'login_anomaly',
            severity: 'high',
            title: 'Unusual Login Pattern Detected',
            description: 'Multiple login attempts from different locations within a short time frame',
            timestamp: new Date('2024-12-19T14:30:00Z'),
            metadata: {
              ipAddress: '203.0.113.15',
              location: 'London, UK',
              attemptCount: 5
            },
            isRead: false,
            actionTaken: 'Temporary account lock applied'
          },
          {
            id: 'alert-2',
            type: 'new_device',
            severity: 'medium',
            title: 'New Device Login',
            description: 'Account accessed from a previously unrecognized device',
            timestamp: new Date('2024-12-18T09:15:00Z'),
            metadata: {
              ipAddress: '198.51.100.42',
              location: 'New York, NY',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            isRead: true,
            actionTaken: 'Email notification sent'
          },
          {
            id: 'alert-3',
            type: 'permission_change',
            severity: 'critical',
            title: 'Admin Privileges Modified',
            description: 'Administrative permissions were changed for your account',
            timestamp: new Date('2024-12-17T16:45:00Z'),
            metadata: {
              affectedResource: 'Admin Dashboard Access',
              ipAddress: '192.168.1.100'
            },
            isRead: false,
            actionTaken: 'All sessions terminated'
          },
          {
            id: 'alert-4',
            type: 'data_export',
            severity: 'medium',
            title: 'Data Export Request',
            description: 'Large amount of data was exported from your account',
            timestamp: new Date('2024-12-16T11:20:00Z'),
            metadata: {
              affectedResource: 'User Profile Data (2.4MB)',
              ipAddress: '192.168.1.105'
            },
            isRead: true
          },
          {
            id: 'alert-5',
            type: 'failed_attempts',
            severity: 'low',
            title: 'Multiple Failed Login Attempts',
            description: 'Several unsuccessful login attempts detected',
            timestamp: new Date('2024-12-15T08:00:00Z'),
            metadata: {
              ipAddress: '192.168.1.201',
              location: 'San Francisco, CA',
              attemptCount: 3
            },
            isRead: true,
            actionTaken: 'Rate limiting applied'
          }
        ];
        
        resolve(Ok(mockAlerts));
      }, 600);
    });
  }

  async markAlertAsRead(alertId: string): Promise<Result<void, SecurityError>> {
    // In demo mode, simulate successful mark as read
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Ok(undefined));
      }, 300);
    });
  }
}

// Security Alerts Component
export const SecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  
  const monitoringService = new SecurityMonitoringService();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    const result = await monitoringService.getSecurityAlerts();
    
    if (result.success) {
      setAlerts(result.data!);
    }
    
    setIsLoading(false);
  };

  const handleMarkAsRead = async (alertId: string) => {
    await monitoringService.markAlertAsRead(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getSeverityVariant = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
    }
  };

  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'login_anomaly': return '🚨';
      case 'new_device': return '📱';
      case 'location_change': return '🌍';
      case 'permission_change': return '🔐';
      case 'data_export': return '📤';
      case 'failed_attempts': return '❌';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Security Alerts</h3>
          <p className="text-muted-foreground">
            Monitor security events and potential threats to your account
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {unreadCount} New
          </Badge>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h4 className="font-medium mb-2">All Clear!</h4>
            <p className="text-muted-foreground">
              No security alerts at this time. Your account appears to be secure.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <Card 
              key={alert.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                !alert.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {getAlertIcon(alert.type)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{alert.title}</h4>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getSeverityVariant(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
              </div>

              {alert.actionTaken && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Action Taken:</span> {alert.actionTaken}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{getAlertIcon(selectedAlert.type)}</span>
                  {selectedAlert.title}
                </DialogTitle>
                <DialogDescription>
                  <Badge variant={getSeverityVariant(selectedAlert.severity)}>
                    {selectedAlert.severity} Severity
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedAlert.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                    {selectedAlert.metadata.ipAddress && (
                      <div className="flex justify-between">
                        <span className="font-medium">IP Address:</span>
                        <span className="font-mono">{selectedAlert.metadata.ipAddress}</span>
                      </div>
                    )}
                    {selectedAlert.metadata.location && (
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{selectedAlert.metadata.location}</span>
                      </div>
                    )}
                    {selectedAlert.metadata.userAgent && (
                      <div>
                        <span className="font-medium">User Agent:</span>
                        <p className="text-xs text-muted-foreground mt-1 break-all">
                          {selectedAlert.metadata.userAgent}
                        </p>
                      </div>
                    )}
                    {selectedAlert.metadata.attemptCount && (
                      <div className="flex justify-between">
                        <span className="font-medium">Attempt Count:</span>
                        <span>{selectedAlert.metadata.attemptCount}</span>
                      </div>
                    )}
                    {selectedAlert.metadata.affectedResource && (
                      <div className="flex justify-between">
                        <span className="font-medium">Affected Resource:</span>
                        <span>{selectedAlert.metadata.affectedResource}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Timestamp:</span>
                      <span>{selectedAlert.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedAlert.actionTaken && (
                  <div>
                    <h4 className="font-medium mb-2">Action Taken</h4>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        {selectedAlert.actionTaken}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close
                </Button>
                
                {!selectedAlert.isRead && (
                  <Button
                    onClick={() => {
                      handleMarkAsRead(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Alert>
        <div className="space-y-2">
          <p className="font-medium">🔔 Alert Preferences</p>
          <p className="text-sm">
            You can customize which security events trigger alerts in your account settings. 
            Critical security events will always generate alerts regardless of your preferences.
          </p>
        </div>
      </Alert>
    </div>
  );
};