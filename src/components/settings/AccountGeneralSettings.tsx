
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, RotateCcw, AlertTriangle, User, Clock, Target, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const AccountGeneralSettings = () => {
  const { user, updateProfile, loading } = useAuth();
  const [firstName, setFirstName] = useState(user?.email?.split('@')[0] || '');
  const [lastName, setLastName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState('');

  // Mock account metrics - in real implementation, these would come from API
  const accountMetrics = {
    totalSessions: 127,
    focusTimeHours: 42,
    currentStreak: 7,
    achievements: 15,
    memberSince: 'March 2024',
    accountId: 'usr_****7891'
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    try {
      const displayName = `${firstName} ${lastName}`.trim();
      await updateProfile({ displayName });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = (format: 'json' | 'csv') => {
    // Mock data export - in real implementation, this would call an API
    const mockData = {
      profile: { email: user?.email, firstName, lastName },
      sessions: accountMetrics.totalSessions,
      focusTime: accountMetrics.focusTimeHours,
      streak: accountMetrics.currentStreak,
      achievements: accountMetrics.achievements,
      exportDate: new Date().toISOString()
    };

    const dataStr = format === 'json' 
      ? JSON.stringify(mockData, null, 2)
      : Object.entries(mockData).map(([key, value]) => `${key},${value}`).join('\n');
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `respiro-data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  const handleResetProgress = () => {
    // Mock reset - in real implementation, this would call an API
    toast.success("Progress reset successfully");
  };

  const handleDeleteAccount = () => {
    if (confirmDeletion === 'DELETE') {
      // Mock deletion - in real implementation, this would call an API
      toast.success("Account deletion initiated. You will receive an email confirmation.");
      setConfirmDeletion('');
    } else {
      toast.error("Please type DELETE to confirm account deletion");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your account profile and personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
              <AvatarFallback className="text-lg">
                {firstName.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1"
                    maxLength={50}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1"
                    maxLength={50}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email address cannot be changed for security reasons
                </p>
              </div>
              <Button 
                onClick={handleSaveProfile} 
                disabled={loading || isUpdating}
                className="w-full md:w-auto"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Status
          </CardTitle>
          <CardDescription>
            Your account information and membership details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accountMetrics.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accountMetrics.focusTimeHours}h</div>
              <div className="text-sm text-muted-foreground">Focus Time</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accountMetrics.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{accountMetrics.achievements}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Member since {accountMetrics.memberSince}</div>
              <div className="text-sm text-muted-foreground">Account ID: {accountMetrics.accountId}</div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data or manage your account progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Export Your Data</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Download a complete copy of your meditation and focus session history, achievements, and progress metrics.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportData('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
              <Button variant="outline" onClick={() => handleExportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Progress Management</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Progress
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Progress</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all your meditation sessions, focus data, achievements, and streaks. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={handleResetProgress}>
                    Reset Progress
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion - Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-4">
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. This will immediately delete all your data including meditation history, progress, achievements, and preferences.
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="confirm-deletion">Type "DELETE" to confirm</Label>
                <Input
                  id="confirm-deletion"
                  value={confirmDeletion}
                  onChange={(e) => setConfirmDeletion(e.target.value)}
                  placeholder="Type DELETE here"
                  className="mt-1"
                />
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={confirmDeletion !== 'DELETE'}
                className="w-full"
              >
                Delete My Account Permanently
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountGeneralSettings;
