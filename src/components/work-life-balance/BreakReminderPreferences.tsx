
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BellRing, Clock, Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { useUserPreferences } from "@/context";
import { BreakReminder, BreakType, NotificationPermissionState, defaultBreakReminders, notificationService } from "@/services/NotificationService";
import { formatTime } from "./utils";
import { useBreakReminderSettings } from "./hooks/useBreakReminderSettings";

const BreakReminderPreferences = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { 
    reminders, 
    notificationsEnabled, 
    permissionState,
    updateReminder,
    toggleNotifications,
    saveSettings,
    requestPermission
  } = useBreakReminderSettings();
  
  // Request notification permission when toggling on
  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && !permissionState.granted) {
      const granted = await requestPermission();
      if (!granted) {
        toast.error("Notification permission denied", {
          description: "Please enable notifications in your browser settings to receive break reminders."
        });
        return;
      }
    }
    
    toggleNotifications(enabled);
  };

  // Update a specific reminder setting
  const handleReminderUpdate = (type: BreakType, field: keyof BreakReminder, value: any) => {
    updateReminder(type, field, value);
  };

  // Save all settings
  const handleSaveSettings = async () => {
    await saveSettings();
    toast.success("Break reminder settings saved", {
      description: "Your break reminder preferences have been updated."
    });
  };
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Break Reminder Settings</CardTitle>
          {notificationsEnabled ? (
            <BellRing className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <CardDescription>
          Configure how and when you'd like to be reminded to take breaks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Notification permission status */}
        {permissionState.denied && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-md text-sm text-amber-700">
            <strong>Notifications blocked.</strong> Please enable notifications in your browser settings to receive break reminders.
          </div>
        )}
        
        {/* Main toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="notifications-enabled" className="font-medium">Enable Break Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications to take regular breaks
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Break Schedule</h3>
          
          {/* Micro breaks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="micro-break" className="font-medium">Micro-breaks (5 min)</Label>
              <Switch
                id="micro-break"
                checked={reminders.micro.enabled}
                onCheckedChange={(checked) => handleReminderUpdate('micro', 'enabled', checked)}
                disabled={!notificationsEnabled}
              />
            </div>
            <div className="pl-0 sm:pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <span className="text-sm font-medium">{reminders.micro.interval} minutes</span>
              </div>
              <Slider
                disabled={!notificationsEnabled || !reminders.micro.enabled}
                value={[reminders.micro.interval]}
                min={15}
                max={120}
                step={15}
                onValueChange={([value]) => handleReminderUpdate('micro', 'interval', value)}
                className="my-4"
              />
            </div>
          </div>
          
          {/* Medium breaks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="medium-break" className="font-medium">Medium breaks (15 min)</Label>
              <Switch
                id="medium-break"
                checked={reminders.medium.enabled}
                onCheckedChange={(checked) => handleReminderUpdate('medium', 'enabled', checked)}
                disabled={!notificationsEnabled}
              />
            </div>
            <div className="pl-0 sm:pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <span className="text-sm font-medium">{reminders.medium.interval} minutes</span>
              </div>
              <Slider
                disabled={!notificationsEnabled || !reminders.medium.enabled}
                value={[reminders.medium.interval]}
                min={60}
                max={240}
                step={30}
                onValueChange={([value]) => handleReminderUpdate('medium', 'interval', value)}
                className="my-4"
              />
            </div>
          </div>
          
          {/* Lunch break */}
          {preferences.lunchBreak && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lunch-break" className="font-medium">Lunch break (45 min)</Label>
                  <p className="text-sm text-muted-foreground">
                    {preferences.lunchTime ? `At ${formatTime(preferences.lunchTime)}` : 'Time not set'}
                  </p>
                </div>
                <Switch
                  id="lunch-break"
                  checked={reminders.lunch.enabled}
                  onCheckedChange={(checked) => handleReminderUpdate('lunch', 'enabled', checked)}
                  disabled={!notificationsEnabled || !preferences.lunchTime}
                />
              </div>
            </div>
          )}
          
          {/* Long breaks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="long-break" className="font-medium">Long breaks (30 min)</Label>
              <Switch
                id="long-break"
                checked={reminders.long.enabled}
                onCheckedChange={(checked) => handleReminderUpdate('long', 'enabled', checked)}
                disabled={!notificationsEnabled}
              />
            </div>
            <div className="pl-0 sm:pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <span className="text-sm font-medium">{reminders.long.interval} minutes</span>
              </div>
              <Slider
                disabled={!notificationsEnabled || !reminders.long.enabled}
                value={[reminders.long.interval]}
                min={180}
                max={480}
                step={60}
                onValueChange={([value]) => handleReminderUpdate('long', 'interval', value)}
                className="my-4"
              />
            </div>
          </div>
        </div>
        
        {/* Notification messages */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Notification Messages</h3>
          
          <div className="space-y-4">
            {Object.keys(reminders).map((type) => {
              const reminder = reminders[type as BreakType];
              return (
                <div key={type} className="space-y-2">
                  <Label htmlFor={`${type}-message`} className="text-sm">
                    {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} break message
                  </Label>
                  <Input
                    id={`${type}-message`}
                    value={reminder.message}
                    onChange={(e) => handleReminderUpdate(reminder.type, 'message', e.target.value)}
                    placeholder={`Enter message for ${reminder.type} breaks`}
                    disabled={!notificationsEnabled || !reminder.enabled}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={!notificationsEnabled || permissionState.denied}
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BreakReminderPreferences;
