
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AccountSecuritySettings: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would update the password here
      // await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password');
      console.error('Error updating password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleToggle2FA = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would toggle 2FA here
      // await toggle2FA(!twoFAEnabled);
      
      setTwoFAEnabled(!twoFAEnabled);
      toast.success(`Two-factor authentication ${!twoFAEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error(`Failed to ${!twoFAEnabled ? 'enable' : 'disable'} two-factor authentication`);
      console.error('Error toggling 2FA:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-2">
                <div className="flex items-center gap-2 text-xs">
                  {passwordForm.newPassword.length >= 8 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  At least 8 characters
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[A-Z]/.test(passwordForm.newPassword) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  One uppercase character
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[0-9]/.test(passwordForm.newPassword) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  One number
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  One special character
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              {passwordForm.newPassword && passwordForm.confirmPassword && (
                passwordForm.newPassword !== passwordForm.confirmPassword ? (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                ) : (
                  <p className="text-xs text-green-500 mt-1">Passwords match</p>
                )
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            form="password-form" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {twoFAEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-muted-foreground">
                {twoFAEnabled 
                  ? 'Your account is protected with two-factor authentication'
                  : 'Enable two-factor authentication for additional security'}
              </p>
            </div>
            <Switch
              checked={twoFAEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={isSubmitting}
            />
          </div>
          
          {twoFAEnabled && (
            <div className="mt-4 rounded-md bg-muted p-4">
              <p className="text-sm">
                Two-factor authentication is enabled for your account. You will need to enter a verification code when logging in from a new device.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions and connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-muted-foreground">
                    {navigator.userAgent}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Started: {new Date().toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Sign Out of All Other Sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSecuritySettings;
