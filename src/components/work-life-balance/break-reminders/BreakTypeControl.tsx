
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { BreakReminder, BreakType } from "@/services/notifications";

interface BreakTypeControlProps {
  type: BreakType;
  reminder: BreakReminder;
  lunchTime?: string;
  notificationsEnabled: boolean;
  onUpdate: (type: BreakType, field: keyof BreakReminder, value: any) => void;
}

const BreakTypeControl: React.FC<BreakTypeControlProps> = ({
  type,
  reminder,
  lunchTime,
  notificationsEnabled,
  onUpdate,
}) => {
  const getBreakTitle = () => {
    switch (type) {
      case 'micro': return 'Micro-breaks (5 min)';
      case 'medium': return 'Medium breaks (15 min)';
      case 'lunch': return 'Lunch break (45 min)';
      case 'long': return 'Long breaks (30 min)';
    }
  };

  const getMinMaxStep = () => {
    switch (type) {
      case 'micro': return { min: 15, max: 120, step: 15 };
      case 'medium': return { min: 60, max: 240, step: 30 };
      case 'long': return { min: 180, max: 480, step: 60 };
      default: return { min: 0, max: 0, step: 0 };
    }
  };

  const isLunchBreak = type === 'lunch';
  const { min, max, step } = getMinMaxStep();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor={`${type}-break`} className="font-medium">{getBreakTitle()}</Label>
          {isLunchBreak && lunchTime && (
            <p className="text-sm text-muted-foreground">
              {`At ${lunchTime}`}
            </p>
          )}
        </div>
        <Switch
          id={`${type}-break`}
          checked={reminder.enabled}
          onCheckedChange={(checked) => onUpdate(type, 'enabled', checked)}
          disabled={!notificationsEnabled || (isLunchBreak && !lunchTime)}
        />
      </div>

      {!isLunchBreak && (
        <div className="pl-0 sm:pl-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Frequency</span>
            <span className="text-sm font-medium">{reminder.interval} minutes</span>
          </div>
          <Slider
            disabled={!notificationsEnabled || !reminder.enabled}
            value={[reminder.interval]}
            min={min}
            max={max}
            step={step}
            onValueChange={([value]) => onUpdate(type, 'interval', value)}
            className="my-4"
          />
        </div>
      )}
    </div>
  );
};

export default BreakTypeControl;
