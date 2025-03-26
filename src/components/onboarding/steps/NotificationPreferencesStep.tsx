
import React from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, Calendar, Trophy, Sparkles } from "lucide-react";

const NotificationPreferencesStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleSessionRemindersChange = (checked: boolean) => {
    updatePreferences({ enableSessionReminders: checked });
  };

  const handleProgressUpdatesChange = (checked: boolean) => {
    updatePreferences({ enableProgressUpdates: checked });
  };

  const handleRecommendationsChange = (checked: boolean) => {
    updatePreferences({ enableRecommendations: checked });
  };

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
              checked={preferences.enableSessionReminders}
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
              checked={preferences.enableProgressUpdates}
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
              checked={preferences.enableProgressUpdates}
              onCheckedChange={handleProgressUpdatesChange}
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
              checked={preferences.enableRecommendations}
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
