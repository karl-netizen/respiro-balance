import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity,
  Lock,
  Unlock,
  Eye,
  UserCheck
} from 'lucide-react';
import { useAuth, type Permission } from '@/security/SecureAuthSystem';

interface SecurityMetrics {
  successfulLogins: number;
  failedAttempts: number;
  lastLogin: Date;
  sessionDuration: number;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  actionRequired: boolean;
}

export const SecurityDashboard: React.FC = () => {
  const { user, session, isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    successfulLogins: 0,
    failedAttempts: 0,
    lastLogin: new Date(),
    sessionDuration: 0,
    securityScore: 85,
    riskLevel: 'low'
  });
  
  const [alerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'info',
      title: 'Session Active',
      message: 'Your secure session is active and monitored',
      timestamp: new Date(),
      actionRequired: false
    },
    {
      id: '2', 
      type: 'warning',
      title: 'Password Age',
      message: 'Consider updating your password (last changed 45 days ago)',
      timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      actionRequired: true
    }
  ]);

  useEffect(() => {
    if (user?.loginHistory) {
      const successful = user.loginHistory.filter(attempt => attempt.success).length;
      const failed = user.loginHistory.filter(attempt => !attempt.success).length;
      const latest = user.loginHistory
        .filter(attempt => attempt.success)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      setMetrics(prev => ({
        ...prev,
        successfulLogins: successful,
        failedAttempts: failed,
        lastLogin: latest?.timestamp || new Date()
      }));
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      const interval = setInterval(() => {
        const duration = Date.now() - session.createdAt.getTime();
        setMetrics(prev => ({
          ...prev,
          sessionDuration: Math.floor(duration / 1000 / 60) // minutes
        }));
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [session]);

  if (!isAuthenticated || !user || !session) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please log in to view security dashboard</p>
        </CardContent>
      </Card>
    );
  }

  const getSecurityScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600'; 
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBadgeVariant = (risk: SecurityMetrics['riskLevel']) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const formatSessionDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPermissionIcon = (permission: Permission) => {
    if (permission.startsWith('read:')) return <Eye className="h-4 w-4" />;
    if (permission.startsWith('write:') || permission.startsWith('moderate:')) return <Key className="h-4 w-4" />;
    if (permission.startsWith('admin:') || permission === 'super:all') return <Shield className="h-4 w-4" />;
    return <UserCheck className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your account security and session activity
          </p>
        </div>
        <Badge variant={getRiskBadgeVariant(metrics.riskLevel)}>
          {metrics.riskLevel.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>
            Overall security posture based on account configuration and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">
              <span className={getSecurityScoreColor(metrics.securityScore)}>
                {metrics.securityScore}/100
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              {metrics.securityScore >= 90 ? 'Excellent' : 
               metrics.securityScore >= 70 ? 'Good' : 
               metrics.securityScore >= 50 ? 'Fair' : 'Needs Improvement'}
            </span>
          </div>
          <Progress value={metrics.securityScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Session Time</p>
                <p className="text-2xl font-semibold">
                  {formatSessionDuration(metrics.sessionDuration)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Logins</p>
                <p className="text-2xl font-semibold text-green-600">
                  {metrics.successfulLogins}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Attempts</p>
                <p className="text-2xl font-semibold text-red-600">
                  {metrics.failedAttempts}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2FA Status</p>
                <p className="text-2xl font-semibold">
                  {user.mfaEnabled ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Lock className="h-5 w-5" />
                      ON
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <Unlock className="h-5 w-5" />
                      OFF
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline">{user.role}</Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Security Level</p>
              <Badge variant={
                user.securityLevel === 'high' ? 'default' :
                user.securityLevel === 'enhanced' ? 'secondary' : 'outline'
              }>
                {user.securityLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Account Status</p>
              <Badge variant={user.accountStatus === 'active' ? 'default' : 'destructive'}>
                {user.accountStatus.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Password Change</p>
              <p className="font-medium">
                {user.lastPasswordChange.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              Your current access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {user.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                >
                  {getPermissionIcon(permission)}
                  <span className="text-sm font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Recent security events and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <Alert 
              key={alert.id}
              variant={alert.type === 'error' ? 'destructive' : 'default'}
            >
              <AlertTriangle className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <AlertDescription className="font-medium">
                    {alert.title}
                  </AlertDescription>
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <AlertDescription className="mt-1">
                  {alert.message}
                </AlertDescription>
                {alert.actionRequired && (
                  <Button size="sm" className="mt-2">
                    Take Action
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;