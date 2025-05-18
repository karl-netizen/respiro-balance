
import React from "react";
import { useUserPreferences } from "@/context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const MeditationExperienceStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleExperienceChange = (value: string) => {
    updatePreferences({ meditationExperience: value });
    toast.success("Meditation experience updated", {
      description: `Your experience level has been set to ${value}`,
      duration: 1500
    });
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
    const duration = value[0];
    updatePreferences({ preferredSessionDuration: duration });
    
    toast.success("Session duration updated", {
      description: `Your preferred session duration has been set to ${duration} minutes`,
      duration: 1500
    });
  };

  // Get color based on duration value
  const getDurationColor = (level: number) => {
    if (level <= 10) return "bg-blue-500"; // Short sessions
    if (level <= 20) return "bg-purple-500"; // Medium sessions
    return "bg-indigo-500"; // Long sessions
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">What's your level of meditation experience?</h3>
        <RadioGroup 
          value={preferences.meditationExperience || ''} 
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
              checked={preferences.meditationGoals?.includes("stress_reduction") || false}
              onCheckedChange={(checked) => handleGoalChange("stress_reduction", !!checked)}
            />
            <label htmlFor="goal-stress_reduction" className="text-sm">
              Reduce stress and anxiety
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-better_focus" 
              checked={preferences.meditationGoals?.includes("better_focus") || false}
              onCheckedChange={(checked) => handleGoalChange("better_focus", !!checked)}
            />
            <label htmlFor="goal-better_focus" className="text-sm">
              Improve focus and concentration
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-better_sleep" 
              checked={preferences.meditationGoals?.includes("better_sleep") || false}
              onCheckedChange={(checked) => handleGoalChange("better_sleep", !!checked)}
            />
            <label htmlFor="goal-better_sleep" className="text-sm">
              Better sleep quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="goal-mindfulness" 
              checked={preferences.meditationGoals?.includes("mindfulness") || false}
              onCheckedChange={(checked) => handleGoalChange("mindfulness", !!checked)}
            />
            <label htmlFor="goal-mindfulness" className="text-sm">
              Greater mindfulness in daily life
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">
          Preferred session duration: {preferences.preferredSessionDuration || 10} minutes
        </h3>
        
        {/* Enhanced session duration visualization with contrast styling */}
        <div className="relative mb-6 mt-4">
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div 
              className={`h-full ${getDurationColor(preferences.preferredSessionDuration || 10)} transition-all duration-200`} 
              style={{ width: `${((preferences.preferredSessionDuration || 10) / 30) * 100}%` }}
            ></div>
          </div>
          <Slider
            value={[preferences.preferredSessionDuration || 10]}
            onValueChange={handleDurationChange}
            min={3}
            max={30}
            step={1}
            className="my-2"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-blue-500 font-medium">Short (3-10min)</span>
          <span className="text-purple-500 font-medium">Medium (10-20min)</span>
          <span className="text-indigo-500 font-medium">Long (20-30min)</span>
        </div>
      </div>
    </div>
  );
};

export default MeditationExperienceStep;
