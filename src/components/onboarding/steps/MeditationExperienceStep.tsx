
import React from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const MeditationExperienceStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleExperienceChange = (value: string) => {
    updatePreferences({ meditationExperience: value as any });
  };

  const handleGoalChange = (value: string, checked: boolean) => {
    let updatedGoals = [...preferences.meditationGoals];
    
    if (checked) {
      updatedGoals.push(value);
    } else {
      updatedGoals = updatedGoals.filter(goal => goal !== value);
    }
    
    updatePreferences({ meditationGoals: updatedGoals });
  };

  const handleDurationChange = (value: number[]) => {
    updatePreferences({ preferredSessionDuration: value[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">What's your level of meditation experience?</h3>
        <RadioGroup 
          value={preferences.meditationExperience} 
          onValueChange={handleExperienceChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="exp-none" />
            <Label htmlFor="exp-none">None - I've never meditated before</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="exp-beginner" />
            <Label htmlFor="exp-beginner">Beginner - I've tried it a few times</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="exp-intermediate" />
            <Label htmlFor="exp-intermediate">Intermediate - I meditate occasionally</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="exp-advanced" />
            <Label htmlFor="exp-advanced">Advanced - I have a regular practice</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">What are your main goals with meditation? (Select all that apply)</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-stress_reduction" 
              checked={preferences.meditationGoals.includes("stress_reduction")}
              onCheckedChange={(checked) => handleGoalChange("stress_reduction", !!checked)}
            />
            <label htmlFor="goal-stress_reduction" className="text-sm">
              Reduce stress and anxiety
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-better_focus" 
              checked={preferences.meditationGoals.includes("better_focus")}
              onCheckedChange={(checked) => handleGoalChange("better_focus", !!checked)}
            />
            <label htmlFor="goal-better_focus" className="text-sm">
              Improve focus and concentration
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-better_sleep" 
              checked={preferences.meditationGoals.includes("better_sleep")}
              onCheckedChange={(checked) => handleGoalChange("better_sleep", !!checked)}
            />
            <label htmlFor="goal-better_sleep" className="text-sm">
              Better sleep quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-mindfulness" 
              checked={preferences.meditationGoals.includes("mindfulness")}
              onCheckedChange={(checked) => handleGoalChange("mindfulness", !!checked)}
            />
            <label htmlFor="goal-mindfulness" className="text-sm">
              Greater mindfulness in daily life
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">
          Preferred session duration: {preferences.preferredSessionDuration} minutes
        </h3>
        <Slider
          value={[preferences.preferredSessionDuration]}
          onValueChange={handleDurationChange}
          min={3}
          max={30}
          step={1}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 min</span>
          <span>15 min</span>
          <span>30 min</span>
        </div>
      </div>
    </div>
  );
};

export default MeditationExperienceStep;
