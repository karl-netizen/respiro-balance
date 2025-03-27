
import React from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const BiofeedbackStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleWearableChange = (value: string) => {
    updatePreferences({ hasWearableDevice: value === "yes" });
  };

  const handleWearableTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ wearableDeviceType: e.target.value });
  };

  const handleMetricChange = (value: string, checked: boolean) => {
    // Ensure metricsOfInterest is an array before using it
    let updatedMetrics = [...(preferences.metricsOfInterest || [])];
    
    if (checked) {
      updatedMetrics.push(value);
    } else {
      updatedMetrics = updatedMetrics.filter(metric => metric !== value);
    }
    
    updatePreferences({ metricsOfInterest: updatedMetrics });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Do you use a wearable device (e.g., smartwatch, fitness tracker)?</h3>
        <RadioGroup 
          value={preferences.hasWearableDevice ? "yes" : "no"} 
          onValueChange={handleWearableChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="wearable-yes" />
            <Label htmlFor="wearable-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="wearable-no" />
            <Label htmlFor="wearable-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {preferences.hasWearableDevice && (
        <div>
          <h3 className="text-sm font-medium mb-3">What type/brand of wearable do you use?</h3>
          <Input
            value={preferences.wearableDeviceType || ""}
            onChange={handleWearableTypeChange}
            placeholder="e.g., Apple Watch, Fitbit, Garmin, etc."
          />
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-3">What metrics would you like to track? (Select all that apply)</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-stress" 
              checked={preferences.metricsOfInterest?.includes("stress") || false}
              onCheckedChange={(checked) => handleMetricChange("stress", !!checked)}
            />
            <label htmlFor="metric-stress" className="text-sm">
              Stress levels
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-focus" 
              checked={preferences.metricsOfInterest?.includes("focus") || false}
              onCheckedChange={(checked) => handleMetricChange("focus", !!checked)}
            />
            <label htmlFor="metric-focus" className="text-sm">
              Focus quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-mood" 
              checked={preferences.metricsOfInterest?.includes("mood") || false}
              onCheckedChange={(checked) => handleMetricChange("mood", !!checked)}
            />
            <label htmlFor="metric-mood" className="text-sm">
              Mood patterns
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-sleep" 
              checked={preferences.metricsOfInterest?.includes("sleep") || false}
              onCheckedChange={(checked) => handleMetricChange("sleep", !!checked)}
            />
            <label htmlFor="metric-sleep" className="text-sm">
              Sleep quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-breathing" 
              checked={preferences.metricsOfInterest?.includes("breathing") || false}
              onCheckedChange={(checked) => handleMetricChange("breathing", !!checked)}
            />
            <label htmlFor="metric-breathing" className="text-sm">
              Breathing exercises
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-session_consistency" 
              checked={preferences.metricsOfInterest?.includes("session_consistency") || false}
              onCheckedChange={(checked) => handleMetricChange("session_consistency", !!checked)}
            />
            <label htmlFor="metric-session_consistency" className="text-sm">
              Session consistency
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiofeedbackStep;
