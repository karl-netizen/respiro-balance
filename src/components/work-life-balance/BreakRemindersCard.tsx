import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, Settings } from "lucide-react";
import { useUserPreferences } from "@/context";
import { formatTime } from "./utils";
import { useBreakReminderSettings } from "./hooks/useBreakReminderSettings";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BreakRemindersCard = () => {
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const { 
    notificationsEnabled, 
    reminders, 
    permissionState,
    toggleNotifications, 
    requestPermission 
  } = useBreakReminderSettings();

  // Handle notification toggle
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
    
    toast.success(enabled ? "Break reminders enabled" : "Break reminders disabled", {
      description: enabled 
        ? "You'll now receive notifications for your scheduled breaks" 
        : "You won't receive break notifications"
    });
  };

  const handleCustomizeClick = () => {
    navigate('/work-life-balance/break-settings');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Break Reminders</CardTitle>
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          {preferences.hasCompletedOnboarding && preferences.lunchBreak
            ? `Includes your lunch break at ${formatTime(preferences.lunchTime)}`
            : "Regular breaks to maintain focus and prevent burnout"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.micro.enabled && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Micro-breaks (5 min)</span>
              <span className="text-sm text-muted-foreground">Every {reminders.micro.interval} minutes</span>
            </div>
          )}
          
          {reminders.medium.enabled && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Medium breaks (15 min)</span>
              <span className="text-sm text-muted-foreground">Every {reminders.medium.interval} minutes</span>
            </div>
          )}
          
          {preferences.hasCompletedOnboarding && preferences.lunchBreak && reminders.lunch.enabled && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Lunch break (45 min)</span>
              <span className="text-sm text-muted-foreground">{formatTime(preferences.lunchTime)}</span>
            </div>
          )}
          
          {reminders.long.enabled && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Long breaks (30 min)</span>
              <span className="text-sm text-muted-foreground">Every {reminders.long.interval} minutes</span>
            </div>
          )}
          
          {/* Show message if no reminders are enabled */}
          {!Object.values(reminders).some(r => r.enabled) && (
            <div className="py-2 text-center text-muted-foreground">
              No break reminders configured
            </div>
          )}
          
          {/* Permission warning */}
          {permissionState.denied && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-md text-sm text-amber-700 mt-4">
              <strong>Notifications blocked.</strong> Please enable notifications in your browser settings.
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
            <label
              htmlFor="notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable notifications
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleCustomizeClick}>
          <Settings className="w-4 h-4 mr-2" /> Customize Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BreakRemindersCard;
