
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MeditationStats, SessionDay } from '@/components/progress/useMeditationStats';

interface WeeklyProgressCardProps {
  meditationStats: MeditationStats;
  sessions: SessionDay[];
}

const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ meditationStats, sessions }) => {
  const weeklyCompletionPercentage = Math.min(
    100,
    Math.round((meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100)
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weekly Progress</CardTitle>
        <CardDescription>Your meditation activity this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          {sessions.map((session, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center ${session.today ? 'relative' : ''}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${session.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : session.today 
                      ? 'border-2 border-primary text-primary' 
                      : 'bg-secondary/50 text-muted-foreground'
                  }`}
              >
                {session.completed ? '✓' : ''}
              </div>
              <span className={`text-xs ${session.today ? 'font-bold' : 'text-muted-foreground'}`}>
                {session.day}
              </span>
              {session.today && (
                <div className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full w-3 h-3"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium">Weekly Goal</span>
            <span>{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal} sessions</span>
          </div>
          <Progress value={weeklyCompletionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {weeklyCompletionPercentage >= 100 
              ? "You've completed your weekly goal! 🎉" 
              : `${meditationStats.weeklyGoal - meditationStats.weeklyCompleted} more to reach your goal`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
