
import React from "react";
import { useUserPreferences } from "@/context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const TimeManagementStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleStyleChange = (value: string) => {
    updatePreferences({ timeManagementStyle: value as any });
  };

  const handleChallengeChange = (value: string, checked: boolean) => {
    // Ensure timeChallenges is an array before using it
    let updatedChallenges = [...(preferences.timeChallenges || [])];
    
    if (checked) {
      updatedChallenges.push(value);
    } else {
      updatedChallenges = updatedChallenges.filter(challenge => challenge !== value);
    }
    
    updatePreferences({ timeChallenges: updatedChallenges });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">How do you manage your time?</h3>
        <RadioGroup 
          value={preferences.timeManagementStyle || "flexible"} 
          onValueChange={handleStyleChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pomodoro" id="style-pomodoro" />
            <Label htmlFor="style-pomodoro">Pomodoro Technique - Work in focused intervals</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="timeblocking" id="style-timeblocking" />
            <Label htmlFor="style-timeblocking">Time Blocking - Schedule specific tasks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="deadline" id="style-deadline" />
            <Label htmlFor="style-deadline">Deadline-driven - Work to meet specific deadlines</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flexible" id="style-flexible" />
            <Label htmlFor="style-flexible">Flexible - Adapt as needed throughout the day</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">What are your time management challenges?</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-procrastination" 
              checked={preferences.timeChallenges?.includes("procrastination") || false}
              onCheckedChange={(checked) => handleChallengeChange("procrastination", !!checked)}
            />
            <Label htmlFor="challenge-procrastination">Procrastination</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-distraction" 
              checked={preferences.timeChallenges?.includes("distraction") || false}
              onCheckedChange={(checked) => handleChallengeChange("distraction", !!checked)}
            />
            <Label htmlFor="challenge-distraction">Getting distracted easily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-prioritization" 
              checked={preferences.timeChallenges?.includes("prioritization") || false}
              onCheckedChange={(checked) => handleChallengeChange("prioritization", !!checked)}
            />
            <Label htmlFor="challenge-prioritization">Difficulty prioritizing tasks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-estimation" 
              checked={preferences.timeChallenges?.includes("estimation") || false}
              onCheckedChange={(checked) => handleChallengeChange("estimation", !!checked)}
            />
            <Label htmlFor="challenge-estimation">Poor time estimation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-boundaries" 
              checked={preferences.timeChallenges?.includes("boundaries") || false}
              onCheckedChange={(checked) => handleChallengeChange("boundaries", !!checked)}
            />
            <Label htmlFor="challenge-boundaries">Setting boundaries between work & personal life</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeManagementStep;
