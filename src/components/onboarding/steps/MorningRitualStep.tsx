
import React, { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type MorningDevicesType = "phone_first" | "phone_delayed" | "no_devices";

const MorningRitualStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Local state for immediate UI feedback
  const [morningActivities, setMorningActivities] = useState<string[]>(
    Array.isArray(preferences.morningActivities) ? preferences.morningActivities : []
  );
  const [morningDevices, setMorningDevices] = useState<MorningDevicesType>(
    (preferences.morningDevices as MorningDevicesType) || "phone_delayed"
  );
  const [morningEnergyLevel, setMorningEnergyLevel] = useState<number>(
    preferences.morningEnergyLevel || 5
  );

  // Sync local state with preferences when they change
  useEffect(() => {
    setMorningActivities(Array.isArray(preferences.morningActivities) ? preferences.morningActivities : []);
    setMorningDevices((preferences.morningDevices as MorningDevicesType) || "phone_delayed");
    setMorningEnergyLevel(preferences.morningEnergyLevel || 5);
  }, [preferences.morningActivities, preferences.morningDevices, preferences.morningEnergyLevel]);

  const handleActivityChange = (value: string, checked: boolean) => {
    // Update local state for immediate feedback
    let updatedActivities = checked 
      ? [...morningActivities, value]
      : morningActivities.filter(activity => activity !== value);
    
    setMorningActivities(updatedActivities);
    
    // Update preferences
    updatePreferences({ morningActivities: updatedActivities });
    
    toast.success(checked ? "Activity added" : "Activity removed", {
      description: checked 
        ? `Added ${value} to your morning activities` 
        : `Removed ${value} from your morning activities`,
      duration: 1500
    });
  };

  const handleDevicesChange = (value: MorningDevicesType) => {
    setMorningDevices(value);
    updatePreferences({ morningDevices: value });
    
    toast.success("Devices preference updated", {
      description: `Your morning devices preference has been set to ${value.replace('_', ' ')}`,
      duration: 1500
    });
  };

  const handleEnergyLevelChange = (value: number[]) => {
    const energyLevel = value[0];
    setMorningEnergyLevel(energyLevel);
    updatePreferences({ morningEnergyLevel: energyLevel });
    
    toast.success("Energy level updated", {
      description: `Your morning energy level has been set to ${energyLevel}/10`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Morning Activities</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Which of these do you typically include in your morning?
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("meditation", !morningActivities.includes("meditation"))}>
            <Checkbox 
              id="activity-meditation"
              checked={morningActivities.includes("meditation")}
              onCheckedChange={(checked) => handleActivityChange("meditation", !!checked)}
            />
            <Label htmlFor="activity-meditation" className="cursor-pointer w-full">Meditation</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("exercise", !morningActivities.includes("exercise"))}>
            <Checkbox 
              id="activity-exercise"
              checked={morningActivities.includes("exercise")}
              onCheckedChange={(checked) => handleActivityChange("exercise", !!checked)}
            />
            <Label htmlFor="activity-exercise" className="cursor-pointer w-full">Exercise</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("journaling", !morningActivities.includes("journaling"))}>
            <Checkbox 
              id="activity-journaling"
              checked={morningActivities.includes("journaling")}
              onCheckedChange={(checked) => handleActivityChange("journaling", !!checked)}
            />
            <Label htmlFor="activity-journaling" className="cursor-pointer w-full">Journaling</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("reading", !morningActivities.includes("reading"))}>
            <Checkbox 
              id="activity-reading"
              checked={morningActivities.includes("reading")}
              onCheckedChange={(checked) => handleActivityChange("reading", !!checked)}
            />
            <Label htmlFor="activity-reading" className="cursor-pointer w-full">Reading</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("planning", !morningActivities.includes("planning"))}>
            <Checkbox 
              id="activity-planning"
              checked={morningActivities.includes("planning")}
              onCheckedChange={(checked) => handleActivityChange("planning", !!checked)}
            />
            <Label htmlFor="activity-planning" className="cursor-pointer w-full">Planning the day</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleActivityChange("email", !morningActivities.includes("email"))}>
            <Checkbox 
              id="activity-email"
              checked={morningActivities.includes("email")}
              onCheckedChange={(checked) => handleActivityChange("email", !!checked)}
            />
            <Label htmlFor="activity-email" className="cursor-pointer w-full">Checking emails/messages</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Morning Devices</h3>
        <p className="text-sm text-muted-foreground mb-3">
          What's your relationship with devices in the morning?
        </p>
        <RadioGroup 
          value={morningDevices} 
          onValueChange={(value) => handleDevicesChange(value as MorningDevicesType)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleDevicesChange("phone_first")}>
            <RadioGroupItem value="phone_first" id="devices-first" />
            <Label htmlFor="devices-first" className="cursor-pointer w-full">Check phone immediately after waking up</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleDevicesChange("phone_delayed")}>
            <RadioGroupItem value="phone_delayed" id="devices-delayed" />
            <Label htmlFor="devices-delayed" className="cursor-pointer w-full">Use phone after morning routine</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleDevicesChange("no_devices")}>
            <RadioGroupItem value="no_devices" id="devices-none" />
            <Label htmlFor="devices-none" className="cursor-pointer w-full">Try to avoid devices in the morning</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">
          Typical morning energy level: {morningEnergyLevel}/10
        </h3>
        <Slider
          value={[morningEnergyLevel]}
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
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Morning Activities: {morningActivities.length > 0 ? morningActivities.join(", ") : "None selected"}</p>
          <p>Morning Devices: {morningDevices}</p>
          <p>Morning Energy Level: {morningEnergyLevel}/10</p>
        </div>
      )}
    </div>
  );
};

export default MorningRitualStep;
