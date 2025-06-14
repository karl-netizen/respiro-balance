
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useUserPreferences } from '@/context';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Moon, Clock, Smartphone, Volume2 } from 'lucide-react';

const AccountNotificationSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const [quietHoursStart, setQuietHoursStart] = useState(preferences.quietHoursStart || '22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState(preferences.quietHoursEnd || '08:00');

  const handleNotificationToggle = (key: string, value: boolean) => {
    const newSettings = {
      ...preferences.notification_settings,
      [key]: value
    };
    updatePreferences({ notification_settings: newSettings });
    toast.success(`${key.replace('_', ' ')} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleQuietHoursUpdate = () => {
    updatePreferences({ 
      quietHoursStart,
      quietHoursEnd 
    });
    toast.success('Quiet hours updated');
  };

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Configure when and how you receive push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Remind you to take meditation breaks
              </p>
            </div>
            <Switch
              checked={preferences.notification_settings?.session_reminders !== false}
              onCheckedChange={(checked) => handleNotificationToggle('session_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Achievement Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Celebrate your progress and milestones
              </p>
            </div>
            <Switch
              checked={preferences.notification_settings?.achievement_notifications !== false}
              onCheckedChange={(checked) => handleNotificationToggle('achievement_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Streak Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Keep your meditation streak alive
              </p>
            </div>
            <Switch
              checked={preferences.notification_settings?.streak_alerts !== false}
              onCheckedChange={(checked) => handleNotificationToggle('streak_alerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose what updates you'd like to receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly report of your meditation progress
              </p>
            </div>
            <Switch
              checked={preferences.notification_settings?.weekly_summary !== false}
              onCheckedChange={(checked) => handleNotificationToggle('weekly_summary', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Tips & Insights</Label>
              <p className="text-sm text-muted-foreground">
                Receive meditation tips and insights
              </p>
            </div>
            <Switch
              checked={preferences.notification_settings?.tips_insights !== false}
              onCheckedChange={(checked) => handleNotificationToggle('tips_insights', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Set times when you don't want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={handleQuietHoursUpdate}>
            Update Quiet Hours
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountNotificationSettings;
