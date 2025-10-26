
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserPreferences } from "@/context";
import { useBreakReminderSettings } from "./hooks/useBreakReminderSettings";
import BreakReminderHeader from "./break-reminders/BreakReminderHeader";
import NotificationToggle from "./break-reminders/NotificationToggle";
import PermissionWarning from "./break-reminders/PermissionWarning";
import BreakScheduleList from "./break-reminders/BreakScheduleList";
import NotificationMessageEditor from "./break-reminders/NotificationMessageEditor";

const BreakReminderPreferences = () => {
  const { preferences } = useUserPreferences();
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
        <BreakReminderHeader notificationsEnabled={notificationsEnabled} />
        <CardDescription>
          Configure how and when you'd like to be reminded to take breaks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Permission warning */}
        <PermissionWarning permissionState={permissionState} />
        
        {/* Main toggle */}
        <NotificationToggle 
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
        />
        
        {/* Break schedule */}
        <BreakScheduleList
          reminders={reminders}
          preferences={preferences}
          notificationsEnabled={notificationsEnabled}
          onUpdateReminder={updateReminder}
        />
        
        {/* Notification messages */}
        <NotificationMessageEditor
          reminders={reminders}
          notificationsEnabled={notificationsEnabled}
          onUpdate={updateReminder}
        />
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
