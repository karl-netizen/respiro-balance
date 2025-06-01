
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Heart, Volume2, Clock, Star, Palette } from 'lucide-react';

interface PersonalizationSettings {
  focusIntensity: number;
  calmnessPriority: number;
  sessionDuration: number;
  voiceGuidance: boolean;
  backgroundSounds: string;
  difficultyLevel: string;
  personalizedTiming: boolean;
  biometricAdaptation: boolean;
}

export const SessionPersonalization: React.FC = () => {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    focusIntensity: 70,
    calmnessPriority: 80,
    sessionDuration: 15,
    voiceGuidance: true,
    backgroundSounds: 'nature',
    difficultyLevel: 'intermediate',
    personalizedTiming: true,
    biometricAdaptation: false
  });

  const handleSettingChange = (key: keyof PersonalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const backgroundSoundOptions = [
    { value: 'nature', label: 'Nature Sounds' },
    { value: 'ocean', label: 'Ocean Waves' },
    { value: 'rain', label: 'Gentle Rain' },
    { value: 'forest', label: 'Forest Ambiance' },
    { value: 'silence', label: 'Silence' },
    { value: 'binaural', label: 'Binaural Beats' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Meditation Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Focus vs Calm Balance */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                Focus Intensity: {settings.focusIntensity}%
              </Label>
              <Slider
                value={[settings.focusIntensity]}
                onValueChange={([value]) => handleSettingChange('focusIntensity', value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-green-500" />
                Calmness Priority: {settings.calmnessPriority}%
              </Label>
              <Slider
                value={[settings.calmnessPriority]}
                onValueChange={([value]) => handleSettingChange('calmnessPriority', value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Session Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Preferred Session Duration: {settings.sessionDuration} minutes
            </Label>
            <Slider
              value={[settings.sessionDuration]}
              onValueChange={([value]) => handleSettingChange('sessionDuration', value)}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
          </div>

          {/* Background Sounds */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-purple-500" />
              Background Sounds
            </Label>
            <Select 
              value={settings.backgroundSounds} 
              onValueChange={(value) => handleSettingChange('backgroundSounds', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose background sounds" />
              </SelectTrigger>
              <SelectContent>
                {backgroundSoundOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Difficulty Level
            </Label>
            <Select 
              value={settings.difficultyLevel} 
              onValueChange={(value) => handleSettingChange('difficultyLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Voice Guidance</Label>
              <p className="text-sm text-muted-foreground">
                Include spoken instructions during meditation
              </p>
            </div>
            <Switch
              checked={settings.voiceGuidance}
              onCheckedChange={(checked) => handleSettingChange('voiceGuidance', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Personalized Timing</Label>
              <p className="text-sm text-muted-foreground">
                Adapt session length based on your performance
              </p>
            </div>
            <Switch
              checked={settings.personalizedTiming}
              onCheckedChange={(checked) => handleSettingChange('personalizedTiming', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Biometric Adaptation
                <Badge variant="outline" className="text-xs">Premium</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Adjust session based on heart rate and stress levels
              </p>
            </div>
            <Switch
              checked={settings.biometricAdaptation}
              onCheckedChange={(checked) => handleSettingChange('biometricAdaptation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800">Morning Focus Session</h4>
              <p className="text-sm text-blue-700">
                Based on your preferences: 15-min intermediate session with nature sounds
              </p>
              <Button size="sm" className="mt-2">Start Session</Button>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">Evening Calm Session</h4>
              <p className="text-sm text-green-700">
                Optimized for relaxation: 20-min gentle session with ocean sounds
              </p>
              <Button size="sm" variant="outline" className="mt-2">Start Session</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
