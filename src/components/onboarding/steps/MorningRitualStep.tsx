
import React from "react";
import { useUserPreferences } from "@/context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MorningRitualStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleActivityChange = (value: string, checked: boolean) => {
    // Ensure morningActivities is an array before using it
    let updatedActivities = [...(preferences.morningActivities || [])];
    
    if (checked) {
      updatedActivities.push(value);
    } else {
      updatedActivities = updatedActivities.filter(activity => activity !== value);
    }
    
    updatePreferences({ morningActivities: updatedActivities });
  };

  const handleDevicesChange = (value: string) => {
    updatePreferences({ morningDevices: value as any });
  };

  const handleEnergyLevelChange = (value: number[]) => {
    updatePreferences({ morningEnergyLevel: value[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Morning Activities</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Which of these do you typically include in your morning?
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-meditation" 
              checked={preferences.morningActivities?.includes("meditation") || false}
              onCheckedChange={(checked) => handleActivityChange("meditation", !!checked)}
            />
            <Label htmlFor="activity-meditation">Meditation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-exercise" 
              checked={preferences.morningActivities?.includes("exercise") || false}
              onCheckedChange={(checked) => handleActivityChange("exercise", !!checked)}
            />
            <Label htmlFor="activity-exercise">Exercise</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-journaling" 
              checked={preferences.morningActivities?.includes("journaling") || false}
              onCheckedChange={(checked) => handleActivityChange("journaling", !!checked)}
            />
            <Label htmlFor="activity-journaling">Journaling</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-reading" 
              checked={preferences.morningActivities?.includes("reading") || false}
              onCheckedChange={(checked) => handleActivityChange("reading", !!checked)}
            />
            <Label htmlFor="activity-reading">Reading</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-planning" 
              checked={preferences.morningActivities?.includes("planning") || false}
              onCheckedChange={(checked) => handleActivityChange("planning", !!checked)}
            />
            <Label htmlFor="activity-planning">Planning the day</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-email" 
              checked={preferences.morningActivities?.includes("email") || false}
              onCheckedChange={(checked) => handleActivityChange("email", !!checked)}
            />
            <Label htmlFor="activity-email">Checking emails/messages</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Morning Devices</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What's your relationship with devices in the morning?
        </p>
        <RadioGroup 
          value={preferences.morningDevices || "phone_delayed"} 
          onValueChange={handleDevicesChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_first" id="devices-first" />
            <Label htmlFor="devices-first">Check phone immediately after waking up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_delayed" id="devices-delayed" />
            <Label htmlFor="devices-delayed">Use phone after morning routine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no_devices" id="devices-none" />
            <Label htmlFor="devices-none">Try to avoid devices in the morning</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">
          Typical morning energy level: {preferences.morningEnergyLevel || 5}/10
        </h3>
        <Slider
          value={[preferences.morningEnergyLevel || 5]}
          onValueChange={handleEnergyLevelChange}
          min={1}
          max={10}
          step={1}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low Energy</span>
          <span>Medium</span>
          <span>High Energy</span>
        </div>
      </div>
    </div>
  );
};

export default MorningRitualStep;
