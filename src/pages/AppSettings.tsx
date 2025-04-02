
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserPreferences } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AppSettings = () => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  
  const handleToggleSetting = (key: string, value: boolean) => {
    updatePreferences({ [key]: value });
    toast.success("Setting updated", {
      description: `${key} is now ${value ? "enabled" : "disabled"}`
    });
  };
  
  const handleResetPreferences = () => {
    resetPreferences();
    toast.success("Settings reset", {
      description: "All application settings have been reset to default values"
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">App Settings</h1>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => handleToggleSetting('darkMode', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="reducedMotion" className="font-medium">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations for accessibility
                    </p>
                  </div>
                  <Switch 
                    id="reducedMotion" 
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => handleToggleSetting('reducedMotion', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="highContrast" className="font-medium">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase visual contrast for better readability
                    </p>
                  </div>
                  <Switch 
                    id="highContrast" 
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => handleToggleSetting('highContrast', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>
                  Configure application performance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="enableBackgroundAudio" className="font-medium">Background Audio</Label>
                    <p className="text-sm text-muted-foreground">
                      Continue playing audio when app is in background
                    </p>
                  </div>
                  <Switch 
                    id="enableBackgroundAudio" 
                    checked={preferences.enableBackgroundAudio}
                    onCheckedChange={(checked) => handleToggleSetting('enableBackgroundAudio', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="highQualityAudio" className="font-medium">High Quality Audio</Label>
                    <p className="text-sm text-muted-foreground">
                      Stream higher quality audio (uses more data)
                    </p>
                  </div>
                  <Switch 
                    id="highQualityAudio" 
                    checked={preferences.highQualityAudio}
                    onCheckedChange={(checked) => handleToggleSetting('highQualityAudio', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="offlineAccess" className="font-medium">Offline Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Download content for offline use
                    </p>
                  </div>
                  <Switch 
                    id="offlineAccess" 
                    checked={preferences.offlineAccess}
                    onCheckedChange={(checked) => handleToggleSetting('offlineAccess', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced</CardTitle>
                <CardDescription>
                  Advanced application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Reset All Settings</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Settings</DialogTitle>
                      <DialogDescription>
                        This will reset all application settings to their default values. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleResetPreferences}>
                        Reset Settings
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Storage Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    Cached data: 24MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppSettings;
