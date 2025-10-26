
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Moon, Volume2, Vibrate, Shield } from 'lucide-react';
import { toast } from 'sonner';

const AccountNotificationSettings = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meditationReminders, setMeditationReminders] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [sessionNotifications, setSessionNotifications] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [focusModeAlerts, setFocusModeAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [digestDay, setDigestDay] = useState('sunday');
  const [progressUpdates, setProgressUpdates] = useState('weekly');
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [notificationSound, setNotificationSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [badgeCount, setBadgeCount] = useState(true);
  const [dailyLimit, setDailyLimit] = useState([10]);

  const handleSaveSettings = () => {
    toast.success("Notification settings saved", {
      description: "Your notification preferences have been updated."
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success("Notifications enabled", {
          description: "You'll now receive push notifications."
        });
      } else {
        toast.error("Notifications denied", {
          description: "Please enable notifications in your browser settings."
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notification Controls
          </CardTitle>
          <CardDescription>
            Manage device notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master toggle for all device notifications
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={Notification.permission === 'granted' ? 'default' : 'secondary'}>
                  {Notification.permission === 'granted' ? 'Granted' : 'Permission required'}
                </Badge>
                {Notification.permission !== 'granted' && (
                  <Button size="sm" variant="outline" onClick={requestNotificationPermission}>
                    Enable
                  </Button>
                )}
              </div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Meditation Reminder System</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Meditation Reminders</Label>
                <p className="text-sm text-muted-foreground">Scheduled meditation notifications</p>
              </div>
              <Switch 
                checked={meditationReminders} 
                onCheckedChange={setMeditationReminders}
                disabled={!pushNotifications}
              />
            </div>

            {meditationReminders && (
              <div className="space-y-3 ml-6">
                <div className="space-y-2">
                  <Label>Reminder Frequency</Label>
                  <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Session & Achievement Notifications</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Completion</Label>
                <p className="text-sm text-muted-foreground">Notifications for finished sessions</p>
              </div>
              <Switch 
                checked={sessionNotifications} 
                onCheckedChange={setSessionNotifications}
                disabled={!pushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievement Unlocks</Label>
                <p className="text-sm text-muted-foreground">Badges, streaks, and milestone celebrations</p>
              </div>
              <Switch 
                checked={achievementNotifications} 
                onCheckedChange={setAchievementNotifications}
                disabled={!pushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Focus Mode Alerts</Label>
                <p className="text-sm text-muted-foreground">Pomodoro break and work session notifications</p>
              </div>
              <Switch 
                checked={focusModeAlerts} 
                onCheckedChange={setFocusModeAlerts}
                disabled={!pushNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Communication Preferences
          </CardTitle>
          <CardDescription>
            Manage email notifications and newsletters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Master toggle for email communication</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          {emailNotifications && (
            <>
              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Content-Specific Email Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Progress stats and meditation tips</p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>

                {weeklyDigest && (
                  <div className="space-y-2 ml-6">
                    <Label>Delivery Day</Label>
                    <Select value={digestDay} onValueChange={setDigestDay}>
                      <SelectTrigger className="w-full md:w-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Progress Updates</Label>
                  <Select value={progressUpdates} onValueChange={setProgressUpdates}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Promotional content and newsletters</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div>
                      <Label>Account Security</Label>
                      <p className="text-sm text-muted-foreground">Login alerts and password changes (always ON)</p>
                    </div>
                  </div>
                  <Switch checked={true} disabled />
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
            <Moon className="h-5 w-5" />
            Advanced Notification Management
          </CardTitle>
          <CardDescription>
            Fine-tune notification behavior and timing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Notification-free periods</p>
              </div>
              <Switch checked={quietHours} onCheckedChange={setQuietHours} />
            </div>

            {quietHours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Delivery Customization</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Notification Sound
                </Label>
                <p className="text-sm text-muted-foreground">Enable audio alerts</p>
              </div>
              <Switch checked={notificationSound} onCheckedChange={setNotificationSound} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4" />
                  Vibration
                </Label>
                <p className="text-sm text-muted-foreground">Mobile device haptic feedback</p>
              </div>
              <Switch checked={vibration} onCheckedChange={setVibration} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Badge Count</Label>
                <p className="text-sm text-muted-foreground">App icon notification badge</p>
              </div>
              <Switch checked={badgeCount} onCheckedChange={setBadgeCount} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Frequency Management</h4>
            
            <div className="space-y-3">
              <Label>Daily Maximum: {dailyLimit[0]} notifications per day</Label>
              <Slider
                value={dailyLimit}
                onValueChange={setDailyLimit}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Limit the number of notifications you receive daily
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="w-full md:w-auto">
          <Bell className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default AccountNotificationSettings;
