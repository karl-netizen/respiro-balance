
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RitualReminder } from '@/context/types';

interface RitualReminderSettingProps {
  reminder: RitualReminder;
  onUpdate: (reminder: RitualReminder) => void;
  disabled?: boolean;
}

const RitualReminderSetting: React.FC<RitualReminderSettingProps> = ({
  reminder,
  onUpdate,
  disabled = false
}) => {
  const handleEnabledChange = (enabled: boolean) => {
    onUpdate({
      ...reminder,
      enabled
    });
  };

  const handleTimeChange = (value: string) => {
    const timeInMinutes = parseInt(value) || 0;
    onUpdate({
      ...reminder,
      time: timeInMinutes
    });
  };

  const handleMessageChange = (value: string) => {
    onUpdate({
      ...reminder,
      message: value
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label htmlFor="reminder-enabled" className="text-sm font-medium">
          Enable Reminder
        </Label>
        <Switch
          id="reminder-enabled"
          checked={reminder.enabled}
          onCheckedChange={handleEnabledChange}
          disabled={disabled}
        />
      </div>

      {reminder.enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reminder-time" className="text-sm font-medium">
              Minutes before ritual
            </Label>
            <Input
              id="reminder-time"
              type="number"
              value={reminder.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={disabled}
              min="0"
              max="60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-message" className="text-sm font-medium">
              Custom message (optional)
            </Label>
            <Input
              id="reminder-message"
              type="text"
              value={reminder.message || ''}
              onChange={(e) => handleMessageChange(e.target.value)}
              disabled={disabled}
              placeholder="Custom reminder message..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RitualReminderSetting;
