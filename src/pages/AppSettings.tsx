

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/context';

const AppSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">App Settings</h1>
          <p className="text-muted-foreground">Customize your app experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Display Preferences</CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={preferences.darkMode || false}
                onCheckedChange={(checked) => handleToggle('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <Switch
                id="reducedMotion"
                checked={preferences.reducedMotion || false}
                onCheckedChange={(checked) => handleToggle('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="highContrast">High Contrast</Label>
              <Switch
                id="highContrast"
                checked={preferences.highContrast || false}
                onCheckedChange={(checked) => handleToggle('highContrast', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audio Settings</CardTitle>
            <CardDescription>
              Configure audio playback preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableBackgroundAudio">Enable Background Audio</Label>
              <Switch
                id="enableBackgroundAudio"
                checked={preferences.enableBackgroundAudio || false}
                onCheckedChange={(checked) => handleToggle('enableBackgroundAudio', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="highQualityAudio">High Quality Audio</Label>
              <Switch
                id="highQualityAudio"
                checked={preferences.highQualityAudio || false}
                onCheckedChange={(checked) => handleToggle('highQualityAudio', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Storage</CardTitle>
            <CardDescription>
              Manage data usage and offline access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="offlineAccess">Enable Offline Access</Label>
              <Switch
                id="offlineAccess"
                checked={preferences.offlineAccess || false}
                onCheckedChange={(checked) => handleToggle('offlineAccess', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppSettings;
