
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { Clock, Dumbbell, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        
        {/* Toggle with explicit Yes/No buttons for more clarity */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={morningExercise ? "default" : "outline"}
            className={`flex items-center justify-center space-x-2 py-6 ${morningExercise ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => handleExerciseToggle(true)}
          >
            <ToggleRight className={`h-6 w-6 ${morningExercise ? 'text-white' : 'text-gray-500'}`} />
            <span className={`font-medium ${morningExercise ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Yes</span>
          </Button>
          
          <Button
            variant={!morningExercise ? "default" : "outline"}
            className={`flex items-center justify-center space-x-2 py-6 ${!morningExercise ? 'bg-gray-500 hover:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => handleExerciseToggle(false)}
          >
            <ToggleLeft className={`h-6 w-6 ${!morningExercise ? 'text-white' : 'text-gray-500'}`} />
            <span className={`font-medium ${!morningExercise ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>No</span>
          </Button>
        </div>
      </div>

      {/* Time selection section - only shown when morning exercise is enabled */}
      {morningExercise && (
        <div className="space-y-3 p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm mt-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <Label htmlFor="exerciseTime" className="text-base font-medium">What time do you usually exercise?</Label>
          </div>
          
          <div className="flex flex-col space-y-3 mt-2">
            <Input
              id="exerciseTime"
              type="time"
              value={exerciseTime}
              onChange={handleExerciseTimeChange}
              className="focus:ring-2 focus:ring-blue-500 text-lg h-12"
            />
            <div className="flex items-center mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Selected time: <span className="font-medium">{exerciseTime}</span>
              </p>
            </div>
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
