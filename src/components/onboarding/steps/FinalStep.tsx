
import React from "react";
import { Check } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const FinalStep = () => {
  const { preferences } = useUserPreferences();
  
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
          <div>{preferences.workDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</div>
          
          <div className="font-medium">Work Hours:</div>
          <div>{preferences.workStartTime} - {preferences.workEndTime}</div>
          
          <div className="font-medium">Lunch Break:</div>
          <div>{preferences.lunchBreak ? `Yes, at ${preferences.lunchTime}` : 'No'}</div>
          
          <div className="font-medium">Morning Exercise:</div>
          <div>{preferences.morningExercise ? `Yes, at ${preferences.exerciseTime}` : 'No'}</div>
          
          <div className="font-medium">Bedtime:</div>
          <div>{preferences.bedTime}</div>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
