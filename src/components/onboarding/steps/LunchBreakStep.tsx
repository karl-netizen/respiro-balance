
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { Coffee, ToggleLeft, ToggleRight } from "lucide-react";

const LunchBreakStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Local state for immediate UI feedback
  const [takesLunchBreak, setTakesLunchBreak] = useState(preferences.lunchBreak || false);
  const [lunchTime, setLunchTime] = useState(preferences.lunchTime || "12:00");
  
  // Sync local state with preferences when they change
  useEffect(() => {
    setTakesLunchBreak(preferences.lunchBreak || false);
    if (preferences.lunchTime) {
      setLunchTime(preferences.lunchTime);
    }
  }, [preferences.lunchBreak, preferences.lunchTime]);

  const handleLunchBreakChange = (checked: boolean) => {
    setTakesLunchBreak(checked);
    updatePreferences({ lunchBreak: checked });
    
    toast.success(checked ? "Lunch break enabled" : "Lunch break disabled", {
      description: checked ? "Don't forget to add your lunch time" : "Your preferences have been updated",
      duration: 1500
    });
  };

  const handleLunchTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setLunchTime(newTime);
    updatePreferences({ lunchTime: newTime });
    
    toast.success("Lunch time updated", {
      description: `Lunch time set to ${newTime}`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Coffee className="h-5 w-5 text-primary" />
          <Label htmlFor="lunch-break" className="text-base font-medium">
            Do you take a lunch break?
          </Label>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Regular breaks help maintain productivity and wellbeing
        </p>
        
        <div className="flex items-center justify-between border p-3 rounded-lg bg-secondary/10">
          <div className="flex items-center space-x-2">
            {takesLunchBreak ? 
              <ToggleRight className="h-5 w-5 text-green-500" /> : 
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            }
            <span className="font-medium">{takesLunchBreak ? "Yes" : "No"}</span>
          </div>
          
          <Switch
            id="lunch-break"
            checked={takesLunchBreak}
            onCheckedChange={handleLunchBreakChange}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {takesLunchBreak && (
        <div className="space-y-2 p-4 border rounded-md bg-secondary/20 dark:bg-gray-800/50">
          <Label htmlFor="lunchTime" className="font-medium">What time do you usually have lunch?</Label>
          <Input
            id="lunchTime"
            type="time"
            value={lunchTime}
            onChange={handleLunchTimeChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Lunch break: {takesLunchBreak ? 'Yes' : 'No'}</p>
          <p>Lunch time: {lunchTime}</p>
        </div>
      )}
    </div>
  );
};

export default LunchBreakStep;
