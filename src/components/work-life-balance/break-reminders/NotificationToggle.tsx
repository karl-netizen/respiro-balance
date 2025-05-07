
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationToggleProps {
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ 
  notificationsEnabled, 
  onToggleNotifications 
}) => {
  return (
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
        onCheckedChange={onToggleNotifications}
      />
    </div>
  );
};

export default NotificationToggle;
