
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyProgressCardProps {
  meditationStats: {
    weeklyGoal: number;
    weeklyCompleted: number;
  };
  sessions: {
    day: string;
    completed: boolean;
    today?: boolean;
  }[];
}

const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ meditationStats, sessions }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>
              Your meditation activity this week
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">About Weekly Progress</h4>
                <p className="text-sm">
                  This shows your weekly meditation sessions. You've set a goal of {meditationStats.weeklyGoal} sessions per week.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 justify-between mb-4">
          {sessions.map((session, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center ${session.today ? 'relative' : ''}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                  ${session.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : session.today 
                      ? 'border-2 border-primary text-primary' 
                      : 'bg-secondary/50 text-foreground/50'
                  }`}
              >
                {session.completed ? '✓' : ''}
              </div>
              <span className={`text-xs ${session.today ? 'font-bold' : ''}`}>{session.day}</span>
              {session.today && (
                <div className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full px-1">
                  Today
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Weekly goal progress</span>
            <span>{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal} sessions</span>
          </div>
          <Progress value={(meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
