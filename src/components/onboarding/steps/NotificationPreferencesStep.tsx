
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Calendar, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";

const NotificationPreferencesStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  console.log("NotificationPreferencesStep - Current preferences:", preferences);
  
  // Local state for notification toggles
  const [sessionReminders, setSessionReminders] = useState<boolean>(
    preferences.enableSessionReminders || false
  );
  const [progressUpdates, setProgressUpdates] = useState<boolean>(
    preferences.enableProgressUpdates || false
  );
  const [achievementNotifications, setAchievementNotifications] = useState<boolean>(
    preferences.enableProgressUpdates || false
  );
  const [recommendations, setRecommendations] = useState<boolean>(
    preferences.enableRecommendations || false
  );
  
  // Sync local state with preferences when they change
  useEffect(() => {
    console.log("NotificationPreferencesStep - useEffect triggered with preferences:", preferences);
    setSessionReminders(preferences.enableSessionReminders || false);
    setProgressUpdates(preferences.enableProgressUpdates || false);
    setAchievementNotifications(preferences.enableProgressUpdates || false);
    setRecommendations(preferences.enableRecommendations || false);
  }, [
    preferences.enableSessionReminders,
    preferences.enableProgressUpdates,
    preferences.enableRecommendations
  ]);

  // Handlers for toggle changes
  const handleSessionRemindersChange = (checked: boolean) => {
    console.log("Session reminders changed to:", checked);
    setSessionReminders(checked);
    updatePreferences({ enableSessionReminders: checked });
    
    toast.success(checked ? "Reminders enabled" : "Reminders disabled", {
      description: checked 
        ? "You'll receive reminders for your scheduled sessions" 
        : "You won't receive session reminders",
      duration: 1500
    });
  };

  const handleProgressUpdatesChange = (checked: boolean) => {
    console.log("Progress updates changed to:", checked);
    setProgressUpdates(checked);
    updatePreferences({ enableProgressUpdates: checked });
    
    toast.success(checked ? "Updates enabled" : "Updates disabled", {
      description: checked 
        ? "You'll receive weekly progress updates" 
        : "You won't receive weekly progress updates",
      duration: 1500
    });
  };

  const handleAchievementNotificationsChange = (checked: boolean) => {
    console.log("Achievement notifications changed to:", checked);
    setAchievementNotifications(checked);
    updatePreferences({ enableProgressUpdates: checked }); // Use the same preference for now
    
    toast.success(checked ? "Achievement alerts enabled" : "Achievement alerts disabled", {
      description: checked 
        ? "You'll be notified when you reach milestones" 
        : "You won't receive achievement notifications",
      duration: 1500
    });
  };

  const handleRecommendationsChange = (checked: boolean) => {
    console.log("Recommendations changed to:", checked);
    setRecommendations(checked);
    updatePreferences({ enableRecommendations: checked });
    
    toast.success(checked ? "Recommendations enabled" : "Recommendations disabled", {
      description: checked 
        ? "You'll receive personalized content recommendations" 
        : "You won't receive content recommendations",
      duration: 1500
    });
  };

  console.log("NotificationPreferencesStep - Local state:", {
    sessionReminders,
    progressUpdates,
    achievementNotifications,
    recommendations
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="session-reminders" className="font-medium text-sm">
              Session Reminders
            </Label>
            <Switch
              id="session-reminders"
              checked={sessionReminders}
              onCheckedChange={handleSessionRemindersChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Receive reminders for scheduled meditation and breathing sessions
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="progress-updates" className="font-medium text-sm">
              Progress Updates
            </Label>
            <Switch
              id="progress-updates"
              checked={progressUpdates}
              onCheckedChange={handleProgressUpdatesChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Get weekly reports on your meditation and breathing practice
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="achievement-notifications" className="font-medium text-sm">
              Achievement Notifications
            </Label>
            <Switch
              id="achievement-notifications"
              checked={achievementNotifications}
              onCheckedChange={handleAchievementNotificationsChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Be notified when you reach milestones in your practice
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="content-recommendations" className="font-medium text-sm">
              Content Recommendations
            </Label>
            <Switch
              id="content-recommendations"
              checked={recommendations}
              onCheckedChange={handleRecommendationsChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Receive personalized session recommendations based on your preferences
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-secondary">
        <p className="text-sm text-center text-muted-foreground">
          You can change these notification settings anytime in your preferences
        </p>
      </div>
    </div>
  );
};

export default NotificationPreferencesStep;
