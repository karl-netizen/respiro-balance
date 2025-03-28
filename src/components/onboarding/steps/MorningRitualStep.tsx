
import React from "react";
import { useUserPreferences } from "@/context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sun, Coffee, BookOpen, Smartphone } from "lucide-react";

const MorningRitualStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleFirstActivitiesChange = (activity: string, checked: boolean) => {
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

  const handleMorningEnergyChange = (value: number[]) => {
    updatePreferences({ morningEnergyLevel: value[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Sun className="w-4 h-4 mr-2 text-primary" />
          What time do you typically wake up?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weekdayWakeTime">Weekdays</Label>
            <Input
              id="weekdayWakeTime"
              type="time"
              value={preferences.weekdayWakeTime || "07:00"}
              onChange={(e) => updatePreferences({ weekdayWakeTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekendWakeTime">Weekends</Label>
            <Input
              id="weekendWakeTime"
              type="time"
              value={preferences.weekendWakeTime || "08:00"}
              onChange={(e) => updatePreferences({ weekendWakeTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Coffee className="w-4 h-4 mr-2 text-primary" />
          What are the first activities you do after waking up? (Select all that apply)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-check-phone" 
              checked={preferences.morningActivities?.includes("check_phone") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("check_phone", !!checked)}
            />
            <label htmlFor="activity-check-phone" className="text-sm">
              Check email/messages on phone
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-meditation" 
              checked={preferences.morningActivities?.includes("meditation") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("meditation", !!checked)}
            />
            <label htmlFor="activity-meditation" className="text-sm">
              Meditation/mindfulness practice
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-exercise" 
              checked={preferences.morningActivities?.includes("exercise") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("exercise", !!checked)}
            />
            <label htmlFor="activity-exercise" className="text-sm">
              Physical activity/stretching/yoga
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-hydration" 
              checked={preferences.morningActivities?.includes("hydration") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("hydration", !!checked)}
            />
            <label htmlFor="activity-hydration" className="text-sm">
              Hydration (water/tea/coffee)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-breakfast" 
              checked={preferences.morningActivities?.includes("breakfast") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("breakfast", !!checked)}
            />
            <label htmlFor="activity-breakfast" className="text-sm">
              Nutritious breakfast
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-journaling" 
              checked={preferences.morningActivities?.includes("journaling") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("journaling", !!checked)}
            />
            <label htmlFor="activity-journaling" className="text-sm">
              Journaling/planning
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="activity-news" 
              checked={preferences.morningActivities?.includes("news_media") || false}
              onCheckedChange={(checked) => handleFirstActivitiesChange("news_media", !!checked)}
            />
            <label htmlFor="activity-news" className="text-sm">
              News/social media consumption
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1 flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-primary" />
          Morning energy level (1-10)
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          How energized do you typically feel within the first hour of waking up?
        </p>
        <Slider
          value={[preferences.morningEnergyLevel || 5]}
          onValueChange={handleMorningEnergyChange}
          min={1}
          max={10}
          step={1}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Very groggy</span>
          <span>Neutral</span>
          <span>Fully energized</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Smartphone className="w-4 h-4 mr-2 text-primary" />
          Morning environment
        </h3>
        <RadioGroup 
          value={preferences.morningDevices || "phone_first"} 
          onValueChange={(value) => updatePreferences({ morningDevices: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_first" id="devices-phone-first" />
            <Label htmlFor="devices-phone-first">I check my phone immediately after waking up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone_delayed" id="devices-phone-delayed" />
            <Label htmlFor="devices-phone-delayed">I wait at least 15 minutes before checking my phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no_devices" id="devices-none" />
            <Label htmlFor="devices-none">I keep devices out of my bedroom/morning routine</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default MorningRitualStep;
