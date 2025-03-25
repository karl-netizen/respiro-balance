
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const SleepStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Sleep Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Regular sleep patterns are important for mental clarity and wellbeing
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bedTime">What time do you usually go to bed?</Label>
        <Input
          id="bedTime"
          type="time"
          value={preferences.bedTime}
          onChange={(e) => updatePreferences({ bedTime: e.target.value })}
        />
      </div>
    </div>
  );
};

export default SleepStep;
