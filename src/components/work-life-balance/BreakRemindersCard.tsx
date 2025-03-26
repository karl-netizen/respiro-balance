
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { formatTime } from "./utils";

const BreakRemindersCard = () => {
  const { preferences } = useUserPreferences();
  const [notifications, setNotifications] = useState<boolean>(true);

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Break Reminders</CardTitle>
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          {preferences.hasCompletedOnboarding && preferences.lunchBreak
            ? `Includes your lunch break at ${formatTime(preferences.lunchTime)}`
            : "Regular breaks to maintain focus and prevent burnout"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Micro-breaks (5 min)</span>
            <span className="text-sm text-muted-foreground">Every hour</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Medium breaks (15 min)</span>
            <span className="text-sm text-muted-foreground">Every 2 hours</span>
          </div>
          {preferences.hasCompletedOnboarding && preferences.lunchBreak && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Lunch break (45 min)</span>
              <span className="text-sm text-muted-foreground">{formatTime(preferences.lunchTime)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-medium">Long breaks (30 min)</span>
            <span className="text-sm text-muted-foreground">Every 4 hours</span>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <label
              htmlFor="notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable notifications
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Customize Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BreakRemindersCard;
