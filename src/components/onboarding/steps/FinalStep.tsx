
import React from "react";
import { Check } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const FinalStep = () => {
  const { preferences } = useUserPreferences();
  
  // Ensure workDays is always an array to prevent errors in the join operation
  const formattedWorkDays = (preferences.workDays || [])
    .map(day => day.charAt(0).toUpperCase() + day.slice(1))
    .join(', ');
  
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-primary" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Your profile is ready!</h3>
        <p className="text-muted-foreground mt-2">
          We've customized your experience based on your preferences.
        </p>
      </div>
      
      <div className="bg-muted p-4 rounded-md text-left">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="font-medium">Work Days:</div>
          <div>{formattedWorkDays || "Not specified"}</div>
          
          <div className="font-medium">Work Hours:</div>
          <div>{preferences.workStartTime || "09:00"} - {preferences.workEndTime || "17:00"}</div>
          
          <div className="font-medium">Lunch Break:</div>
          <div>{preferences.lunchBreak ? `Yes, at ${preferences.lunchTime || "12:00"}` : 'No'}</div>
          
          <div className="font-medium">Morning Exercise:</div>
          <div>{preferences.morningExercise ? `Yes, at ${preferences.exerciseTime || "07:00"}` : 'No'}</div>
          
          <div className="font-medium">Bedtime:</div>
          <div>{preferences.bedTime || "Not specified"}</div>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
