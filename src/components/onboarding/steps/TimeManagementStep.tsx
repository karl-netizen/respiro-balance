
import React, { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type TimeManagementStyle = "pomodoro" | "timeblocking" | "deadline" | "flexible";

const TimeManagementStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Local state for immediate UI feedback
  const [timeManagementStyle, setTimeManagementStyle] = useState<TimeManagementStyle>(
    (preferences.timeManagementStyle as TimeManagementStyle) || "flexible"
  );
  const [challenges, setChallenges] = useState<string[]>(preferences.timeChallenges || []);
  
  // Sync local state with preferences when they change
  useEffect(() => {
    setTimeManagementStyle((preferences.timeManagementStyle as TimeManagementStyle) || "flexible");
    setChallenges(preferences.timeChallenges || []);
  }, [preferences.timeManagementStyle, preferences.timeChallenges]);

  const handleStyleChange = (value: TimeManagementStyle) => {
    setTimeManagementStyle(value);
    updatePreferences({ timeManagementStyle: value });
    
    toast.success("Time management style updated", {
      description: `Your time management style has been set to ${value}`,
      duration: 1500
    });
  };

  const handleChallengeChange = (value: string, checked: boolean) => {
    // Update local state for immediate feedback
    let updatedChallenges = checked 
      ? [...challenges, value]
      : challenges.filter(challenge => challenge !== value);
    
    setChallenges(updatedChallenges);
    
    // Update preferences
    updatePreferences({ timeChallenges: updatedChallenges });
    
    toast.success(checked ? "Challenge added" : "Challenge removed", {
      description: checked 
        ? `Added ${value} to your time management challenges` 
        : `Removed ${value} from your time management challenges`,
      duration: 1500
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">How do you manage your time?</h3>
        <RadioGroup 
          value={timeManagementStyle} 
          onValueChange={(value) => handleStyleChange(value as TimeManagementStyle)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStyleChange("pomodoro")}>
            <RadioGroupItem value="pomodoro" id="style-pomodoro" />
            <Label htmlFor="style-pomodoro" className="cursor-pointer w-full">
              Pomodoro Technique - Work in focused intervals
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStyleChange("timeblocking")}>
            <RadioGroupItem value="timeblocking" id="style-timeblocking" />
            <Label htmlFor="style-timeblocking" className="cursor-pointer w-full">
              Time Blocking - Schedule specific tasks
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStyleChange("deadline")}>
            <RadioGroupItem value="deadline" id="style-deadline" />
            <Label htmlFor="style-deadline" className="cursor-pointer w-full">
              Deadline-driven - Work to meet specific deadlines
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleStyleChange("flexible")}>
            <RadioGroupItem value="flexible" id="style-flexible" />
            <Label htmlFor="style-flexible" className="cursor-pointer w-full">
              Flexible - Adapt as needed throughout the day
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">What are your time management challenges?</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleChallengeChange("procrastination", !challenges.includes("procrastination"))}>
            <Checkbox 
              id="challenge-procrastination" 
              checked={challenges.includes("procrastination")}
              onCheckedChange={(checked) => handleChallengeChange("procrastination", !!checked)}
            />
            <Label htmlFor="challenge-procrastination" className="cursor-pointer w-full">Procrastination</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleChallengeChange("distraction", !challenges.includes("distraction"))}>
            <Checkbox 
              id="challenge-distraction" 
              checked={challenges.includes("distraction")}
              onCheckedChange={(checked) => handleChallengeChange("distraction", !!checked)}
            />
            <Label htmlFor="challenge-distraction" className="cursor-pointer w-full">Getting distracted easily</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleChallengeChange("prioritization", !challenges.includes("prioritization"))}>
            <Checkbox 
              id="challenge-prioritization" 
              checked={challenges.includes("prioritization")}
              onCheckedChange={(checked) => handleChallengeChange("prioritization", !!checked)}
            />
            <Label htmlFor="challenge-prioritization" className="cursor-pointer w-full">Difficulty prioritizing tasks</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleChallengeChange("estimation", !challenges.includes("estimation"))}>
            <Checkbox 
              id="challenge-estimation" 
              checked={challenges.includes("estimation")}
              onCheckedChange={(checked) => handleChallengeChange("estimation", !!checked)}
            />
            <Label htmlFor="challenge-estimation" className="cursor-pointer w-full">Poor time estimation</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
               onClick={() => handleChallengeChange("boundaries", !challenges.includes("boundaries"))}>
            <Checkbox 
              id="challenge-boundaries" 
              checked={challenges.includes("boundaries")}
              onCheckedChange={(checked) => handleChallengeChange("boundaries", !!checked)}
            />
            <Label htmlFor="challenge-boundaries" className="cursor-pointer w-full">Setting boundaries between work & personal life</Label>
          </div>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Time management style: {timeManagementStyle}</p>
          <p>Time challenges: {challenges.length > 0 ? challenges.join(", ") : "None selected"}</p>
        </div>
      )}
    </div>
  );
};

export default TimeManagementStep;
