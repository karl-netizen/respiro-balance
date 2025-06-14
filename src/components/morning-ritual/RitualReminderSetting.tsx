
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RitualReminder } from './types';

interface RitualReminderSettingProps {
  reminder: RitualReminder;
  onUpdate: (reminder: RitualReminder) => void;
}

const RitualReminderSetting: React.FC<RitualReminderSettingProps> = ({
  reminder,
  onUpdate
}) => {
  const handleEnabledChange = (enabled: boolean) => {
    onUpdate({ ...reminder, enabled });
  };

  const handleTimeChange = (time: number) => {
    onUpdate({ ...reminder, time });
  };

  const handleMessageChange = (message: string) => {
    onUpdate({ ...reminder, message });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="reminder-enabled"
          checked={reminder.enabled}
          onCheckedChange={handleEnabledChange}
        />
        <Label htmlFor="reminder-enabled">Enable reminder</Label>
      </div>

      {reminder.enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Minutes before ritual</Label>
            <Input
              id="reminder-time"
              type="number"
              min="1"
              max="60"
              value={reminder.time}
              onChange={(e) => handleTimeChange(parseInt(e.target.value) || 15)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-message">Custom message (optional)</Label>
            <Input
              id="reminder-message"
              placeholder="Time for your morning ritual!"
              value={reminder.message || ''}
              onChange={(e) => handleMessageChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RitualReminderSetting;
