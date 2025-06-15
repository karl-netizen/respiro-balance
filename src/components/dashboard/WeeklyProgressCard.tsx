
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';

export interface WeeklyProgressData {
  weeklyCompleted: number;
  weeklyGoal: number;
  streak: number;
}

export interface WeeklyProgressCardProps {
  progress: WeeklyProgressData;
}

const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ progress }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate completion percentage
  const completionPercentage = Math.round((progress.weeklyCompleted / progress.weeklyGoal) * 100);
  
  // Generate stable week data based on completed sessions
  const generateWeekData = () => {
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    const adjustedToday = today === 0 ? 6 : today - 1; // Convert to 0 = Monday, 6 = Sunday
    
    // Create stable completed days based on weeklyCompleted count
    const completedDays = Math.min(progress.weeklyCompleted, 7);
    
    return daysOfWeek.map((day, index) => ({
      day,
      completed: index < completedDays,
      today: index === adjustedToday
    }));
  };
  
  const weekData = generateWeekData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weekly Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {progress.weeklyCompleted} of {progress.weeklyGoal} sessions
              </p>
            </div>
            <div className="text-sm font-medium">
              {completionPercentage}%
            </div>
          </div>
          
          <Progress value={completionPercentage} className="h-2" />
          
          <div className="flex justify-between mt-4">
            {weekData.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-1">
                  {day.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className={`h-5 w-5 ${day.today ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  )}
                </div>
                <span className={`text-xs ${day.today ? 'font-medium' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-2">
            <p className="text-sm">
              {progress.streak > 0 ? (
                <>Current streak: <span className="font-medium">{progress.streak} days</span></>
              ) : (
                "Start a streak by meditating today!"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
