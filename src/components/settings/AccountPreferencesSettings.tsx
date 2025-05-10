
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/context";
import { Theme, MeditationExperience } from "@/context/types";

const AccountPreferencesSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const handleThemeChange = (value: Theme) => {
    updatePreferences({ theme: value });
  };
  
  const handleExperienceChange = (value: MeditationExperience) => {
    updatePreferences({ meditationExperience: value });
  };
  
  const handleSessionDurationChange = (value: string) => {
    updatePreferences({ defaultMeditationDuration: parseInt(value, 10) });
  };
  
  const toggleDarkMode = (checked: boolean) => {
    updatePreferences({ darkMode: checked });
  };
  
  const toggleReducedMotion = (checked: boolean) => {
    updatePreferences({ reducedMotion: checked });
  };
  
  const toggleHighContrast = (checked: boolean) => {
    updatePreferences({ highContrast: checked });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-2">Theme</h3>
              <Select value={preferences.theme || "system"} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">Meditation Experience</h3>
              <Select 
                value={preferences.meditationExperience || "beginner"} 
                onValueChange={handleExperienceChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">Default Session Duration</h3>
              <Select 
                value={String(preferences.defaultMeditationDuration || 10)} 
                onValueChange={handleSessionDurationChange}
              >
                <SelectTrigger className="w-full">
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
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Accessibility</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Use dark theme for the interface
                </div>
              </div>
              <Switch 
                id="dark-mode" 
                checked={preferences.darkMode || false}
                onCheckedChange={toggleDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <div className="text-sm text-muted-foreground">
                  Minimize animations throughout the app
                </div>
              </div>
              <Switch 
                id="reduced-motion" 
                checked={preferences.reducedMotion || false}
                onCheckedChange={toggleReducedMotion}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <div className="text-sm text-muted-foreground">
                  Increase contrast for better visibility
                </div>
              </div>
              <Switch 
                id="high-contrast" 
                checked={preferences.highContrast || false}
                onCheckedChange={toggleHighContrast}
              />
            </div>
          </div>
          
          {/* Onboarding section */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium">Onboarding</h3>
            
            {preferences.hasCompletedOnboarding ? (
              <div>
                <div className="text-sm text-muted-foreground mb-3">
                  {preferences.lastOnboardingCompleted ? (
                    <>You completed onboarding on {new Date(preferences.lastOnboardingCompleted).toLocaleDateString()}.</>
                  ) : (
                    <>You've completed the onboarding process.</>
                  )}
                  {preferences.lastOnboardingStep !== null && preferences.lastOnboardingStep >= 0 && (
                    <> You can resume where you left off.</>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    window.location.href = '/onboarding?resume=true';
                  }}
                >
                  {preferences.lastOnboardingStep !== null && preferences.lastOnboardingStep >= 0
                    ? "Resume Onboarding"
                    : "Restart Onboarding"}
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground mb-3">
                  You haven't completed the onboarding process yet.
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = '/onboarding';
                  }}
                >
                  Complete Onboarding
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPreferencesSettings;
