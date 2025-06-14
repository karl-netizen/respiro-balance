
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Eye, EyeOff, Smartphone, Globe, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AccountSecuritySettings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock security data - in real implementation, this would come from API
  const securityData = {
    lastPasswordChange: '45 days ago',
    securityScore: 85,
    twoFactorEnabled: false,
    activeSessions: [
      { id: '1', device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 minutes ago', current: true },
      { id: '2', device: 'Safari on iPhone', location: 'New York, US', lastActive: '1 hour ago', current: false },
      { id: '3', device: 'Firefox on Mac', location: 'Boston, US', lastActive: '2 days ago', current: false }
    ],
    loginHistory: [
      { timestamp: '2024-03-15 10:30 AM', location: 'New York, US', device: 'Chrome', success: true },
      { timestamp: '2024-03-14 08:15 AM', location: 'New York, US', device: 'iPhone', success: true },
      { timestamp: '2024-03-13 07:45 PM', location: 'Unknown', device: 'Chrome', success: false },
      { timestamp: '2024-03-13 06:30 PM', location: 'New York, US', device: 'Chrome', success: true }
    ]
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(password)) score += 25;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    else feedback.push('Special character');

    return {
      score,
      strength: score < 50 ? 'Weak' : score < 75 ? 'Medium' : 'Strong',
      color: score < 50 ? 'text-red-600' : score < 75 ? 'text-yellow-600' : 'text-green-600',
      feedback
    };
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const strength = getPasswordStrength(newPassword);
    if (strength.score < 50) {
      toast.error("Password is too weak. Please follow the requirements.");
      return;
    }

    setIsUpdating(true);
    try {
      // Mock password update - in real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password updated successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOutAllDevices = () => {
    // Mock sign out all devices - in real implementation, this would call an API
    toast.success("Signed out of all devices successfully");
  };

  const handleTerminateSession = (sessionId: string) => {
    // Mock session termination - in real implementation, this would call an API
    toast.success("Session terminated successfully");
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password & Authentication
          </CardTitle>
          <CardDescription>
            Manage your password and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Password Security</div>
                <div className="text-sm text-muted-foreground">
                  Last changed: {securityData.lastPasswordChange} | Security Score: {securityData.securityScore}/100
                </div>
              </div>
              <Badge variant={securityData.securityScore >= 80 ? 'default' : 'secondary'}>
                {securityData.securityScore >= 80 ? 'Strong' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1 h-9 w-9"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Strength:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handlePasswordUpdate}
                disabled={!currentPassword || !newPassword || !confirmPassword || isUpdating}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">SMS Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Switch
                checked={securityData.twoFactorEnabled}
                onCheckedChange={(checked) => {
                  toast.success(checked ? '2FA enabled' : '2FA disabled');
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Manage your data privacy and sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile information
                </p>
              </div>
              <Select defaultValue="public">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Progress Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically share achievements and milestones
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Activity Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Data collection level for personalization
                </p>
              </div>
              <Select defaultValue="enhanced">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essential">Essential Only</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Third-Party Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow data sharing with integrated services
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Access Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Account Access Management
          </CardTitle>
          <CardDescription>
            Monitor and manage your account access across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Active Sessions</h4>
              <Button variant="outline" size="sm" onClick={handleSignOutAllDevices}>
                Sign Out All Devices
              </Button>
            </div>
            <div className="space-y-3">
              {securityData.activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && <Badge variant="default" className="text-xs">Current</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Recent Login Activity</h4>
            <div className="space-y-2">
              {securityData.loginHistory.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-2 text-sm">
                  <div className="flex items-center gap-3">
                    {login.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <span className="font-medium">{login.timestamp}</span>
                      <span className="text-muted-foreground ml-2">
                        {login.device} • {login.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant={login.success ? 'default' : 'destructive'} className="text-xs">
                    {login.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Retention & Policies
          </CardTitle>
          <CardDescription>
            Understand how your data is stored and managed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Session Data</h5>
              <p className="text-sm text-muted-foreground">
                Meditation and focus session data is stored indefinitely for progress tracking.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Usage Analytics</h5>
              <p className="text-sm text-muted-foreground">
                Anonymized usage data is retained for 24 months for service improvement.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Communication Data</h5>
              <p className="text-sm text-muted-foreground">
                Messages and emails are retained for 12 months for support purposes.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Account Deletion</h5>
              <p className="text-sm text-muted-foreground">
                Complete data removal within 30 days of account deletion request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecuritySettings;
