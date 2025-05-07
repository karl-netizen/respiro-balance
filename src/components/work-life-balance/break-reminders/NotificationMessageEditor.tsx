
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BreakReminder, BreakType } from "@/services/notifications";

interface NotificationMessageEditorProps {
  reminders: Record<BreakType, BreakReminder>;
  notificationsEnabled: boolean;
  onUpdate: (type: BreakType, field: keyof BreakReminder, value: any) => void;
}

const NotificationMessageEditor: React.FC<NotificationMessageEditorProps> = ({
  reminders,
  notificationsEnabled,
  onUpdate,
}) => {
  return (
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
                onChange={(e) => onUpdate(reminder.type, 'message', e.target.value)}
                placeholder={`Enter message for ${reminder.type} breaks`}
                disabled={!notificationsEnabled || !reminder.enabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationMessageEditor;
