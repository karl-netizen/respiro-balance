
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";

// Define the allowed stress level values as a type
type StressLevelType = "low" | "moderate" | "high" | "very_high";

const StressFocusStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Local state for immediate UI feedback
  const [stressLevel, setStressLevel] = useState<StressLevelType>(
    (preferences.stressLevel as StressLevelType) || "moderate"
  );
  const [focusChallenges, setFocusChallenges] = useState<string[]>(
    Array.isArray(preferences.focusChallenges) ? preferences.focusChallenges : []
  );
  
  // Sync local state with preferences when they change
  useEffect(() => {
    setStressLevel((preferences.stressLevel as StressLevelType) || "moderate");
    setFocusChallenges(
      Array.isArray(preferences.focusChallenges) ? preferences.focusChallenges : []
    );
  }, [preferences.stressLevel, preferences.focusChallenges]);

  const handleStressLevelChange = (value: StressLevelType) => {
    setStressLevel(value);
    updatePreferences({ stressLevel: value as any });
    
    toast.success("Stress level updated", {
      description: `Your stress level has been set to ${value}`,
      duration: 1500
    });
  };
  
  const handleFocusChallengeChange = (value: string, checked: boolean) => {
    // Update local state for immediate feedback
    const updatedChallenges = checked 
      ? [...focusChallenges, value]
      : focusChallenges.filter(challenge => challenge !== value);
    
    setFocusChallenges(updatedChallenges);
    
    // Update preferences
    updatePreferences({ focusChallenges: updatedChallenges });
    
    toast.success(checked ? "Challenge added" : "Challenge removed", {
      description: checked 
        ? `Added ${value} to your focus challenges` 
        : `Removed ${value} from your focus challenges`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Stress Level</h3>
        <p className="text-sm text-muted-foreground mb-3">
          How would you describe your typical daily stress level?
        </p>
        <RadioGroup 
          value={stressLevel} 
          onValueChange={(value) => handleStressLevelChange(value as StressLevelType)} 
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStressLevelChange("low")}>
            <RadioGroupItem value="low" id="stress-low" />
            <Label htmlFor="stress-low" className="cursor-pointer w-full">Low - I rarely feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStressLevelChange("moderate")}>
            <RadioGroupItem value="moderate" id="stress-moderate" />
            <Label htmlFor="stress-moderate" className="cursor-pointer w-full">Moderate - I sometimes feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStressLevelChange("high")}>
            <RadioGroupItem value="high" id="stress-high" />
            <Label htmlFor="stress-high" className="cursor-pointer w-full">High - I often feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStressLevelChange("very_high")}>
            <RadioGroupItem value="very_high" id="stress-very-high" />
            <Label htmlFor="stress-very-high" className="cursor-pointer w-full">Very High - I feel stressed almost always</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Focus Challenges</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What challenges your ability to focus during work? Select all that apply.
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("digital_distractions", !focusChallenges.includes("digital_distractions"))}>
            <Checkbox 
              id="focus-digital-distractions" 
              checked={focusChallenges.includes("digital_distractions")}
              onCheckedChange={(checked) => handleFocusChallengeChange("digital_distractions", !!checked)}
            />
            <Label htmlFor="focus-digital-distractions" className="cursor-pointer w-full">Digital distractions (social media, email)</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("noise", !focusChallenges.includes("noise"))}>
            <Checkbox 
              id="focus-noise" 
              checked={focusChallenges.includes("noise")}
              onCheckedChange={(checked) => handleFocusChallengeChange("noise", !!checked)}
            />
            <Label htmlFor="focus-noise" className="cursor-pointer w-full">Noise and environment distractions</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("interruptions", !focusChallenges.includes("interruptions"))}>
            <Checkbox 
              id="focus-interruptions" 
              checked={focusChallenges.includes("interruptions")}
              onCheckedChange={(checked) => handleFocusChallengeChange("interruptions", !!checked)}
            />
            <Label htmlFor="focus-interruptions" className="cursor-pointer w-full">Coworker interruptions</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("fatigue", !focusChallenges.includes("fatigue"))}>
            <Checkbox 
              id="focus-fatigue" 
              checked={focusChallenges.includes("fatigue")}
              onCheckedChange={(checked) => handleFocusChallengeChange("fatigue", !!checked)}
            />
            <Label htmlFor="focus-fatigue" className="cursor-pointer w-full">Mental fatigue or burnout</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("stress", !focusChallenges.includes("stress"))}>
            <Checkbox 
              id="focus-stress" 
              checked={focusChallenges.includes("stress")}
              onCheckedChange={(checked) => handleFocusChallengeChange("stress", !!checked)}
            />
            <Label htmlFor="focus-stress" className="cursor-pointer w-full">Stress and anxiety</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleFocusChallengeChange("sleep", !focusChallenges.includes("sleep"))}>
            <Checkbox 
              id="focus-sleep" 
              checked={focusChallenges.includes("sleep")}
              onCheckedChange={(checked) => handleFocusChallengeChange("sleep", !!checked)}
            />
            <Label htmlFor="focus-sleep" className="cursor-pointer w-full">Poor sleep quality</Label>
          </div>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Stress level: {stressLevel}</p>
          <p>Focus challenges: {focusChallenges.length > 0 ? focusChallenges.join(", ") : "None selected"}</p>
        </div>
      )}
    </div>
  );
};

export default StressFocusStep;
