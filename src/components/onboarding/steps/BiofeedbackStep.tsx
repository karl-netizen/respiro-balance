
import React, { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BiofeedbackStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Create local state to track UI selections
  const [hasWearableDevice, setHasWearableDevice] = useState<boolean>(preferences.hasWearableDevice || false);
  const [wearableDeviceType, setWearableDeviceType] = useState<string>(preferences.wearableDeviceType || "");
  const [metricsOfInterest, setMetricsOfInterest] = useState<string[]>(preferences.metricsOfInterest || []);
  
  // Sync local state with preferences when they change
  useEffect(() => {
    if (preferences.hasWearableDevice !== undefined) {
      setHasWearableDevice(preferences.hasWearableDevice);
    }
    if (preferences.wearableDeviceType) {
      setWearableDeviceType(preferences.wearableDeviceType);
    }
    if (preferences.metricsOfInterest) {
      setMetricsOfInterest(preferences.metricsOfInterest);
    }
  }, [preferences.hasWearableDevice, preferences.wearableDeviceType, preferences.metricsOfInterest]);

  const handleWearableChange = (value: string) => {
    const hasDevice = value === "yes";
    setHasWearableDevice(hasDevice);
    updatePreferences({ hasWearableDevice: hasDevice });
    
    toast.success("Preference updated", {
      description: hasDevice ? "Wearable device preference set to yes" : "Wearable device preference set to no",
      duration: 1500
    });
  };

  const handleWearableTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deviceType = e.target.value;
    setWearableDeviceType(deviceType);
    updatePreferences({ wearableDeviceType: deviceType });
    
    if (deviceType.trim()) {
      toast.success("Device type updated", {
        description: `Your wearable type has been set to ${deviceType}`,
        duration: 1500
      });
    }
  };

  const handleMetricChange = (value: string, checked: boolean) => {
    let updatedMetrics = [...metricsOfInterest];
    
    if (checked) {
      updatedMetrics.push(value);
    } else {
      updatedMetrics = updatedMetrics.filter(metric => metric !== value);
    }
    
    setMetricsOfInterest(updatedMetrics);
    updatePreferences({ metricsOfInterest: updatedMetrics });
    
    toast.success(checked ? "Metric added" : "Metric removed", {
      description: checked ? `Added "${value}" to your metrics` : `Removed "${value}" from your metrics`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Do you use a wearable device (e.g., smartwatch, fitness tracker)?</h3>
        <RadioGroup 
          value={hasWearableDevice ? "yes" : "no"} 
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

      {hasWearableDevice && (
        <div>
          <h3 className="text-sm font-medium mb-3">What type/brand of wearable do you use?</h3>
          <Input
            value={wearableDeviceType}
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
              checked={metricsOfInterest.includes("stress")}
              onCheckedChange={(checked) => handleMetricChange("stress", !!checked)}
            />
            <label htmlFor="metric-stress" className="text-sm cursor-pointer">
              Stress levels
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-focus" 
              checked={metricsOfInterest.includes("focus")}
              onCheckedChange={(checked) => handleMetricChange("focus", !!checked)}
            />
            <label htmlFor="metric-focus" className="text-sm cursor-pointer">
              Focus quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-mood" 
              checked={metricsOfInterest.includes("mood")}
              onCheckedChange={(checked) => handleMetricChange("mood", !!checked)}
            />
            <label htmlFor="metric-mood" className="text-sm cursor-pointer">
              Mood patterns
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-sleep" 
              checked={metricsOfInterest.includes("sleep")}
              onCheckedChange={(checked) => handleMetricChange("sleep", !!checked)}
            />
            <label htmlFor="metric-sleep" className="text-sm cursor-pointer">
              Sleep quality
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-breathing" 
              checked={metricsOfInterest.includes("breathing")}
              onCheckedChange={(checked) => handleMetricChange("breathing", !!checked)}
            />
            <label htmlFor="metric-breathing" className="text-sm cursor-pointer">
              Breathing exercises
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="metric-session_consistency" 
              checked={metricsOfInterest.includes("session_consistency")}
              onCheckedChange={(checked) => handleMetricChange("session_consistency", !!checked)}
            />
            <label htmlFor="metric-session_consistency" className="text-sm cursor-pointer">
              Session consistency
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiofeedbackStep;
