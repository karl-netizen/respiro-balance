
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { Clock, Dumbbell, ToggleLeft, ToggleRight } from "lucide-react";

const ExerciseStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Local state for immediate UI feedback
  const [morningExercise, setMorningExercise] = useState(preferences.morningExercise || false);
  const [exerciseTime, setExerciseTime] = useState(preferences.exerciseTime || "07:00");
  
  // Sync local state with preferences when they change
  useEffect(() => {
    setMorningExercise(preferences.morningExercise || false);
    if (preferences.exerciseTime) {
      setExerciseTime(preferences.exerciseTime);
    }
  }, [preferences.morningExercise, preferences.exerciseTime]);

  const handleExerciseToggle = (checked: boolean) => {
    setMorningExercise(checked);
    updatePreferences({ morningExercise: checked });
    
    toast.success(checked ? "Morning exercise enabled" : "Morning exercise disabled", {
      description: checked ? "Don't forget to add your exercise time" : "Your preferences have been updated",
      duration: 1500
    });
  };

  const handleExerciseTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setExerciseTime(newTime);
    updatePreferences({ exerciseTime: newTime });
    
    toast.success("Exercise time updated", {
      description: `Exercise time set to ${newTime}`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <Label htmlFor="morning-exercise" className="text-base font-medium">
            Do you exercise in the morning?
          </Label>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Morning exercise can boost energy and focus
        </p>
        
        {/* Toggle selection with clear Yes/No indicators */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            {morningExercise ? (
              <>
                <ToggleRight className="h-6 w-6 text-green-500" />
                <span className="font-medium text-green-600 dark:text-green-400">Yes</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-6 w-6 text-gray-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">No</span>
              </>
            )}
          </div>
          
          <Switch
            id="morning-exercise"
            checked={morningExercise}
            onCheckedChange={handleExerciseToggle}
            className="data-[state=checked]:bg-green-500"
            aria-label={morningExercise ? "Disable morning exercise" : "Enable morning exercise"}
          />
        </div>
      </div>

      {/* Time selection section - only shown when morning exercise is enabled */}
      {morningExercise && (
        <div className="space-y-2 p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <Label htmlFor="exerciseTime" className="font-medium">What time do you usually exercise?</Label>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Input
              id="exerciseTime"
              type="time"
              value={exerciseTime}
              onChange={handleExerciseTimeChange}
              className="focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-sm text-muted-foreground">Selected time: <span className="font-medium">{exerciseTime}</span></p>
          </div>
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Morning exercise: {morningExercise ? 'Yes' : 'No'}</p>
          <p>Exercise time: {exerciseTime}</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseStep;
