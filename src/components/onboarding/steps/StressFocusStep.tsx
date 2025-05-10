
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserPreferences } from "@/context";

const StressFocusStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const handleStressLevelChange = (value: string) => {
    updatePreferences({ stressLevel: value as any });
  };
  
  const handleFocusChallengeChange = (value: string, checked: boolean) => {
    // Ensure focusChallenges is an array before using it
    const focusChallenges = Array.isArray(preferences.focusChallenges) ? 
      preferences.focusChallenges : [];
    
    let updatedChallenges;
    if (checked) {
      updatedChallenges = [...focusChallenges, value];
    } else {
      updatedChallenges = focusChallenges.filter(challenge => challenge !== value);
    }
    
    updatePreferences({ focusChallenges: updatedChallenges });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Stress Level</h3>
        <p className="text-sm text-muted-foreground mb-3">
          How would you describe your typical daily stress level?
        </p>
        <RadioGroup 
          value={preferences.stressLevel || "moderate"} 
          onValueChange={handleStressLevelChange} 
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="stress-low" />
            <Label htmlFor="stress-low">Low - I rarely feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="stress-moderate" />
            <Label htmlFor="stress-moderate">Moderate - I sometimes feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="stress-high" />
            <Label htmlFor="stress-high">High - I often feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very_high" id="stress-very-high" />
            <Label htmlFor="stress-very-high">Very High - I feel stressed almost always</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Focus Challenges</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What challenges your ability to focus during work? Select all that apply.
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-digital-distractions" 
              checked={preferences.focusChallenges?.includes("digital_distractions")}
              onCheckedChange={(checked) => handleFocusChallengeChange("digital_distractions", !!checked)}
            />
            <Label htmlFor="focus-digital-distractions">Digital distractions (social media, email)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-noise" 
              checked={preferences.focusChallenges?.includes("noise")}
              onCheckedChange={(checked) => handleFocusChallengeChange("noise", !!checked)}
            />
            <Label htmlFor="focus-noise">Noise and environment distractions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-interruptions" 
              checked={preferences.focusChallenges?.includes("interruptions")}
              onCheckedChange={(checked) => handleFocusChallengeChange("interruptions", !!checked)}
            />
            <Label htmlFor="focus-interruptions">Coworker interruptions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-fatigue" 
              checked={preferences.focusChallenges?.includes("fatigue")}
              onCheckedChange={(checked) => handleFocusChallengeChange("fatigue", !!checked)}
            />
            <Label htmlFor="focus-fatigue">Mental fatigue or burnout</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-stress" 
              checked={preferences.focusChallenges?.includes("stress")}
              onCheckedChange={(checked) => handleFocusChallengeChange("stress", !!checked)}
            />
            <Label htmlFor="focus-stress">Stress and anxiety</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="focus-sleep" 
              checked={preferences.focusChallenges?.includes("sleep")}
              onCheckedChange={(checked) => handleFocusChallengeChange("sleep", !!checked)}
            />
            <Label htmlFor="focus-sleep">Poor sleep quality</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressFocusStep;
