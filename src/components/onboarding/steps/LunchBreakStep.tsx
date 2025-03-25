
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const LunchBreakStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="lunch-break">Do you take a lunch break?</Label>
          <p className="text-sm text-muted-foreground">
            Regular breaks help maintain productivity and wellbeing
          </p>
        </div>
        <Switch
          id="lunch-break"
          checked={preferences.lunchBreak}
          onCheckedChange={(checked) => updatePreferences({ lunchBreak: checked })}
        />
      </div>

      {preferences.lunchBreak && (
        <div className="space-y-2">
          <Label htmlFor="lunchTime">What time do you usually have lunch?</Label>
          <Input
            id="lunchTime"
            type="time"
            value={preferences.lunchTime}
            onChange={(e) => updatePreferences({ lunchTime: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export default LunchBreakStep;
