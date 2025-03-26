
import React from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const StressFocusStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleStressLevelChange = (value: string) => {
    updatePreferences({ stressLevel: value as any });
  };

  const handleFocusChallengeChange = (value: string, checked: boolean) => {
    let updatedChallenges = [...preferences.focusChallenges];
    
    if (checked) {
      updatedChallenges.push(value);
    } else {
      updatedChallenges = updatedChallenges.filter(challenge => challenge !== value);
    }
    
    updatePreferences({ focusChallenges: updatedChallenges });
  };

  const handleEnergyPatternChange = (value: string) => {
    updatePreferences({ energyPattern: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">What's your typical stress level during work days?</h3>
        <RadioGroup 
          value={preferences.stressLevel} 
          onValueChange={handleStressLevelChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="stress-low" />
            <Label htmlFor="stress-low">Low - I rarely feel stressed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="stress-moderate" />
            <Label htmlFor="stress-moderate">Moderate - I feel stressed sometimes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="stress-high" />
            <Label htmlFor="stress-high">High - I often feel stressed</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">What focus challenges do you experience? (Select all that apply)</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-distractions" 
              checked={preferences.focusChallenges.includes("distractions")}
              onCheckedChange={(checked) => handleFocusChallengeChange("distractions", !!checked)}
            />
            <label htmlFor="challenge-distractions" className="text-sm">
              Frequent distractions (notifications, noise, etc.)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-afternoon_slump" 
              checked={preferences.focusChallenges.includes("afternoon_slump")}
              onCheckedChange={(checked) => handleFocusChallengeChange("afternoon_slump", !!checked)}
            />
            <label htmlFor="challenge-afternoon_slump" className="text-sm">
              Afternoon energy slump
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-multitasking" 
              checked={preferences.focusChallenges.includes("multitasking")}
              onCheckedChange={(checked) => handleFocusChallengeChange("multitasking", !!checked)}
            />
            <label htmlFor="challenge-multitasking" className="text-sm">
              Difficulty focusing on one task (multitasking)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-mind_wandering" 
              checked={preferences.focusChallenges.includes("mind_wandering")}
              onCheckedChange={(checked) => handleFocusChallengeChange("mind_wandering", !!checked)}
            />
            <label htmlFor="challenge-mind_wandering" className="text-sm">
              Mind wandering/racing thoughts
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">When during the day is your energy typically lowest?</h3>
        <RadioGroup 
          value={preferences.energyPattern} 
          onValueChange={handleEnergyPatternChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="morning_dip" id="energy-morning" />
            <Label htmlFor="energy-morning">Morning (before 11am)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="afternoon_dip" id="energy-afternoon" />
            <Label htmlFor="energy-afternoon">Afternoon (1-4pm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="evening_dip" id="energy-evening" />
            <Label htmlFor="energy-evening">Evening (after 5pm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consistent" id="energy-consistent" />
            <Label htmlFor="energy-consistent">My energy is fairly consistent</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default StressFocusStep;
