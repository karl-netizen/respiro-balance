
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPreferences } from '@/context';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, Mail, Clock, Moon, Volume2, Smartphone, Calendar } from 'lucide-react';

const AccountNotificationSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [dailyLimit, setDailyLimit] = useState([10]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notification permissions granted');
      } else {
        toast.error('Notification permissions denied');
      }
    }
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    const newNotificationSettings = {
      ...preferences.notificationSettings,
      [key]: value
    };
    updatePreferences({ notificationSettings: newNotificationSettings });
    toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const notificationSettings = preferences.notificationSettings || {
    streakAlerts: true,
    weeklySummary: true,
    sessionReminders: true,
    achievementNotifications: true
  };

  return (
    <div className="space-y-6">
      {/* Push Notification Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage device notifications and meditation reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Notification Permission</div>
              <div className="text-sm text-muted-foreground">
                Status: {notificationPermission === 'granted' ? 'Granted' : notificationPermission === 'denied' ? 'Denied' : 'Not requested'}
              </div>
            </div>
            {notificationPermission !== 'granted' && (
              <Button onClick={requestNotificationPermission}>
                Enable Notifications
              </Button>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Meditation Reminders</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Meditation Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Gentle reminders to maintain your practice
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.sessionReminders}
                  onCheckedChange={(checked) => handleNotificationToggle('sessionReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Streak Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications to help maintain your meditation streak
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.streakAlerts}
                  onCheckedChange={(checked) => handleNotificationToggle('streakAlerts', checked)}
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
                  checked={notificationSettings.achievementNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('achievementNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Focus Mode Alerts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Break Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Pomodoro break time notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.breakReminders || false}
                  onCheckedChange={(checked) => handleNotificationToggle('breakReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Work Session Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Focus session start and completion notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.workSessionAlerts || false}
                  onCheckedChange={(checked) => handleNotificationToggle('workSessionAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Productivity Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly and monthly performance summaries
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.productivityInsights || false}
                  onCheckedChange={(checked) => handleNotificationToggle('productivityInsights', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Communications
          </CardTitle>
          <CardDescription>
            Control email notifications and digest preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master toggle for all email communication
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications !== false}
              onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)}
            />
          </div>

          {notificationSettings.emailNotifications !== false && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Progress Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Sunday summary with progress stats and tips
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklySummary}
                    onCheckedChange={(checked) => handleNotificationToggle('weeklySummary', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Milestone notifications and achievement updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.progressUpdates !== false}
                    onCheckedChange={(checked) => handleNotificationToggle('progressUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Optional promotional content and newsletters
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails || false}
                    onCheckedChange={(checked) => handleNotificationToggle('marketingEmails', checked)}
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Account security notifications (login alerts, password changes) are always enabled for your protection.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Advanced Notification Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Fine-tune notification timing and delivery preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Disable notifications during specified hours
                </p>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>
            
            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Delivery Customization</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notification Sound</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable audio alerts for notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.soundEnabled !== false}
                  onCheckedChange={(checked) => handleNotificationToggle('soundEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Vibration</Label>
                  <p className="text-sm text-muted-foreground">
                    Mobile device haptic feedback
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.vibrationEnabled !== false}
                  onCheckedChange={(checked) => handleNotificationToggle('vibrationEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>App Badge Count</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notification count on app icon
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.badgeCount !== false}
                  onCheckedChange={(checked) => handleNotificationToggle('badgeCount', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Daily Notification Limit</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Maximum notifications per day: {dailyLimit[0]}
            </p>
            <Slider
              value={dailyLimit}
              onValueChange={setDailyLimit}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 per day</span>
              <span>10 per day</span>
              <span>20 per day</span>
            </div>
          </div>

          <div>
            <Label>Notification Bundling</Label>
            <Select defaultValue="grouped">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual notifications</SelectItem>
                <SelectItem value="grouped">Group similar notifications</SelectItem>
                <SelectItem value="digest">Daily digest summary</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how to group notifications to reduce interruptions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountNotificationSettings;
