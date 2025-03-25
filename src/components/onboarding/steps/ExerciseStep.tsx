
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const ExerciseStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="morning-exercise">Do you exercise in the morning?</Label>
          <p className="text-sm text-muted-foreground">
            Morning exercise can boost energy and focus
          </p>
        </div>
        <Switch
          id="morning-exercise"
          checked={preferences.morningExercise}
          onCheckedChange={(checked) => updatePreferences({ morningExercise: checked })}
        />
      </div>

      {preferences.morningExercise && (
        <div className="space-y-2">
          <Label htmlFor="exerciseTime">What time do you usually exercise?</Label>
          <Input
            id="exerciseTime"
            type="time"
            value={preferences.exerciseTime}
            onChange={(e) => updatePreferences({ exerciseTime: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export default ExerciseStep;
