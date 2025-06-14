
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useUserPreferences } from '@/context';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Palette, Brain, Clock, Calendar, RotateCcw, Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type MeditationExperience = 'beginner' | 'intermediate' | 'advanced';
type StressLevel = 'low' | 'moderate' | 'high';

const AccountPreferencesSettings = () => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  
  // Local state for work days
  const [workDays, setWorkDays] = useState<WorkDay[]>(preferences.work_days as WorkDay[] || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  
  const daysOfWeek: { key: WorkDay; label: string }[] = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const handleThemeChange = (theme: Theme) => {
    updatePreferences({ theme });
    toast.success(`Theme changed to ${theme}`);
  };

  const handleWorkDayToggle = (day: WorkDay) => {
    const newWorkDays = workDays.includes(day) 
      ? workDays.filter(d => d !== day)
      : [...workDays, day];
    setWorkDays(newWorkDays);
    updatePreferences({ work_days: newWorkDays });
  };

  const handleTimeChange = (field: string, value: string) => {
    updatePreferences({ [field]: value });
  };

  const handleResetPreferences = () => {
    resetPreferences();
    toast.success("All preferences have been reset to default values");
  };

  return (
    <div className="space-y-6">
      {/* Theme & Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your meditation experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Theme Selection</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred theme or let the system decide automatically
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={preferences.theme === 'light' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => handleThemeChange('light')}
              >
                <Sun className="h-5 w-5" />
                <span>Light</span>
              </Button>
              <Button
                variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => handleThemeChange('dark')}
              >
                <Moon className="h-5 w-5" />
                <span>Dark</span>
              </Button>
              <Button
                variant={preferences.theme === 'system' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => handleThemeChange('system')}
              >
                <Monitor className="h-5 w-5" />
                <span>System</span>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Accessibility Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations for motion sensitivity
                  </p>
                </div>
                <Switch
                  checked={preferences.reducedMotion || false}
                  onCheckedChange={(checked) => updatePreferences({ reducedMotion: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Enhanced contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={preferences.highContrast || false}
                  onCheckedChange={(checked) => updatePreferences({ highContrast: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meditation Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Meditation Experience
          </CardTitle>
          <CardDescription>
            Configure your meditation preferences and default settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Experience Level</Label>
              <Select
                value={preferences.meditation_experience || 'beginner'}
                onValueChange={(value: MeditationExperience) => updatePreferences({ meditation_experience: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Stress Level</Label>
              <Select
                value={preferences.stress_level || 'moderate'}
                onValueChange={(value: StressLevel) => updatePreferences({ stress_level: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Default Session Duration</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Current: {preferences.preferred_session_duration || 10} minutes
            </p>
            <Slider
              value={[preferences.preferred_session_duration || 10]}
              onValueChange={(value) => updatePreferences({ preferred_session_duration: value[0] })}
              max={60}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work-Life Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Work-Life Integration
          </CardTitle>
          <CardDescription>
            Configure your work schedule and break reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Work Days</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select the days when you want work-related meditation reminders
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.key}
                    checked={workDays.includes(day.key)}
                    onCheckedChange={() => handleWorkDayToggle(day.key)}
                  />
                  <Label htmlFor={day.key} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Work Start Time</Label>
              <Input
                type="time"
                value={preferences.work_start_time || '09:00'}
                onChange={(e) => handleTimeChange('work_start_time', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Work End Time</Label>
              <Input
                type="time"
                value={preferences.work_end_time || '17:00'}
                onChange={(e) => handleTimeChange('work_end_time', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Lunch Break</Label>
                <Switch
                  checked={preferences.lunch_break !== false}
                  onCheckedChange={(checked) => updatePreferences({ lunch_break: checked })}
                />
              </div>
              {preferences.lunch_break !== false && (
                <Input
                  type="time"
                  value={preferences.lunch_time || '12:00'}
                  onChange={(e) => handleTimeChange('lunch_time', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Morning Exercise</Label>
                <Switch
                  checked={preferences.morning_exercise || false}
                  onCheckedChange={(checked) => updatePreferences({ morning_exercise: checked })}
                />
              </div>
              {preferences.morning_exercise && (
                <Input
                  type="time"
                  value={preferences.exercise_time || '07:00'}
                  onChange={(e) => handleTimeChange('exercise_time', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <div>
            <Label>Bedtime</Label>
            <Input
              type="time"
              value={preferences.bed_time || '22:00'}
              onChange={(e) => handleTimeChange('bed_time', e.target.value)}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Used for evening meditation recommendations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Onboarding Management
          </CardTitle>
          <CardDescription>
            Manage your onboarding completion status and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                Onboarding Status: {preferences.has_completed_onboarding ? 'Completed' : 'Incomplete'}
              </div>
              <p className="text-sm text-muted-foreground">
                {preferences.has_completed_onboarding 
                  ? 'You have completed the initial setup process'
                  : 'Complete onboarding to get personalized recommendations'
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => updatePreferences({ has_completed_onboarding: false })}
              disabled={!preferences.has_completed_onboarding}
            >
              Restart Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset All Preferences */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <RotateCcw className="h-5 w-5" />
            Reset Preferences
          </CardTitle>
          <CardDescription>
            Reset all preferences to their default values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 mb-4">
              This will reset all your application preferences including theme, meditation settings, work schedule, and notification preferences to their default values.
            </p>
            <Button variant="outline" onClick={handleResetPreferences}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPreferencesSettings;
