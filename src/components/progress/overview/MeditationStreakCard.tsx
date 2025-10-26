
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MeditationStreakCardProps {
  streak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

const MeditationStreakCard: React.FC<MeditationStreakCardProps> = ({
  streak,
  longestStreak,
  weeklyGoal,
  weeklyCompleted
}) => {
  const streakPercentage = longestStreak > 0 ? (streak / longestStreak) * 100 : 0;
  const weeklyPercentage = (weeklyCompleted / weeklyGoal) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Meditation Streak
        </CardTitle>
        <CardDescription>Your consistent meditation practice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col items-center p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground">days in a row</p>
            <div className="w-full mt-2">
              <Progress value={streakPercentage} className="h-1.5" />
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <p className="text-3xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">days in a row</p>
            <div className="w-full mt-2">
              <Progress value={100} className="h-1.5 bg-secondary/40" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Weekly Goal Progress</span>
            <span>{weeklyCompleted}/{weeklyGoal} sessions</span>
          </div>
          <Progress value={weeklyPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {weeklyCompleted >= weeklyGoal 
              ? "You've reached your weekly goal! 🎉" 
              : `${weeklyGoal - weeklyCompleted} more sessions to reach your weekly goal`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationStreakCard;
