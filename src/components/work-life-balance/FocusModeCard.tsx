
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Switch } from "@/components/ui/switch";
import { Target, Clock } from "lucide-react";
import { useUserPreferences } from "@/context";
import { formatTime } from "./utils";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useFocus } from "@/context/FocusProvider";

const FocusModeCard = () => {
  const { preferences } = useUserPreferences();
  const { isActive, timerState, remaining, progress, stats } = useFocus();
  const navigate = useNavigate();

  const getTimeDisplay = () => {
    if (!isActive) {
      return `${preferences.focusTimerDuration || 25} min work / ${preferences.breakTimerDuration || 5} min break`;
    }
    
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (timerState === 'work') {
      return `${timeString} - Focus time`;
    } else if (timerState === 'break') {
      return `${timeString} - Short break`;
    } else if (timerState === 'long-break') {
      return `${timeString} - Long break`;
    }
    
    return timeString;
  };
  
  const handleFocusClick = () => {
    navigate('/focus');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Focus Mode</CardTitle>
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <CardDescription className="text-sm">
          {preferences.hasCompletedOnboarding && preferences.morningExercise
            ? `Optimized for your ${formatTime(preferences.exerciseTime)} workout`
            : "Dedicated time for deep work with minimal distractions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="font-medium text-sm sm:text-base">Focus Timer</span>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm">{getTimeDisplay()}</span>
            </div>
          </div>
          
          {isActive && (
            <Progress 
              value={progress} 
              className={`h-2 ${
                timerState === 'work' 
                  ? 'bg-primary/20' 
                  : timerState === 'break' 
                  ? 'bg-green-500/20' 
                  : 'bg-blue-500/20'
              }`}
            />
          )}
          
          <div className="text-xs sm:text-sm text-muted-foreground">
            {isActive
              ? timerState === 'work'
                ? "Focus mode is active. Concentrate on your current task."
                : "Break time. Rest your mind before the next focus interval."
              : "Start a focus session with timed work intervals and breaks to maintain productivity."}
              
            {stats && !isActive && (
              <span className="block mt-2">
                You've completed {stats.totalSessions} focus sessions 
                ({stats.totalFocusTime} minutes) this week.
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="focusMode"
              checked={isActive}
              onCheckedChange={handleFocusClick}
            />
            <label
              htmlFor="focusMode"
              className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {isActive ? "Focus mode active" : "Enable focus mode"}
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <TouchFriendlyButton
          variant={isActive ? "default" : "outline"}
          className="w-full"
          onClick={handleFocusClick}
        >
          {isActive ? "View Focus Session" : "Start Focus Session"}
        </TouchFriendlyButton>
      </CardFooter>
    </Card>
  );
};

export default FocusModeCard;
