
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserPreferences } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ConnectedDevicesList, NoDevicesView } from "@/components/biofeedback";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SettingsPage = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const handleToggleSetting = (key: string, value: boolean) => {
    updatePreferences({ [key]: value });
    toast.success("Setting updated", {
      description: `${key} is now ${value ? "enabled" : "disabled"}`
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="devices">Connected Devices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your application preferences
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
                      <Label htmlFor="autoPlayNextSession" className="font-medium">Auto-play Next Session</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically start the next meditation session
                      </p>
                    </div>
                    <Switch 
                      id="autoPlayNextSession" 
                      checked={preferences.autoPlayNextSession}
                      onCheckedChange={(checked) => handleToggleSetting('autoPlayNextSession', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="showBiometrics" className="font-medium">Show Biometric Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Display biometric information during meditation
                      </p>
                    </div>
                    <Switch 
                      id="showBiometrics" 
                      checked={preferences.showBiometrics}
                      onCheckedChange={(checked) => handleToggleSetting('showBiometrics', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="reminders" className="font-medium">Meditation Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily reminders for your practice
                      </p>
                    </div>
                    <Switch 
                      id="reminders" 
                      checked={preferences.reminders}
                      onCheckedChange={(checked) => handleToggleSetting('reminders', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handleToggleSetting('emailNotifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="achievementNotifications" className="font-medium">Achievement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you reach new milestones
                      </p>
                    </div>
                    <Switch 
                      id="achievementNotifications" 
                      checked={preferences.achievementNotifications}
                      onCheckedChange={(checked) => handleToggleSetting('achievementNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>
                    Manage your wearable and biometric devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {preferences.hasWearableDevice ? (
                    <ConnectedDevicesList />
                  ) : (
                    <NoDevicesView />
                  )}
                  
                  <div className="mt-6">
                    <Button
                      onClick={() => handleToggleSetting('hasWearableDevice', !preferences.hasWearableDevice)}
                    >
                      {preferences.hasWearableDevice ? "Disconnect Devices" : "Connect a Device"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
