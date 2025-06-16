
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, TestTube, Clock, Award, TrendingUp, Heart } from 'lucide-react';
import { useUserPreferences } from '@/context';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const NotificationPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { 
    isSupported, 
    permissionStatus, 
    requestPermission, 
    sendTestNotification 
  } = useNotifications();

  const handleToggle = (key: string, value: boolean) => {
    updatePreferences({
      notificationSettings: {
        ...preferences.notificationSettings,
        [key]: value
      }
    });
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notifications enabled successfully!');
    } else {
      toast.error('Notification permission denied. You can enable it in your browser settings.');
    }
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (success) {
      toast.success('Test notification sent!');
    } else {
      toast.error('Failed to send test notification');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-2">Notifications Not Supported</h3>
            <p className="text-sm text-muted-foreground">
              Your browser doesn't support push notifications. Please use a modern browser to enable this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Notification Permission</h3>
              <p className="text-sm text-muted-foreground">
                Status: {permissionStatus === 'granted' ? 'Enabled' : permissionStatus === 'denied' ? 'Blocked' : 'Not requested'}
              </p>
            </div>
            <div className="flex gap-2">
              {permissionStatus !== 'granted' && (
                <Button onClick={handleRequestPermission} size="sm">
                  Enable Notifications
                </Button>
              )}
              {permissionStatus === 'granted' && (
                <Button onClick={handleTestNotification} variant="outline" size="sm">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </Button>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">Session Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily meditation and breathing reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.notificationSettings?.sessionReminders || false}
                onCheckedChange={(checked) => handleToggle('sessionReminders', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-medium">Streak Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Celebrate your meditation streaks
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.notificationSettings?.streakAlerts || false}
                onCheckedChange={(checked) => handleToggle('streakAlerts', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="font-medium">Achievement Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you unlock new achievements
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.notificationSettings?.achievementNotifications || false}
                onCheckedChange={(checked) => handleToggle('achievementNotifications', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-medium">Weekly Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Weekly progress reports and insights
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.notificationSettings?.weeklySummary || false}
                onCheckedChange={(checked) => handleToggle('weeklySummary', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>
          </div>

          {permissionStatus === 'denied' && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800">Notifications Blocked</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Notifications are currently blocked. To enable them, click on the lock icon in your browser's address bar and allow notifications for this site.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
