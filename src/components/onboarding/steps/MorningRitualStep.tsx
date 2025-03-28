
import React from "react";
import { useUserPreferences } from "@/context";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Alarm, Sun, Coffee, Calendar, Smartphone } from "lucide-react";
import { MorningDevicesHabit } from "@/context/types";

const MorningRitualStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleMorningActivityChange = (activity: string, checked: boolean) => {
    // Ensure morningActivities exists in preferences
    const currentActivities = preferences.morningActivities || [];
    
    let updatedActivities;
    if (checked) {
      updatedActivities = [...currentActivities, activity];
    } else {
      updatedActivities = currentActivities.filter(item => item !== activity);
    }
    
    updatePreferences({ morningActivities: updatedActivities });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Alarm className="w-4 h-4 mr-2 text-primary" />
          What time do you typically wake up?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weekday-wake" className="text-xs text-muted-foreground mb-1 block">Weekdays</Label>
            <Input
              id="weekday-wake"
              type="time"
              value={preferences.weekdayWakeTime || "07:00"}
              onChange={(e) => updatePreferences({ weekdayWakeTime: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="weekend-wake" className="text-xs text-muted-foreground mb-1 block">Weekends</Label>
            <Input
              id="weekend-wake"
              type="time"
              value={preferences.weekendWakeTime || "08:00"}
              onChange={(e) => updatePreferences({ weekendWakeTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Sun className="w-4 h-4 mr-2 text-primary" />
          What's your typical morning energy level?
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Energy</span>
            <span>High Energy</span>
          </div>
          <Slider
            value={[preferences.morningEnergyLevel || 5]}
            onValueChange={(value) => updatePreferences({ morningEnergyLevel: value[0] })}
            max={10}
            step={1}
          />
          <div className="text-center text-sm mt-2">
            {preferences.morningEnergyLevel ? preferences.morningEnergyLevel : 5}/10
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Coffee className="w-4 h-4 mr-2 text-primary" />
          What activities do you typically do in the first 30 minutes after waking up?
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-check-phone" 
              checked={preferences.morningActivities?.includes("check_phone") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("check_phone", !!checked)}
            />
            <label htmlFor="morning-check-phone" className="text-sm">Check phone/emails</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-meditate" 
              checked={preferences.morningActivities?.includes("meditation") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("meditation", !!checked)}
            />
            <label htmlFor="morning-meditate" className="text-sm">Meditation/mindfulness</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-exercise" 
              checked={preferences.morningActivities?.includes("exercise") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("exercise", !!checked)}
            />
            <label htmlFor="morning-exercise" className="text-sm">Exercise/stretching</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-hydration" 
              checked={preferences.morningActivities?.includes("hydration") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("hydration", !!checked)}
            />
            <label htmlFor="morning-hydration" className="text-sm">Hydration (water/tea/coffee)</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-journal" 
              checked={preferences.morningActivities?.includes("journaling") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("journaling", !!checked)}
            />
            <label htmlFor="morning-journal" className="text-sm">Journaling/planning</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="morning-news" 
              checked={preferences.morningActivities?.includes("news_social") || false}
              onCheckedChange={(checked) => handleMorningActivityChange("news_social", !!checked)}
            />
            <label htmlFor="morning-news" className="text-sm">Reading news/social media</label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Smartphone className="w-4 h-4 mr-2 text-primary" />
          How do you use devices in the morning?
        </h3>
        <RadioGroup 
          value={preferences.morningDevices || "phone_first"} 
          onValueChange={(value: MorningDevicesHabit) => updatePreferences({ morningDevices: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_first" id="devices-first" />
            <Label htmlFor="devices-first">I check my phone immediately upon waking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_delayed" id="devices-delayed" />
            <Label htmlFor="devices-delayed">I wait at least 30 minutes before using devices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no_devices" id="devices-none" />
            <Label htmlFor="devices-none">I try to avoid devices in the morning completely</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default MorningRitualStep;
