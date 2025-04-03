
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AccountPreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system', // system, light, dark
    language: 'en', // en, es, fr, de, etc.
    autoPlayNext: true,
    showBiometrics: true,
    backgroundSounds: true,
    hapticFeedback: true,
    session: {
      defaultDuration: '10', // 5, 10, 15, 20, 30, 45, 60
      defaultCategory: 'guided', // guided, quick, deep, sleep
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleValueChange = (key: string, value: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would update user preferences here
      // await updateUserPreferences(preferences);
      
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preferences</CardTitle>
        <CardDescription>
          Customize your meditation experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Appearance</h3>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => handleValueChange('theme', value)}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => handleValueChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Session Defaults</h3>
            
            <div className="space-y-2">
              <Label htmlFor="default-duration">Default Session Duration</Label>
              <Select
                value={preferences.session.defaultDuration}
                onValueChange={(value) => handleValueChange('session.defaultDuration', value)}
              >
                <SelectTrigger id="default-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-category">Default Category</Label>
              <Select
                value={preferences.session.defaultCategory}
                onValueChange={(value) => handleValueChange('session.defaultCategory', value)}
              >
                <SelectTrigger id="default-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guided">Guided Meditation</SelectItem>
                  <SelectItem value="quick">Quick Breaks</SelectItem>
                  <SelectItem value="deep">Deep Focus</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Features</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-play">Auto-play Next Session</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically play the next recommended session
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={preferences.autoPlayNext}
                onCheckedChange={() => handleToggle('autoPlayNext')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-biometrics">Show Biometrics</Label>
                <p className="text-xs text-muted-foreground">
                  Display biometric data during sessions
                </p>
              </div>
              <Switch
                id="show-biometrics"
                checked={preferences.showBiometrics}
                onCheckedChange={() => handleToggle('showBiometrics')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="background-sounds">Background Sounds</Label>
                <p className="text-xs text-muted-foreground">
                  Play ambient sounds during sessions
                </p>
              </div>
              <Switch
                id="background-sounds"
                checked={preferences.backgroundSounds}
                onCheckedChange={() => handleToggle('backgroundSounds')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                <p className="text-xs text-muted-foreground">
                  Enable haptic feedback for session control
                </p>
              </div>
              <Switch
                id="haptic-feedback"
                checked={preferences.hapticFeedback}
                onCheckedChange={() => handleToggle('hapticFeedback')}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountPreferencesSettings;
