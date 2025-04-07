
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/context';
import { MeditationExperience } from '@/context/types';

const AccountPreferencesSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (theme: string) => {
    updatePreferences({ theme });
  };

  const handleExperienceChange = (experience: string) => {
    // Ensure type safety by casting to the correct type
    const meditationExperience = experience as MeditationExperience;
    updatePreferences({ meditationExperience });
  };

  const handleSessionDurationChange = (duration: string) => {
    updatePreferences({ defaultMeditationDuration: parseInt(duration) });
  };

  const toggleDarkMode = (enabled: boolean) => {
    updatePreferences({ darkMode: enabled });
  };

  const toggleReducedMotion = (enabled: boolean) => {
    updatePreferences({ reducedMotion: enabled });
  };

  const toggleHighContrast = (enabled: boolean) => {
    updatePreferences({ highContrast: enabled });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize how Respiro looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme || 'system'}
                onValueChange={handleThemeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={preferences.darkMode || false}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <Switch
                id="reduced-motion"
                checked={preferences.reducedMotion || false}
                onCheckedChange={toggleReducedMotion}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={preferences.highContrast || false}
                onCheckedChange={toggleHighContrast}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meditation Preferences</CardTitle>
          <CardDescription>Customize your meditation experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={preferences.meditationExperience || 'beginner'}
                onValueChange={handleExperienceChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="default-duration">Default Session Duration</Label>
              <Select
                value={String(preferences.defaultMeditationDuration || 5)}
                onValueChange={handleSessionDurationChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select duration" />
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
              <Label htmlFor="background-music">Background Music</Label>
              <Switch
                id="background-music"
                checked={preferences.enableBackgroundAudio || false}
                onCheckedChange={(enabled) => 
                  updatePreferences({ enableBackgroundAudio: enabled })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-quality-audio">High Quality Audio</Label>
              <Switch
                id="high-quality-audio"
                checked={preferences.highQualityAudio || false}
                onCheckedChange={(enabled) => 
                  updatePreferences({ highQualityAudio: enabled })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="offline-access">Enable Offline Access</Label>
              <Switch
                id="offline-access"
                checked={preferences.offlineAccess || false}
                onCheckedChange={(enabled) => 
                  updatePreferences({ offlineAccess: enabled })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full">Save Preferences</Button>
    </div>
  );
};

export default AccountPreferencesSettings;
