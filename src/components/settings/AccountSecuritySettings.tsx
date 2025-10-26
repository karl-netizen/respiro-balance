
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Eye, EyeOff, Smartphone, Globe, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const AccountSecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [progressSharing, setProgressSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState('essential');
  const [thirdPartyIntegration, setThirdPartyIntegration] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { strength: 'Weak', color: 'text-red-600' };
    if (score <= 2) return { strength: 'Medium', color: 'text-yellow-600' };
    if (score <= 3) return { strength: 'Strong', color: 'text-green-600' };
    return { strength: 'Very Strong', color: 'text-green-700' };
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both password fields are identical."
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long."
      });
      return;
    }

    // Mock password update
    toast.success("Password updated successfully", {
      description: "Your password has been changed and you're still logged in."
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSignOutAllDevices = () => {
    toast.success("Signed out from all devices", {
      description: "You'll need to sign in again on other devices."
    });
  };

  const mockLoginHistory = [
    { location: 'New York, NY', device: 'Chrome on Windows', time: '2 hours ago', current: true },
    { location: 'New York, NY', device: 'Safari on iPhone', time: '1 day ago', current: false },
    { location: 'Boston, MA', device: 'Chrome on Mac', time: '3 days ago', current: false },
  ];

  const mockActiveSessions = [
    { device: 'Current Browser', location: 'New York, NY', lastActive: 'Now' },
    { device: 'iPhone App', location: 'New York, NY', lastActive: '5 minutes ago' },
    { device: 'Chrome (Mac)', location: 'Boston, MA', lastActive: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password & Authentication Management
          </CardTitle>
          <CardDescription>
            Update your password and manage account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {newPassword && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Strength:</span>
                  <span className={`text-sm font-medium ${getPasswordStrength(newPassword).color}`}>
                    {getPasswordStrength(newPassword).strength}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </div>

            <Button 
              onClick={handlePasswordUpdate}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="w-full md:w-auto"
            >
              Update Password
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Security Status</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Last Password Change</Label>
                <p className="text-sm text-muted-foreground">45 days ago</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Security Score</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">85/100</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Active Sessions</Label>
                <p className="text-sm text-muted-foreground">{mockActiveSessions.length} devices</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls & Data Protection
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Data Privacy Settings</h4>
            
            <div className="space-y-3">
              <Label>Profile Visibility</Label>
              <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view</SelectItem>
                  <SelectItem value="friends">Friends Only - Limited access</SelectItem>
                  <SelectItem value="private">Private - Only you can view</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Progress Sharing</Label>
                <p className="text-sm text-muted-foreground">Automatic achievement sharing</p>
              </div>
              <Switch checked={progressSharing} onCheckedChange={setProgressSharing} />
            </div>

            <div className="space-y-3">
              <Label>Activity Tracking</Label>
              <Select value={activityTracking} onValueChange={setActivityTracking}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essential">Essential - Basic functionality only</SelectItem>
                  <SelectItem value="enhanced">Enhanced - Improved features</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive - Full analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Third-Party Integration</Label>
                <p className="text-sm text-muted-foreground">Share data with connected services</p>
              </div>
              <Switch checked={thirdPartyIntegration} onCheckedChange={setThirdPartyIntegration} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Access Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Account Access Management
          </CardTitle>
          <CardDescription>
            Monitor and control access to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Recent Login Activity</h4>
            
            <div className="space-y-3">
              {mockLoginHistory.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{login.location}</p>
                      <p className="text-sm text-muted-foreground">{login.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{login.time}</p>
                    {login.current && <Badge variant="default">Current</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Active Sessions</h4>
              <Button variant="outline" size="sm" onClick={handleSignOutAllDevices}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out All Devices
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockActiveSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">{session.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{session.lastActive}</p>
                    {index === 0 && <Badge variant="default">Current</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecuritySettings;
