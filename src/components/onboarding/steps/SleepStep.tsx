
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";

const SleepStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [bedTime, setBedTime] = useState(preferences.bedTime || "22:00");

  // Sync with preferences when they change
  useEffect(() => {
    if (preferences.bedTime) {
      setBedTime(preferences.bedTime);
    }
  }, [preferences.bedTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setBedTime(newTime);
    updatePreferences({ bedTime: newTime });
    
    toast.success("Bedtime updated", {
      description: `Your bedtime has been set to ${formatTimeForDisplay(newTime)}`,
      duration: 1500
    });
  };
  
  // Format time string (HH:MM) for display
  const formatTimeForDisplay = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      
      // Format as "10:30 PM" or similar
      return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Sleep Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Regular sleep patterns are important for mental clarity and wellbeing
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bedTime">What time do you usually go to bed?</Label>
        <Input
          id="bedTime"
          type="time"
          value={bedTime}
          onChange={handleTimeChange}
          className="cursor-pointer"
        />
        
        {bedTime && (
          <p className="text-sm text-muted-foreground mt-2">
            Your selected bedtime: <span className="font-medium">{formatTimeForDisplay(bedTime)}</span>
          </p>
        )}
      </div>
      
      <div className="mt-6 space-y-2">
        <Label htmlFor="wakeTime">What time do you usually wake up?</Label>
        <Input
          id="wakeTime"
          type="time"
          value={preferences.wakeTime || "07:00"}
          onChange={(e) => updatePreferences({ wakeTime: e.target.value })}
          className="cursor-pointer"
        />
        
        {preferences.wakeTime && (
          <p className="text-sm text-muted-foreground mt-2">
            Your selected wake time: <span className="font-medium">{formatTimeForDisplay(preferences.wakeTime || "07:00")}</span>
          </p>
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Bed Time: {bedTime}</p>
          <p>Wake Time: {preferences.wakeTime || "Not set"}</p>
        </div>
      )}
    </div>
  );
};

export default SleepStep;
