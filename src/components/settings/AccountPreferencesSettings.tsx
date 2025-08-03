
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Palette, Accessibility, Target, Clock, Calendar, Sun, Moon, Monitor, HelpCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useUserGuideProgress } from '@/components/guide/hooks/useUserGuideProgress';

const AccountPreferencesSettings = () => {
  const { userPreferences, updatePreferences, resetProgress, getCompletionPercentage, completedTours } = useUserGuideProgress();
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [darkModeOverride, setDarkModeOverride] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [defaultDuration, setDefaultDuration] = useState(10);
  const [audioGuidance, setAudioGuidance] = useState(true);
  const [backgroundSounds, setBackgroundSounds] = useState('nature');
  const [autoContinue, setAutoContinue] = useState(false);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState([30]);
  const [workDays, setWorkDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('17:00');
  const [lunchTime, setLunchTime] = useState('12:00');
  const [lunchBreak, setLunchBreak] = useState(true);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeupTime, setWakeupTime] = useState('07:00');
  const [morningExercise, setMorningExercise] = useState(false);
  const [exerciseTime, setExerciseTime] = useState('07:30');

  const handleSaveSettings = () => {
    // Mock save - in real implementation, this would save to backend
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated across all devices."
    });
  };

  const dayOptions = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

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
            Customize the visual appearance of your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="theme-select">Theme Selection</Label>
            <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light Theme
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Theme
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System Auto-Detect
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              System auto-detect follows your device's theme preference
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibility Options
            </h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode Override</Label>
                <p className="text-sm text-muted-foreground">
                  Force dark theme regardless of system setting
                </p>
              </div>
              <Switch checked={darkModeOverride} onCheckedChange={setDarkModeOverride} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations for motion sensitivity
                </p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced contrast for better visibility
                </p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meditation Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Meditation Experience Configuration
          </CardTitle>
          <CardDescription>
            Customize your meditation practice and session preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to meditation</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                <SelectItem value="advanced">Advanced - Experienced practitioner</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Affects session recommendations and difficulty filtering
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Default Session Preferences</h4>
            
            <div className="space-y-3">
              <Label>Default Duration</Label>
              <Select value={defaultDuration.toString()} onValueChange={(value) => setDefaultDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audio Guidance</Label>
                <p className="text-sm text-muted-foreground">Enable voice instructions by default</p>
              </div>
              <Switch checked={audioGuidance} onCheckedChange={setAudioGuidance} />
            </div>

            <div className="space-y-3">
              <Label>Background Sounds</Label>
              <Select value={backgroundSounds} onValueChange={setBackgroundSounds}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Background Sound</SelectItem>
                  <SelectItem value="nature">Nature Sounds</SelectItem>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="ocean">Ocean Waves</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Continue Sessions</Label>
                <p className="text-sm text-muted-foreground">Automatic progression between sessions</p>
              </div>
              <Switch checked={autoContinue} onCheckedChange={setAutoContinue} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vibration Alerts</Label>
                <p className="text-sm text-muted-foreground">Mobile device haptic feedback</p>
              </div>
              <Switch checked={vibrationAlerts} onCheckedChange={setVibrationAlerts} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Goal Configuration</h4>
            
            <div className="space-y-3">
              <Label>Weekly Meditation Goal: {weeklyGoal[0]} minutes per day</Label>
              <Slider
                value={weeklyGoal}
                onValueChange={setWeeklyGoal}
                max={60}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Set your daily meditation target (0-60 minutes)
              </p>
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
            Configure your schedule for optimal meditation timing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Work Schedule</h4>
            
            <div className="space-y-3">
              <Label>Work Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dayOptions.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={workDays.includes(day.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setWorkDays([...workDays, day.id]);
                        } else {
                          setWorkDays(workDays.filter(d => d !== day.id));
                        }
                      }}
                    />
                    <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])}
                >
                  Weekdays Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkDays(dayOptions.map(d => d.id))}
                >
                  All Week
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="work-start">Work Start Time</Label>
                <Input
                  id="work-start"
                  type="time"
                  value={workStartTime}
                  onChange={(e) => setWorkStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-end">Work End Time</Label>
                <Input
                  id="work-end"
                  type="time"
                  value={workEndTime}
                  onChange={(e) => setWorkEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lunch Break Integration</Label>
                <p className="text-sm text-muted-foreground">Include lunch break in schedule</p>
              </div>
              <Switch checked={lunchBreak} onCheckedChange={setLunchBreak} />
            </div>

            {lunchBreak && (
              <div className="space-y-2">
                <Label htmlFor="lunch-time">Lunch Time</Label>
                <Input
                  id="lunch-time"
                  type="time"
                  value={lunchTime}
                  onChange={(e) => setLunchTime(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Personal Schedule</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">For evening meditation recommendations</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wakeup">Wake-up Time</Label>
                <Input
                  id="wakeup"
                  type="time"
                  value={wakeupTime}
                  onChange={(e) => setWakeupTime(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Morning schedule integration</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Morning Exercise</Label>
                <p className="text-sm text-muted-foreground">Include workout in daily schedule</p>
              </div>
              <Switch checked={morningExercise} onCheckedChange={setMorningExercise} />
            </div>

            {morningExercise && (
              <div className="space-y-2">
                <Label htmlFor="exercise-time">Exercise Time</Label>
                <Input
                  id="exercise-time"
                  type="time"
                  value={exerciseTime}
                  onChange={(e) => setExerciseTime(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guided Tours & Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Guided Tours & Tips
          </CardTitle>
          <CardDescription>
            Configure in-app tutorials, tooltips, and guided experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Tooltips & Tours</Label>
              <p className="text-sm text-muted-foreground">
                Show helpful tips and guided tours throughout the app
              </p>
            </div>
            <Switch 
              checked={userPreferences.enableTooltips} 
              onCheckedChange={(enabled) => updatePreferences({ enableTooltips: enabled })} 
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Tour Settings</h4>
            
            <div className="space-y-3">
              <Label>Tour Speed</Label>
              <Select 
                value={userPreferences.tourSpeed} 
                onValueChange={(speed: 'slow' | 'medium' | 'fast') => updatePreferences({ tourSpeed: speed })}
                disabled={!userPreferences.enableTooltips}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow - Extended explanations</SelectItem>
                  <SelectItem value="medium">Medium - Standard pace</SelectItem>
                  <SelectItem value="fast">Fast - Quick overview</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Controls the pacing and detail level of guided tours
              </p>
            </div>

            <div className="space-y-3">
              <Label>Trigger Preference</Label>
              <Select 
                value={userPreferences.preferredTrigger} 
                onValueChange={(trigger: 'auto' | 'manual') => updatePreferences({ preferredTrigger: trigger })}
                disabled={!userPreferences.enableTooltips}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto - Show tips automatically</SelectItem>
                  <SelectItem value="manual">Manual - Only when requested</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose when tooltips and hints should appear
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Progress & Reset</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Completed Tours</Label>
                <span className="text-sm text-muted-foreground">
                  {completedTours.length} tours completed
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{getCompletionPercentage(10)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300" 
                    style={{ width: `${getCompletionPercentage(10)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetProgress();
                  toast.success("Tour progress reset", {
                    description: "All tooltips and tours will be shown again."
                  });
                }}
                disabled={completedTours.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="w-full md:w-auto">
          <Clock className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default AccountPreferencesSettings;
