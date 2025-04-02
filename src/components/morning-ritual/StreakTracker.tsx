
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, CheckCircle } from "lucide-react";
import { useUserPreferences } from "@/context";

interface StreakTrackerProps {
  totalRituals: number;
  completedToday: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ 
  totalRituals, 
  completedToday 
}) => {
  const { preferences } = useUserPreferences();
  const rituals = preferences.morningRituals || [];
  
  // Calculate longest current streak across all rituals
  const longestCurrentStreak = rituals.reduce((max, ritual) => {
    return ritual.streak > max ? ritual.streak : max;
  }, 0);
  
  // Calculate completion percentage for today
  const completionPercentage = totalRituals > 0 
    ? Math.round((completedToday / totalRituals) * 100) 
    : 0;
  
  // Get day of the week
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[today.getDay()];
  
  // Format today's date
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4">
        <h3 className="text-lg font-medium flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          {dayName}, {formattedDate}
        </h3>
        <p className="text-sm opacity-90">Your morning ritual progress</p>
      </div>
      
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3 py-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Daily Progress</h4>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedToday} of {totalRituals} rituals completed today
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-full">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">{completedToday}</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 text-amber-700 p-3 rounded-full">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">{longestCurrentStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Current Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
