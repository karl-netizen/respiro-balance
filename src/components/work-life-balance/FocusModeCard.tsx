
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Battery, Sun, Moon } from "lucide-react";
import { useUserPreferences } from "@/context";
import { formatTime } from "./utils";

const FocusModeCard = () => {
  const { preferences } = useUserPreferences();
  const [focusMode, setFocusMode] = useState<boolean>(false);

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Focus Mode</CardTitle>
          <Battery className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          {preferences.hasCompletedOnboarding && preferences.morningExercise
            ? `Optimized for your ${formatTime(preferences.exerciseTime)} workout`
            : "Dedicated time for deep work with minimal distractions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Focus Session</span>
            <div className="flex items-center space-x-4">
              <Sun className="h-4 w-4 text-amber-500" />
              <Moon className="h-4 w-4 text-indigo-500" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Focus mode blocks notifications and helps you stay concentrated on your task
            with ambient sounds and breathing reminders.
            {preferences.hasCompletedOnboarding && (
              <span className="block mt-2">
                Your recommended focus times are based on your {preferences.workDays.length}-day work week
                {preferences.hasCompletedOnboarding && preferences.morningExercise && 
                  ` and ${formatTime(preferences.exerciseTime)} exercise routine`}.
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="focusMode"
              checked={focusMode}
              onCheckedChange={setFocusMode}
            />
            <label
              htmlFor="focusMode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {focusMode ? "Focus mode active" : "Enable focus mode"}
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={focusMode ? "default" : "outline"}
          className="w-full"
          onClick={() => setFocusMode(!focusMode)}
        >
          {focusMode ? "End Focus Session" : "Start Focus Session"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FocusModeCard;
