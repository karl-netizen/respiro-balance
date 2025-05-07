import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, Trophy, Clock } from 'lucide-react';
import { FocusStats as FocusStatsType } from './types';

interface FocusStatsProps {
  stats: FocusStatsType | null;
}

export const FocusStats: React.FC<FocusStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="text-muted-foreground">
          <p>No focus data available yet.</p>
          <p className="text-sm mt-1">Complete your first focus session to see statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Weekly Focus Goal</h3>
          <span className="text-sm text-muted-foreground">
            {stats.weeklyFocusTime} / {stats.weeklyFocusGoal} minutes
          </span>
        </div>
        
        <Progress value={stats.weeklyFocusProgress} className="h-2" />
        
        <p className="text-xs text-muted-foreground">
          {stats.weeklyFocusProgress < 100
            ? `${Math.round(stats.weeklyFocusProgress)}% of your weekly goal`
            : "Weekly goal achieved! 🎉"
          }
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Total Focus Time"
          value={`${stats.totalFocusTime} min`}
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
        
        <StatCard 
          title="Sessions Completed"
          value={stats.totalSessions.toString()}
          icon={<Target className="h-4 w-4 text-primary" />}
        />
        
        <StatCard 
          title="Focus Score"
          value={`${Math.round(stats.averageFocusScore)}/100`}
          icon={<BarChart3 className="h-4 w-4 text-yellow-500" />}
        />
        
        <StatCard 
          title="Best Streak"
          value={`${stats.longestStreak} days`}
          icon={<Trophy className="h-4 w-4 text-orange-500" />}
        />
      </div>
      
      {/* Additional insights */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Insights</h3>
        
        <div className="bg-muted/50 p-3 rounded-md">
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span>Most productive day</span>
              <span className="font-medium">{stats.mostProductiveDay}</span>
            </li>
            <li className="flex justify-between">
              <span>Most productive time</span>
              <span className="font-medium">{stats.mostProductiveTime}</span>
            </li>
            <li className="flex justify-between">
              <span>Session completion rate</span>
              <span className="font-medium">{Math.round(stats.completionRate)}%</span>
            </li>
            <li className="flex justify-between">
              <span>Current streak</span>
              <span className="font-medium">{stats.currentStreak} days</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ 
  title, 
  value, 
  icon 
}) => {
  return (
    <Card className="p-4 flex items-center space-x-3">
      <div className="bg-muted p-2 rounded">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );
};
